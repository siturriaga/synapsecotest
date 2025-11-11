import type { HandlerEvent } from '@netlify/functions';
import { handler as generateAssignment } from '../netlify/functions/generateAssignment';

const event: HandlerEvent = {
  httpMethod: 'POST',
  headers: {
    'x-debug-uid': 'debug-user'
  },
  multiValueHeaders: {},
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  isBase64Encoded: false,
  path: '/api/generateAssignment',
  rawUrl: 'http://localhost/.netlify/functions/generateAssignment',
  rawQuery: '',
  body: JSON.stringify({
    title: 'Simulation Assignment',
    standardCode: 'SS.7.CG.1.1',
    questionCount: 5,
    type: 'mixed'
  })
};

async function main() {
  const response = await generateAssignment(event, {} as any);
  console.log('Status:', response.statusCode);
  console.log('Body:', response.body);
}

main().catch((error) => {
  console.error('Simulation failed:', error);
  process.exitCode = 1;
});
