'use server'

/**
 * Server Actions — /dashboard/progreso_profesional
 *
 * Vercel Best Practices:
 *   - `server-auth-actions` : Autenticación obligatoria, igual que una API route
 *   - `server-cache-react`  : Delega a getStudentProgress() (React.cache'd)
 *   - `server-serialization`: Solo serializa los datos mínimos necesarios a la page RSC
 */

import { createClient } from '@/utils/supabase/server'
import { getStudentProgress } from '@/utils/cache-helpers'
import type { StudentProgressData } from '@/types/progress'

/**
 * Obtiene todos los datos de progreso del estudiante autenticado.
 * Devuelve null si el usuario no está autenticado (la page debe redirigir).
 */
export async function fetchProgressPageData(): Promise<StudentProgressData | null> {
  const supabase = await createClient()

  // server-auth-actions: verificar sesión antes de cualquier query
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  // Delegar al helper cacheado — deduplica si ya se llamó en el mismo request
  return getStudentProgress(
    user.id,
    user.email ?? '',
    user.created_at,
  )
}
