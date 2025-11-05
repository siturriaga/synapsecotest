const NETLIFY_PREFIX = '/.netlify/functions/'
const API_PREFIX = '/api/'
const LOCAL_NETLIFY_ORIGIN = 'http://localhost:8888'

type EnvSource = Record<string, string | undefined>

const envSource: EnvSource =
  typeof import.meta !== 'undefined' && (import.meta as any)?.env
    ? ((import.meta as any).env as EnvSource)
    : typeof process !== 'undefined'
      ? (process.env as EnvSource)
      : {}

function readEnv(key: string): string {
  const value = envSource?.[key]
  return typeof value === 'string' ? value.trim() : ''
}

const DEFAULT_FUNCTION_ORIGIN = 'https://synapsecopilot.netlify.app'
const DEFAULT_REMOTE_FUNCTION_BASE = `${DEFAULT_FUNCTION_ORIGIN}${NETLIFY_PREFIX}`
const rawFunctionOrigin = readEnv('VITE_FUNCTION_ORIGIN')
const rawFunctionBaseOverride = readEnv('VITE_FUNCTION_BASE_URL')
const fallbackFromOrigin = rawFunctionOrigin
  ? `${rawFunctionOrigin.replace(/\/$/, '')}${NETLIFY_PREFIX}`
  : ''
const RAW_REMOTE_FUNCTION_BASE =
  rawFunctionBaseOverride || fallbackFromOrigin || DEFAULT_REMOTE_FUNCTION_BASE

export type RemoteBaseConfig = {
  functionBase: string
  apiBase: string
  includesFunctionPrefix: boolean
}

function ensureAbsoluteBase(candidate: string, fallback: string) {
  if (!candidate) {
    return fallback
  }
  let normalized = candidate.trim()
  if (!normalized) {
    return fallback
  }
  if (!/^https?:/i.test(normalized)) {
    normalized = `https://${normalized.replace(/^\/+/, '')}`
  }
  try {
    const url = new URL(normalized)
    const joined = `${url.origin}${url.pathname}`.replace(/\/$/, '')
    return joined || fallback
  } catch (error) {
    console.warn('Unable to normalize remote base', candidate, error)
    return fallback
  }
}

export function normalizeRemoteBase(raw: string, fallback: string): RemoteBaseConfig {
  const base = ensureAbsoluteBase(raw, fallback)
  const withoutTrailingSlash = base.replace(/\/$/, '') || fallback

  const hasFunctionPrefix = /\/\.netlify\/functions(?:\b|\/)/i.test(withoutTrailingSlash)
  const hasApiPrefix = /\/api(?:\b|\/)/i.test(withoutTrailingSlash)

  const functionBase = (() => {
    if (hasFunctionPrefix) {
      return withoutTrailingSlash
    }
    if (hasApiPrefix) {
      return withoutTrailingSlash.replace(/\/api(?:\b|\/)/i, NETLIFY_PREFIX.replace(/\/$/, ''))
    }
    return withoutTrailingSlash
  })()

  const apiBase = (() => {
    if (hasApiPrefix) {
      return withoutTrailingSlash
    }
    if (/\/\.netlify\/functions(?:\b|\/)/i.test(withoutTrailingSlash)) {
      return withoutTrailingSlash.replace(/\/\.netlify\/functions(?:\b|\/)/i, API_PREFIX.replace(/\/$/, ''))
    }
    return `${withoutTrailingSlash}${API_PREFIX}`
  })().replace(/\/$/, '')

  return {
    functionBase: functionBase.replace(/\/$/, ''),
    apiBase,
    includesFunctionPrefix: /\/\.netlify\/functions\b/i.test(functionBase)
  }
}

export const REMOTE_BASE_CONFIG = normalizeRemoteBase(RAW_REMOTE_FUNCTION_BASE, DEFAULT_REMOTE_FUNCTION_BASE)
export const REMOTE_FUNCTION_BASE = REMOTE_BASE_CONFIG.functionBase
export const REMOTE_API_BASE = REMOTE_BASE_CONFIG.apiBase
export const REMOTE_BASE_INCLUDES_FUNCTION_PREFIX = REMOTE_BASE_CONFIG.includesFunctionPrefix

export function joinUrl(base: string, path: string) {
  const normalizedBase = base.replace(/\/$/, '')
  const normalizedPath = path.replace(/^\//, '')
  return `${normalizedBase}/${normalizedPath}`
}

export function buildFunctionTargets(functionPath: string): string[] {
  const normalizedInput = functionPath.replace(/^\/+/, '')
  const [pathOnly, query = ''] = normalizedInput.split('?')
  const normalizedPath = pathOnly
  const querySuffix = query ? `?${query}` : ''
  const canonicalFunctionPath = `${NETLIFY_PREFIX}${normalizedPath}${querySuffix}`
  const canonicalApiPath = `${API_PREFIX}${normalizedPath}${querySuffix}`

  const targets: string[] = []
  const append = (value: string | null | undefined) => {
    if (value && !targets.includes(value)) {
      targets.push(value)
    }
  }

  const isBrowser = typeof window !== 'undefined' && typeof window.location !== 'undefined'
  const isLocalhost = isBrowser && window.location.hostname === 'localhost'

  if (isLocalhost) {
    append(`${LOCAL_NETLIFY_ORIGIN}${canonicalFunctionPath}`)
    append(`${LOCAL_NETLIFY_ORIGIN}${canonicalApiPath}`)
  }

  const remoteFunctionTarget = REMOTE_BASE_INCLUDES_FUNCTION_PREFIX
    ? joinUrl(REMOTE_FUNCTION_BASE, normalizedPath)
    : joinUrl(REMOTE_FUNCTION_BASE, `${NETLIFY_PREFIX}${normalizedPath}`)
  append(`${remoteFunctionTarget}${querySuffix}`)

  if (REMOTE_API_BASE) {
    append(`${joinUrl(REMOTE_API_BASE, normalizedPath)}${querySuffix}`)
  }

  append(canonicalFunctionPath)
  append(canonicalApiPath)

  return targets
}

export {
  NETLIFY_PREFIX,
  API_PREFIX,
  LOCAL_NETLIFY_ORIGIN
}
