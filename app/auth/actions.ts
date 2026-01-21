'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signout() {
  const supabase = await createClient()
  
  // Destruye la sesión en el servidor
  await supabase.auth.signOut()
  
  // Limpia la caché y redirige
  revalidatePath('/', 'layout')
  redirect('/')
}