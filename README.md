# LaundroSaaS 🧺

Multi-tenant laundry management platform built for the Kenyan market.

**Stack:** Django 5 + DRF + django-tenants | React 18 + Vite + TypeScript | PostgreSQL 16 | Redis 7 + Celery

## Quick Start

### Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Run migrations (shared + tenant schemas)
python manage.py migrate_schemas --shared

# Create a public tenant
python manage.py shell -c "
from apps.tenants.models import Tenant, Domain, Plan
Plan.objects.create(code='starter', name='Starter', price_kes=1999, max_users=1, max_orders_monthly=300)
Plan.objects.create(code='pro', name='Pro', price_kes=4999, max_users=3, has_sms=True, sms_included=500, has_rent_health=True)
t = Tenant(name='FreshWash Demo', phone='0712345678', schema_name='freshwash')
t.save()
Domain.objects.create(domain='freshwash.localhost', tenant=t, is_primary=True)
"

# Run development server
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Architecture

```
Tier 1: React 18 + Vite (Web Frontend)
Tier 2: Django 5 + DRF (REST API)
Tier 3: PostgreSQL 16 (Multi-tenant with schema-per-tenant)
Tier 4: Redis + Celery (Async tasks & scheduling)
```

## Multi-Tenant URLs

| Tenant | URL |
|--------|-----|
| FreshWash | freshwash.laundrosaas.com |
| CleanWave | cleanwave.laundrosaas.com |

## Persona URLs

| Role | URL | Auth |
|------|-----|------|
| POS (Cashier) | /pos | JWT + cashier role |
| Admin (Owner) | /admin | JWT + admin role |
| Employee | /employee | JWT + employee role |
| Customer Tracker | /track/:orderId | No auth |
| SuperAdmin | /superadmin | JWT + superadmin |

## Revenue Model

| Stream | Margin |
|--------|--------|
| SaaS Subscriptions | ~85% |
| M-Pesa Transaction Fees (1.5%) | ~60% |
| SMS/WhatsApp Overage | ~40% markup |
| Hardware (Printers, Scanners) | ~20% |
| Data Insights (Anonymized Reports) | ~90% |

**Per-tenant profit (Pro plan):** KES 7,244/month (82% margin)
