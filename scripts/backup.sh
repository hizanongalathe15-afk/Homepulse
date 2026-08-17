#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

echo "=========================================="
echo "HomePulse Database Backup"
echo "=========================================="

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_NAME="${DB_NAME:-homepulse}"

BACKUP_FILE="$BACKUP_DIR/homepulse_${TIMESTAMP}.sql"

echo "Backing up database $DB_NAME to $BACKUP_FILE..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -F c -f "$BACKUP_FILE"

echo "Compressing backup..."
gzip -f "$BACKUP_FILE"

echo "Backup completed: ${BACKUP_FILE}.gz"
echo "Backup size: $(du -h "${BACKUP_FILE}.gz" | cut -f1)"

RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "homepulse_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup process completed successfully!"
