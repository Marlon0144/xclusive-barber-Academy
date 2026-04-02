'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getServerDictionary } from '@/lib/i18n/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const dictionary = await getServerDictionary()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Si falla, redirigimos a la página de login con un parámetro de error
    // (Una forma simple de manejar errores sin client components complejos por ahora)
    const encodedError = encodeURIComponent(dictionary.actions.login.invalidCredentials)
    return redirect(`/login?error=${encodedError}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}