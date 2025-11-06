const NETLIFY_PREFIX = '/.netlify/functions/'
const API_PREFIX = '/api/'
const STORAGE_KEY = 'synapse:function-helper'

type NullableString = string | null | undefined

function stripSuffixSegments(value: string): string {
  const withoutTrailingSlash = value.replace(/\/+$/, '')
  return withoutTrailingSlash.replace(/\/(?:\.netlify\/functions|api)(?:\/.*)?$/i, '')
}

function sanitizeRemoteBase(raw: NullableString, strict: boolean): string | null {
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

  return stripSuffixSegments(trimmed)
}

function readEnvRemoteBase(): string {
  const maybeImportMeta: any = typeof import.meta !== 'undefined' ? import.meta : undefined
  const fromImportMeta = sanitizeRemoteBase(maybeImportMeta?.env?.VITE_FUNCTION_BASE_URL, false)
  if (fromImportMeta) {
    return fromImportMeta
  }

  if (typeof process !== 'undefined' && typeof process.env === 'object') {
    const fromProcess = sanitizeRemoteBase((process.env as Record<string, NullableString>).VITE_FUNCTION_BASE_URL, false)
    if (fromProcess) {
      return fromProcess
    }
  }

  return ''
}

function readStoredOverride(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return sanitizeRemoteBase(window.localStorage.getItem(STORAGE_KEY), false)
  } catch (error) {
    console.warn('Unable to read remote helper override from storage', error)
    return null
  }
}

function persistOverride(value: string | null) {
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

let runtimeOverride: string | null = readStoredOverride()
const envBase = readEnvRemoteBase()

function resolveRemoteBase(): string {
  const base = runtimeOverride ?? envBase
  return base.replace(/\/+$/, '')
}

export function getDefaultRemoteFunctionBase(): string {
  return envBase
}

export function getRemoteFunctionBase(): string {
  return resolveRemoteBase()
}

export function getRemoteFunctionBaseOverride(): string | null {
  return runtimeOverride
}

export function setRemoteFunctionBaseOverride(raw: NullableString): string {
  const sanitized = sanitizeRemoteBase(raw, true)
  runtimeOverride = sanitized
  persistOverride(runtimeOverride)
  return getRemoteFunctionBase()
}

export function clearRemoteFunctionBaseOverride(): string {
  runtimeOverride = null
  persistOverride(null)
  return getRemoteFunctionBase()
}

function normalizePath(path: string): { pathname: string; query: string } {
  const [rawPath, ...queryParts] = path.split('?')
  const query = queryParts.length ? queryParts.join('?') : ''

  if (/^https?:\/\//i.test(rawPath)) {
    return { pathname: rawPath, query }
  }

  let pathname = rawPath.trim()
  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    return { pathname, query }
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

  const { pathname, query } = normalizePath(path)
  const base = getRemoteFunctionBase()
  const normalizedBase = base.replace(/\/+$/, '')
  const prefix = normalizedBase ? `${normalizedBase}${API_PREFIX}` : API_PREFIX
  const url = `${prefix}${pathname}`
  return query ? `${url}?${query}` : url
}

export { NETLIFY_PREFIX, API_PREFIX }
