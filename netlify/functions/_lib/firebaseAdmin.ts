
import * as admin from "firebase-admin";

let app: admin.app.App | null = null;

export function getAdmin() {
  if (app) return admin;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin env vars.");
  }
  privateKey = privateKey.replace(/\\n/g, "\n");

  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  app = admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    ...(storageBucket ? { storageBucket } : {})
  });
  return admin;
}

export function getStorageBucket() {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
  if (!bucketName) {
    const err: any = new Error("FIREBASE_STORAGE_BUCKET env var is not configured");
    err.status = 500;
    throw err;
  }
  const admin = getAdmin();
  return admin.storage().bucket(bucketName);
}

export async function verifyBearerUid(authorization?: string): Promise<string> {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    const e:any = new Error("Missing/invalid Authorization header"); e.status=401; throw e;
  }
  const token = authorization.substring("Bearer ".length);
  const admin = getAdmin();
  const decoded = await admin.auth().verifyIdToken(token);
  if (!decoded?.uid) { const e:any=new Error("Invalid token"); e.status=401; throw e; }
  return decoded.uid;
}
