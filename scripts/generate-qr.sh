#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "=========================================="
echo "HomePulse QR Code Generator"
echo "=========================================="

PROPERTY_ID="${1:-}"
LANDLORD_ID="${2:-}"
OUTPUT_DIR="${3:-$PROJECT_ROOT/backend/uploads/qr}"

if [ -z "$PROPERTY_ID" ] || [ -z "$LANDLORD_ID" ]; then
  echo "Usage: $0 <property_id> <landlord_id> [output_dir]"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

cd "$PROJECT_ROOT/backend"

echo "Generating QR code for property $PROPERTY_ID..."
npx ts-node -e "
import { QRCodeService } from './src/services/qr.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const qrService = new QRCodeService(prisma);

const qr = await qrService.generateQRForProperty('$PROPERTY_ID', '$LANDLORD_ID');
console.log('QR Code generated:', qr.url);
console.log('Saved to:', '$OUTPUT_DIR');
"

echo "QR code generation completed!"
