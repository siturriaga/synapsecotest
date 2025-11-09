import { ensureFirebase } from '../firebase'
import {
  API_PREFIX,
  NETLIFY_PREFIX,
  LOCAL_NETLIFY_ORIGIN,
  getRemoteBaseConfig,
  joinUrl,
  normalizeFunctionPath
} from './netlifyTargets'

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

type AttemptSummary = {
  url: string
  status?: number
  message?: string
}

function appendAttemptDetails<T extends Error>(error: T, attempts: AttemptSummary[]): T {
  if (attempts.length === 0) {
    return error
  }

  const marker = 'Attempt summary:'
  if (error.message.includes(marker)) {
    return error
  }

  const summary = attempts
    .map((attempt, index) => {
      const parts = [`${index + 1}. ${attempt.url}`]
      if (typeof attempt.status === 'number') {
        parts.push(`[${attempt.status}]`)
      }
      if (attempt.message) {
        parts.push(`- ${attempt.message}`)
      }
      return parts.join(' ')
    })
    .join('\n')

  error.message = `${error.message}\n\n${marker}\n${summary}`
  return error
}

function createRequestTargets(path: string): { targets: string[]; treatAsFunctionRequest: boolean } {
  if (/^https?:\/\//i.test(path)) {
    return { targets: [path], treatAsFunctionRequest: false }
  }

  const { pathname, query } = normalizeFunctionPath(path)
  const querySuffix = query ? `?${query}` : ''
  const normalizedInput = path.trim()
  const directPath = normalizedInput ? (normalizedInput.startsWith('/') ? normalizedInput : `/${normalizedInput}`) : ''
  const directTarget = directPath ? `${directPath}${querySuffix}` : ''

  const apiPath = pathname ? `${API_PREFIX}${pathname}` : API_PREFIX.replace(/\/$/, '')
  const apiTarget = `${apiPath}${querySuffix}`

  const functionPath = pathname ? `${NETLIFY_PREFIX}${pathname}` : NETLIFY_PREFIX.replace(/\/$/, '')
  const functionTarget = `${functionPath}${querySuffix}`

  const requestedApiDirectly = directPath ? directPath.startsWith(API_PREFIX) : false
  const treatAsFunctionRequest = !requestedApiDirectly

  const targets: string[] = []
  const appendTarget = (target: string) => {
    if (!target) {
      return
    }
    const normalizedTarget =
      /^https?:\/\//i.test(target) ? target : target.startsWith('/') ? target : `/${target}`
    if (!targets.includes(normalizedTarget)) {
      targets.push(normalizedTarget)
    }
  }

  appendTarget(apiTarget)

  if (treatAsFunctionRequest) {
    appendTarget(functionTarget)

    if (directTarget && directTarget !== functionTarget && directTarget !== apiTarget) {
      appendTarget(directTarget)
    }

    if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
      appendTarget(`${LOCAL_NETLIFY_ORIGIN}${functionTarget}`)
    }

    const remoteConfig = getRemoteBaseConfig()
    if (remoteConfig.functionBase) {
      const remoteFunctionTargetBase = remoteConfig.includesFunctionPrefix
        ? joinUrl(remoteConfig.functionBase, pathname)
        : joinUrl(remoteConfig.functionBase, functionPath)
      const remoteFunctionTarget = querySuffix
        ? `${remoteFunctionTargetBase}${querySuffix}`
        : remoteFunctionTargetBase
      appendTarget(remoteFunctionTarget)
    }

    if (remoteConfig.apiBase) {
      const remoteApiTargetBase = joinUrl(remoteConfig.apiBase, pathname)
      const remoteApiTarget = querySuffix ? `${remoteApiTargetBase}${querySuffix}` : remoteApiTargetBase
      appendTarget(remoteApiTarget)
    }
  } else if (directTarget && directTarget !== apiTarget) {
    appendTarget(directTarget)
  }

  return { targets, treatAsFunctionRequest }
}

function shouldRetry404(
  error: unknown,
  index: number,
  total: number,
  treatAsFunctionRequest: boolean
): boolean {
  return (
    treatAsFunctionRequest && error instanceof SafeFetchError && error.status === 404 && index < total - 1
  )
}

function shouldRetryNetworkError(
  error: unknown,
  index: number,
  total: number,
  treatAsFunctionRequest: boolean
): boolean {
  return treatAsFunctionRequest && error instanceof TypeError && index < total - 1
}

export async function safeFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { targets, treatAsFunctionRequest } = createRequestTargets(path)
  const { auth } = ensureFirebase()
  const user = auth?.currentUser ?? null
  const unauthorizedStatuses = new Set([401, 403, 440])
  const maxAttempts = user ? 2 : 1
  const attempts: AttemptSummary[] = []
  let lastError: unknown = null

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const token = user ? await user.getIdToken(attempt === 1) : null
    const shouldRefresh = attempt === 0 && Boolean(user)
    let refreshDueToAuth = false

    for (let index = 0; index < targets.length; index += 1) {
      const target = targets[index]

      try {
        const response = await performFetch(target, options, token)
        if (!response.ok) {
          const details = await parseError(response)
          const message = `${response.status}: ${details}`
          const error = new SafeFetchError(message, response.status)
          attempts.push({ url: target, status: error.status, message })
          lastError = error

          if (shouldRefresh && unauthorizedStatuses.has(error.status)) {
            refreshDueToAuth = true
            break
          }

          if (shouldRetry404(error, index, targets.length, treatAsFunctionRequest)) {
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
        const normalizedError = error instanceof Error ? error : new Error('Request failed')
        lastError = normalizedError

        if (!(normalizedError instanceof SafeFetchError)) {
          attempts.push({ url: target, message: normalizedError.message })
        }

        if (refreshDueToAuth) {
          break
        }

        if (shouldRetryNetworkError(normalizedError, index, targets.length, treatAsFunctionRequest)) {
          continue
        }

        throw appendAttemptDetails(normalizedError, attempts)
      }
    }

    if (refreshDueToAuth) {
      continue
    }

    break
  }

  if (lastError instanceof SafeFetchError && lastError.status === 404) {
    const friendlyError = new SafeFetchError(
      [
        'Gemini helper unavailable.',
        'Confirm your Netlify deployment is live and serving /.netlify/functions endpoints.',
        'Ensure that environment has the Firebase and Gemini keys configured.'
      ].join(' '),
      lastError.status
    )
    throw appendAttemptDetails(friendlyError, attempts)
  }

  if (lastError instanceof Error) {
    throw appendAttemptDetails(lastError, attempts)
  }

  throw appendAttemptDetails(new Error('Request failed'), attempts)
}
