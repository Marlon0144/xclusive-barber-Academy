import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js' // <--- IMPORTACIÓN NUEVA
import { cookies } from 'next/headers'

// 1. CLIENTE NORMAL (Mantiene la sesión del usuario - Usar para vistas públicas/estudiantes)
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar errores de cookies en Server Components
          }
        },
      },
    }
  )
}

// 2. CLIENTE ADMIN (Modo Dios - Ignora RLS y Cookies)
// NOTA: No necesita ser async porque no espera cookies
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    {
      auth: {
        autoRefreshToken: false, // No necesitamos refrescar tokens
        persistSession: false,   // IMPORTANTE: No guardar sesión en memoria ni cookies
        detectSessionInUrl: false
      }
    }
  )
}