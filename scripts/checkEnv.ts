const required = [
  'GEMINI_API_KEY',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY'
];

const missing = required.filter((key) => !process.env[key] || process.env[key]?.length === 0);

if (missing.length === 0) {
  console.log('All required environment variables are present.');
} else {
  console.log('Missing environment variables:');
  missing.forEach((key) => console.log(`- ${key}`));
}

if (!process.env.GEMINI_MODEL) {
  console.log('Optional: GEMINI_MODEL is not set. Falling back to gemini-2.5-flash.');
}

if (process.argv.includes('--strict') && missing.length > 0) {
  process.exitCode = 1;
}
