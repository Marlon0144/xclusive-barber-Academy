import { createBrowserClient } from '@supabase/ssr'

// cache a singleton instance so we don't recreate on every render
let _supabase: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (!_supabase) {
    // Este cliente es seguro para usarse en el navegador porque usa la ANON KEY pública
    _supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _supabase
}