import { auth } from '../firebase'

const NETLIFY_PREFIX = '/.netlify/functions/'
const API_PREFIX = '/api/'
const LOCAL_NETLIFY_ORIGIN = 'http://localhost:8888'
const REMOTE_FUNCTION_BASE = (import.meta.env?.VITE_FUNCTION_BASE_URL || 'https://synapsecopilot.com')
  .replace(/\/$/, '')

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
  } catch (err) {
    // ignore JSON parse failures; fall back to raw text
  }
  return text || `Request failed with status ${response.status}`
}

export async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const user = auth.currentUser ?? null
  const targets: string[] = []
  const appendTarget = (target: string) => {
    if (!targets.includes(target)) {
      targets.push(target)
    }
  }

  appendTarget(url)

  const requestingFunction = url.startsWith(NETLIFY_PREFIX)
  const isBrowser = typeof window !== 'undefined' && typeof window.location !== 'undefined'

  if (requestingFunction) {
    appendTarget(`${API_PREFIX}${url.slice(NETLIFY_PREFIX.length)}`)

    if (isBrowser && window.location.hostname === 'localhost') {
      appendTarget(`${LOCAL_NETLIFY_ORIGIN}${url}`)
    }

    appendTarget(`${REMOTE_FUNCTION_BASE}${url}`)
  }

  let lastError: unknown
  const shouldRetry404 = (error: unknown, index: number) =>
    requestingFunction &&
    error instanceof SafeFetchError &&
    error.status === 404 &&
    index < targets.length - 1

  const unauthorizedStatuses = new Set([401, 403, 440])
  const maxAuthAttempts = user ? 2 : 1

  for (let attempt = 0; attempt < maxAuthAttempts; attempt += 1) {
    const token = user ? await user.getIdToken(attempt === 1) : null
    let refreshDueToAuth = false

    for (let index = 0; index < targets.length; index += 1) {
      const target = targets[index]

      try {
        const response = await performFetch(target, options, token)

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
        if (shouldRetry404(error, index)) {
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
