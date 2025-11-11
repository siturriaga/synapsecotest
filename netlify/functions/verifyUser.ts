import { Handler } from '@netlify/functions';
import { verifyIdToken } from './_shared/firebaseAdmin';

export const handler: Handler = async (event) => {
  try {
    const decoded = await verifyIdToken(event.headers.authorization);
    return {
      statusCode: 200,
      body: JSON.stringify({ uid: decoded.uid })
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to verify user';
    const statusCode = message.toLowerCase().includes('missing environment') ? 500 : 401;
    return {
      statusCode,
      body: message
    };
  }
};
