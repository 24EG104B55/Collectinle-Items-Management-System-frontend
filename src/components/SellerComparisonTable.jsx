import React from 'react';

export default function SellerComparisonTable({ comparisons = [], onSelectListing, currentListingId }) {
  if (!comparisons || comparisons.length === 0) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        color: '#94a3b8',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        border: '1px dashed #cbd5e1'
      }}>
        No alternative seller listings currently available for this exact part or category.
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a' }}>
            🏷️ Multi-Seller Price Comparison
          </h4>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
            Comparing {comparisons.length} active offers for identical or equivalent parts
          </p>
        </div>
        <span style={{
          fontSize: '0.75rem',
          backgroundColor: '#ecfdf5',
          color: '#059669',
          padding: '4px 8px',
          borderRadius: '6px',
          border: '1px solid #a7f3d0',
          fontWeight: 600
        }}>
          Live Market Scan
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px' }}>Seller / Vendor</th>
              <th style={{ padding: '12px 16px' }}>Format</th>
              <th style={{ padding: '12px 16px' }}>Condition</th>
              <th style={{ padding: '12px 16px' }}>Stock</th>
              <th style={{ padding: '12px 16px' }}>Current Price</th>
              <th style={{ padding: '12px 16px' }}>Price Advantage</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c) => {
              const isCurrent = c.listingId === currentListingId;
              return (
                <tr
                  key={c.listingId}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: isCurrent ? '#f0f9ff' : 'transparent',
                    transition: 'background-color 0.15s'
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>
                      {c.sellerName}
                      {isCurrent && (
                        <span style={{
                          marginLeft: '8px',
                          fontSize: '0.7rem',
                          color: '#0284c7',
                          backgroundColor: '#e0f2fe',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 700
                        }}>
                          Current
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.sellerEmail}</div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                      {c.listingType === 'AUCTION' ? '⏱️ Auction' : '⚡ Buy Now'}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px', color: '#334155' }}>
                    {c.itemCondition || 'Standard'}
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: c.stockQty > 0 ? '#059669' : '#dc2626', fontWeight: 600 }}>
                      {c.stockQty > 0 ? `${c.stockQty} unit(s)` : 'Sold Out'}
                    </span>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                      ${c.price.toFixed(2)}
                    </div>
                  </td>

                  <td style={{ padding: '12px 16px' }}>
                    {c.bestPrice ? (
                      <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.8rem' }}>
                        ⭐ Lowest Price
                      </span>
                    ) : (
                      <span style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 600 }}>
                        +${c.priceDifferenceFromBest ? c.priceDifferenceFromBest.toFixed(2) : '0.00'} higher
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {!isCurrent && (
                      <button
                        onClick={() => onSelectListing(c.listingId)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        Inspect Offer →
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
