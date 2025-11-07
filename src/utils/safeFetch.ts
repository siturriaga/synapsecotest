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

type AttemptDetail = {
  url: string
  status?: number
  message?: string
}

type AttemptLogPhase = 'start' | 'success' | 'failure' | 'final-error'

function logAttempt(phase: AttemptLogPhase, detail: AttemptDetail & { attempt: number; refreshed?: boolean }) {
  if (typeof console === 'undefined') {
    return
  }

  const parts: string[] = [`attempt ${detail.attempt}`]
  if (detail.refreshed) {
    parts.push('refreshed token')
  }
  if (typeof detail.status === 'number') {
    parts.push(`status ${detail.status}`)
  }
  if (detail.message) {
    parts.push(detail.message)
  }

  const prefix = `[safeFetch] ${phase.toUpperCase()}: ${detail.url}`
  const suffix = parts.length ? ` (${parts.join('; ')})` : ''
  const text = `${prefix}${suffix}`

  if (phase === 'failure' || phase === 'final-error') {
    console.warn(text)
  } else {
    console.debug(text)
  }
}

function formatAttemptSummary(attempts: AttemptDetail[]): string {
  if (!attempts.length) {
    return 'no targets attempted'
  }
  return attempts
    .map((attempt) => {
      const status = typeof attempt.status === 'number' ? attempt.status : 'error'
      const message = attempt.message?.trim()
      return message ? `${attempt.url} (${status} – ${message})` : `${attempt.url} (${status})`
    })
    .join('; ')
}

export async function safeFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const targets = buildFunctionCandidates(path)
  const user = auth?.currentUser ?? null
  const unauthorizedStatuses = new Set([401, 403, 440])
  const maxAttempts = user ? 2 : 1
  let finalError: unknown = null
  const attempts: AttemptDetail[] = []

  for (const url of targets) {
    let lastError: unknown = null

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const forceRefresh = attempt === 1
      const token = user ? await user.getIdToken(forceRefresh) : null
      const shouldRefresh = attempt === 0 && Boolean(user)

      logAttempt('start', {
        url,
        attempt: attempt + 1,
        refreshed: forceRefresh
      })

      try {
        const response = await performFetch(url, options, token)
        if (!response.ok) {
          const details = await parseError(response)
          const message = `${response.status}: ${details}`
          const error = new SafeFetchError(message, response.status)
          attempts.push({ url, status: response.status, message: details })
          logAttempt('failure', {
            url,
            attempt: attempt + 1,
            status: response.status,
            message: details,
            refreshed: forceRefresh
          })
          lastError = error
          if (shouldRefresh && unauthorizedStatuses.has(error.status)) {
            continue
          }
          break
        }

        const clone = response.clone()
        try {
          logAttempt('success', {
            url,
            attempt: attempt + 1,
            status: response.status,
            refreshed: forceRefresh
          })
          return (await response.json()) as T
        } catch {
          logAttempt('success', {
            url,
            attempt: attempt + 1,
            status: response.status,
            refreshed: forceRefresh,
            message: 'non-JSON response'
          })
          const text = await clone.text()
          return text as unknown as T
        }
      } catch (error) {
        const normalizedError =
          error instanceof Error ? error : new Error('Request failed')
        if (normalizedError instanceof SafeFetchError) {
          attempts.push({ url, status: normalizedError.status, message: normalizedError.message })
          logAttempt('failure', {
            url,
            attempt: attempt + 1,
            status: normalizedError.status,
            message: normalizedError.message,
            refreshed: forceRefresh
          })
        } else {
          attempts.push({ url, message: normalizedError.message })
          logAttempt('failure', {
            url,
            attempt: attempt + 1,
            message: normalizedError.message,
            refreshed: forceRefresh
          })
        }
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
    }

    if (!lastError) {
      finalError = new Error('Request failed')
      attempts.push({ url, message: 'Unknown failure' })
      logAttempt('failure', {
        url,
        attempt: maxAttempts,
        message: 'Unknown failure'
      })
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
    logAttempt('final-error', {
      url: targets[targets.length - 1] ?? path,
      attempt: maxAttempts,
      status: finalError.status,
      message: formatAttemptSummary(attempts)
    })
    throw new SafeFetchError(
      [
        'Gemini helper unavailable.',
        `Attempts: ${formatAttemptSummary(attempts)}.`,
        'Confirm your Netlify deployment is live and serving /.netlify/functions endpoints.',
        'Ensure that environment has the Firebase and Gemini keys configured.'
      ].join(' '),
      finalError.status
    )
  }

  if (finalError instanceof Error) {
    const message = finalError.message
    const suffix = attempts.length ? ` Attempts: ${formatAttemptSummary(attempts)}.` : ''
    const augmented = new Error(`${message}${suffix}`)
    logAttempt('final-error', {
      url: targets[targets.length - 1] ?? path,
      attempt: maxAttempts,
      message: augmented.message
    })
    throw augmented
  }

  logAttempt('final-error', {
    url: targets[targets.length - 1] ?? path,
    attempt: maxAttempts,
    message: 'Unknown terminal failure'
  })
  throw new Error('Request failed')
}
