import type { Handler } from "@netlify/functions";

export const handler: Handler = async () => {
  const cfg = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
  };
  return { statusCode: 200, headers: { "content-type":"application/json" }, body: JSON.stringify(cfg) };
};
