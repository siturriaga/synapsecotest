import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { getAdminFirestore, verifyIdToken } from './_shared/firebaseAdmin';

const requestSchema = z.object({
  title: z.string().min(1),
  gradeLevel: z.string().min(1),
  questionCount: z.number().min(1).max(30),
  type: z.enum(['mcq', 'short', 'mixed']),
  standards: z.array(z.string().min(1)).min(1)
});

const assignmentSchema = z.object({
  title: z.string(),
  standardCode: z.string(),
  gradeLevel: z.string(),
  createdAt: z.string(),
  items: z
    .array(
      z.object({
        type: z.enum(['mcq', 'short', 'mixed']),
        stem: z.string(),
        options: z.array(z.string()).optional(),
        answerIndex: z.number().nonnegative().optional()
      })
    )
    .min(1)
});

const promptTemplate = ({ title, gradeLevel, questionCount, type, standards }: z.infer<typeof requestSchema>) => `You are a helpful teaching assistant. Create a JSON object for an assignment.
The JSON must follow this TypeScript interface strictly:
interface Assignment {\n  title: string;\n  standardCode: string;\n  gradeLevel: string;\n  createdAt: string;\n  items: { type: 'mcq' | 'short' | 'mixed'; stem: string; options?: string[]; answerIndex?: number; }[];\n}
Constraints:
- title: use "${title}".
- gradeLevel: ${gradeLevel}.
- standardCode: choose one from: ${standards.join(', ')}.
- items array length: ${questionCount}.
- type field of each item must align with requested type ${type} (use mixture if 'mixed').
Return ONLY valid JSON with double quotes.`;

const callGemini = async (prompt: string) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing environment variable: GEMINI_API_KEY');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${text}`);
  }

  return response.json() as Promise<any>;
};

const extractAssignment = (data: any, fallback: z.infer<typeof requestSchema>): z.infer<typeof assignmentSchema> => {
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (text) {
    try {
      const parsed = JSON.parse(text);
      const normalized = assignmentSchema.parse(parsed);
      return normalized;
    } catch (error) {
      // fall through to fallback below
    }
  }

  const now = new Date().toISOString();
  return {
    title: fallback.title,
    gradeLevel: fallback.gradeLevel,
    standardCode: fallback.standards[0],
    createdAt: now,
    items: Array.from({ length: fallback.questionCount }).map((_, index) => ({
      type: fallback.type === 'mixed' ? (index % 2 === 0 ? 'mcq' : 'short') : fallback.type,
      stem: `Placeholder question ${index + 1} for ${fallback.standards[0]}.`,
      options:
        fallback.type === 'short'
          ? undefined
          : ['Option A', 'Option B', 'Option C', 'Option D'],
      answerIndex: fallback.type === 'short' ? undefined : 0
    }))
  };
};

export const handler: Handler = async (event) => {
  try {
    const decoded = await verifyIdToken(event.headers.authorization);
    if (!event.body) {
      return { statusCode: 400, body: 'Request body is required.' };
    }
    const payload = requestSchema.parse(JSON.parse(event.body));

    const prompt = promptTemplate(payload);
    const geminiResponse = await callGemini(prompt);
    const assignment = extractAssignment(geminiResponse, payload);
    const withMetadata = {
      ...assignment,
      createdAt: assignment.createdAt || new Date().toISOString(),
      gradeLevel: assignment.gradeLevel || payload.gradeLevel
    };

    const validated = assignmentSchema.parse(withMetadata);

    const firestore = getAdminFirestore();
    const collectionRef = firestore.collection('users').doc(decoded.uid).collection('assignments');
    const docRef = await collectionRef.add({ ...validated, createdAt: validated.createdAt });

    return {
      statusCode: 200,
      body: JSON.stringify({ ...validated, id: docRef.id })
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { statusCode: 400, body: error.message };
    }
    const message = error instanceof Error ? error.message : 'Assignment generation failed';
    const statusCode = message.toLowerCase().includes('missing environment') ? 500 : 400;
    return {
      statusCode,
      body: message
    };
  }
};
