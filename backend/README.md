# Backend

Node.js/Express backend API for HomePulse.

## Stack
- Node.js + Express + TypeScript
- Prisma ORM
- Redis (caching + sessions)
- Socket.io
- Bull (background jobs)
- AWS S3 / SES
- Stripe / M-Pesa integrations
- Sentry

## Setup
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Structure
```
src/
├── app.ts                 # Express app entry
├── config/                # Service configs (AWS, DB, Redis, Stripe, M-Pesa, Sentry, etc.)
├── controllers/           # Route controllers
├── jobs/                  # Background jobs (BannerScheduler, EscrowRelease, etc.)
├── middleware/            # Auth, validation, rate limiting, role checks, error handling
├── models/                # Prisma models
├── routes/                # API route definitions
├── services/              # Business logic
├── sockets/               # Socket.io handlers
├── types/                 # TypeScript types
├── utils/                 # Helpers (bcrypt, JWT, OTP, QR, validators, email templates)
├── webhooks/              # External webhooks (Stripe, M-Pesa, Mapbox)
└── workers/               # Background worker entry
```

## Key Routes
- `/api/auth` — Authentication, OTP, ID verification
- `/api/users` — User management
- `/api/properties` — Property CRUD, search, recommendations
- `/api/payments` — M-Pesa, Stripe, escrow deposits
- `/api/escrow` — Escrow lifecycle
- `/api/qr` — QR generation & scanning
- `/api/banners` — Banner management
- `/api/campaigns` — Marketing campaigns
- `/api/disputes` — Dispute creation & resolution
- `/api/notifications` — Push, SMS, email notifications
- `/api/chat` — Messaging
- `/api/safety` — SOS alerts, incident reports
- `/api/community` — Groups, events, neighbors
- `/api/analytics` — Platform analytics
- `/api/admin` — Admin-only endpoints
- `/api/search` — Property search
- `/api/referral` — Referral program
- `/api/maintenance` — Maintenance requests
- `/api/review` — Reviews & ratings
- `/api/roommate` — Roommate matching

## Background Jobs
- `bannerScheduler.job.ts`
- `expireListings.job.ts`
- `expireQRCodes.job.ts`
- `generateAnalytics.job.ts`
- `reindexSearch.job.ts`
- `releaseEscrow.job.ts`
- `sendReminders.job.ts`
- `sendSavedSearchAlerts.job.ts`
- `updateScores.job.ts`

## Deployment
Dockerfile included at `../docker/Dockerfile.backend`.
