'use server'

import { createClient } from '@/utils/supabase/server' // <--- USAR CLIENTE NORMAL
import { revalidatePath } from 'next/cache'

export async function uploadSubmission(formData: FormData) {
  const supabase = await createClient()

  // 1. Verificar Usuario (Necesario para el student_id)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Usuario no autenticado')
  }

  const file = formData.get('image') as File
  const cutType = formData.get('cutType') as string
  const description = formData.get('description') as string

  if (!file) throw new Error('La imagen es obligatoria')

  // 2. Subir a Storage
  // Tip: Organizar por carpetas de usuario es buena práctica
  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}/${Date.now()}.${fileExt}`

  const { error: storageError } = await supabase.storage
    .from('practice_images')
    .upload(filePath, file)

  if (storageError) throw new Error('Error subiendo imagen a Storage')

  // 3. Obtener URL
  const { data: { publicUrl } } = supabase.storage
    .from('practice_images')
    .getPublicUrl(filePath)

  // 4. Guardar en DB (Usando cliente normal + RLS)
  const { error: dbError } = await supabase
    .from('submissions')
    .insert({
      image_url: publicUrl,
      cut_type: cutType,
      description: description,
      student_id: user.id, // <--- Coincide con auth.uid(), así que RLS lo permite
      status: 'pending'
    })

  if (dbError) {
    console.error("Error DB:", dbError)
    throw new Error(`No se pudo guardar: ${dbError.message}`)
  }

  revalidatePath('/dashboard/tracker')
}