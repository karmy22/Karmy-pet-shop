# Karmy Pet Shop

A full-stack e-commerce platform for pet supplies. Built with React, Express, MongoDB, and Firebase Authentication.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 7, Firebase JS SDK |
| Backend | Node.js, Express 4 |
| Database | MongoDB (Atlas) |
| Auth | Firebase Authentication + Admin SDK |

---

## Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster
- A [Firebase project](https://console.firebase.google.com) with **Authentication** enabled (Email/Password + Google providers)

---

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env` and fill in your real values:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/karmy-pet-shop?retryWrites=true&w=majority
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
ALLOWED_ORIGINS=http://localhost:3000
PORT=5000
ADMIN_EMAILS=your_admin_email@example.com
```

Download your **Firebase Admin SDK service account key**:
> Firebase Console → Project Settings → Service Accounts → Generate new private key

Save it as `backend/serviceAccountKey.json` (this file is gitignored — never commit it).

Seed the database with sample categories and products:

```bash
npm run seed:catalog
```

Start the server:

```bash
npm start
# Backend listening on http://localhost:5000
```

---

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local` with your Firebase client config:

> Firebase Console → Project Settings → Your Apps → Web App → SDK setup

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

Optionally add an Unsplash API key for product images:

```env
REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_key
```

Start the dev server:

```bash
npm start
# Frontend running on http://localhost:3000
```

---

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/catalog/categories` | List all active categories |
| GET | `/api/catalog/products` | List products (filter by `species`, `categorySlug`, `seasonalCollection`) |
| GET | `/api/catalog/products/:slug` | Get single product |

### Authenticated (Firebase ID token required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/orders` | Create order from cart |
| GET | `/api/orders` | Get current user's orders |

### Admin (admin email required)
| Method | Path | Description |
|--------|------|-------------|
| GET/POST/PUT/DELETE | `/api/admin/categories` | Manage categories |
| GET/POST/PUT/DELETE | `/api/admin/products` | Manage products |
| GET | `/api/admin/orders` | List all orders |
| PATCH | `/api/admin/orders/:id/status` | Update order status |
| PATCH | `/api/admin/orders/:id/shipment` | Update shipment details |

---

## Environment Files Reference

| File | Committed | Purpose |
|------|-----------|---------|
| `backend/.env.example` | ✅ | Template — copy to `.env` and fill in values |
| `backend/.env` | ❌ gitignored | Real backend secrets |
| `backend/serviceAccountKey.json` | ❌ gitignored | Firebase Admin credentials |
| `frontend/.env.example` | ✅ | Template reference |
| `frontend/.env.development` | ✅ | Dev API URL + admin emails |
| `frontend/.env.production` | ✅ | Production API URL + admin emails |
| `frontend/.env.local` | ❌ gitignored | Firebase client keys (create manually) |
