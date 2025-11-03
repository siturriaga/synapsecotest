declare module '@netlify/functions' {
  export interface HandlerEvent {
    body: string | null;
    rawUrl?: string;
    rawQuery?: string;
    headers: Record<string, string | undefined>;
    multiValueHeaders?: Record<string, string[]>;
    httpMethod: string;
    isBase64Encoded: boolean;
    path: string;
    queryStringParameters?: Record<string, string | undefined> | null;
  }

  export interface HandlerContext {
    callbackWaitsForEmptyEventLoop: boolean;
    functionName: string;
    functionVersion: string;
    invokedFunctionArn: string;
    memoryLimitInMB: string;
    awsRequestId: string;
    logGroupName: string;
    logStreamName: string;
    identity?: {
      cognitoIdentityId?: string;
      cognitoIdentityPoolId?: string;
    } | null;
    clientContext?: {
      client?: Record<string, unknown>;
      custom?: Record<string, unknown>;
      environment?: Record<string, unknown>;
    } | null;
  }

  export interface HandlerResult {
    statusCode: number;
    headers?: Record<string, string>;
    multiValueHeaders?: Record<string, string[]>;
    body: string;
    isBase64Encoded?: boolean;
  }

  export type Handler = (
    event: HandlerEvent,
    context: HandlerContext
  ) => HandlerResult | Promise<HandlerResult>;
}
