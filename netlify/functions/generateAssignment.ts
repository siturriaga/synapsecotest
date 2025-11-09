import type { Handler } from "@netlify/functions";
import * as admin from "firebase-admin";

/** Optional: initialize Firebase Admin for Firestore/Storage */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")!,
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const PREFERRED_MODELS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro",
  "gemini-1.0-pro-latest",
  "gemini-1.0-pro"
];

async function listModels(): Promise<string[]> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`ListModels ${res.status}: ${text}`);
  }
  const data = JSON.parse(text);
  const supported = (data.models ?? [])
    .filter((m: any) => (m.supportedGenerationMethods ?? []).includes("generateContent"))
    .map((m: any) => m.name.replace(/^models\//, ""))
    .filter(Boolean);
  const byPref = PREFERRED_MODELS.filter(m => supported.includes(m));
  const remainder = supported.filter((m: string) => !byPref.includes(m));
  return [...byPref, ...remainder];
}

async function callGemini(model: string, prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const body = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const raw = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(raw);
  } catch {
    // non-JSON response body
  }
  if (!res.ok) {
    const code = json?.error?.code ?? res.status;
    const msg = (json?.error?.message ?? raw) || res.statusText;
    throw new Error(`Gemini ${code} on ${model}: ${msg}`);
  }
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p: any) => p?.text || "").join("").trim();
  if (!text) {
    throw new Error(`Gemini ${model} returned no text`);
  }
  return text;
}

export const handler: Handler = async (event) => {
  try {
    if (!event.body) {
      return { statusCode: 400, body: "Missing body" };
    }
    const payload = JSON.parse(event.body);
    const prompt =
      payload.prompt ??
      payload.standard ??
      "Create a 10-question multiple-choice quiz aligned to the provided standard, with answer key.";

    const tried: string[] = [];
    let modelsToTry = [...PREFERRED_MODELS];

    for (let pass = 0; pass < 2; pass++) {
      for (const model of modelsToTry) {
        try {
          const text = await callGemini(model, prompt);
          return {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ ok: true, model, text }),
          };
        } catch (e: any) {
          tried.push(String(e?.message || e));
        }
      }
      if (pass === 0) {
        try {
          modelsToTry = await listModels();
        } catch (e: any) {
          tried.push("ListModels failed: " + String(e?.message || e));
          break;
        }
      }
    }

    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, error: "All Gemini models failed.", tried }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, error: String(e?.message || e) }),
    };
  }
};
