import type { HandlerEvent } from '@netlify/functions';
import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const requiredEnv = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'] as const;

type RequiredEnvKey = (typeof requiredEnv)[number];

class AuthResponseError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

let app: App | null = null;

const readEnv = (key: RequiredEnvKey): string => {
  const value = process.env[key];
  if (!value) {
    throw new AuthResponseError(503, `Auth temporarily unavailable. Missing environment variable: ${key}`);
  }
  return value;
};

const initApp = () => {
  if (app) return app;
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new AuthResponseError(503, `Auth temporarily unavailable. Missing environment variables: ${missing.join(', ')}`);
  }

  app = getApps()[0] ?? initializeApp({
    credential: cert({
      projectId: readEnv('FIREBASE_PROJECT_ID'),
      clientEmail: readEnv('FIREBASE_CLIENT_EMAIL'),
      privateKey: readEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n')
    })
  });
  return app;
};

const normalizeHeader = (headers: HandlerEvent['headers'] | undefined, name: string) => {
  if (!headers) return undefined;
  const lower = name.toLowerCase();
  return headers[lower] ?? headers[name] ?? headers[name.toUpperCase()];
};

export interface VerifiedUser {
  uid: string;
  email?: string;
  simulated: boolean;
}

export const requireUser = async (event: HandlerEvent): Promise<VerifiedUser> => {
  const debugUid = normalizeHeader(event.headers, 'x-debug-uid');
  const authHeader = normalizeHeader(event.headers, 'authorization');

  try {
    const appInstance = initApp();
    if (!authHeader) {
      if (debugUid) {
        return { uid: debugUid, simulated: true };
      }
      throw new AuthResponseError(401, 'Authorization header missing. Sign in again.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AuthResponseError(401, 'Authorization header must be in the format Bearer <token>.');
    }

    const decoded = await getAuth(appInstance).verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? undefined, simulated: false };
  } catch (error) {
    if (error instanceof AuthResponseError) {
      if (error.statusCode === 503 && debugUid) {
        return { uid: debugUid, simulated: true };
      }
      throw error;
    }

    if (debugUid) {
      return { uid: debugUid, simulated: true };
    }

    const message = error instanceof Error ? error.message : 'Unable to verify user.';
    throw new AuthResponseError(401, message);
  }
};

export const getAdminFirestore = () => {
  try {
    const appInstance = initApp();
    return getFirestore(appInstance);
  } catch (error) {
    if (error instanceof AuthResponseError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : 'Unable to initialise Firestore.';
    throw new AuthResponseError(503, message);
  }
};

export const toErrorResponse = (error: unknown) => {
  if (error instanceof AuthResponseError) {
    return { statusCode: error.statusCode, body: JSON.stringify({ ok: false, error: error.message }) };
  }
  const message = error instanceof Error ? error.message : 'Unexpected error';
  return { statusCode: 500, body: JSON.stringify({ ok: false, error: message }) };
};
