#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "=========================================="
echo "HomePulse Database Seed"
echo "=========================================="

cd "$PROJECT_ROOT/backend"

echo "Installing dependencies..."
npm install

echo "Running Prisma seed..."
npx prisma db seed

echo "Seed completed successfully!"
