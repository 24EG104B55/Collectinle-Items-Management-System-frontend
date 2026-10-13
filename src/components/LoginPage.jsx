import React, { useState } from 'react';
import { AuthService } from '../services/api';

export default function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('BUYER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await AuthService.register({
          username: username.trim(),
          password,
          fullName: fullName.trim() || username.trim(),
          email: email.trim() || `${username.trim()}@store.com`,
          role
        });
        onLogin(res.data);
      } else {
        const res = await AuthService.login(username.trim(), password);
        onLogin(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || (isRegister ? 'Registration failed.' : 'Invalid username or password.'));
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setSuccess('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '40px 36px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
      }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.6rem', color: '#0f172a', marginBottom: '4px' }}>Store</h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Collectible Items Management System</p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: !isRegister ? '#ffffff' : 'transparent',
              color: !isRegister ? '#0f172a' : '#64748b',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: !isRegister ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isRegister ? '#ffffff' : 'transparent',
              color: isRegister ? '#0f172a' : '#64748b',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: isRegister ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer'
            }}
          >
            Register New Account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Walker"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a' }}
                >
                  <option value="BUYER">Buyer (bid and purchase items)</option>
                  <option value="SELLER">Seller (list and manage items)</option>
                  <option value="ADMIN">Admin (platform manager)</option>
                </select>
              </div>
            </>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{ width: '100%' }}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecdd3',
              borderRadius: '8px',
              color: '#be123c',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          >
            {loading ? (isRegister ? 'Creating Account...' : 'Signing in...') : (isRegister ? 'Create Account & Enter' : 'Sign In')}
          </button>
        </form>
      </div>
    </div>
  );
}
