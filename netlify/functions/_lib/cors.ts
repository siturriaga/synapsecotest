import type { Handler, HandlerResponse } from '@netlify/functions'

type CorsOptions = {
  origins?: string[]
  allowCredentials?: boolean
  methods?: string[]
  headers?: string[]
  maxAge?: number
}

const DEFAULT_METHODS = ['GET', 'POST', 'OPTIONS']
const DEFAULT_HEADERS = ['Accept', 'Content-Type', 'Authorization']
const DEFAULT_MAX_AGE = 60 * 60 * 12 // 12 hours

function mergeVary(existing: string | undefined, value: string) {
  if (!existing) {
    return value
  }
  const parts = existing
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
  if (!parts.includes(value)) {
    parts.push(value)
  }
  return parts.join(', ')
}

function applyCorsHeaders(response: HandlerResponse, options: Required<Omit<CorsOptions, 'allowCredentials'>>) {
  const headers = response.headers ? { ...response.headers } : {}
  headers['Access-Control-Allow-Origin'] = options.origins.length === 1 ? options.origins[0] : '*'
  headers['Access-Control-Allow-Methods'] = options.methods.join(', ')
  headers['Access-Control-Allow-Headers'] = options.headers.join(', ')
  headers['Access-Control-Max-Age'] = String(options.maxAge)
  headers['Vary'] = mergeVary(headers['Vary'] || headers['vary'], 'Origin')
  delete headers['vary']
  return { ...response, headers }
}

export function withCors(handler: Handler, options: CorsOptions = {}): Handler {
  const {
    origins = ['*'],
    allowCredentials = false,
    methods = DEFAULT_METHODS,
    headers = DEFAULT_HEADERS,
    maxAge = DEFAULT_MAX_AGE
  } = options

  const normalizedHeaders = Array.from(new Set(headers.concat('Origin')))

  return async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
      const response: HandlerResponse = {
        statusCode: 204,
        headers: {
          'Content-Length': '0'
        },
        body: ''
      }
      const withHeaders = applyCorsHeaders(response, { origins, methods, headers: normalizedHeaders, maxAge })
      if (allowCredentials) {
        withHeaders.headers = {
          ...withHeaders.headers,
          'Access-Control-Allow-Credentials': 'true'
        }
      }
      return withHeaders
    }

    const result = (await handler(event, context)) ?? { statusCode: 204, body: '' }
    const withHeaders = applyCorsHeaders(result, { origins, methods, headers: normalizedHeaders, maxAge })
    if (allowCredentials) {
      withHeaders.headers = {
        ...withHeaders.headers,
        'Access-Control-Allow-Credentials': 'true'
      }
    }
    return withHeaders
  }
}
