import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // 1. Creamos una respuesta inicial. El middleware necesita modificarla.
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Creamos el cliente de Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Aquí ocurre la magia: actualizamos las cookies en la respuesta
          // y en la petición actual para que estén sincronizadas.
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Obtenemos el usuario. Esto refresca el token si es necesario.
  // IMPORTANTE: No uses supabase.auth.getSession() aquí, es inseguro en middleware.
  // getUser() valida contra la base de datos de Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 4. Lógica de Protección de Rutas
  // Si NO hay usuario y trata de entrar a cualquier ruta que empiece por /dashboard...
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    // ...lo redirigimos al login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si YA hay usuario y trata de entrar al login o signup...
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
     // (Opcional) Podrías redirigirlo directo al dashboard si ya está logueado
     // Por ahora lo dejamos simple o redirigimos a dashboard:
     const url = request.nextUrl.clone()
     url.pathname = '/dashboard'
     return NextResponse.redirect(url)
  }

  return supabaseResponse
}