import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Este cliente es seguro para usarse en el navegador porque usa la ANON KEY pública
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}