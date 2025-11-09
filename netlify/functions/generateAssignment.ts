// netlify/functions/generateAssignment.ts
import type { Handler } from "@netlify/functions";
import * as admin from "firebase-admin";

/** Initialize Firebase Admin once */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")!,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // optional
  });
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const PREFERRED_MODELS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro",
  "gemini-1.0-pro-latest",
  "gemini-1.0-pro",
];

function cors(headers: Record<string, string> = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    ...headers,
  };
}

async function requireUser(authHeader?: string) {
  if (!authHeader?.startsWith("Bearer ")) {
    throw Object.assign(new Error("Missing Authorization Bearer token"), { status: 401 });
  }
  const idToken = authHeader.slice("Bearer ".length).trim();
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded?.uid) throw new Error("Token has no uid");
    return decoded.uid as string;
  } catch {
    throw Object.assign(new Error("Invalid or expired token"), { status: 401 });
  }
}

async function listModels(): Promise<string[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
    GEMINI_API_KEY
  )}`;
  const res = await fetch(url);
  const raw = await res.text();
  if (!res.ok) throw new Error(`ListModels ${res.status}: ${raw}`);
  const data = JSON.parse(raw);
  const supported = (data?.models ?? [])
    .filter((m: any) => (m?.supportedGenerationMethods ?? []).includes("generateContent"))
    .map((m: any) => String(m?.name || "").replace(/^models\//, ""))
    .filter(Boolean);
  const byPref = PREFERRED_MODELS.filter((m) => supported.includes(m));
  const remainder = supported.filter((m: string) => !byPref.includes(m));
  return [...byPref, ...remainder];
}

async function callGemini(model: string, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const body = { contents: [{ role: "user", parts: [{ text: prompt }]}] };

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  let json: any = null;
  try { json = JSON.parse(raw); } catch {}

  if (!res.ok) {
    const code = json?.error?.code ?? res.status;
    const msg = (json?.error?.message ?? raw) || res.statusText;
    throw new Error(`Gemini ${code} on ${model}: ${msg}`);
  }

  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p: any) => p?.text || "").join("").trim();
  if (!text) throw new Error(`Gemini ${model} returned no text`);
  return text;
}

function normalizePrompt(input: any): string {
  const raw =
    (typeof input?.prompt === "string" && input.prompt) ||
    (typeof input?.standard === "string" && input.standard) ||
    "";
  const base = raw.trim();
  const capped = base.slice(0, 8000);
  return (
    capped ||
    "Create a 10-question multiple-choice quiz aligned to the provided standard, with answer key."
  );
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: cors(), body: "" };
  }

  try {
    const uid = await requireUser(event.headers.authorization);

    if (!event.body) {
      return { statusCode: 400, headers: cors(), body: "Missing body" };
    }
    const payload = JSON.parse(event.body);
    const prompt = normalizePrompt(payload);

    const tried: string[] = [];
    let modelsToTry = [...PREFERRED_MODELS];

    for (const model of modelsToTry) {
      try {
        const text = await callGemini(model, prompt);
        return {
          statusCode: 200,
          headers: cors({ "content-type": "application/json" }),
          body: JSON.stringify({ ok: true, model, text, uid }),
        };
      } catch (e: any) {
        tried.push(String(e?.message || e));
      }
    }

    try {
      modelsToTry = await listModels();
    } catch (e: any) {
      tried.push("ListModels failed: " + String(e?.message || e));
      return {
        statusCode: 502,
        headers: cors({ "content-type": "application/json" }),
        body: JSON.stringify({ ok: false, error: "Failed to list models.", tried }),
      };
    }

    for (const model of modelsToTry) {
      try {
        const text = await callGemini(model, prompt);
        return {
          statusCode: 200,
          headers: cors({ "content-type": "application/json" }),
          body: JSON.stringify({ ok: true, model, text, uid }),
        };
      } catch (e: any) {
        tried.push(String(e?.message || e));
      }
    }

    return {
      statusCode: 502,
      headers: cors({ "content-type": "application/json" }),
      body: JSON.stringify({ ok: false, error: "All Gemini models failed.", tried }),
    };
  } catch (e: any) {
    const status = Number(e?.status) || 500;
    return {
      statusCode: status,
      headers: cors({ "content-type": "application/json" }),
      body: JSON.stringify({ ok: false, error: String(e?.message || e) }),
    };
  }
};
