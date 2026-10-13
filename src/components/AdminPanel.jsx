import React, { useState, useEffect } from 'react';
import { AdminService, ItemService, AuthService } from '../services/api';

export default function AdminPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'items', 'users'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  // New User Form State
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('BUYER');

  // New Item Form State
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemCondition, setNewItemCondition] = useState('MINT');
  const [newItemRarity, setNewItemRarity] = useState('Rare');
  const [newItemPartNum, setNewItemPartNum] = useState('');
  const [newItemStock, setNewItemStock] = useState(5);

  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, lowRes, itemsRes] = await Promise.all([
        AdminService.getStats(),
        AdminService.getUsers(),
        ItemService.getLowStock(),
        ItemService.getAll()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data || []);
      setLowStock(lowRes.data || []);
      setItems(itemsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const showNotification = (type, text) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
  };

  // Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await AuthService.register({
        username: newUsername.trim(),
        password: newPassword,
        fullName: newFullName.trim() || newUsername.trim(),
        email: newEmail.trim() || `${newUsername.trim()}@store.com`,
        role: newRole
      });
      showNotification('success', `User '${newUsername}' registered successfully!`);
      setNewUsername('');
      setNewPassword('');
      setNewFullName('');
      setNewEmail('');
      setShowAddUser(false);
      loadAdminData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to create user');
    }
  };

  // Delete User
  const handleDeleteUser = async (id, uname) => {
    if (!window.confirm(`Are you sure you want to delete user '${uname}'?`)) return;
    try {
      await AdminService.deleteUser(id);
      showNotification('success', `User '${uname}' removed.`);
      loadAdminData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to remove user');
    }
  };

  // Add Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await ItemService.create({
        name: newItemName.trim(),
        description: newItemDesc.trim(),
        condition: newItemCondition,
        rarityLevel: newItemRarity,
        partNumber: newItemPartNum.trim(),
        stockQty: parseInt(newItemStock, 10) || 1
      });
      showNotification('success', `Item '${newItemName}' added to inventory!`);
      setNewItemName('');
      setNewItemDesc('');
      setNewItemPartNum('');
      setNewItemStock(5);
      setShowAddItem(false);
      loadAdminData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to create item');
    }
  };

  // Delete Item
  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete item '${name}'?`)) return;
    try {
      await ItemService.delete(id);
      showNotification('success', `Item '${name}' deleted.`);
      loadAdminData();
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to delete item');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '960px' }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>🛠️ Administrator Platform Console</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Full management: Add/Delete Users, Inventory Items, and Telemetry
            </p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', color: '#64748b', fontSize: '1.2rem', padding: '4px 10px', borderRadius: '6px' }}>
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 24px 0 24px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0'
        }}>
          {[
            { id: 'overview', label: '📊 System Metrics' },
            { id: 'items', label: `📦 Manage Items (${items.length})` },
            { id: 'users', label: `👥 Manage Users (${users.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: activeTab === tab.id ? '#0284c7' : '#64748b',
                borderBottom: activeTab === tab.id ? '2px solid #0284c7' : '2px solid transparent',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '24px', backgroundColor: '#ffffff', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Notification Alert */}
          {feedbackMsg.text && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '0.85rem',
              backgroundColor: feedbackMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: feedbackMsg.type === 'success' ? '#047857' : '#be123c',
              border: `1px solid ${feedbackMsg.type === 'success' ? '#a7f3d0' : '#fecdd3'}`
            }}>
              {feedbackMsg.type === 'success' ? '✅ ' : '⚠️ '} {feedbackMsg.text}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading platform telemetry...</div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Catalog Items</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7' }}>{stats?.totalItems || 0}</div>
                    </div>
                    <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Active Listings</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#be123c' }}>{stats?.activeListings || 0}</div>
                    </div>
                    <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Total Bids Placed</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669' }}>{stats?.totalBids || 0}</div>
                    </div>
                    <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Total Users</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>{stats?.totalUsers || 0}</div>
                    </div>
                  </div>

                  {lowStock.length > 0 && (
                    <div style={{
                      padding: '14px 18px',
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '10px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ fontWeight: 700, color: '#b45309', fontSize: '0.88rem', marginBottom: '6px' }}>
                        ⚠️ Low Stock & Scarcity Alerts ({lowStock.length} items &le; 2 units):
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {lowStock.map(item => (
                          <span key={item.id} style={{
                            fontSize: '0.75rem',
                            backgroundColor: '#ffffff',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px solid #fde68a',
                            color: '#92400e',
                            fontWeight: 500
                          }}>
                            {item.name} ({item.stockQty} left)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: MANAGE ITEMS (ADD / DELETE) */}
              {activeTab === 'items' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                      Inventory Catalog ({items.length})
                    </div>
                    <button
                      onClick={() => setShowAddItem(!showAddItem)}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                    >
                      {showAddItem ? '✕ Cancel' : '+ Add New Item'}
                    </button>
                  </div>

                  {/* Add Item Form */}
                  {showAddItem && (
                    <form onSubmit={handleAddItem} style={{
                      backgroundColor: '#f8fafc',
                      padding: '20px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '20px'
                    }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '14px', fontSize: '0.9rem' }}>
                        Create New Catalog Item
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Item Name *</label>
                          <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} required placeholder="e.g. Vintage Tube 6L6GC" style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>SKU / Part Number *</label>
                          <input type="text" value={newItemPartNum} onChange={e => setNewItemPartNum(e.target.value)} required placeholder="e.g. VT-6L6GC-01" style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Initial Stock *</label>
                          <input type="number" min="0" value={newItemStock} onChange={e => setNewItemStock(e.target.value)} required style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Condition</label>
                          <select value={newItemCondition} onChange={e => setNewItemCondition(e.target.value)} style={{ width: '100%', backgroundColor: '#ffffff' }}>
                            <option value="MINT">Mint / Unused</option>
                            <option value="NEAR_MINT">Near Mint</option>
                            <option value="EXCELLENT">Excellent</option>
                            <option value="GOOD">Good / Functional</option>
                            <option value="FOR_PARTS">For Parts</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Rarity Level</label>
                          <select value={newItemRarity} onChange={e => setNewItemRarity(e.target.value)} style={{ width: '100%', backgroundColor: '#ffffff' }}>
                            <option value="Common">Common</option>
                            <option value="Rare">Rare</option>
                            <option value="Ultra-Rare">Ultra-Rare</option>
                            <option value="Legendary">Legendary</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Description</label>
                        <textarea value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} rows="2" placeholder="Item description, provenance, details..." style={{ width: '100%' }} />
                      </div>
                      <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                        Save Item to Catalog
                      </button>
                    </form>
                  )}

                  {/* Items List Table */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '10px 16px', textAlign: 'left' }}>SKU</th>
                          <th style={{ padding: '10px 16px', textAlign: 'left' }}>Item Name</th>
                          <th style={{ padding: '10px 16px', textAlign: 'left' }}>Condition</th>
                          <th style={{ padding: '10px 16px', textAlign: 'left' }}>Rarity</th>
                          <th style={{ padding: '10px 16px', textAlign: 'left' }}>Stock</th>
                          <th style={{ padding: '10px 16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(item => (
                          <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 16px', color: '#64748b', fontFamily: 'monospace' }}>{item.partNumber}</td>
                            <td style={{ padding: '10px 16px', color: '#0f172a', fontWeight: 600 }}>{item.name}</td>
                            <td style={{ padding: '10px 16px', color: '#475569' }}>{item.condition}</td>
                            <td style={{ padding: '10px 16px', color: '#475569' }}>{item.rarityLevel}</td>
                            <td style={{ padding: '10px 16px' }}>
                              <span style={{ color: item.stockQty > 0 ? '#059669' : '#dc2626', fontWeight: 600 }}>
                                {item.stockQty} unit(s)
                              </span>
                            </td>
                            <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                              <button
                                onClick={() => handleDeleteItem(item.id, item.name)}
                                style={{
                                  backgroundColor: '#ffffff',
                                  color: '#dc2626',
                                  fontSize: '0.75rem',
                                  border: '1px solid #fca5a5',
                                  padding: '4px 10px',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: MANAGE USERS (ADD / DELETE) */}
              {activeTab === 'users' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                      Registered Users ({users.length})
                    </div>
                    <button
                      onClick={() => setShowAddUser(!showAddUser)}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                    >
                      {showAddUser ? '✕ Cancel' : '+ Add New User'}
                    </button>
                  </div>

                  {/* Add User Form */}
                  {showAddUser && (
                    <form onSubmit={handleAddUser} style={{
                      backgroundColor: '#f8fafc',
                      padding: '20px',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '20px'
                    }}>
                      <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '14px', fontSize: '0.9rem' }}>
                        Register New User Account
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Username *</label>
                          <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} required placeholder="e.g. john_collector" style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Password *</label>
                          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Secret password" style={{ width: '100%' }} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Full Name</label>
                          <input type="text" value={newFullName} onChange={e => setNewFullName(e.target.value)} placeholder="e.g. John Collector" style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Email</label>
                          <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="e.g. john@store.com" style={{ width: '100%' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>Role *</label>
                          <select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ width: '100%', backgroundColor: '#ffffff' }}>
                            <option value="BUYER">BUYER</option>
                            <option value="SELLER">SELLER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                        Create User
                      </button>
                    </form>
                  )}

                  {/* Users Table */}
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '10px 16px', textAlign: 'left' }}>Username</th>
                          <th style={{ padding: '10px 16px', textAlign: 'left' }}>Full Name</th>
                          <th style={{ padding: '10px 16px', textAlign: 'left' }}>Email</th>
                          <th style={{ padding: '10px 16px', textAlign: 'left' }}>Role</th>
                          <th style={{ padding: '10px 16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 16px', color: '#0f172a', fontWeight: 600 }}>{u.username}</td>
                            <td style={{ padding: '10px 16px', color: '#475569' }}>{u.fullName || '-'}</td>
                            <td style={{ padding: '10px 16px', color: '#64748b' }}>{u.email}</td>
                            <td style={{ padding: '10px 16px' }}>
                              <span style={{
                                fontSize: '0.72rem',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                backgroundColor: u.role === 'ADMIN' ? '#fee2e2' : u.role === 'SELLER' ? '#e0f2fe' : '#dcfce7',
                                color: u.role === 'ADMIN' ? '#b91c1c' : u.role === 'SELLER' ? '#0369a1' : '#15803d',
                                fontWeight: 700
                              }}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                              {u.role !== 'ADMIN' && (
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.username)}
                                  style={{
                                    backgroundColor: '#ffffff',
                                    color: '#dc2626',
                                    fontSize: '0.75rem',
                                    border: '1px solid #fca5a5',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
