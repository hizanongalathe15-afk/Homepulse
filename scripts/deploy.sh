#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "=========================================="
echo "HomePulse Deployment Script"
echo "=========================================="

ENVIRONMENT="${1:-staging}"
VERSION="${2:-latest}"
DOCKER_REGISTRY="${DOCKER_REGISTRY:-homepulse}"

echo "Environment: $ENVIRONMENT"
echo "Version: $VERSION"
echo "Registry: $DOCKER_REGISTRY"

cd "$PROJECT_ROOT/docker"

if [ "$ENVIRONMENT" = "production" ]; then
  COMPOSE_FILE="docker-compose.yml"
else
  COMPOSE_FILE="docker-compose.staging.yml"
fi

echo "Building images..."
docker compose -f "$COMPOSE_FILE" build --build-arg VERSION="$VERSION"

echo "Pushing images..."
docker compose -f "$COMPOSE_FILE" push

echo "Deploying to $ENVIRONMENT..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

echo "Running database migrations..."
docker compose -f "$COMPOSE_FILE" exec -T backend npx prisma migrate deploy

echo "Deployment completed successfully!"
