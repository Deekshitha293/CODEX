# VyaparAI

VyaparAI is a real-time, AI-powered hybrid web/mobile SaaS for local businesses.

## Stack
- Frontend: React + TypeScript + TailwindCSS + Vite
- Backend: Node.js + Express + MongoDB
- Real-time: Socket.IO notifications (`low-stock`, `expiry-alert`, `new-invoice`, `sales-milestone`)
- AI/BI: Rule-based agents + GPT integration (`/api/ai/query`) + TensorFlow.js linear regression forecast
- Security: JWT auth, bcrypt password hashing, AES utility encryption for sensitive payload snapshots, rate limiting
- Monitoring: Prometheus (`/metrics`) + Grafana
- Deployment: Docker + Docker Compose

## Run with Docker
```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001
- MongoDB: mongodb://localhost:27017

## Backend API Highlights
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`
- Products: `/api/products`, `/api/products/expiry-alerts`
- Invoices: `/api/invoices`
- Analytics: `/api/analytics/reorder-recommendations`, `/api/analytics/expiry-discounts`, `/api/analytics/weekly-sales`, `/api/analytics/customer-insights`, `/api/analytics/forecast`, `/api/analytics/business-score`, `/api/analytics/admin-summary`
- AI: `/api/ai/query`

## Environment Variables
Backend:
- `MONGO_URI`
- `JWT_SECRET`
- `AES_KEY`
- `AES_IV`
- `OPENAI_API_KEY` (optional, enables GPT responses)
- `OPENAI_MODEL` (optional, defaults to `gpt-4o-mini`)

Frontend:
- `VITE_API_BASE_URL` (default `http://localhost:5000/api`)
- `VITE_SOCKET_URL` (default `http://localhost:5000`)

## Notes
- Frontend includes route-based lazy loading and PWA service worker (`frontend/public/sw.js`).
- Billing supports voice command input (Web Speech API) and barcode scanning (Quagga.js).
- Inventory, expiry alerts, billing events, and notifications are event-driven and update in near real-time.
