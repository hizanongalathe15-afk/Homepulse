export const smsConfig = {
  provider: process.env['SMS_PROVIDER'] || 'twilio',
  twilio: {
    accountSid: process.env['TWILIO_ACCOUNT_SID'],
    authToken: process.env['TWILIO_AUTH_TOKEN'],
    senderId: process.env['TWILIO_SENDER_ID'] || 'HomePulse',
    whatsappNumber: process.env['TWILIO_WHATSAPP_NUMBER'] || 'whatsapp:+14155238886',
  },
  africaTalking: {
    username: process.env['AFRICASTALKING_USERNAME'],
    apiKey: process.env['AFRICASTALKING_API_KEY'],
    senderId: process.env['AFRICASTALKING_SENDER_ID'] || 'HomePulse',
  },
};
