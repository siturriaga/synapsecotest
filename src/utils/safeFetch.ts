import { auth } from './firebaseClient';

type SafeFetchOptions = RequestInit & { expectJson?: boolean };

export const safeFetch = async (input: string, init?: SafeFetchOptions) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('You must sign in before using this feature.');
  }
  const token = await currentUser.getIdToken();
  const headers = new Headers(init?.headers ?? {});
  if (!headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(input, { ...init, headers });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Request failed (${response.status}): ${message}`);
  }

  if (init?.expectJson === false) {
    return response;
  }

  return response.json();
};
