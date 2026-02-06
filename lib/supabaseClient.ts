import { createClient } from '@supabase/supabase-js';

// Vercel (and Vite) injects environment variables via import.meta.env
const env = (import.meta as any).env || {};
const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase URLs are missing. Running in disconnected mode.');
  
  // Helper to simulate a Supabase-like promise response that returns an error
  const mockError = (msg: string) => Promise.resolve({ 
    data: null, 
    error: { message: `MISSING API KEYS: ${msg}` } 
  });

  // Mock implementation that ensures errors are returned for await calls
  supabaseInstance = {
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: () => mockError(`Cannot select from ${table}`),
          order: () => mockError(`Cannot select from ${table}`)
        }),
        order: () => mockError(`Cannot list ${table}`),
        insert: () => mockError(`Cannot insert into ${table}`)
      }),
      insert: (data: any) => ({
        select: () => ({
          single: () => mockError(`Cannot insert/select from ${table}`)
        }),
        then: (resolve: any) => resolve({ data: null, error: { message: "MISSING API KEYS" } }) // Make it thenable
      })
    })
  } as any;
} else {
  supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export const supabase = supabaseInstance;