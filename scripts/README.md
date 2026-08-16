# Scripts

Operational scripts for HomePulse.

## Scripts
| Script | Purpose |
|--------|---------|
| `seed.sh` | Seed database with initial/demo data |
| `backup.sh` | Backup database & uploads |
| `deploy.sh` | Deployment automation |
| `generate-qr.sh` | Bulk QR code generation |

## Usage
```bash
chmod +x scripts/*.sh
./scripts/seed.sh
./scripts/backup.sh
./scripts/deploy.sh
./scripts/generate-qr.sh
```

## Notes
- Review each script before running in production.
- Ensure environment variables are set in `.env` or shell profile.
- `seed.sh` and `backup.sh` may require database credentials.
