import type { Handler } from "@netlify/functions";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const handler: Handler = async () => {
  try {
    if (!GEMINI_API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ ok:false, error:"GEMINI_API_KEY not set"}) };
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const res = await fetch(url);
    const text = await res.text();
    return {
      statusCode: res.ok ? 200 : 502,
      headers: { "content-type": "application/json" },
      body: res.ok ? text : JSON.stringify({ ok:false, error:`List failed ${res.status}`, detail:text })
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok:false, error:String(e?.message || e) })
    };
  }
};
