const NETLIFY_PREFIX = '/.netlify/functions/'
const API_PREFIX = '/api/'
const LOCAL_NETLIFY_ORIGIN = 'http://localhost:8888'
const REMOTE_BASE_STORAGE_KEY = 'synapseco.remoteFunctionBaseOverride'

type RemoteBaseConfig = {
  functionBase: string
  apiBase: string
  includesFunctionPrefix: boolean
}

const DEFAULT_REMOTE_BASE_RAW = (() => {
  const raw = typeof import.meta !== 'undefined' ? (import.meta as any)?.env?.VITE_FUNCTION_BASE_URL : undefined
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  return trimmed || 'https://synapsecopilot.com'
})()

function normalizeRemoteBase(raw: string): RemoteBaseConfig {
  const trimmed = raw.trim()
  if (!trimmed) {
    throw new Error('Gemini helper URL must not be empty.')
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch (error) {
    throw new Error('Gemini helper must be a valid URL.')
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Gemini helper must use http or https.')
  }

  const base = `${parsed.origin}${parsed.pathname}`.replace(/\/$/, '')
  const hasFunctionPrefix = /\/\.netlify\/functions(?:\b|\/)/i.test(base)
  const hasApiPrefix = /\/api(?:\b|\/)/i.test(base)

  const functionBase = (() => {
    if (hasFunctionPrefix) {
      return base
    }
    if (hasApiPrefix) {
      return base.replace(/\/api(?:\b|\/)/i, NETLIFY_PREFIX.replace(/\/$/, ''))
    }
    return base
  })()

  const apiBase = (() => {
    if (hasApiPrefix) {
      return base
    }
    if (hasFunctionPrefix) {
      return base.replace(/\/\.netlify\/functions(?:\b|\/)/i, API_PREFIX.replace(/\/$/, ''))
    }
    return `${base}${API_PREFIX}`
  })().replace(/\/$/, '')

  return {
    functionBase: functionBase.replace(/\/$/, ''),
    apiBase,
    includesFunctionPrefix: /\/\.netlify\/functions(?:\b|\/)/i.test(functionBase)
  }
}

const DEFAULT_REMOTE_BASE_CONFIG = normalizeRemoteBase(DEFAULT_REMOTE_BASE_RAW)

let remoteBaseOverride: RemoteBaseConfig | null = null
let overrideLoaded = false

function persistOverride(value: string | null) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    if (value) {
      window.localStorage.setItem(REMOTE_BASE_STORAGE_KEY, value)
    } else {
      window.localStorage.removeItem(REMOTE_BASE_STORAGE_KEY)
    }
  } catch (error) {
    // ignore storage failures (private mode, etc.)
  }
}

function loadOverrideFromStorage() {
  if (overrideLoaded || typeof window === 'undefined') {
    overrideLoaded = true
    return
  }

  overrideLoaded = true

  try {
    const stored = window.localStorage.getItem(REMOTE_BASE_STORAGE_KEY)
    if (stored) {
      remoteBaseOverride = normalizeRemoteBase(stored)
    }
  } catch (error) {
    remoteBaseOverride = null
    try {
      window.localStorage.removeItem(REMOTE_BASE_STORAGE_KEY)
    } catch (cleanupError) {
      // ignore cleanup errors
    }
  }
}

function getActiveRemoteBase(): RemoteBaseConfig {
  loadOverrideFromStorage()
  return remoteBaseOverride ?? DEFAULT_REMOTE_BASE_CONFIG
}

export function getDefaultRemoteFunctionBase(): string {
  return DEFAULT_REMOTE_BASE_CONFIG.functionBase
}

export function getRemoteFunctionBase(): string {
  return getActiveRemoteBase().functionBase
}

export function getRemoteBaseConfig(): RemoteBaseConfig {
  return getActiveRemoteBase()
}

export function getRemoteFunctionBaseOverride(): string | null {
  loadOverrideFromStorage()
  return remoteBaseOverride ? remoteBaseOverride.functionBase : null
}

export function setRemoteFunctionBaseOverride(value: string | null): string {
  const trimmed = value?.trim() ?? ''
  if (!trimmed) {
    return clearRemoteFunctionBaseOverride()
  }

  const config = normalizeRemoteBase(trimmed)
  remoteBaseOverride = config
  overrideLoaded = true
  persistOverride(trimmed)
  return config.functionBase
}

export function clearRemoteFunctionBaseOverride(): string {
  remoteBaseOverride = null
  overrideLoaded = true
  persistOverride(null)
  return getActiveRemoteBase().functionBase
}

export function normalizeFunctionPath(path: string): { pathname: string; query: string } {
  const [rawPath, ...queryParts] = path.split('?')
  const query = queryParts.length ? queryParts.join('?') : ''

  if (/^https?:\/\//i.test(rawPath)) {
    return { pathname: rawPath, query }
  }

  let pathname = rawPath.trim()
  if (!pathname) {
    return { pathname: '', query }
  }

  pathname = pathname.replace(/^\/+/, '')

  if (pathname.startsWith(NETLIFY_PREFIX.slice(1))) {
    pathname = pathname.slice(NETLIFY_PREFIX.length - 1)
  }

  if (pathname.startsWith(API_PREFIX.slice(1))) {
    pathname = pathname.slice(API_PREFIX.length - 1)
  }

  pathname = pathname.replace(/^\/+/, '')

  return { pathname, query }
}

export function buildFunctionUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const { pathname, query } = normalizeFunctionPath(path)
  const base = API_PREFIX
  const url = pathname ? `${base}${pathname}` : base.replace(/\/$/, '')
  return query ? `${url}?${query}` : url
}

export function joinUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/$/, '')
  const normalizedPath = path.replace(/^\/+/, '')
  if (!normalizedPath) {
    return normalizedBase
  }
  return `${normalizedBase}/${normalizedPath}`
}

export { NETLIFY_PREFIX, API_PREFIX, LOCAL_NETLIFY_ORIGIN }
