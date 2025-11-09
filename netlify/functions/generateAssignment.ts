// netlify/functions/generateAssignment.ts
import type { Handler } from "@netlify/functions";
import * as admin from "firebase-admin";

/** --- Firebase Admin bootstrap (idempotent) --- */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")!,
    }),
  });
}

/** --- Types mirrored by the frontend --- */
type AssessmentQuestion = {
  id: string;
  prompt: string;
  options?: string[];
  answer: string;
  rationale: string;
};

type AssessmentLevel = {
  level: string; // e.g., "Foundational", "Core", "Stretch"
  description: string;
  questions: AssessmentQuestion[];
  remediation: string[];
};

type AssessmentBlueprint = {
  standardCode: string;
  standardName: string;
  subject: string;
  grade: string;
  assessmentType: "multiple_choice" | "reading_plus" | "matching";
  questionCount: number;
  aiInsights: {
    overview: string;
    classStrategies: string[];
    nextSteps: string[];
    pedagogy?: {
      summary: string;
      bestPractices: string[];
      reflectionPrompts: string[];
    };
  };
  levels: AssessmentLevel[];
};

/** --- Gemini wiring --- */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const PREFERRED_MODELS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-pro-latest",
  "gemini-1.5-pro",
  "gemini-1.0-pro-latest",
  "gemini-1.0-pro",
];

async function listModels(): Promise<string[]> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(
    GEMINI_API_KEY
  )}`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok) throw new Error(`ListModels ${res.status}: ${text}`);
  const data = JSON.parse(text);
  const supported = (data?.models ?? [])
    .filter((m: any) =>
      (m?.supportedGenerationMethods ?? []).includes("generateContent")
    )
    .map((m: any) => String(m.name || "").replace(/^models\//, ""))
    .filter(Boolean);
  const byPref = PREFERRED_MODELS.filter((m) => supported.includes(m));
  const remainder = supported.filter((m: string) => !byPref.includes(m));
  return [...byPref, ...remainder];
}

async function callGeminiRawJSON(model: string, prompt: string): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
    },
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
    // fall through
  }

  if (!res.ok) {
    const code = json?.error?.code ?? res.status;
    const msg = (json?.error?.message ?? raw) || res.statusText;
    throw new Error(`Gemini ${code} on ${model}: ${msg}`);
  }

  // Gemini returns text; we asked for JSON in the text. Extract fenced JSON if present.
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  const joined = parts.map((p: any) => p?.text || "").join("\n");
  const match =
    /```json\s*([\s\S]*?)\s*```/i.exec(joined) ||
    /```\s*([\s\S]*?)\s*```/i.exec(joined);
  const candidate = match ? match[1] : joined;

  try {
    return JSON.parse(candidate);
  } catch {
    throw new Error("Gemini returned non-JSON content.");
  }
}

/** --- Minimal validation/normalization --- */
function coerceBlueprint(input: any): AssessmentBlueprint {
  const fail = (m: string) => {
    throw new Error(`Invalid blueprint: ${m}`);
  };

  const stringReq = (v: any, name: string) =>
    typeof v === "string" && v.trim() ? v.trim() : fail(`${name} required`);

  const numReq = (v: any, name: string) =>
    Number.isFinite(Number(v)) ? Number(v) : fail(`${name} must be a number`);

  const arr = (v: any) => (Array.isArray(v) ? v : []);

  const levels = arr(input.levels).map((lvl: any, i: number) => {
    const questions = arr(lvl.questions).map((q: any, qi: number) => {
      const options =
        typeof q?.options === "undefined"
          ? undefined
          : arr(q.options).map((o) => String(o));
      return {
        id:
          typeof q?.id === "string" && q.id.trim()
            ? q.id
            : `q-${i + 1}-${qi + 1}`,
        prompt: stringReq(q?.prompt, "question.prompt"),
        options,
        answer: stringReq(q?.answer, "question.answer"),
        rationale: stringReq(q?.rationale, "question.rationale"),
      } as AssessmentQuestion;
    });

    return {
      level: stringReq(lvl?.level, "level.level"),
      description: stringReq(lvl?.description, "level.description"),
      questions,
      remediation: arr(lvl?.remediation).map((r) => String(r)),
    } as AssessmentLevel;
  });

  const assessmentType = ((): AssessmentBlueprint["assessmentType"] => {
    const at = String(input.assessmentType || "multiple_choice");
    return (["multiple_choice", "reading_plus", "matching"] as const).includes(
      at as any
    )
      ? (at as any)
      : "multiple_choice";
  })();

  const insights = input?.aiInsights ?? {};
  const pedagogy =
    insights?.pedagogy && typeof insights.pedagogy === "object"
      ? {
          summary: String(insights.pedagogy.summary || "").trim(),
          bestPractices: arr(insights.pedagogy.bestPractices).map((s) =>
            String(s)
          ),
          reflectionPrompts: arr(insights.pedagogy.reflectionPrompts).map((s) =>
            String(s)
          ),
        }
      : undefined;

  return {
    standardCode: stringReq(input?.standardCode, "standardCode"),
    standardName: stringReq(input?.standardName, "standardName"),
    subject: stringReq(input?.subject, "subject"),
    grade: stringReq(input?.grade, "grade"),
    assessmentType,
    questionCount: numReq(input?.questionCount, "questionCount"),
    aiInsights: {
      overview: String(insights.overview || "").trim(),
      classStrategies: arr(insights.classStrategies).map((s) => String(s)),
      nextSteps: arr(insights.nextSteps).map((s) => String(s)),
      ...(pedagogy ? { pedagogy } : {}),
    },
    levels,
  };
}

/** --- Prompt builder --- */
function buildPrompt(payload: any): string {
  const {
    standardCode,
    standardName,
    subject,
    grade,
    assessmentType = "multiple_choice",
    questionCount = 5,
    standardClarifications = [],
    standardObjectives = [],
    classContext = null,
    focus = "",
    includeRemediation = true,
  } = payload || {};

  const context = classContext
    ? `\nClass Context (optional):\n${JSON.stringify(classContext)}`
    : "";

  const clar = Array.isArray(standardClarifications)
    ? standardClarifications
    : [];
  const obj = Array.isArray(standardObjectives) ? standardObjectives : [];

  return `
You are an assessment designer. Produce a JSON object ONLY (no commentary) that matches the schema below. 
Tailor to the standard and keep questions unambiguous, grade-appropriate, and aligned.

Schema:
{
  "standardCode": string,
  "standardName": string,
  "subject": string,
  "grade": string,
  "assessmentType": "multiple_choice" | "reading_plus" | "matching",
  "questionCount": number,
  "aiInsights": {
    "overview": string,
    "classStrategies": string[],
    "nextSteps": string[],
    "pedagogy"?: {
      "summary": string,
      "bestPractices": string[],
      "reflectionPrompts": string[]
    }
  },
  "levels": [
    {
      "level": "Foundational" | "Core" | "Stretch",
      "description": string,
      "questions": [
        {
          "id": string,
          "prompt": string,
          "options"?: string[],
          "answer": string,
          "rationale": string
        }
      ],
      "remediation": string[]
    }
  ]
}

Rules:
- Return EXACTLY ${questionCount} total questions across levels.
- For "multiple_choice", provide 4 plausible options per question and a single correct "answer" matching one option.
- For "reading_plus", supply text-dependent prompts; options may be omitted; still include "answer" and "rationale".
- For "matching", use concise term/definition pairs; put the correct term in "answer".
- Include rationales for every question.
- If details are insufficient, make reasonable assumptions aligned to the standard.

Wrap the JSON in a single \`\`\`json block.

Standard: ${standardCode} — ${standardName}
Subject: ${subject} • Grade ${grade}
Assessment Type: ${assessmentType}
Focus: ${focus || "Align tightly to the standard."}
Clarifications: ${JSON.stringify(clar)}
Objectives: ${JSON.stringify(obj)}
Include remediation: ${includeRemediation ? "yes" : "no"}
${context}
`;
}

/** --- Handler --- */
export const handler: Handler = async (event) => {
  try {
    // Require auth
    const authz = event.headers.authorization || event.headers.Authorization;
    const token = authz?.startsWith("Bearer ")
      ? authz.slice("Bearer ".length)
      : null;
    if (!token) {
      return { statusCode: 401, body: "Missing Authorization bearer token" };
    }
    await admin.auth().verifyIdToken(token).catch(() => {
      throw new Error("Invalid or expired token");
    });

    if (!event.body) return { statusCode: 400, body: "Missing body" };
    const payload = JSON.parse(event.body);

    // Basic required fields checked here for better error messages
    const required = ["standardCode", "standardName", "subject", "grade"];
    for (const k of required) {
      if (typeof payload[k] !== "string" || !payload[k].trim()) {
        return {
          statusCode: 400,
          body: `Missing required field: ${k}`,
        };
      }
    }

    // Call Gemini (with fallback discovery)
    const triedErrors: string[] = [];
    let modelsToTry = [...PREFERRED_MODELS];
    for (let pass = 0; pass < 2; pass++) {
      for (const model of modelsToTry) {
        try {
          const prompt = buildPrompt(payload);
          const raw = await callGeminiRawJSON(model, prompt);
          const blueprint = coerceBlueprint(raw);

          // Final guarantee: keep counts sane and IDs present
          const flat = blueprint.levels.flatMap((l) => l.questions);
          if (flat.length !== blueprint.questionCount || flat.length === 0) {
            // Trim or pad to requested count (pad is rare; we just trim for safety)
            const allQ = blueprint.levels.flatMap((lvl) =>
              lvl.questions.map((q) => ({ lvl, q }))
            );
            const trimmed = allQ.slice(0, blueprint.questionCount);
            // Rebuild levels in the same order with trimmed questions
            let idx = 0;
            blueprint.levels = blueprint.levels.map((lvl) => {
              const take = trimmed.filter((t) => t.lvl === lvl).map((t) => t.q);
              // If a level ends empty after trim, keep it but with zero questions
              return { ...lvl, questions: take };
            });
          }

          return {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify(blueprint),
          };
        } catch (e: any) {
          triedErrors.push(String(e?.message || e));
        }
      }
      if (pass === 0) {
        try {
          modelsToTry = await listModels();
        } catch (e: any) {
          triedErrors.push("ListModels failed: " + String(e?.message || e));
          break;
        }
      }
    }

    return {
      statusCode: 502,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: "All Gemini models failed.",
        tried: triedErrors,
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
