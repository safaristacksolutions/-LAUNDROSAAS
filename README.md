# LaundroSaaS — Frontend

Multi-tenant laundry management SPA for Kenyan shops. React 19 + MUI v6 + TanStack Query v5.

**Stack:** React 19 + Vite + TypeScript | MUI v6 | TanStack Query v5 | Zustand v5 | React Router v7 | React Hook Form + Zod

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

## Architecture

| Layer | Library | Role |
|-------|---------|------|
| Shell | React Router v7 + MUI | Application chrome, layout, routing |
| State (server) | TanStack Query v5 | All API data, caching, refetching |
| State (client) | Zustand v5 | UI state only (transaction draft, filters, sidebar) |
| Forms | React Hook Form + Zod | Validation, submission |
| Theme | MUI v6 + Emotion | Runtime multi-tenant branding |
| Persistence | IndexedDB (idb) | Offline mutation queue + query cache |
| Real-time | Event bus | Cross-module communication + SSE |

## Feature Modules

Each feature lives under `src/features/<name>/` with zero cross-imports. Modules communicate via the event bus and shared API client only.

`auth`, `pos`, `orders`, `customers`, `services`, `inventory`, `employees`, `laundry`, `reports`, `dashboard`, `admin`, `superadmin`
