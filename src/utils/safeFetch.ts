import { auth } from './firebaseClient';

type SafeFetchOptions = RequestInit & { parseJson?: boolean };

type SafeFetchResult<T> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};

export const safeFetch = async <T = unknown>(input: RequestInfo, init?: SafeFetchOptions): Promise<SafeFetchResult<T>> => {
  try {
    const currentUser = auth.currentUser;
    const headers = new Headers(init?.headers ?? {});

    if (currentUser) {
      const token = await currentUser.getIdToken();
      if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    if (!headers.has('Content-Type') && init?.body && typeof init.body === 'string') {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(input, { ...init, headers });
    const parseJson = init?.parseJson ?? true;

    if (!parseJson) {
      return { ok: response.ok, status: response.status };
    }

    const text = await response.text();
    const json = text ? (JSON.parse(text) as T) : undefined;

    if (!response.ok) {
      const message = typeof json === 'object' && json && 'error' in (json as Record<string, unknown>)
        ? String((json as Record<string, unknown>).error)
        : text || 'Request failed.';
      return { ok: false, status: response.status, error: message };
    }

    return { ok: true, status: response.status, data: json };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected request error.';
    return { ok: false, status: 0, error: message };
  }
};
