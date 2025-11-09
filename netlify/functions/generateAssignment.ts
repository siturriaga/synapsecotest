import type { Handler } from "@netlify/functions";
import * as admin from "firebase-admin";

// Optional: keep admin initialized for other uses (storage, firestore)
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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Minimal helper to call Gemini
async function generateWithGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

  // v1beta generateContent endpoint (text prompt)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const body = {
    contents: [
      { role: "user", parts: [{ text: prompt }] }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errTxt = await res.text().catch(() => "");
    throw new Error(`Gemini HTTP ${res.status}: ${errTxt}`);
  }

  const data = await res.json();
  // Extract first candidate text
  const candidates = data?.candidates || [];
  const parts = candidates[0]?.content?.parts || [];
  const text = parts.map((p: any) => p?.text || "").join("").trim();
  if (!text) throw new Error("Gemini returned no text");
  return text;
}

export const handler: Handler = async (event) => {
  try {
    if (!event.body) return { statusCode: 400, body: "Missing body" };
    const payload = JSON.parse(event.body);

    const prompt =
      payload?.prompt ??
      payload?.standard ??
      "Create a 10-question multiple-choice quiz aligned to the provided standard, with answer key.";

    const text = await generateWithGemini(prompt);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true, text }),
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: false, error: String(e?.message || e) }),
    };
  }
};
