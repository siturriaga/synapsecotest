const NETLIFY_PREFIX = '/.netlify/functions/'
const API_PREFIX = '/api/'

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

export function buildFunctionUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const { pathname, query } = normalizePath(path)
  const base = API_PREFIX
  const url = pathname ? `${base}${pathname}` : base.replace(/\/$/, '')
  return query ? `${url}?${query}` : url
}

export { NETLIFY_PREFIX, API_PREFIX }
