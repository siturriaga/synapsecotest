import type { Handler } from "@netlify/functions";
import * as admin from "firebase-admin";

/** Optional: keep Firebase Admin initialized for future storage/DB use */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

/** Use a server key from Google AI Studio (not referrer-restricted). */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/** Try these model IDs in order; report diagnostics if all fail. */
const MODEL_CANDIDATES = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro",
];

async function callGemini(model: string, prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

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
    /* non-JSON error bodies happen */
  }

  if (!res.ok) {
    const code = json?.error?.code ?? res.status;
    const msg = json?.error?.message ?? raw || res.statusText;
    throw new Error(`Gemini ${code} on ${model}: ${msg}`);
  }

  const candidates = json?.candidates ?? [];
  const parts = candidates[0]?.content?.parts ?? [];
  const text = parts.map((p: any) => p?.text || "").join("").trim();
  if (!text) throw new Error(`Gemini ${model} returned no text`);
  return text;
}

export const handler: Handler = async (event) => {
  try {
    if (!event.body)
      return { statusCode: 400, body: "Missing body" };

    const payload = JSON.parse(event.body);

    const prompt =
      payload?.prompt ??
      payload?.standard ??
      "Create a 10-question multiple-choice quiz aligned to the provided standard, with answer key.";

    const tried: string[] = [];
    for (const model of MODEL_CANDIDATES) {
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

    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: "All Gemini models failed.",
        tried,
      }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, error: String(e?.message || e) }),
    };
  }
};
