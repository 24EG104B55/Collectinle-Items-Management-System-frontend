import React from 'react';

export default function Navbar({
  currentUser,
  onLogout,
  onOpenSellerModal,
  onOpenAdminPanel,
  showAdminPanel,
  onSearchChange,
  searchTerm
}) {
  return (
    <header style={{
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#ffffff',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        gap: '20px'
      }}>
        {/* Brand */}
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
            Store
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Collectible Items Management System</p>
        </div>

        {/* Search Bar */}
        <div style={{ flex: '1', maxWidth: '420px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search items, SKU, description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '38px',
              backgroundColor: '#f8fafc',
              borderColor: '#cbd5e1',
              color: '#0f172a',
              fontSize: '0.875rem'
            }}
          />
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8',
            fontSize: '0.9rem'
          }}>
            🔍
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={onOpenAdminPanel}
              className="btn-secondary"
              style={{
                borderColor: showAdminPanel ? '#0284c7' : '#cbd5e1',
                color: showAdminPanel ? '#0284c7' : '#334155',
                backgroundColor: showAdminPanel ? '#f0f9ff' : '#ffffff'
              }}
            >
              🛠️ Admin
            </button>
          )}

          {(currentUser?.role === 'SELLER' || currentUser?.role === 'ADMIN') && (
            <button onClick={onOpenSellerModal} className="btn-primary">
              + List Item
            </button>
          )}

          {/* User info + Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '6px 12px'
          }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                {currentUser?.fullName || currentUser?.username}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{currentUser?.role}</div>
            </div>
            <button
              onClick={onLogout}
              style={{
                background: 'none',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
