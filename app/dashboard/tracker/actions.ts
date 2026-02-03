'use server'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadSubmission(formData: FormData) {
  const supabase = await createClient()
  
  const file = formData.get('image') as File
  const cutType = formData.get('cutType') as string
  const description = formData.get('description') as string

  if (!file) throw new Error('La imagen es obligatoria')

  // 1. Subir imagen a Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${fileName}`

  const { data: storageData, error: storageError } = await supabase.storage
    .from('practice_images')
    .upload(filePath, file)

  if (storageError) throw storageError

  // 2. Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('practice_images')
    .getPublicUrl(filePath)

  // 3. Insertar en base de datos
  const { error: dbError } = await supabase
    .from('submissions')
    .insert({
      image_url: publicUrl,
      cut_type: cutType,       // Asegúrate que no sea null
      description: description || '', 
      student_id: (await supabase.auth.getUser()).data.user?.id,
      status: 'pending'        // Forzamos el estado inicial
    })

  if (dbError) {
    console.error("DETALLE DEL ERROR DE DB:", dbError) // Esto saldrá en tu terminal, no en el navegador
    throw new Error(`Error en DB: ${dbError.message}`)
  }

  revalidatePath('/dashboard/tracker')
}