export const pushConfig = {
  provider: process.env['PUSH_PROVIDER'] || 'firebase',
  firebase: {
    projectId: process.env['FIREBASE_PROJECT_ID'],
    privateKey: process.env['FIREBASE_PRIVATE_KEY']?.replace(/\\n/g, '\n'),
    clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
    databaseURL: process.env['FIREBASE_DATABASE_URL'],
  },
  onesignal: {
    appId: process.env['ONESIGNAL_APP_ID'],
    apiKey: process.env['ONESIGNAL_API_KEY'],
    restApiKey: process.env['ONESIGNAL_REST_API_KEY'],
  },
};
