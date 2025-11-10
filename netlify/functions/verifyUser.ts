import type { HandlerEvent } from "@netlify/functions";
import { admin } from "./firebaseAdmin";

export async function verifyBearerUid(authHeader?: string): Promise<string> {
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Missing/invalid Authorization header");
  const token = authHeader.slice(7);
  const decoded = await admin.auth().verifyIdToken(token);
  return decoded.uid;
}
