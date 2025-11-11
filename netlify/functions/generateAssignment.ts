import type { Handler } from "@netlify/functions";
import { verifyBearerUid } from "./verifyUser";
import type { AssessmentBlueprint } from "./types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const PREFERRED = [
  "gemini-1.5-pro",
  "gemini-1.5-flash",
  "gemini-1.0-pro"
];

async function listModels(): Promise<string[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(GEMINI_API_KEY!)}`;
  const r = await fetch(url);
  const raw = await r.text();
  if (!r.ok) throw new Error(`ListModels ${r.status}: ${raw}`);
  const data = JSON.parse(raw);
  return (data.models ?? [])
    .filter((m:any) => (m.supportedGenerationMethods ?? []).includes("generateContent"))
    .map((m:any) => (m.name || "").replace(/^models\//, ""))
    .filter(Boolean);
}

async function callGemini(model: string, prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY!)}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ]
    })
  });
  const raw = await r.text();
  if (!r.ok) throw new Error(`Gemini ${r.status}: ${raw}`);
  const data = JSON.parse(raw);
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p:any) => typeof p.text === "string" ? p.text : "")
    .join("")
    .trim();
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}

function extractJsonBlock(text: string) {
  const match = text.match(/```json([\s\S]*?)```/i) || text.match(/```([\s\S]*?)```/i);
  return (match ? match[1] : text).trim();
}

function buildPrompt(payload: any) {
  return `You are an instructional design AI helping teachers craft rigorous assessments. Using the following payload as context:
${JSON.stringify(payload, null, 2)}

Return ONLY valid JSON matching this TypeScript interface (no markdown, no commentary):
${JSON.stringify({
  standardCode: "string",
  standardName: "string",
  subject: "string",
  grade: "string",
  assessmentType: "MultipleChoice | ShortAnswer | Mixed",
  questionCount: "number",
  aiInsights: {
    overview: "string",
    classStrategies: ["string"],
    nextSteps: ["string"],
    pedagogy: {
      summary: "string",
      bestPractices: ["string"],
      reflectionPrompts: ["string"]
    }
  },
  levels: [
    {
      level: "Emerging | Developing | Proficient | Advanced",
      description: "string",
      questions: [
        {
          id: "string",
          prompt: "string",
          options: ["string"],
          answer: "string",
          rationale: "string"
        }
      ]
    }
  ]
}, null, 2)}

Ensure exactly ${payload.questionCount ?? 0} total questions across all levels, with unique IDs, grade-appropriate tone, and if assessmentType is MultipleChoice include 4 distinct options per question.`;
}

function coerceBlueprint(data: any): AssessmentBlueprint {
  return data as AssessmentBlueprint;
}

export const handler: Handler = async (event) => {
  try {
    if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, headers: { Allow: "POST" }, body: "Method Not Allowed" };
    }

    await verifyBearerUid(event.headers.authorization || event.headers.Authorization);

    if (!event.body) throw new Error("Missing request body");
    const payload = JSON.parse(event.body);

    const available = await listModels();
    const model = PREFERRED.find(m => available.includes(m)) || available[0];
    if (!model) throw new Error("No Gemini model available");

    const prompt = buildPrompt(payload);
    const raw = await callGemini(model, prompt);
    const cleaned = extractJsonBlock(raw);
    const blueprint = coerceBlueprint(JSON.parse(cleaned));

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(blueprint)
    };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: error?.message || "Internal Error" })
    };
  }
};
