export const mpesaConfig = {
  env: process.env['MPESA_ENV'] || 'sandbox',
  consumerKey: process.env['MPESA_CONSUMER_KEY'],
  consumerSecret: process.env['MPESA_CONSUMER_SECRET'],
  shortcode: process.env['MPESA_SHORTCODE'] || '174379',
  passkey: process.env['MPESA_PASSKEY'],
  callbackUrl: process.env['MPESA_CALLBACK_URL'] || 'https://your-domain.com/api/webhooks/mpesa',
  timeoutUrl: process.env['MPESA_TIMEOUT_URL'] || 'https://your-domain.com/api/webhooks/mpesa/timeout',
  transactionType: process.env['MPESA_TRANSACTION_TYPE'] || 'CustomerPayBillOnline',
  initiatorName: process.env['MPESA_INITIATOR_NAME'] || 'testapi',
  securityCredential: process.env['MPESA_SECURITY_CREDENTIAL'],
  organizationShortcode: process.env['MPESA_ORGANIZATION_SHORTCODE'] || '174379',
  b2cShortcode: process.env['MPESA_B2C_SHORTCODE'],
};

export const getMpesaBaseUrl = () => {
  return mpesaConfig.env === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
};
