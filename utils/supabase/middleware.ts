import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  LANGUAGE_COOKIE_MAX_AGE,
  LANGUAGE_COOKIE_NAME,
  isSupportedLanguage,
  resolvePreferredLanguage,
  type Language,
} from '@/lib/i18n/config'

function setLanguageCookie(response: NextResponse, language: Language) {
  response.cookies.set(LANGUAGE_COOKIE_NAME, language, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: LANGUAGE_COOKIE_MAX_AGE,
  })
}

function redirectWithSessionCookies(
  request: NextRequest,
  destinationPath: string,
  sourceResponse: NextResponse,
  language: Language,
) {
  const url = request.nextUrl.clone()
  url.pathname = destinationPath

  const redirectResponse = NextResponse.redirect(url)

  sourceResponse.cookies.getAll().forEach(({ name, value }) => {
    redirectResponse.cookies.set(name, value)
  })

  setLanguageCookie(redirectResponse, language)
  return redirectResponse
}

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

  const cookieLanguage = request.cookies.get(LANGUAGE_COOKIE_NAME)?.value
  const preferredLanguage = resolvePreferredLanguage(
    cookieLanguage,
    request.headers.get('accept-language'),
  )

  if (!isSupportedLanguage(cookieLanguage)) {
    setLanguageCookie(supabaseResponse, preferredLanguage)
  }

  // 4. Lógica de Protección de Rutas
  // Si NO hay usuario y trata de entrar a cualquier ruta que empiece por /dashboard...
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return redirectWithSessionCookies(request, '/login', supabaseResponse, preferredLanguage)
  }

  // Si YA hay usuario y trata de entrar a rutas publicas de acceso/onboarding...
  if (
    user &&
    (
      request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/signup' ||
      request.nextUrl.pathname === '/apply' ||
      request.nextUrl.pathname === '/qualify'
    )
  ) {
    return redirectWithSessionCookies(request, '/dashboard', supabaseResponse, preferredLanguage)
  }

  return supabaseResponse
}