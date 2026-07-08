# EasyWash — Frontend

Multi-tenant laundry management SPA. React 19 + MUI v6 + TanStack Query v5.

**Stack:** React 19 + Vite + TypeScript | MUI v6 | TanStack Query v5 | Zustand v5 | React Router v7 | React Hook Form + Zod

Backend: Django 5 + DRF + django-tenants (schema-per-tenant) + PostgreSQL 16 + Redis + Celery

## Layout

```
src/
├── app/           Entry, providers, router, TenantGate bootstrap
├── api/           Axios client, interceptors, all endpoint modules
├── store/         Zustand: auth (in-memory), tenant, branch, theme
├── layouts/       AuthLayout, DashboardLayout, MinimalLayout
├── components/    Domain-blind UI: NavigationRail, TopBar, DataTable, StatusBadge, PageHeader
├── features/      Isolated business modules (Tomb Stability pattern)
│   ├── authentication/  Login, validation (Zod)
│   ├── pos/             Three-pane POS canvas + useTransactionEngine
│   ├── dashboard/       KPI widgets
│   ├── orders/          Order list, status updates
│   ├── customers/       Customer directory
│   ├── laundry/         Workflow timeline with Stepper + status advance
│   ├── inventory/       Stock levels
│   ├── employees/       Staff directory
│   ├── reports/         Sales reports + export
│   ├── billing/         Subscriptions + invoices
│   └── analytics/       ML forecast + RFM segments
├── services/       Event bus, offline queue
├── theme/          Runtime MUI theme from brand tokens
├── types/          Domain model types
└── utilities/      Formatters, constants
```

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

## Architecture

| Principle | Implementation |
|-----------|---------------|
| State separation | Zustand = client only; TanStack Query = server only |
| Auth | Access token in-memory (Zustand), never localStorage |
| Token refresh | Silent via Axios interceptor with HttpOnly cookie |
| Multi-tenant | TenantGate blocks render until config/permissions/branches hydrate |
| Cross-module comms | Event bus — zero feature-to-feature imports |
| Offline | IndexedDB mutation queue with idempotency keys |
| Theming | Runtime MUI theme from tenant brand tokens |
| Performance | Lazy routes, selector-scoped Zustand, Suspense boundaries |

## API Endpoints

All endpoints proxied through Vite dev server to the Django backend.

### Public
- `POST /api/auth/login/` — JWT access + refresh
- `POST /api/auth/refresh/` — Refresh access token
- `GET /api/tenant-config/` — Branding tokens
- `POST /api/tenants/provision/` — Create tenant (SuperAdmin)

### Tenant-scoped
- `GET/POST /api/orders/` — Orders CRUD
- `PUT /api/orders/{id}/status/` — Workflow status
- `GET/POST /api/customers/` — Customers CRUD
- `GET/POST /api/services/` — Services CRUD
- `GET /api/inventory/` — Stock levels
- `POST /api/inventory/stock-in/` — Stock inward
- `GET/POST /api/employees/` — Employees CRUD
- `GET /api/reports/sales/` — Sales data
- `POST /api/payments/mpesa/stk/` — STK Push
- `GET /api/analytics/forecast/` — ML revenue forecast
- `GET /api/analytics/rfm/` — Customer RFM segments
- `GET /api/billing/subscriptions/` — Plan info
- `GET /api/billing/invoices/` — Invoice list
