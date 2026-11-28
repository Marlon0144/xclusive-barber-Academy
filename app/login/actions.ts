'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getServerDictionary } from '@/lib/i18n/server'
import { loginSchema } from '@/lib/validation/login'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const dictionary = await getServerDictionary()
  const loginMessages = dictionary.actions.login

  // 1. VALIDAR (REQ-FUNC-002) — Zod antes de tocar Supabase Auth
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    const message =
      firstIssue?.path[0] === 'email'
        ? loginMessages.invalidEmail
        : loginMessages.invalidPassword
    const encodedError = encodeURIComponent(message)
    return redirect(`/login?error=${encodedError}`)
  }

  const { email, password } = parsed.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Si falla, redirigimos a la página de login con un parámetro de error
    // (Una forma simple de manejar errores sin client components complejos por ahora)
    const encodedError = encodeURIComponent(loginMessages.invalidCredentials)
    return redirect(`/login?error=${encodedError}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}