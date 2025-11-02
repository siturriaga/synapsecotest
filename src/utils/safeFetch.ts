import { auth } from '../firebase'

export async function safeFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = await auth.currentUser?.getIdToken?.()
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed with status ${res.status}`)
  }
  return (await res.json()) as T
}
