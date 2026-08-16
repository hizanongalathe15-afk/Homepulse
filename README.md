# HomePulse

> Kenya's Premier Property Rental Platform with Trust, Safety & Community Features

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

HomePulse is a comprehensive property rental platform designed for the Kenyan market, connecting tenants, landlords, and property managers in a secure, trusted environment. The platform goes beyond traditional property listings by integrating trust and safety features that protect both tenants and landlords throughout the rental journey.

Unlike generic rental platforms, HomePulse is purpose-built for urban rental markets with features like:
- **QR Code Property Verification** — Prevents fake property listings through physical QR code verification
- **Escrow Payments** — Secure payment holding with automatic release
- **SOS Safety Alerts** — Emergency alert system for tenants
- **Trust Scores & Reviews** — Community-driven reputation system
- **Identity Verification** — KYC-style ID verification for all users
- **Fraud Detection** — AI-powered suspicious activity detection
- **Community Groups** — Neighborhood-based social features

The platform consists of three main components:

| Component | Technology | Description |
|-----------|-----------|-------------|
| **Backend API** | Node.js / Express / TypeScript | REST API with Socket.IO real-time features |
| **Admin Panel** | Next.js / React / TypeScript | Web-based admin dashboard |
| **Mobile App** | Flutter / Dart | Cross-platform mobile application |

## Key Features

### Property Discovery & Management
- Advanced property search with filters (city, price, type, amenities)
- Property listing management for landlords
- Property verification via QR codes
- Property analytics and view tracking
- Saved searches with alert notifications
- Trending and recommended properties

### Trust & Safety
- **QR Code Verification System** — Each verified property gets a unique QR code. Tenants scan to verify authenticity, preventing fake listings and rental scams.
- **SOS Alerts** — One-tap emergency alerts (panic, medical, fire, crime) with location sharing
- **Safety Reports** — Community-driven safety issue reporting with moderation
- **Identity Verification** — National ID, passport, and driving license verification
- **Trust Scores** — Dynamic scoring based on reviews, verification status, and activity
- **Fraud Detection** — Automated detection of suspicious patterns and fake listings

### Payments & Financial Security
- **M-Pesa Integration** — STK Push, C2B payments for Kenyan users
- **Stripe Integration** — International card payments
- **Escrow System** — Secure deposit holding with 14-day dispute window
- **Payment History** — Complete transaction records with receipts
- **Refund Management** — Admin-controlled refund workflow

### Communication & Community
- **Real-time Chat** — Socket.IO powered messaging between tenants and landlords
- **Notifications** — In-app, push, SMS, and email notification channels
- **Community Groups** — Neighborhood-based community features
- **Events** — Community event creation and RSVP
- **Banners & Campaigns** — Promotional banner management with targeting

### Additional Features
- Maintenance request tracking and management
- Roommate matching with preference-based algorithm
- Referral program with reward system
- Admin dashboard with comprehensive analytics
- Export functionality (CSV/PDF reports)
- AI-powered property description generation
- Weather integration for property context
- Geocoding and map integration

## Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | >=18.0.0 | Runtime |
| Express.js | 4.18.2 | Web framework |
| TypeScript | 5.9.3 | Language |
| Prisma | 5.7.0 | ORM |
| PostgreSQL | 14+ | Primary database |
| Redis | 7+ | Caching & session store |
| Socket.IO | 4.7.4 | Real-time communication |
| Bull | 4.12.0 | Job queue |
| Winston | 3.11.0 | Logging |
| Jest | 29.7.0 | Testing |

### Frontend (Admin Panel)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14+ | React framework |
| React | 18+ | UI library |
| TypeScript | 5+ | Language |
| Tailwind CSS | 3.4+ | Styling |
| React Query | 5+ | Data fetching |

### Mobile App
| Technology | Version | Purpose |
|-----------|---------|---------|
| Flutter | 3.16+ | Framework |
| Dart | 3.0+ | Language |
| Riverpod | 2.5+ | State management |
| GoRouter | 14.1+ | Navigation |
| Hive | 2.2+ | Local storage |
| Socket.IO Client | 2.0+ | Real-time |

### Infrastructure
| Technology | Version | Purpose |
|-----------|---------|---------|
| Docker | 24+ | Containerization |
| Docker Compose | 2.20+ | Local orchestration |
| Kubernetes | 1.28+ | Production orchestration |
| Nginx | 1.25+ | Reverse proxy & SSL |
| Prometheus | 2.47+ | Metrics |
| Grafana | 10.0+ | Monitoring dashboards |
| Sentry | 10.70+ | Error tracking |
| AWS S3 | Latest | File storage |

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet Users                        │
└───────────────┬─────────────────────────────┬───────────────┘
                │                             │
        ┌───────▼────────┐           ┌───────▼────────┐
        │    Nginx       │           │   Mobile App   │
        │ (SSL, Proxy,   │           │   (Flutter)    │
        │   Rate Limit)  │           └────────────────┘
        └───────┬────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌───────┐ ┌───────┐ ┌───────────────┐
│ Admin │ │Backend│ │    Worker     │
│Panel  │ │ API   │ │  (Bull Jobs)  │
│(Next) │ │(Express)│ └───────────────┘
└───────┘ └───┬───┘
              │
    ┌─────────┼──────────┐
    │         │          │
    ▼         ▼          ▼
┌──────┐ ┌──────┐ ┌──────────┐
│Postgres│ │ Redis│ │   S3     │
│ (DB) │ │(Cache)│ │(Storage) │
└──────┘ └──────┘ └──────────┘
```

### Backend Architecture

The backend follows a layered architecture pattern:

```
backend/src/
├── config/          # Configuration modules (database, redis, sentry, etc.)
├── controllers/     # Request handlers — validate input, orchestrate service calls
├── services/        # Business logic layer — core domain operations
├── models/          # Mongoose-like model wrappers around Prisma
├── routes/          # Express route definitions with validation middleware
├── middleware/      # Express middleware (auth, rate-limit, error-handling, etc.)
├── sockets/         # Socket.IO event handlers
├── workers/         # Background job processors (Bull + Redis)
├── jobs/            # Scheduled background jobs
├── types/           # TypeScript type definitions
├── utils/           # Helper utilities (formatters, validators, etc.)
├── webhooks/        # Third-party webhook handlers
├── app.ts           # Express app initialization
└── workers/         # Worker process entry point
```

### API Design Principles

- **Versioned**: All endpoints live under `/api/v1`
- **RESTful**: Standard HTTP verbs (GET, POST, PUT, DELETE, PATCH)
- **Consistent Response Shape**:
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Operation successful",
    "timestamp": "2024-01-15T10:30:00Z"
  }
  ```
- **Error Shape**:
  ```json
  {
    "success": false,
    "error": "Error message",
    "code": "ERROR_CODE",
    "details": { ... },
    "timestamp": "2024-01-15T10:30:00Z"
  }
  ```
- **Pagination**: `page`, `limit`, `total`, `totalPages` in list responses
- **Authentication**: JWT Bearer tokens in `Authorization` header
- **Rate Limiting**: 100 requests per 15 minutes per IP (configurable)

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- Redis >= 7
- Docker & Docker Compose (optional, for containerized setup)
- Flutter SDK >= 3.16.0 (for mobile app)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/homepulse/homepulse.git
cd homepulse

# Start all services
docker compose up -d

# Run database migrations
docker compose exec backend npx prisma migrate deploy

# Seed the database
docker compose exec backend npx prisma db seed
```

### Option 2: Local Development

```bash
# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp backend/.env.example backend/.env
# Edit .env with your database credentials

# Run database migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed

# Start development server
npm run dev
```

### Admin Panel

```bash
cd admin
npm install
npm run dev
# Access at http://localhost:3001
```

### Mobile App

```bash
cd app
flutter pub get
flutter run
```

## Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=3000
HOST=0.0.0.0
API_VERSION=v1

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/homepulse?schema=public"

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
FRONTEND_URL=http://localhost:3001
SOCKET_CORS_ORIGIN=http://localhost:3001

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# M-Pesa
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_PASSKEY=...
MPESA_SHORTCODE=...
MPESA_ENVIRONMENT=sandbox

# Twilio (SMS)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Email (SMTP)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=noreply@homepulse.co.ke

# AWS S3
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=homepulse-uploads

# Sentry
SENTRY_DSN=...

# QR Code
QR_SECRET_KEY=...
QR_MAX_SCANS=100

# Push Notifications
FCM_SERVER_KEY=...
FCM_SENDER_ID=...

# External APIs
MAPBOX_TOKEN=...
WEATHER_API_KEY=...
```

## API Documentation

Full API documentation is available at:
- **Swagger UI**: `http://localhost:3000/api-docs` (development)
- **Detailed Docs**: See [`docs/API_DOCS.md`](./docs/API_DOCS.md)

## Database Schema

See [`docs/DATABASE_SCHEMA.md`](./docs/DATABASE_SCHEMA.md) for the complete Prisma schema documentation including all 25+ models, relationships, indexes, and ER diagrams.

## Deployment

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for comprehensive deployment guides covering Docker, Kubernetes, CI/CD, environment configuration, scaling, and monitoring.

### Quick Deployment

```bash
# Build and push Docker image
docker build -t homepulse/backend:latest -f docker/Dockerfile.backend .
docker push homepulse/backend:latest

# Deploy to Kubernetes
kubectl apply -f infra/
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Lint
npm run lint

# Format code
npm run format
```

## Project Structure

```
homepulse/
├── backend/               # Node.js/Express API server
│   ├── src/
│   │   ├── config/        # Configuration modules
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── sockets/       # Socket.IO handlers
│   │   ├── workers/       # Background job workers
│   │   ├── jobs/          # Scheduled jobs
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Utilities
│   │   └── app.ts         # App entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Seed data
│   └── package.json
├── admin/                 # Next.js admin panel
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   └── package.json
├── app/                   # Flutter mobile app
│   ├── lib/
│   │   ├── core/          # Core utilities
│   │   ├── features/      # Feature modules
│   │   ├── models/        # Data models
│   │   ├── services/      # API services
│   │   └── widgets/       # Reusable widgets
│   └── pubspec.yaml
├── docker/                # Docker configurations
├── infra/                 # Kubernetes manifests
├── scripts/               # Utility scripts
├── shared/                # Shared TypeScript utilities
├── docs/                  # Documentation
└── .github/               # CI/CD workflows
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

HomePulse is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

Copyright (c) 2026 HomePulse. All rights reserved.
