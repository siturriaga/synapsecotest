declare module '@netlify/functions' {
  export interface HandlerEvent {
    body: string | null;
    headers: Record<string, string | undefined>;
    httpMethod: string;
    isBase64Encoded?: boolean;
    multiValueHeaders?: Record<string, string[]>;
    path: string;
    queryStringParameters?: Record<string, string | undefined>;
    rawQuery?: string;
  }

  export interface HandlerContext {
    callbackWaitsForEmptyEventLoop?: boolean;
    functionName?: string;
    functionVersion?: string;
    invokedFunctionArn?: string;
    memoryLimitInMB?: string;
    logGroupName?: string;
    logStreamName?: string;
    clientContext?: {
      user?: {
        sub?: string;
        email?: string;
        app_metadata?: Record<string, unknown>;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
    identity?: {
      url?: string;
      token?: string;
    };
  }

  export interface HandlerResponse {
    statusCode: number;
    body: string;
    headers?: Record<string, string>;
    multiValueHeaders?: Record<string, string[]>;
  }

  export type Handler = (
    event: HandlerEvent,
    context: HandlerContext
  ) => Promise<HandlerResponse> | HandlerResponse;
}
