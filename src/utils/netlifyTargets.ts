const NETLIFY_PREFIX = '/.netlify/functions/'
const API_PREFIX = '/api/'
const LOCAL_NETLIFY_HOSTS = [
  'http://localhost:8888/.netlify/functions/',
  'http://127.0.0.1:8888/.netlify/functions/'
]

export function getDefaultRemoteFunctionBase(): string {
  return ''
}

export function getRemoteFunctionBase(): string {
  return ''
}

export function getRemoteFunctionBaseOverride(): string | null {
  return null
}

export function setRemoteFunctionBaseOverride(_value: string | null): void {}

export function clearRemoteFunctionBaseOverride(): void {}

function normalizePath(path: string): { pathname: string; query: string } {
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

function buildUrl(base: string, pathname: string, query: string): string {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const trimmedPath = pathname.replace(/^\/+/, '')
  const url = trimmedPath
    ? `${normalizedBase}${trimmedPath}`
    : normalizedBase.replace(/\/$/, '')
  return query ? `${url}?${query}` : url
}

export function buildFunctionCandidates(path: string): string[] {
  if (/^https?:\/\//i.test(path)) {
    return [path]
  }

  const { pathname, query } = normalizePath(path)
  const candidates = [
    buildUrl(API_PREFIX, pathname, query),
    buildUrl(NETLIFY_PREFIX, pathname, query),
    ...LOCAL_NETLIFY_HOSTS.map((host) => buildUrl(host, pathname, query))
  ]

  return Array.from(new Set(candidates))
}

export function buildFunctionUrl(path: string): string {
  return buildFunctionCandidates(path)[0]
}

export { NETLIFY_PREFIX, API_PREFIX }
