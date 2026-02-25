// Questo file sostituisce il vecchio supabaseClient.ts.
// Invece di connettersi direttamente al database dal browser,
// ora si usa fetch() per chiamare le API serverless di Vercel.

/**
 * Helper generico per le chiamate alle API serverless.
 * Lancia un errore se la risposta HTTP non è ok (4xx, 5xx).
 */
export async function apiFetch(path: string, options?: RequestInit): Promise<any> {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || `Errore HTTP ${res.status}`);
  }

  return json;
}