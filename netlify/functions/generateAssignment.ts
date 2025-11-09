import type { Handler } from "@netlify/functions";

/** Minimal REST client for Gemini (AI Studio). No SDK needed. */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/** Candidates of stable model IDs to try in order. */
const MODEL_CANDIDATES = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro"
];

async function callGemini(model: string, prompt: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY!)}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }]}],
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: any = null;
  try { json = JSON.parse(text); } catch {}

  if (!res.ok) {
    const reason = json?.error?.message || text || res.statusText;
    const code = json?.error?.code || res.status;
    throw new Error(`Gemini ${code} on ${model}: ${reason}`);
  }

  const candidates = json?.candidates || [];
  const parts = candidates[0]?.content?.parts || [];
  const out = parts.map((p: any) => p?.text || "").join("").trim();
  if (!out) throw new Error(`Gemini ${model} returned no text`);
  return out;
}

export const handler: Handler = async (event) => {
  try {
    if (!GEMINI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ ok:false, error:"GEMINI_API_KEY not set"}) };
    }
    if (!event.body) return { statusCode: 400, body: "Missing body" };
    const payload = JSON.parse(event.body);

    const prompt =
      payload?.prompt ??
      payload?.standard ??
      "Create a 10-question multiple-choice quiz aligned to the provided standard, with answer key.";

    const tried: string[] = [];
    let lastError: any = null;
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
        lastError = e;
      }
    }

    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: "All Gemini models failed.",
        tried
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
