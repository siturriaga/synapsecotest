import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { getAdminFirestore, verifyIdToken } from './_shared/firebaseAdmin';

const rosterEntrySchema = z.object({
  studentId: z.string().min(1),
  studentName: z.string().min(1),
  testScorePercent: z.number().min(0).max(100),
  period: z.string().min(1),
  testTitle: z.string().min(1)
});

const payloadSchema = z.object({
  entries: z.array(rosterEntrySchema)
});

export const handler: Handler = async (event) => {
  try {
    const decoded = await verifyIdToken(event.headers.authorization);
    const { period, quarter } = event.queryStringParameters ?? {};
    if (!period || !quarter) {
      return { statusCode: 400, body: 'Missing required query parameters: period and quarter.' };
    }

    if (!event.body) {
      return { statusCode: 400, body: 'Request body is required.' };
    }

    const parsed = payloadSchema.parse(JSON.parse(event.body));

    const firestore = getAdminFirestore();
    const batch = firestore.batch();
    const periodDoc = firestore.collection('users').doc(decoded.uid).collection('rosters').doc(period);
    const metadataDoc = periodDoc.collection('metadata').doc('info');
    batch.set(metadataDoc, { quarter, updatedAt: new Date().toISOString() }, { merge: true });

    parsed.entries.forEach((entry) => {
      const docRef = periodDoc.collection('entries').doc();
      batch.set(docRef, { ...entry, uploadedAt: new Date().toISOString() });
    });

    await batch.commit();

    return {
      statusCode: 200,
      body: JSON.stringify({ count: parsed.entries.length })
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { statusCode: 400, body: error.message };
    }
    const message = error instanceof Error ? error.message : 'Upload failed';
    const statusCode = message.toLowerCase().includes('missing environment') ? 500 : 400;
    return {
      statusCode,
      body: message
    };
  }
};
