import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  LANGUAGE_COOKIE_MAX_AGE,
  LANGUAGE_COOKIE_NAME,
  PATHNAME_HEADER,
  isSupportedLanguage,
  resolvePreferredLanguage,
  type Language,
} from '@/lib/i18n/config'
import { languageForPath } from '@/lib/i18n/routes'

/**
 * Pass-through response that also hands the URL path to server components.
 * The header is always overwritten here, so a client can't spoof it. Cloning
 * `request.headers` AFTER Supabase mutated `request.cookies` keeps the
 * refreshed auth cookies in the forwarded request.
 */
function nextWithPathname(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.set(PATHNAME_HEADER, request.nextUrl.pathname)
  return NextResponse.next({ request: { headers } })
}

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
  let supabaseResponse = nextWithPathname(request)

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
          supabaseResponse = nextWithPathname(request)
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
  // On public marketing pages the URL decides the language (/en/... → en, / → es) and the
  // cookie follows it, so the next page without a language-specific URL (qualify, login…)
  // keeps the language the visitor was just reading. Elsewhere the cookie is a preference.
  const urlLanguage = languageForPath(request.nextUrl.pathname)
  const preferredLanguage =
    urlLanguage ?? resolvePreferredLanguage(cookieLanguage, request.headers.get('accept-language'))

  // <Link> prefetches request pages the visitor hasn't opened (e.g. the "English version" link on a
  // Spanish page). Those requests pass through this middleware too, so writing the cookie for them
  // would silently change the visitor's language just because a link was visible.
  const isPrefetch =
    request.headers.has('next-router-prefetch') ||
    request.headers.get('purpose') === 'prefetch' ||
    (request.headers.get('sec-purpose') ?? '').includes('prefetch')

  const shouldWriteLanguageCookie =
    !isPrefetch && (urlLanguage ? cookieLanguage !== urlLanguage : !isSupportedLanguage(cookieLanguage))

  if (shouldWriteLanguageCookie) {
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