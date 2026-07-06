# LaundroSaaS

Multi-tenant laundry management platform for the Kenyan market. Schema-per-tenant SaaS with M-Pesa integration, ML analytics, and role-based POS.

**Stack:** Django 5 + DRF + django-tenants | React 18 + Vite + TypeScript + Tailwind | PostgreSQL 16 | Redis 7 + Celery

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Multi-Tenancy Strategy](#3-multi-tenancy-strategy)
4. [Auth & RBAC Flow](#4-auth--rbac-flow)
5. [Django Backend](#5-django-backend)
6. [REST API Endpoints](#6-rest-api-endpoints)
7. [React Frontend](#7-react-frontend)
8. [Payment Integration — M-Pesa](#8-payment-integration--m-pesa)
9. [ML Analytics](#9-ml-analytics)
10. [SaaS Billing & Plan Enforcement](#10-saas-billing--plan-enforcement)
11. [Deployment](#11-deployment)
12. [Quick Start](#12-quick-start)

---

## 1. Architecture Overview

```
Tier 1: React 18 + Vite (Web Frontend)
Tier 2: Django 5 + DRF (REST API)
Tier 3: PostgreSQL 16 (Multi-tenant with schema-per-tenant)
Tier 4: Redis + Celery (Async tasks & scheduling)
```

### Request Lifecycle

1. User visits `freshwash.laundrosaas.com/api/orders`
2. Nginx/Vercel passes request to Gunicorn/serverless function
3. `TenantMainMiddleware` reads subdomain, looks up Tenant record in public schema
4. Sets PostgreSQL `search_path = tenant_freshwash`
5. `JWTAuthentication` decodes token — user belongs to this tenant
6. All ORM queries are automatically scoped to the tenant schema

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend framework | Django 5 + DRF | REST API, ORM, admin |
| Multi-tenancy | django-tenants 3.x | Schema isolation |
| Authentication | djangorestframework-simplejwt | JWT access + refresh tokens |
| Database | PostgreSQL 16 | Schema-per-tenant |
| Cache / Queue broker | Redis 7 | Celery tasks, session cache |
| Background tasks | Celery 5 | Notifications, reports, ML jobs |
| Frontend | React 18 + Vite + TypeScript | SPA with per-tenant branding |
| UI | Tailwind CSS 3 + custom components | Design system |
| State management | Zustand | Cart, user, orders |
| Charts | Custom SVG components | Dashboard analytics |
| HTTP client | Axios | JWT interceptors |
| SMS notifications | Africa's Talking | Order status SMS (Kenya) |
| Payments | M-Pesa Daraja API | STK Push + callbacks |
| ML / Analytics | scikit-learn + pandas | Revenue forecast, RFM |
| Deployment | Docker + Nginx + Gunicorn | Production containers |

---

## 3. Multi-Tenancy Strategy

This system uses **schema-per-tenant** with PostgreSQL and `django-tenants`. Each laundry business gets its own isolated PostgreSQL schema. The Django ORM automatically sets `search_path = tenant_schema` on every request — no application-level filtering is needed.

| Aspect | Implementation |
|--------|---------------|
| Approach | Schema-per-tenant (PostgreSQL schemas) |
| Library | django-tenants 3.x |
| Public schema | tenants, domains, plans, invoices, accounts |
| Tenant schema | orders, customers, services, payments, inventory, laundry |
| Routing | Subdomain: `freshwash.laundrosaas.com` -> schema `tenant_freshwash` |
| Isolation | `SET search_path` at DB connection level |
| Custom domains | `freshwash.co.ke` maps to the same tenant schema |

### Provisioning a new tenant

```python
from apps.tenants.models import Tenant, Domain, Plan

plan = Plan.objects.get(code='starter')
tenant = Tenant(
    name='FreshWash',
    phone='0712345678',
    schema_name='freshwash',
    plan=plan
)
tenant.save()
Domain.objects.create(domain='freshwash.laundrosaas.com', tenant=tenant, is_primary=True)
```

---

## 4. Auth & RBAC Flow

### Authentication Flow

```
Login (POST /api/auth/login/)
  -> Phone + password
  -> Verify credentials against public.accounts_user
  -> Return { access, refresh, user }

Every API request
  -> Header: Authorization: Bearer <access_token>
  -> TenantMainMiddleware sets search_path
  -> JWTAuthentication verifies token
  -> User is scoped to their tenant

Token refresh (POST /api/auth/refresh/)
  -> Send { refresh }
  -> Returns { access }

Register (POST /api/auth/register/)
  -> Phone, password, first_name, last_name, role
  -> Creates user in public schema, auto-provisions tenant
  -> Returns { access, refresh, user }
```

### Role-Based Access Control

| Role | Access | Capabilities |
|------|--------|-------------|
| **superadmin** | All tenants | Provision tenants, view all data, manage plans |
| **admin** | Own tenant | Full access: POS, dashboard, reports, employees, inventory, settings |
| **cashier** | Own tenant | POS screen, view orders, search customers, process payments |
| **employee** | Own tenant | Task queue (view assigned orders, update status) |
| **customer** | Public | Track order status via `/track/:orderId` (no auth) |

### Frontend Guards

```tsx
// Each route is wrapped with a role guard
<Route path="/pos" element={
  <ProtectedRoute role="cashier">
    <POSScreen />
  </ProtectedRoute>
} />
```

### Axios JWT Interceptor (Frontend)

```typescript
// Automatically attaches Bearer token, refreshes on 401
api.interceptors.request.use(config => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401) {
      // Attempt token refresh, retry original request
      const refresh = localStorage.getItem("refresh_token");
      const { data } = await axios.post("/api/auth/refresh/", { refresh });
      localStorage.setItem("access_token", data.access);
      return api(err.config);
    }
    return Promise.reject(err);
  }
);
```

---

## 5. Django Backend

### Project Structure

```
backend/
├── api/
│   └── index.py                 # Vercel serverless entrypoint
├── config/
│   ├── settings.py              # Django settings (multi-tenant)
│   ├── urls.py                  # Root URL routing
│   └── wsgi.py                  # WSGI config
├── apps/
│   ├── tenants/                 # SHARED: Tenant, Domain, Plan models
│   ├── accounts/                # SHARED: User model, JWT auth views
│   ├── laundry/                 # TENANT: Order, Service, Customer, OrderItem
│   ├── payments/                # TENANT: M-Pesa STK Push, callbacks
│   ├── notifications/           # TENANT: SMS templates, Celery tasks
│   ├── rent/                    # TENANT: Rent Health engine
│   ├── billing/                 # SHARED: Subscription, Invoice, Plan enforcement
│   ├── inventory/               # TENANT: StockItem, StockTransaction
│   └── analytics/               # TENANT: ML models, forecast endpoints
├── manage.py
├── requirements.txt
└── runtime.txt
```

### Key Models

**laundry/models.py**
```python
class Customer(models.Model):
    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Service(models.Model):
    UNIT = [("kg","Per Kg"), ("item","Per Item"), ("flat","Flat Rate")]
    name = models.CharField(max_length=80)
    unit = models.CharField(max_length=10, choices=UNIT)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_active = models.BooleanField(default=True)

class Order(models.Model):
    STATUS = [("received","Received"), ("washing","Washing"), ("drying","Drying"),
              ("ironing","Ironing"), ("ready","Ready for Pickup"), ("delivered","Delivered")]
    order_number = models.CharField(max_length=20, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    cashier = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS, default="received")
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class Payment(models.Model):
    METHOD = [("cash","Cash"), ("mpesa","M-Pesa"), ("card","Card")]
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    method = models.CharField(max_length=10, choices=METHOD)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    reference = models.CharField(max_length=50, blank=True)  # M-Pesa transaction code
    paid_at = models.DateTimeField(auto_now_add=True)
```

---

## 6. REST API Endpoints

### Public Endpoints (shared schema)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login/` | None | Obtain JWT tokens |
| POST | `/api/auth/refresh/` | None | Refresh access token |
| POST | `/api/auth/register/` | None | Register + auto-provision tenant |
| GET | `/api/auth/me/` | JWT | Current user profile |
| GET | `/api/tenant-config/` | JWT | Tenant branding (logo, colors, name) |
| POST | `/api/tenants/provision/` | SuperAdmin | Create new tenant |

### Tenant Endpoints (per-tenant schema)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| **Orders** | | | |
| GET/POST | `/api/orders/` | Admin/Cashier | List/create orders |
| GET | `/api/orders/{id}/` | All | Order detail |
| POST | `/api/orders/{id}/update_status/` | Admin/Employee | Update order status |
| GET | `/api/orders/dashboard/` | Admin | Dashboard KPIs |
| **Customers** | | | |
| GET/POST | `/api/customers/` | Admin/Cashier | List/create customers |
| GET | `/api/customers/search/?phone=` | Admin/Cashier | Search by phone |
| **Services** | | | |
| GET/POST | `/api/services/` | Admin | List/create services |
| PATCH/DELETE | `/api/services/{id}/` | Admin | Update/delete service |
| **Payments** | | | |
| POST | `/api/payments/mpesa/stk/` | Cashier | Initiate STK Push |
| GET | `/api/payments/mpesa/status/{id}/` | Cashier | Check payment status |
| POST | `/api/payments/mpesa/callback/` | None | Safaricom callback |
| **Rent Health** | | | |
| GET | `/api/rent/reserve/health/` | Admin | Rent health status |
| POST | `/api/rent/reserve/add_to_reserve/` | Admin | Add to reserve |
| **Inventory** | | | |
| GET/POST | `/api/stock-items/` | Admin | List/create stock items |
| GET | `/api/stock-items/low_stock/` | Admin | Low stock alerts |
| GET/POST | `/api/stock-transactions/` | Admin | Stock movement log |
| **Analytics** | | | |
| GET | `/api/analytics/forecast/?days=` | Admin | Revenue forecast |
| GET | `/api/analytics/peak_hours/` | Admin | Peak hours heatmap |
| GET | `/api/analytics/service_demand/` | Admin | Service demand data |
| GET | `/api/analytics/churn/` | Admin | Customer churn analysis |

---

## 7. React Frontend

### Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.ts              # Axios instance + JWT interceptors
│   │   └── endpoints.ts           # Typed API functions
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx       # Sidebar + Outlet
│   │   │   ├── Sidebar.tsx        # Role-based navigation
│   │   │   └── Topbar.tsx         # User info + logout
│   │   ├── ui/
│   │   │   ├── Button.tsx, Input.tsx, Card.tsx
│   │   │   ├── Table.tsx, Modal.tsx
│   │   │   └── StatusBadge.tsx
│   │   └── charts/
│   │       ├── RevenueChart.tsx
│   │       ├── ServicePieChart.tsx
│   │       └── OrderStatusChart.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePOS.ts
│   │   └── useTenant.ts
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── pos/POSScreen.tsx
│   │   ├── admin/AdminDashboard.tsx
│   │   ├── employee/EmployeeTaskQueue.tsx
│   │   ├── customer/CustomerTracker.tsx
│   │   ├── superadmin/SuperAdminPanel.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── CustomersPage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── EmployeesPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── InventoryPage.tsx
│   ├── stores/
│   │   ├── authStore.ts           # Zustand — auth state
│   │   └── posStore.ts            # Zustand — cart, customer, totals
│   ├── types/index.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

### Frontend Modules

**POS Screen** — Cashier interface with customer search, service grid, cart management, and M-Pesa STK Push initiation.

**Admin Dashboard** — KPIs (orders today, revenue, cash vs M-Pesa), Rent Health hero widget, revenue forecast chart, service demand pie chart.

**Orders** — Full list with status filter tabs, inline status badges, payment status indicators.

**Customers** — Searchable customer list, create new customer modal, loyalty indicators.

**Reports** — Revenue forecast bar chart, service demand pie chart, order status progress bars, dashboard KPI cards.

**Inventory** — Stock items table with low stock alerts, add item modal, stock transaction log.

**Employees** — Staff list with role badges and onboarding status.

---

## 8. Payment Integration — M-Pesa (Daraja API)

Uses Safaricom's Daraja API with Lipa Na M-Pesa Online (STK Push) flow.

### Flow

```
1. Cashier enters customer phone number + amount
2. Frontend calls POST /api/payments/mpesa/stk/
3. Backend calls Safaricom STK Push API
4. Customer receives payment prompt on phone
5. Customer enters M-Pesa PIN
6. Safaricom calls POST /api/payments/mpesa/callback/
7. Backend reconciles payment, updates order status
8. Celery task auto-retries failed payments (2 retries)
```

### Environment Variables Required

| Variable | Description |
|----------|-------------|
| `MPESA_CONSUMER_KEY` | Daraja API consumer key |
| `MPESA_CONSUMER_SECRET` | Daraja API consumer secret |
| `MPESA_PASSKEY` | STK Push passkey |
| `MPESA_SHORTCODE` | Paybill/Till number (sandbox: 174379) |
| `MPESA_ENVIRONMENT` | `sandbox` or `production` |

### Payment State Machine

```
initiated -> pending -> processing -> completed
                                    -> failed (x2 retries) -> payment_link_generated
```

---

## 9. ML Analytics

Four machine learning models run as Celery background tasks, scoped per tenant. All models train on the tenant's own historical data — no cross-tenant training.

### Revenue Forecasting

- **Algorithm:** Linear regression (scikit-learn) with future date features
- **Input:** Daily payment totals (last 90 days minimum)
- **Output:** 30-day rolling forecast with confidence
- **Displayed:** Dashed prediction line on revenue chart (Reports page)
- **Celery task:** Scheduled nightly via celery-beat

### Customer Retention — RFM Segmentation

- **Algorithm:** K-Means clustering on Recency, Frequency, Monetary scores
- **Segments:** Champions, Loyal, At Risk, Lost, New
- **Input:** Orders table grouped by customer
- **Output:** Segment labels stored on customer records, shown as pie chart in Reports

### Service Demand Prediction

- **Algorithm:** Linear regression on order items grouped by service + day of week
- **Output:** Top 3 likely services tomorrow, displayed as widget on cashier dashboard
- **Helps:** Cashiers prepare staffing and supplies in advance

### Peak Hours Analysis

- **Algorithm:** Histogram of `created_at` hour across all orders
- **Output:** Heatmap by hour x day-of-week on admin dashboard
- **Identifies:** Busiest 3-hour windows per weekday for staffing

---

## 10. SaaS Billing & Plan Enforcement

### Plan Tiers

| Feature | Starter (KES 1,999/mo) | Pro (KES 4,999/mo) |
|---------|----------------------|-------------------|
| Users | 1 (cashier only) | Up to 3 (admin + cashier + employee) |
| Orders/mo | 300 | Unlimited |
| SMS notifications | — | 500 included |
| Rent Health dashboard | — | Yes |
| ML Analytics | — | Yes |
| Inventory management | — | Yes |
| Margin | ~80% | ~82% |

### Plan Enforcement Middleware

`PlanEnforcementMiddleware` runs on every request and returns HTTP 402 if the tenant's subscription is expired or past due.

**Exempted endpoints:**
- `/api/auth/*` — Login and registration always work
- `/api/tenant-config/` — Branding always loads
- `/api/billing/*` — Payment and subscription endpoints
- `/admin/*` — Django admin

### Revenue Model

| Stream | Margin |
|--------|--------|
| SaaS Subscriptions | ~85% |
| M-Pesa Transaction Fees (1.5%) | ~60% |
| SMS/WhatsApp Overage | ~40% markup |
| Hardware (Printers, Scanners) | ~20% |
| Data Insights (Anonymized Reports) | ~90% |

**Per-tenant profit (Pro plan):** KES 7,244/month (82% margin)

---

## 11. Deployment

### Vercel (current)

The monorepo deploys as a single Vercel project:

- **Frontend:** Vite builds to `frontend/dist`, served as SPA
- **Backend:** Python 3.13 serverless function at `api/index.py` handles `/api/*`
- **Rewrites:** `/api/*` routed to serverless function, everything else to `index.html`

### Docker Compose (production)

```yaml
services:
  db:      postgres:16
  redis:   redis:7-alpine
  django:  gunicorn config.wsgi:application -b 0.0.0.0:8000 -w 4
  celery:  celery -A config worker -l info -c 4
  celery-beat: celery -A config beat -l info
  nginx:   nginx:alpine (ports 80, 443)
```

### Required Environment Variables

Create `backend/.env` from `.env.example` with these values:

```
# Django
SECRET_KEY=generate-a-random-secret-key
DEBUG=True
ALLOWED_HOSTS=*

# PostgreSQL (local dev uses port 5433)
DB_NAME=laundrosaas
DB_USER=laundrosaas
DB_PASSWORD=laundrosaas_dev
DB_HOST=localhost
DB_PORT=5433

# Redis
REDIS_URL=redis://localhost:6379/0

# M-Pesa Daraja API (sandbox)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=174379
MPESA_ENVIRONMENT=sandbox

# Africa's Talking SMS
AT_API_KEY=your_africas_talking_api_key
AT_USERNAME=sandbox
AT_SENDER_ID=LaundroSaaS
```

---

## 12. Quick Start

### Prerequisites

- Python 3.13+
- Node.js 18+
- PostgreSQL 16 running on port 5433
- Redis (optional, for Celery)

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your database credentials
python manage.py migrate_schemas --shared
python manage.py seed
python manage.py runserver
```

The `seed` command creates demo data:
- Admin: `0712345678` / `admin123`
- Cashier: `0712000001` / `cashier123`
- Employee: `0712000002` / `emp123`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173` — proxies `/api/*` to Django at `http://localhost:8000`.

### Demo Flow

1. Open `http://localhost:5173/login`
2. Login as Admin (`0712345678` / `admin123`)
3. View Dashboard with Rent Health widget, revenue chart
4. Navigate to POS to create an order
5. Track order via `/track/:orderId`
6. View Reports with forecast charts
7. Manage Inventory, Services, Customers, Employees

---

## Persona URLs

| Role | URL | Auth |
|------|-----|------|
| POS (Cashier) | `/pos` | JWT + cashier role |
| Admin (Owner) | `/admin` | JWT + admin role |
| Employee | `/employee` | JWT + employee role |
| Customer Tracker | `/track/:orderId` | No auth |
| SuperAdmin | `/superadmin` | JWT + superadmin |

## Multi-Tenant URLs

| Tenant | URL |
|--------|-----|
| FreshWash | `freshwash.laundrosaas.com` |
| CleanWave | `cleanwave.laundrosaas.com` |
