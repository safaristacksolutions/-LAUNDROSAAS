# LaundroSaaS

Multi-tenant laundry management platform for Kenyan shops. Schema-per-tenant SaaS with M-Pesa integration, role-based POS, ML analytics, and Rent Health.

**Stack:** Django 5 + DRF + django-tenants | React 18 + Vite + TypeScript | PostgreSQL 16 | Redis + Celery

---

## Quick Start

```bash
# Backend
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate_schemas --shared
python manage.py seed
python manage.py runserver

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` — proxies `/api/*` to Django on port 8000.

---

## Environment Variables (required in production)

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Django secret key |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | PostgreSQL connection |
| `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_PASSKEY`, `MPESA_SHORTCODE` | M-Pesa Daraja API |
| `AT_API_KEY`, `AT_USERNAME` | Africa's Talking SMS |
| `REDIS_URL` | Redis connection (Celery) |

See `backend/.env.example` for the full list.

---

## Deployment

**Vercel:** The monorepo deploys with frontend (Vite SPA) and backend (Python 3.13 serverless function) under a single project with `/api/*` rewrites.

**Docker:** `docker-compose up` runs PostgreSQL, Redis, Django (Gunicorn), Celery worker, Celery Beat, and Nginx.

---

## About

Built for the Kenyan market. M-Pesa STK Push, auto-SMS notifications, Rent Health dashboard, ML revenue forecasting, schema-per-tenant isolation.

&copy; 2026 LaundroSaaS
