const NETLIFY_PREFIX = '/.netlify/functions/'
const API_PREFIX = '/api/'
const LOCAL_NETLIFY_ORIGIN = 'http://localhost:8888'

const DEFAULT_REMOTE_BASES = ['https://synapsecopilot.com', 'https://synapsecopilot.netlify.app'] as const
const STORAGE_KEY = 'synapse:function-helper'

type NullableString = string | null | undefined

export type RemoteBaseConfig = {
  functionBase: string
  apiBase: string
  includesFunctionPrefix: boolean
}

function readEnvRemoteBase(): string | null {
  const maybeImportMeta: any = typeof import.meta !== 'undefined' ? import.meta : undefined
  const fromImportMeta: NullableString = maybeImportMeta?.env?.VITE_FUNCTION_BASE_URL

  if (typeof fromImportMeta === 'string' && fromImportMeta.trim().length > 0) {
    return fromImportMeta.trim()
  }

  if (typeof process !== 'undefined' && typeof process.env === 'object') {
    const fromProcess = (process.env as Record<string, NullableString>).VITE_FUNCTION_BASE_URL
    if (typeof fromProcess === 'string' && fromProcess.trim().length > 0) {
      return fromProcess.trim()
    }
  }

  return null
}

function sanitizeRemoteOverride(raw: NullableString, strict: boolean): string | null {
  if (typeof raw !== 'string') {
    return null
  }

  const trimmed = raw.trim()

  if (!trimmed) {
    return null
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    if (strict) {
      throw new Error('Enter a full URL that starts with http:// or https://')
    }
    return null
  }

  return trimmed
}

function readStoredOverride(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return sanitizeRemoteOverride(stored, false)
  } catch (error) {
    console.warn('Unable to read remote helper override from storage', error)
    return null
  }
}

function readGlobalOverride(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const hint = (window as any).__REMOTE_FUNCTION_BASE__
  return sanitizeRemoteOverride(typeof hint === 'string' ? hint : null, false)
}

function resolveDefaultRemoteBase(): string {
  const [primaryDefault] = DEFAULT_REMOTE_BASES
  return primaryDefault
}

let runtimeOverride: string | null = readGlobalOverride() ?? readStoredOverride()

function persistRuntimeOverride(value: string | null) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, value)
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  } catch (error) {
    console.warn('Unable to persist remote helper override', error)
  }
}

export function normalizeRemoteBase(raw: string): RemoteBaseConfig {
  const fallback = resolveDefaultRemoteBase()
  const base = raw ? raw : fallback
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

let cachedConfig: RemoteBaseConfig | null = null
let cachedRaw: string | null = null

function resolveRawRemoteBase(): string {
  if (runtimeOverride) {
    return runtimeOverride
  }

  const envValue = readEnvRemoteBase()
  if (envValue) {
    return envValue
  }

  return resolveDefaultRemoteBase()
}

function computeRemoteBaseConfig(): RemoteBaseConfig {
  const raw = resolveRawRemoteBase()
  if (cachedConfig && cachedRaw === raw) {
    return cachedConfig
  }

  const config = normalizeRemoteBase(raw)
  cachedConfig = config
  cachedRaw = raw
  return config
}

export function getRemoteBaseConfig(): RemoteBaseConfig {
  return computeRemoteBaseConfig()
}

export function getRemoteFunctionBase(): string {
  return computeRemoteBaseConfig().functionBase
}

export function getRemoteApiBase(): string {
  return computeRemoteBaseConfig().apiBase
}

export function remoteBaseIncludesFunctionPrefix(): boolean {
  return computeRemoteBaseConfig().includesFunctionPrefix
}

export function getRemoteFunctionBaseOverride(): string | null {
  return runtimeOverride
}

export function setRemoteFunctionBaseOverride(raw: NullableString): RemoteBaseConfig {
  const sanitized = sanitizeRemoteOverride(raw, true)
  runtimeOverride = sanitized
  persistRuntimeOverride(runtimeOverride)
  cachedConfig = null
  cachedRaw = null
  return computeRemoteBaseConfig()
}

export function clearRemoteFunctionBaseOverride(): RemoteBaseConfig {
  runtimeOverride = null
  persistRuntimeOverride(null)
  cachedConfig = null
  cachedRaw = null
  return computeRemoteBaseConfig()
}

export function getDefaultRemoteFunctionBase(): string {
  return resolveDefaultRemoteBase()
}

export function joinUrl(base: string, path: string) {
  const normalizedBase = base.replace(/\/$/, '')
  const normalizedPath = path.replace(/^\//, '')
  return `${normalizedBase}/${normalizedPath}`
}

export {
  NETLIFY_PREFIX,
  API_PREFIX,
  LOCAL_NETLIFY_ORIGIN
}
