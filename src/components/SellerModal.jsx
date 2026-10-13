import React, { useState } from 'react';
import { ItemService, ListingService } from '../services/api';

export default function SellerModal({ onClose, currentUser, onListingCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    condition: 'Restored',
    rarityLevel: 'Rare',
    partNumber: '',
    stockQty: 1,
    description: '',
    listingType: 'AUCTION',
    price: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name || !formData.partNumber || !formData.price) {
      setErrorMsg('Please fill in all mandatory fields (Name, Part Number, Price)');
      return;
    }

    try {
      setLoading(true);

      const itemRes = await ItemService.create({
        name: formData.name,
        description: formData.description,
        condition: formData.condition,
        rarityLevel: formData.rarityLevel,
        partNumber: formData.partNumber,
        stockQty: parseInt(formData.stockQty) || 1
      });

      const createdItem = itemRes.data;

      const priceVal = parseFloat(formData.price);
      await ListingService.create({
        itemId: createdItem.id,
        sellerId: currentUser.id,
        listingType: formData.listingType,
        currentPrice: priceVal,
        startingBid: formData.listingType === 'AUCTION' ? priceVal : null,
        auctionEndTime: null
      });

      onListingCreated();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to list item';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>+ List Rare Item & Valuation</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
              Add a new rare part to inventory and launch its auction or fixed price sale
            </p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', color: '#64748b', fontSize: '1.2rem', padding: '4px 10px', borderRadius: '6px' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          {errorMsg && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecdd3',
              borderRadius: '8px',
              color: '#be123c',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '4px', fontWeight: 600 }}>
              Item / Part Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. 1969 Boss 429 Tachometer"
              style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '4px', fontWeight: 600 }}>
                Condition *
              </label>
              <select name="condition" value={formData.condition} onChange={handleChange} style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a' }}>
                <option value="NOS / Mint">NOS / Mint</option>
                <option value="Restored">Restored</option>
                <option value="Vintage / NOS">Vintage / NOS</option>
                <option value="Used / Excellent">Used / Excellent</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '4px', fontWeight: 600 }}>
                Rarity Rating *
              </label>
              <select name="rarityLevel" value={formData.rarityLevel} onChange={handleChange} style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a' }}>
                <option value="Common">Common</option>
                <option value="Rare">Rare</option>
                <option value="Ultra-Rare">Ultra-Rare</option>
                <option value="Legendary">Legendary</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '4px', fontWeight: 600 }}>
                Part / SKU Number *
              </label>
              <input
                type="text"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleChange}
                placeholder="e.g. BOSS-429-01"
                style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '4px', fontWeight: 600 }}>
                Listing Format *
              </label>
              <select name="listingType" value={formData.listingType} onChange={handleChange} style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a' }}>
                <option value="AUCTION">Auction</option>
                <option value="FIXED_PRICE">Fixed Price</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '4px', fontWeight: 600 }}>
                {formData.listingType === 'AUCTION' ? 'Starting Bid ($) *' : 'Fixed Price ($) *'}
              </label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '4px', fontWeight: 600 }}>
                Stock Units
              </label>
              <input
                type="number"
                name="stockQty"
                min="1"
                value={formData.stockQty}
                onChange={handleChange}
                style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#475569', marginBottom: '4px', fontWeight: 600 }}>
              Description & Specifications
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="State working condition, manufacturer, rarity and history..."
              style={{ width: '100%', resize: 'vertical', backgroundColor: '#ffffff', color: '#0f172a' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Submitting...' : 'Confirm & Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
