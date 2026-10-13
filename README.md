# Collectible Items Management System - Frontend

Modern, responsive web interface for the Collectible Items Management System. Built with **React 18**, **Vite**, and **Axios**.

---

## 🌟 Features

- **Store Discovery & Inventory**: Real-time browsing of collectible items with search and filters.
- **Interactive Auctions & Purchases**: Live bidding with history tracking and instant buy-now checkout.
- **Price Trend Curves**: Visual SVG charting of price history across auction events.
- **Multi-Vendor Pricing Table**: Side-by-side comparison of competing sellers with lowest-price highlighting.
- **Administrator Management**: Integrated console to add/delete items and manage platform user accounts.
- **Authentication**: Modal-based user login and account registration directly from the UI.

---

## 🚀 Running Locally

### Prerequisites
- **Node.js 18+** & **npm**

### Installation & Run
```bash
npm install
npm run dev
```

The app will be accessible at: `http://localhost:5173`

---

## ⚙️ Environment Variables

By default, the app connects to the local backend at `http://localhost:8080/api`.

To point to a deployed backend (e.g. on Render):
Create a `.env` file or configure it in Vercel:

```env
VITE_API_BASE_URL=https://<your-backend-url>.onrender.com/api
```

---

## 🌐 Vercel Deployment

1. Import this repository in **Vercel**.
2. Set Framework Preset to **Vite** (auto-detected).
3. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://<your-backend-url>.onrender.com/api`
4. Click **Deploy**.
