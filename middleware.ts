import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Simplemente delegamos la lógica a nuestra función auxiliar
  return await updateSession(request)
}

export const config = {
  // Matcher: Le dice a Next.js en qué rutas debe ejecutarse el middleware.
  // Excluimos archivos estáticos (_next/static), imágenes, favicons, etc.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}