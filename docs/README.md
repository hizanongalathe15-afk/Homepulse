# Documentation Index

Welcome to the HomePulse documentation. This directory contains comprehensive guides for developers, administrators, and operations teams working with the HomePulse platform.

## Documents

| Document | Description |
|----------|-------------|
| **[API_DOCS.md](./API_DOCS.md)** | Complete REST API documentation for all `/api/v1` endpoints including request/response examples, authentication, error codes, and rate limits. |
| **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** | Full Prisma database schema documentation with all 25+ models, fields, types, relations, indexes, enums, and ER diagram description. |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Comprehensive deployment guide covering Docker, Kubernetes, CI/CD, environment variables, scaling, monitoring, and backups. |
| **[QR_SYSTEM.md](./QR_SYSTEM.md)** | Complete documentation for the QR code property verification system including generation, scanning, verification flow, security, limits, and analytics. |
| **[SAFETY_TRUST_POLICY.md](./SAFETY_TRUST_POLICY.md)** | Safety and trust policy documentation including SOS alerts, safety reports, identity verification, escrow protection, dispute resolution, trust scores, and community guidelines. |
| **[USER_FLOWS.md](./USER_FLOWS.md)** | Complete user flows for tenant, landlord, and admin roles including registration, property search, viewing, payment, escrow, QR verification, chat, community, and safety features. |

## Quick Navigation

### For Backend Developers
1. Start with [API_DOCS.md](./API_DOCS.md) — understand available endpoints
2. Review [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) — understand data models
3. Check [DEPLOYMENT.md](./DEPLOYMENT.md) — local setup instructions

### For DevOps / SRE
1. Start with [DEPLOYMENT.md](./DEPLOYMENT.md) — deployment architecture
2. Review [QR_SYSTEM.md](./QR_SYSTEM.md) — QR infrastructure details
3. Check [SAFETY_TRUST_POLICY.md](./SAFETY_TRUST_POLICY.md) — safety system architecture

### For Product Managers
1. Start with [USER_FLOWS.md](./USER_FLOWS.md) — understand all user journeys
2. Review [SAFETY_TRUST_POLICY.md](./SAFETY_TRUST_POLICY.md) — safety & trust policies
3. Check [QR_SYSTEM.md](./QR_SYSTEM.md) — verification system overview

### For Mobile Developers
1. Start with [API_DOCS.md](./API_DOCS.md) — API endpoints consumed by the Flutter app
2. Review [USER_FLOWS.md](./USER_FLOWS.md) — user journey flows
3. Check [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) — data models

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Admin Panel │  │ Mobile App  │  │   Third-party Apps   │  │
│  │  (Next.js)   │  │ (Flutter)   │  │   (Webhooks/API)     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬──────────┘  │
└─────────┼─────────────────┼──────────────────────┼────────────┘
          │                 │                      │
          └─────────────────┼──────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│                      API Gateway Layer                      │
│                  Nginx (SSL, Rate Limit, Proxy)             │
└───────────────────────────┬───────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│                       Application Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Backend API │  │ Admin Panel  │  │      Worker         │  │
│  │  (Express)   │  │  (Next.js)   │  │   (Bull Jobs)       │  │
│  └──────┬───────┘  └─────────────┘  └─────────────────────┘  │
└─────────┼────────────────────────────────────────────────────┘
          │
┌─────────┼────────────────────────────────────────────────────┐
│         │              Data Layer                           │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐         │
│  │ PostgreSQL  │  │    Redis    │  │     S3      │         │
│  │  (Primary)  │  │  (Cache)    │  │ (Files)     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Getting Help

- **GitHub Issues**: Report bugs and request features
- **Documentation**: This `/docs` directory
- **API Reference**: Available at `/api-docs` endpoint in development
