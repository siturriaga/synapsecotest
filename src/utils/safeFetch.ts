import { auth } from '../firebase'
import { NETLIFY_PREFIX, buildFunctionTargets } from './netlifyTargets'

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
  const contentType = response.headers.get('content-type') ?? ''
  const text = await response.text()

  if (contentType.includes('application/json')) {
    try {
      const parsed = JSON.parse(text)
      if (parsed && typeof parsed.error === 'string') {
        return parsed.error
      }
      if (parsed && typeof parsed.message === 'string') {
        return parsed.message
      }
    } catch {
      // fall through to the plain-text handler
    }
  }

  if (text) {
    return text
  }

  return `Request failed with status ${response.status}`
}

export async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const user = auth.currentUser ?? null
  const requestingFunction = url.startsWith(NETLIFY_PREFIX)
  const targets = requestingFunction ? buildFunctionTargets(url.slice(NETLIFY_PREFIX.length)) : [url]

  let lastError: unknown
  const shouldRetry404 = (error: unknown, index: number) =>
    requestingFunction &&
    error instanceof SafeFetchError &&
    error.status === 404 &&
    index < targets.length - 1

  const shouldRetryNetworkError = (error: unknown, index: number) =>
    requestingFunction &&
    error instanceof TypeError &&
    index < targets.length - 1

  const unauthorizedStatuses = new Set([401, 403, 440])
  const maxAuthAttempts = user ? 2 : 1
  const serializedBody = typeof options.body === 'string' ? options.body : undefined
  const baseInit: RequestInit = serializedBody !== undefined ? { ...options, body: serializedBody } : { ...options }

  for (let attempt = 0; attempt < maxAuthAttempts; attempt += 1) {
    const token = user ? await user.getIdToken(attempt === 1) : null
    let refreshDueToAuth = false

    for (let index = 0; index < targets.length; index += 1) {
      const target = targets[index]

      try {
        const response = await performFetch(target, baseInit, token)

        if (!response.ok) {
          const error = new SafeFetchError(await parseError(response), response.status)
          lastError = error
          if (user && attempt === 0 && unauthorizedStatuses.has(error.status)) {
            refreshDueToAuth = true
            break
          }
          if (shouldRetry404(error, index)) {
            continue
          }
          throw error
        }

        const responseClone = response.clone()

        try {
          return (await response.json()) as T
        } catch {
          const text = await responseClone.text()
          return text as unknown as T
        }
      } catch (error) {
        lastError = error
        if (refreshDueToAuth) {
          break
        }
        if (shouldRetry404(error, index) || shouldRetryNetworkError(error, index)) {
          continue
        }
        if (error instanceof Error) {
          throw error
        }
        throw new Error('Request failed')
      }
    }

    if (refreshDueToAuth) {
      lastError = null
      continue
    }
  }

  if (lastError instanceof Error) {
    throw lastError
  }

  throw new Error('Request failed')
}
