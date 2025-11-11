import type { Handler } from '@netlify/functions';
import { z } from 'zod';
import { getAdminFirestore, requireUser, toErrorResponse } from './_verifyUser';

const mcqSchema = z.object({
  type: z.literal('mcq'),
  stem: z.string().min(1),
  options: z.array(z.string().min(1)).min(4),
  answerIndex: z.number().int().min(0)
});

const shortSchema = z.object({
  type: z.literal('short'),
  prompt: z.string().min(1),
  rubric: z.string().optional()
});

const assignmentSchema = z.object({
  title: z.string().min(1),
  standardCode: z.string().min(1),
  createdAt: z.number().int(),
  items: z.array(z.union([mcqSchema, shortSchema])).min(1)
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'Method not allowed.' }) };
  }

  let user;
  try {
    user = await requireUser(event);
  } catch (error) {
    return toErrorResponse(error);
  }

  if (!event.body) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Request body is required.' }) };
  }

  let assignmentInput;
  try {
    const payload = JSON.parse(event.body) as { assignment?: unknown };
    assignmentInput = assignmentSchema.parse(payload.assignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: error.message }) };
    }
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid assignment payload.' }) };
  }

  try {
    const firestore = getAdminFirestore();
    const assignmentsCollection = firestore.collection('users').doc(user.uid).collection('assignments');
    const docRef = await assignmentsCollection.add(assignmentInput);
    const saved = { ...assignmentInput, id: docRef.id };
    return { statusCode: 200, body: JSON.stringify({ ok: true, assignment: saved }) };
  } catch (error) {
    return toErrorResponse(error);
  }
};
