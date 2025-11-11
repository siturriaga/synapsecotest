import type { Handler } from '@netlify/functions';
import { getAdminFirestore, requireUser, toErrorResponse } from './_verifyUser';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'Method not allowed.' }) };
  }

  let user;
  try {
    user = await requireUser(event);
  } catch (error) {
    return toErrorResponse(error);
  }

  try {
    const firestore = getAdminFirestore();
    const snapshot = await firestore
      .collection('users')
      .doc(user.uid)
      .collection('assignments')
      .orderBy('createdAt', 'desc')
      .get();

    const assignments = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Record<string, unknown>) }));

    return { statusCode: 200, body: JSON.stringify({ ok: true, assignments }) };
  } catch (error) {
    return toErrorResponse(error);
  }
};
