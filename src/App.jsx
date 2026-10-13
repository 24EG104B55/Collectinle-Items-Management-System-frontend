import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import ItemCard from './components/ItemCard';
import ItemDetailModal from './components/ItemDetailModal';
import SellerModal from './components/SellerModal';
import AdminPanel from './components/AdminPanel';
import { ListingService } from './services/api';

export default function App() {
  const [listings, setListings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('ALL');
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await ListingService.getAll();
      setListings(res.data || []);
    } catch (err) {
      console.error('Error connecting to backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchData();
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    setListings([]);
    setSelectedListing(null);
    setShowSellerModal(false);
    setShowAdminPanel(false);
  };

  const filteredListings = listings.filter((listing) => {
    const item = listing.item;
    const matchesSearch = !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'ALL' || item.rarityLevel === selectedRarity;
    const matchesFormat = selectedFormat === 'ALL' || listing.listingType === selectedFormat;
    return matchesSearch && matchesRarity && matchesFormat;
  });

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSellerModal={() => setShowSellerModal(true)}
        onOpenAdminPanel={() => setShowAdminPanel(true)}
        showAdminPanel={showAdminPanel}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {/* Hero Section */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '36px 0 28px 0',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <div className="container">
            <div style={{ maxWidth: '800px' }}>
              <h1 style={{ fontSize: '2.2rem', lineHeight: 1.2, color: '#0f172a', marginBottom: '6px' }}>
                Collectible Items Management System
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '18px', flexWrap: 'wrap' }}>
              {['📈 Interactive Price Curves', '🏷️ Multi-Vendor Comparison', '⏱️ Live Auction Bidding', '📦 Low-Stock Monitor'].map(label => (
                <div key={label} style={{ padding: '6px 14px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="container" style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            backgroundColor: '#ffffff',
            padding: '12px 18px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
              Inventory Listings ({filteredListings.length})
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Rarity:</span>
                <select value={selectedRarity} onChange={(e) => setSelectedRarity(e.target.value)}
                  style={{ fontSize: '0.82rem', padding: '6px 10px', backgroundColor: '#ffffff', color: '#0f172a' }}>
                  <option value="ALL">All Rarities</option>
                  <option value="Common">Common</option>
                  <option value="Rare">Rare</option>
                  <option value="Ultra-Rare">Ultra-Rare</option>
                  <option value="Legendary">Legendary</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Format:</span>
                <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}
                  style={{ fontSize: '0.82rem', padding: '6px 10px', backgroundColor: '#ffffff', color: '#0f172a' }}>
                  <option value="ALL">All Formats</option>
                  <option value="AUCTION">Auctions Only</option>
                  <option value="FIXED_PRICE">Fixed Buy Now Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔄</div>
              <div>Loading inventory items...</div>
            </div>
          ) : filteredListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
              <h3 style={{ color: '#0f172a', marginBottom: '6px' }}>No collectible items found</h3>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>Try adjusting your search filters or list a new item as a seller!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filteredListings.map(listing => (
                <ItemCard key={listing.id} listing={listing} onSelect={setSelectedListing} />
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedListing && (
        <ItemDetailModal
          listing={selectedListing}
          currentUser={currentUser}
          onClose={() => setSelectedListing(null)}
          onRefreshListings={fetchData}
        />
      )}

      {showSellerModal && (
        <SellerModal
          currentUser={currentUser}
          onClose={() => setShowSellerModal(false)}
          onListingCreated={fetchData}
        />
      )}

      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
}
