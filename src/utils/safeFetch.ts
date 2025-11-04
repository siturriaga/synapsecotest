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
  const token = await auth.currentUser?.getIdToken?.()

  const attempt = async (target: string) => {
    const response = await performFetch(target, options, token)
    if (response.ok) {
      return response
    }
    throw new SafeFetchError(await parseError(response), response.status)
  }

  try {
    const response = await attempt(url)
    return (await response.json()) as T
  } catch (error) {
    const shouldFallback =
      url.startsWith(NETLIFY_PREFIX) && error instanceof SafeFetchError && error.status === 404

    if (!shouldFallback) {
      throw error
    }

    const fallbackUrl = `${API_PREFIX}${url.slice(NETLIFY_PREFIX.length)}`

    try {
      const response = await attempt(fallbackUrl)
      return (await response.json()) as T
    } catch (apiError) {
      const isBrowser = typeof window !== 'undefined' && typeof window.location !== 'undefined'
      const canUseLocalNetlify =
        isBrowser &&
        window.location.hostname === 'localhost' &&
        apiError instanceof SafeFetchError &&
        apiError.status === 404

      if (canUseLocalNetlify) {
        const localUrl = `${LOCAL_NETLIFY_ORIGIN}${url}`
        const response = await attempt(localUrl)
        return (await response.json()) as T
      }

      if (apiError instanceof SafeFetchError && apiError.status === 404) {
        const remoteUrl = `${REMOTE_FUNCTION_BASE}${url}`
        const response = await attempt(remoteUrl)
        return (await response.json()) as T
      }

      throw apiError
    }
  }
}
