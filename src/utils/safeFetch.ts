import { auth } from '../firebase'
import { buildFunctionUrl } from './netlifyTargets'

class SafeFetchError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function buildHeaders(options: RequestInit, token?: string | null) {
  const headers = new Headers(options.headers ?? {})
  const hasJsonBody = typeof options.body === 'string'
  if (hasJsonBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  headers.set('Accept', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return headers
}

async function performFetch(url: string, options: RequestInit, token?: string | null) {
  const headers = await buildHeaders(options, token)
  return fetch(url, { ...options, headers })
}

async function parseError(response: Response) {
  const text = await response.text()
  try {
    const parsed = JSON.parse(text)
    if (parsed && typeof parsed.error === 'string') {
      return parsed.error
    }
  } catch (error) {
    // ignore JSON parse failures and fall back to raw text
  }
  return text || `Request failed with status ${response.status}`
}

function resolveRequestUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path
  }
  return buildFunctionUrl(path)
}

export async function safeFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = resolveRequestUrl(path)
  const user = auth.currentUser ?? null
  const unauthorizedStatuses = new Set([401, 403, 440])
  const maxAttempts = user ? 2 : 1
  let lastError: unknown = null

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const token = user ? await user.getIdToken(attempt === 1) : null
    const shouldRefresh = attempt === 0 && Boolean(user)

    try {
      const response = await performFetch(url, options, token)
      if (!response.ok) {
        const error = new SafeFetchError(await parseError(response), response.status)
        lastError = error
        if (shouldRefresh && unauthorizedStatuses.has(error.status)) {
          continue
        }
        throw error
      }

      const clone = response.clone()
      try {
        return (await response.json()) as T
      } catch {
        const text = await clone.text()
        return text as unknown as T
      }
    } catch (error) {
      lastError = error
      if (shouldRefresh && error instanceof SafeFetchError && unauthorizedStatuses.has(error.status)) {
        continue
      }
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Request failed')
    }
  }

  if (lastError instanceof SafeFetchError && lastError.status === 404) {
    throw new SafeFetchError(
      [
        'Gemini helper unavailable.',
        'Start the Netlify Functions server with "npx netlify-cli dev" or set VITE_FUNCTION_BASE_URL',
        'to a deployed site whose functions are running with your Firebase and Gemini keys.'
      ].join(' '),
      lastError.status
    )
  }

  if (lastError instanceof Error) {
    throw lastError
  }

  throw new Error('Request failed')
}
