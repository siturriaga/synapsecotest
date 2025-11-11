import type { Handler } from '@netlify/functions';
import path from 'path';
import { promises as fs } from 'fs';
import { requireUser, toErrorResponse } from './_verifyUser';

let cached: Array<{ code: string; label: string }> | null = null;

const loadStandards = async () => {
  if (cached) return cached;
  const standardsPath = path.join(process.cwd(), 'data', 'standards', 'ss7cg.json');
  const file = await fs.readFile(standardsPath, 'utf8');
  cached = JSON.parse(file) as Array<{ code: string; label: string }>;
  return cached;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'Method not allowed.' }) };
  }

  try {
    await requireUser(event);
  } catch (error) {
    return toErrorResponse(error);
  }

  try {
    const standards = await loadStandards();
    return { statusCode: 200, body: JSON.stringify({ ok: true, standards }) };
  } catch (error) {
    return toErrorResponse(error);
  }
};
