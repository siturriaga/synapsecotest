export async function safeFetch(url: string, init?: RequestInit) {
  const r = await fetch(url, init);
  const raw = await r.text();
  let json: any = null;
  try { json = raw ? JSON.parse(raw) : null; } catch {}
  if (!r.ok) {
    const msg = (json?.error ?? raw) || r.statusText;
    throw new Error(`${r.status}: ${msg}`);
  }
  return json;
}
