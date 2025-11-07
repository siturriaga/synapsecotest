import { auth } from '../firebase'
import { buildFunctionCandidates } from './netlifyTargets'

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

export async function safeFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const targets = buildFunctionCandidates(path)
  const user = auth?.currentUser ?? null
  const unauthorizedStatuses = new Set([401, 403, 440])
  const maxAttempts = user ? 2 : 1
  let finalError: unknown = null

  for (const url of targets) {
    let lastError: unknown = null

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const token = user ? await user.getIdToken(attempt === 1) : null
      const shouldRefresh = attempt === 0 && Boolean(user)

      try {
        const response = await performFetch(url, options, token)
        if (!response.ok) {
          const details = await parseError(response)
          const message = `${response.status}: ${details}`
          const error = new SafeFetchError(message, response.status)
          lastError = error
          if (shouldRefresh && unauthorizedStatuses.has(error.status)) {
            continue
          }
          break
        }

        const clone = response.clone()
        try {
          return (await response.json()) as T
        } catch {
          const text = await clone.text()
          return text as unknown as T
        }
      } catch (error) {
        const normalizedError =
          error instanceof Error ? error : new Error('Request failed')
        lastError = normalizedError
        if (
          shouldRefresh &&
          normalizedError instanceof SafeFetchError &&
          unauthorizedStatuses.has(normalizedError.status)
        ) {
          continue
        }
        break
      }

    if (!lastError) {
      finalError = new Error('Request failed')
      continue
    }

    finalError = lastError

    if (lastError instanceof SafeFetchError) {
      if (lastError.status === 404) {
        continue
      }
      throw lastError
    }
  }

  if (finalError instanceof SafeFetchError && finalError.status === 404) {
    throw new SafeFetchError(
      [
        'Gemini helper unavailable.',
        'Confirm your Netlify deployment is live and serving /.netlify/functions endpoints.',
        'Ensure that environment has the Firebase and Gemini keys configured.'
      ].join(' '),
      finalError.status
    )
  }

  if (finalError instanceof Error) {
    throw finalError
  }

  throw new Error('Request failed')
}
