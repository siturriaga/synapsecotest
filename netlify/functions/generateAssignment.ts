import type { Handler } from '@netlify/functions';
import { z } from 'zod';
import { generateAssignmentJson } from './_gemini';
import { requireUser, toErrorResponse } from './_verifyUser';
import path from 'path';
import { promises as fs } from 'fs';

interface Standard {
  code: string;
  label: string;
}

const payloadSchema = z.object({
  title: z.string().min(1),
  standardCode: z.string().min(1),
  questionCount: z.coerce.number().int().min(1).max(20),
  type: z.enum(['mcq', 'short', 'mixed'])
});

let cachedStandards: Standard[] | null = null;

const loadStandards = async (): Promise<Standard[]> => {
  if (cachedStandards) return cachedStandards;
  const standardsPath = path.join(process.cwd(), 'data', 'standards', 'ss7cg.json');
  const file = await fs.readFile(standardsPath, 'utf8');
  cachedStandards = JSON.parse(file) as Standard[];
  return cachedStandards;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'Method not allowed.' }) };
  }

  try {
    await requireUser(event);
  } catch (error) {
    return toErrorResponse(error);
  }

  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Request body is required.' }) };
  }

  let parsed;
  try {
    parsed = payloadSchema.parse(JSON.parse(event.body));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: error.message }) };
    }
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid request body.' }) };
  }

  try {
    const standards = await loadStandards();
    const match = standards.find((standard) => standard.code === parsed.standardCode);
    const standardLabel = match?.label ?? 'Civics standard';

    const generation = await generateAssignmentJson({
      title: parsed.title,
      questionCount: parsed.questionCount,
      type: parsed.type,
      standardCode: parsed.standardCode,
      standardLabel
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, assignment: generation.assignment, mockUsed: generation.mockUsed, warnings: generation.warnings })
    };
  } catch (error) {
    return toErrorResponse(error);
  }
};
