import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const requiredEnv = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'] as const;

type RequiredEnvKey = (typeof requiredEnv)[number];

const readEnv = (key: RequiredEnvKey) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

let app: App | null = null;

export const getFirebaseAdminApp = () => {
  if (app) return app;

  const privateKey = readEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');
  app = getApps()[0] ?? initializeApp({
    credential: cert({
      projectId: readEnv('FIREBASE_PROJECT_ID'),
      clientEmail: readEnv('FIREBASE_CLIENT_EMAIL'),
      privateKey
    })
  });

  return app;
};

export const verifyIdToken = async (authorizationHeader?: string) => {
  if (!authorizationHeader) {
    throw new Error('Missing Authorization header');
  }
  const [, token] = authorizationHeader.split(' ');
  if (!token) {
    throw new Error('Authorization header must be in the format Bearer <token>');
  }
  const auth = getAuth(getFirebaseAdminApp());
  return auth.verifyIdToken(token);
};

export const getAdminFirestore = () => getFirestore(getFirebaseAdminApp());
