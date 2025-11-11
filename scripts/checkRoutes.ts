import type { Handler, HandlerEvent } from '@netlify/functions';
import { handler as getStandards } from '../netlify/functions/getStandards';
import { handler as getAssignments } from '../netlify/functions/getAssignments';

const createEvent = (overrides: Partial<HandlerEvent>): HandlerEvent => ({
  httpMethod: 'GET',
  headers: {},
  multiValueHeaders: {},
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  isBase64Encoded: false,
  path: '/api/check',
  rawUrl: 'http://localhost/.netlify/functions/check',
  rawQuery: '',
  body: null,
  ...overrides
});

const call = async (label: string, handler: Handler, event: HandlerEvent) => {
  const response = await handler(event, {} as any);
  console.log(`${label}: ${response.statusCode}`);
  return response.statusCode;
};

async function main() {
  await call('getStandards (no auth)', getStandards, createEvent({ path: '/api/getStandards' }));
  await call(
    'getStandards (debug auth)',
    getStandards,
    createEvent({ path: '/api/getStandards', headers: { 'x-debug-uid': 'debug-user' } })
  );
  await call(
    'getAssignments (debug auth)',
    getAssignments,
    createEvent({ path: '/api/getAssignments', headers: { 'x-debug-uid': 'debug-user' } })
  );
}

main().catch((error) => {
  console.error('Route check failed:', error);
  process.exitCode = 1;
});
