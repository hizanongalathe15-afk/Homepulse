import AWS from 'aws-sdk';
import { logger } from './logger.config';

export const awsConfig = {
  region: process.env['AWS_REGION'] || 'us-east-1',
  accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
  secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
  s3Bucket: process.env['AWS_S3_BUCKET'] || 'homepulse-uploads',
  s3Region: process.env['AWS_S3_REGION'] || 'us-east-1',
  sesRegion: process.env['AWS_SES_REGION'] || 'us-east-1',
  sesSenderEmail: process.env['AWS_SES_SENDER_EMAIL'] || 'noreply@homepulse.com',
  sesSenderName: process.env['AWS_SES_SENDER_NAME'] || 'HomePulse',
  presignedExpiry: Number(process.env['AWS_S3_PRESIGNED_EXPIRY']) || 3600,
  uploadMaxSize: Number(process.env['AWS_S3_UPLOAD_MAX_SIZE']) || 10485760,
};

export const s3 = new AWS.S3({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.s3Region,
  signatureVersion: 'v4',
});

export const ses = new AWS.SES({ region: awsConfig.sesRegion });
