import React, { useState, useEffect } from 'react';
import { ListingService } from '../services/api';
import PriceChart from './PriceChart';
import SellerComparisonTable from './SellerComparisonTable';

export default function ItemDetailModal({ listing, onClose, currentUser, onRefreshListings }) {
  const [activeTab, setActiveTab] = useState('bid');
  const [bidAmount, setBidAmount] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);
  const [bids, setBids] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [currentListing, setCurrentListing] = useState(listing);

  const isAuction = currentListing.listingType === 'AUCTION';

  const loadListingData = async (listingId) => {
    try {
      setLoading(true);
      setErrorMsg('');

      const [histRes, bidsRes, compRes, listRes] = await Promise.all([
        ListingService.getPriceHistory(listingId),
        ListingService.getBids(listingId),
        ListingService.getCompareSellers(listingId),
        ListingService.getById(listingId)
      ]);

      setPriceHistory(histRes.data || []);
      setBids(bidsRes.data || []);
      setComparisons(compRes.data || []);
      setCurrentListing(listRes.data);

      const minNext = (listRes.data.currentPrice + 10).toFixed(2);
      setBidAmount(minNext);
    } catch (err) {
      console.error('Error loading listing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (listing?.id) {
      loadListingData(listing.id);
    }
  }, [listing?.id]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const numericBid = parseFloat(bidAmount);
    if (isNaN(numericBid) || numericBid <= currentListing.currentPrice) {
      setErrorMsg(`Bid must be greater than current price ($${currentListing.currentPrice.toFixed(2)})`);
      return;
    }

    try {
      setLoading(true);
      await ListingService.placeBid(currentListing.id, currentUser.id, numericBid);
      setSuccessMsg(`Success! Your bid of $${numericBid.toFixed(2)} was accepted and logged.`);
      await loadListingData(currentListing.id);
      onRefreshListings();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to place bid';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    try {
      setLoading(true);
      await ListingService.buyNow(currentListing.id, currentUser.id);
      setSuccessMsg(`Congratulations! You purchased ${currentListing.item.name} for $${currentListing.currentPrice.toFixed(2)}!`);
      await loadListingData(currentListing.id);
      onRefreshListings();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to complete purchase';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchListing = (newListingId) => {
    loadListingData(newListingId);
    setActiveTab('bid');
  };

  const item = currentListing.item;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff'
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              SKU: {item.partNumber} • Condition: {item.condition}
            </span>
            <h2 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '4px 0 0 0' }}>
              {item.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              color: '#64748b',
              fontSize: '1.2rem',
              padding: '4px 10px',
              borderRadius: '6px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          {/* Top Info Bar (without image) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Price & Format Tile */}
            <div style={{
              padding: '18px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {isAuction ? 'Current High Bid' : 'Fixed Sale Price'}
                  </span>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
                    ${currentListing.currentPrice.toFixed(2)}
                  </div>
                </div>
                <div>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{isAuction ? '⏱️ Live Auction' : '⚡ Direct Buy'}</span>
                </div>
              </div>

              <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#475569' }}>
                Seller: <strong style={{ color: '#0284c7' }}>{currentListing.seller?.fullName || currentListing.seller?.username}</strong>
                {currentListing.seller?.email && ` (${currentListing.seller.email})`}
              </div>

              {isAuction && currentListing.auctionEndTime && (
                <div style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  color: '#92400e',
                  fontWeight: 500
                }}>
                  ⏳ Auction closes in approximately 4 days
                </div>
              )}
            </div>

            {/* Spec & Provenance Tile */}
            <div style={{
              padding: '18px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>Condition: {item.condition}</span>
                  <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>• Rarity: {item.rarityLevel}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                    borderRadius: '999px',
                    backgroundColor: item.stockQty > 0 ? '#ecfdf5' : '#fef2f2',
                    color: item.stockQty > 0 ? '#059669' : '#dc2626',
                    fontWeight: 600,
                    border: item.stockQty > 0 ? '1px solid #a7f3d0' : '1px solid #fecdd3'
                  }}>
                    {item.stockQty > 0 ? `${item.stockQty} unit(s) left` : 'Out of Stock'}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                  {item.description}
                </p>
              </div>

              {/* Status alerts */}
              {errorMsg && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecdd3',
                  borderRadius: '6px',
                  color: '#be123c',
                  fontSize: '0.8rem',
                  marginTop: '8px'
                }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              {successMsg && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '6px',
                  color: '#047857',
                  fontSize: '0.8rem',
                  marginTop: '8px'
                }}>
                  ✅ {successMsg}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '18px',
            gap: '8px'
          }}>
            <button
              onClick={() => setActiveTab('bid')}
              style={{
                padding: '10px 16px',
                background: 'transparent',
                color: activeTab === 'bid' ? '#0284c7' : '#64748b',
                borderBottom: activeTab === 'bid' ? '2px solid #0284c7' : 'none',
                fontWeight: 600,
                fontSize: '0.88rem'
              }}
            >
              {isAuction ? '🔨 Place Bid' : '🛒 Purchase'}
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              style={{
                padding: '10px 16px',
                background: 'transparent',
                color: activeTab === 'compare' ? '#0284c7' : '#64748b',
                borderBottom: activeTab === 'compare' ? '2px solid #0284c7' : 'none',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🏷️ Other Sellers ({comparisons.length})
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              style={{
                padding: '10px 16px',
                background: 'transparent',
                color: activeTab === 'chart' ? '#0284c7' : '#64748b',
                borderBottom: activeTab === 'chart' ? '2px solid #0284c7' : 'none',
                fontWeight: 600,
                fontSize: '0.88rem'
              }}
            >
              📈 Price History ({priceHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              style={{
                padding: '10px 16px',
                background: 'transparent',
                color: activeTab === 'history' ? '#0284c7' : '#64748b',
                borderBottom: activeTab === 'history' ? '2px solid #0284c7' : 'none',
                fontWeight: 600,
                fontSize: '0.88rem'
              }}
            >
              📜 Bids Log ({bids.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'bid' && (
            <div>
              {currentListing.status !== 'ACTIVE' ? (
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#64748b',
                  border: '1px solid #e2e8f0'
                }}>
                  This listing is marked as <strong>{currentListing.status}</strong>. Bidding and purchasing are closed.
                </div>
              ) : isAuction ? (
                <form onSubmit={handlePlaceBid} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: '6px' }}>
                      Enter your bid (must exceed ${currentListing.currentPrice.toFixed(2)})
                    </label>
                    <input
                      type="number"
                      step="1"
                      min={currentListing.currentPrice + 1}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`$${(currentListing.currentPrice + 10).toFixed(2)}`}
                      style={{ width: '100%', fontSize: '1rem', fontWeight: 600, backgroundColor: '#ffffff', color: '#0f172a' }}
                      required
                    />
                  </div>
                  <div style={{ alignSelf: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={loading || item.stockQty <= 0}
                      className="btn-primary"
                      style={{ padding: '12px 24px', fontSize: '0.95rem' }}
                    >
                      {loading ? 'Submitting...' : '🚀 Submit Official Bid'}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '16px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>Instant Buy Out</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Immediate purchase directly at seller's fixed valuation.</div>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    disabled={loading || item.stockQty <= 0}
                    className="btn-success"
                    style={{ padding: '12px 24px' }}
                  >
                    {loading ? 'Processing...' : `💳 Buy Now for $${currentListing.currentPrice.toFixed(2)}`}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'compare' && (
            <SellerComparisonTable
              comparisons={comparisons}
              currentListingId={currentListing.id}
              onSelectListing={handleSwitchListing}
            />
          )}

          {activeTab === 'chart' && (
            <PriceChart history={priceHistory} />
          )}

          {activeTab === 'history' && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              {bids.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                  No bids have been logged for this auction yet.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left' }}>Bidder</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left' }}>Bid Amount</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 16px', color: '#0f172a', fontWeight: 600 }}>
                          {b.bidder?.fullName || b.bidder?.username}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#059669', fontWeight: 700 }}>
                          ${b.bidAmount.toFixed(2)}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#64748b' }}>
                          {new Date(b.bidTime).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
