export const qrConfig = {
  secretKey: process.env['QR_SECRET_KEY'] || 'your-qr-secret-key-for-signing',
  defaultExpiry: Number(process.env['QR_DEFAULT_EXPIRY']) || 86400000,
  maxSize: Number(process.env['QR_MAX_SIZE']) || 1048576,
  cacheTTL: Number(process.env['QR_CACHE_TTL']) || 3600,
};
