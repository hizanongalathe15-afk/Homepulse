import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
  env: process.env['NODE_ENV'] || 'development',
  port: parseInt(process.env['PORT'] || '3000', 10),
  host: process.env['HOST'] || '0.0.0.0',
  appName: process.env['APP_NAME'] || 'HomePulse API',
  appUrl: process.env['APP_URL'] || 'http://localhost:3000',
  frontendUrl: process.env['FRONTEND_URL'] || 'http://localhost:3001',
  apiVersion: process.env['API_VERSION'] || 'v1',
  apiTimeout: parseInt(process.env['API_TIMEOUT'] || '30000', 10),
  bodyLimit: process.env['BODY_LIMIT'] || '10mb',
  isDevelopment: process.env['NODE_ENV'] === 'development',
  isProduction: process.env['NODE_ENV'] === 'production',
  isStaging: process.env['NODE_ENV'] === 'staging',
};

export default config;
