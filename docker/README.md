# Docker

Container definitions for HomePulse services.

## Services
- `Dockerfile.backend` — Node.js API server
- `Dockerfile.admin` — Next.js admin dashboard
- `Dockerfile.nginx` — Reverse proxy / load balancer
- `Dockerfile.redis` — Redis cache
- `Dockerfile.worker` — Background job worker

## Compose Files
- `docker-compose.yml` — Production stack
- `docker-compose.staging.yml` — Staging stack

## Usage
```bash
# Production
docker compose up -d

# Staging
docker compose -f docker-compose.staging.yml up -d
```

## Building Individual Images
```bash
docker build -f docker/Dockerfile.backend -t homepulse-backend ./backend
docker build -f docker/Dockerfile.admin -t homepulse-admin ./admin
docker build -f docker/Dockerfile.nginx -t homepulse-nginx ./docker/nginx
docker build -f docker/Dockerfile.redis -t homepulse-redis .
docker build -f docker/Dockerfile.worker -t homepulse-worker ./backend
```
