import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ItemService = {
  getAll: (query, rarity) => {
    const params = {};
    if (query) params.query = query;
    if (rarity && rarity !== 'ALL') params.rarity = rarity;
    return api.get('/items', { params });
  },
  getById: (id) => api.get(`/items/${id}`),
  create: (itemData) => api.post('/items', itemData),
  update: (id, itemData) => api.put(`/items/${id}`, itemData),
  delete: (id) => api.delete(`/items/${id}`),
  getLowStock: () => api.get('/items/low-stock'),
};

export const ListingService = {
  getAll: () => api.get('/listings'),
  getById: (id) => api.get(`/listings/${id}`),
  create: (listingData) => api.post('/listings', listingData),
  placeBid: (listingId, bidderId, bidAmount) =>
    api.post(`/listings/${listingId}/bid`, { bidderId, bidAmount }),
  buyNow: (listingId, buyerId) =>
    api.post(`/listings/${listingId}/buy?buyerId=${buyerId}`),
  getPriceHistory: (listingId) => api.get(`/listings/${listingId}/history`),
  getBids: (listingId) => api.get(`/listings/${listingId}/bids`),
  getCompareSellers: (listingId) => api.get(`/listings/${listingId}/compare`),
  getBySeller: (sellerId) => api.get(`/listings/seller/${sellerId}`),
};

export const AuthService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (userData) => api.post('/auth/register', userData),
  getAllUsers: () => api.get('/auth/users'),
};

export const AdminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  cancelListing: (id) => api.put(`/admin/listings/${id}/cancel`),
};

export default api;
