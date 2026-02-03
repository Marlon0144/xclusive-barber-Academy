'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Si falla, redirigimos a la página de login con un parámetro de error
    // (Una forma simple de manejar errores sin client components complejos por ahora)
    return redirect('/login?error=Credenciales incorrectas')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}