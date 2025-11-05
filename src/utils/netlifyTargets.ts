const NETLIFY_PREFIX = '/.netlify/functions/'
const API_PREFIX = '/api/'
const LOCAL_NETLIFY_ORIGIN = 'http://localhost:8888'
const RAW_REMOTE_FUNCTION_BASE = (import.meta.env?.VITE_FUNCTION_BASE_URL || 'https://synapsecopilot.com').trim()

export type RemoteBaseConfig = {
  functionBase: string
  apiBase: string
  includesFunctionPrefix: boolean
}

export function normalizeRemoteBase(raw: string): RemoteBaseConfig {
  const fallback = 'https://synapsecopilot.com'
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

export const REMOTE_BASE_CONFIG = normalizeRemoteBase(RAW_REMOTE_FUNCTION_BASE)
export const REMOTE_FUNCTION_BASE = REMOTE_BASE_CONFIG.functionBase
export const REMOTE_API_BASE = REMOTE_BASE_CONFIG.apiBase
export const REMOTE_BASE_INCLUDES_FUNCTION_PREFIX = REMOTE_BASE_CONFIG.includesFunctionPrefix

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
