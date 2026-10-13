import React from 'react';

export default function ItemCard({ listing, onSelect }) {
  const { item, seller, listingType, currentPrice } = listing;
  const isAuction = listingType === 'AUCTION';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
          {isAuction ? '⏱️ Auction' : '⚡ Buy Now'}
        </span>
        <span style={{
          fontSize: '0.72rem',
          color: item.stockQty > 0 ? '#059669' : '#dc2626',
          fontWeight: 600,
          backgroundColor: item.stockQty > 0 ? '#ecfdf5' : '#fef2f2',
          padding: '2px 8px',
          borderRadius: '999px',
          border: item.stockQty > 0 ? '1px solid #a7f3d0' : '1px solid #fecdd3'
        }}>
          {item.stockQty > 0 ? `${item.stockQty} in stock` : 'Out of stock'}
        </span>
      </div>

      <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '8px', lineHeight: 1.35 }}>
        {item.name}
      </h3>

      <p style={{
        fontSize: '0.82rem',
        color: '#64748b',
        marginBottom: '16px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        lineHeight: 1.5
      }}>
        {item.description}
      </p>

      {/* Footer Price & Action */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '14px',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            {isAuction ? 'Current High Bid' : 'Direct Price'}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            ${currentPrice?.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            Seller: {seller?.fullName || seller?.username}
          </div>
        </div>

        <button
          onClick={() => onSelect(listing)}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          {isAuction ? 'Bid & Track →' : 'Details →'}
        </button>
      </div>
    </div>
  );
}
