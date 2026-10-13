import React from 'react';

export default function PriceChart({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div style={{
        padding: '30px',
        textAlign: 'center',
        color: '#94a3b8',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        border: '1px dashed #cbd5e1'
      }}>
        No price movement recorded yet. Price points will plot here automatically on new bids.
      </div>
    );
  }

  const prices = history.map(h => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const range = maxPrice - minPrice === 0 ? 1 : maxPrice - minPrice;

  const width = 680;
  const height = 220;
  const paddingX = 50;
  const paddingY = 40;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;

  const points = history.map((item, index) => {
    const x = paddingX + (index / (history.length - 1 || 1)) * innerWidth;
    const y = height - paddingY - ((item.price - minPrice) / range) * innerHeight;
    return { x, y, price: item.price, date: item.recordedAt, event: item.eventType };
  });

  const pathData = points.reduce((acc, point, index) => {
    return `${acc} ${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
  }, '');

  const areaData = points.length > 0
    ? `${pathData} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div style={{
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      padding: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#0f172a', margin: 0 }}>📈 Price History & Valuation Trend</h4>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '4px 0 0 0' }}>
            Tracking {history.length} price change events across bidding & adjustments
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
          <div>
            <span style={{ color: '#64748b' }}>Floor: </span>
            <strong style={{ color: '#0284c7' }}>${minPrice.toFixed(2)}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Peak: </span>
            <strong style={{ color: '#059669' }}>${maxPrice.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', maxHeight: '240px', overflow: 'visible' }}>
          <defs>
            <linearGradient id="chartGradientLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1={paddingX} y1={paddingY + innerHeight / 2} x2={width - paddingX} y2={paddingY + innerHeight / 2} stroke="#e2e8f0" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#cbd5e1" />

          {/* Area fill under curve */}
          <path d={areaData} fill="url(#chartGradientLight)" />

          {/* Line stroke */}
          <path d={pathData} fill="none" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <text
                x={pt.x}
                y={pt.y - 10}
                fill="#334155"
                fontSize="11"
                fontWeight="600"
                textAnchor="middle"
              >
                ${pt.price.toFixed(0)}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px', padding: '0 8px' }}>
        <span>Earliest recorded</span>
        <span>Latest valuation</span>
      </div>
    </div>
  );
}
