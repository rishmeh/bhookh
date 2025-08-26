# Bhookh

Connect food donors with people and organizations in need. Frontend (Vite + React) and backend (Express + Mongoose).

## Prerequisites
- Node.js 18+
- MongoDB connection string (Atlas or local)

## Setup

1) Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

2) Configure environment variables (create `backend/.env`)
Create a file at `backend/.env` with:
```
MONGODB_URI=your_mongodb_connection_string
PORT=8080
CORS_ORIGIN=http://localhost:5173
```

3) Run apps
```bash
# terminal 1
cd backend
npm start

# terminal 2
cd frontend
npm run dev
```

Frontend runs on http://localhost:5173 and proxies `/api` to the backend.

## Environment variables (backend)
- MONGODB_URI: MongoDB connection string
- PORT: Backend port (default 8080)
- CORS_ORIGIN: Allowed origin for CORS (default http://localhost:5173)

Never commit real secrets. Use `.env` locally and CI secrets for deployments.

Git ignore (add these to a root `.gitignore`):
```
# dependencies
backend/node_modules/
frontend/node_modules/

# env files
backend/.env

# build outputs
frontend/dist/
```

## API
- POST /api/donate
- GET /api/donations
- GET /api/donations/:id
- PUT /api/donations/:id
- DELETE /api/donations/:id

## Notes
- Freshness is computed dynamically based on `createdAt`
- Donations auto-expire after 24h (TTL index + cleanup)
