# Admin

Next.js 14 admin dashboard for HomePulse.

## Stack
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Recharts
- Zustand
- Socket.io client

## Setup
```bash
cd admin
npm install
cp .env.example .env.local
npm run dev
```

## Routes
- `/login` — Admin login
- `/overview` — Dashboard overview
- `/analytics` — Analytics suite
- `/users` — User management
- `/properties` — Property management
- `/verifications` — Identity/document verification queue
- `/disputes` — Dispute resolution
- `/qr-management` — QR code generation & analytics
- `/banner-management` — Banner campaigns
- `/escrow-management` — Escrow oversight
- `/payments` — Payment transactions
- `/campaigns` — Marketing campaigns
- `/content-management` — Blog, announcements, FAQ, tutorials
- `/reports` — Report builder & scheduler
- `/notifications` — Notification center
- `/settings` — System, payment, notification, localization, integration settings
- `/audit-logs` — Audit trail
- `/safety` — SOS alerts, incidents, safety scores
- `/fraud-detection` — Fraud rules & flagged listings
- `/feedback` — User feedback
- `/support` — Support tickets & live chat

## Structure
```
src/
├── app/                 # Next.js App Router pages & layouts
├── components/          # Shared UI, charts, forms, layouts
├── contexts/            # React contexts (auth, theme, socket, notifications, permissions)
├── hooks/               # Custom hooks
├── lib/                 # API client & utilities
├── middleware/          # Auth, rate limiting, security, permissions
├── services/            # API service layer
├── styles/              # Global CSS, admin utilities, chart overrides
├── types/               # TypeScript interfaces
└── utils/               # Constants, helpers, validators, formatters, permissions, metrics
```

## Auth
- JWT stored in `localStorage` as `admin_token`
- Protected via `AdminAuthProvider`
- Middleware handles redirects on 401

## Permissions
Roles: `super_admin`, `admin`, `moderator`
Permissions are checked via `useAdminPermissions` hook and middleware.

## Deployment
Dockerfile included at `../docker/Dockerfile.admin`.
