# VyparAI (Full-Stack Inventory + Billing + ML)

VyparAI is a complete starter project with:
- **Backend**: Node.js + Express + MongoDB + JWT Auth + Swagger docs
- **Frontend**: React + Vite sample pages/forms
- **ML service**: Python/Flask model endpoint for demand prediction

## Folder Structure

```txt
VyparAI/
  backend/
    src/
      config/ controllers/ middleware/ models/ routes/ utils/
  frontend/
    src/
      api/ pages/
  ml-service/
    training/ model/
```

## Quick Start

### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```
Set `VITE_API_URL` in `.env` if backend is not on `http://localhost:5000/api`.

### 3) ML service
```bash
cd ml-service
pip install -r requirements.txt
python training/train_model.py
python app.py
```

## API Highlights
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/products`
- `POST /api/billing` (creates bill and decrements stock)
- `GET /api/dashboard/summary`
- `POST /api/predict` (proxies to Flask ML service)
- `GET /api/docs` Swagger UI

## Deployment
- **Frontend (Vercel)**: use `frontend/vercel.json`
- **Backend (Render)**: use `backend/render.yaml`

## Notes
- Uses ES modules and modular architecture.
- Includes basic comments and centralized error handling.
- Extend validation and tests for production-grade use.
