'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getServerDictionary } from '@/lib/i18n/server'
import { interpolate } from '@/lib/i18n/dictionaries'

// ─────────────────────────────────────────────────────────────────────────────
// Seguridad: sólo formatos de imagen clásicos de celular / computador.
// MIME types y extensiones se validan en el servidor (la capa client-side puede
// ser eludida por cualquier cliente HTTP).
// ─────────────────────────────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/gif',
  'image/bmp',
  'image/tiff',
])

const ALLOWED_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'gif', 'bmp', 'tiff',
])

/** 15 MB — los teléfonos modernos generan fotos de hasta ~10 MB */
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024

const CUT_TYPES_ALLOWED = [
  'Low Fade', 'Mid Fade', 'High Fade', 'Taper Fade', 'Buzz Cut', 'Scissor Cut',
] as const

// Zod valida los campos de texto para evitar inyecciones o datos basura
function buildSubmissionSchema(messages: {
  descriptionMin: string
  descriptionMax: string
}) {
  return z.object({
    cutType: z.enum(CUT_TYPES_ALLOWED),
    description: z
      .string()
      .trim()
      .min(10, messages.descriptionMin)
      .max(1000, messages.descriptionMax),
  })
}

export async function uploadSubmission(formData: FormData) {
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.tracker
  const submissionSchema = buildSubmissionSchema(messages)
  const supabase = await createClient()

  // 1. Verificar Usuario
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error(messages.unauthenticated)
  }

  // ── Extraer campos ────────────────────────────────────────────────────────
  const file = formData.get('image')
  const cutType = formData.get('cutType') as string
  const description = formData.get('description') as string

  // 2. Validar existencia y tipo del archivo (capa de seguridad servidor)
  if (!(file instanceof File) || file.size === 0) {
    throw new Error(messages.imageRequired)
  }

  // 2a. Validar tamaño
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      interpolate(messages.fileTooLarge, {
        sizeMb: MAX_FILE_SIZE_BYTES / 1024 / 1024,
      }),
    )
  }

  // 2b. Validar MIME type declarado
  const mimeType = file.type.toLowerCase()
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(
      interpolate(messages.invalidMimeType, {
        mimeType: mimeType || 'unknown',
      }),
    )
  }

  // 2c. Validar extensión del nombre de archivo
  const rawExt = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_EXTENSIONS.has(rawExt)) {
    throw new Error(
      interpolate(messages.invalidExtension, {
        extension: rawExt,
      }),
    )
  }

  // 3. Validar campos de texto con Zod
  const parsed = submissionSchema.safeParse({ cutType, description })
  if (!parsed.success) {
    // Zod v4 usa `issues` en vez de `errors`
    const firstError = parsed.error.issues[0]?.message ?? messages.invalidForm
    throw new Error(firstError)
  }

  const { cutType: validCutType, description: validDescription } = parsed.data

  // 4. Subir a Storage con nombre seguro (sin preservar el nombre original)
  const safeName = `${user.id}/${Date.now()}.${rawExt}`

  const { error: storageError } = await supabase.storage
    .from('practice_images')
    .upload(safeName, file)

  if (storageError) throw new Error(messages.uploadStorageError)

  // 5. Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('practice_images')
    .getPublicUrl(safeName)

  // 6. Guardar en DB (RLS asegura que student_id === auth.uid())
  const { error: dbError } = await supabase
    .from('submissions')
    .insert({
      image_url: publicUrl,
      cut_type: validCutType,
      description: validDescription,
      student_id: user.id,
      status: 'pending',
    })

  if (dbError) {
    console.error('Error DB:', dbError)
    throw new Error(messages.saveDbError)
  }

  revalidatePath('/dashboard/tracker')
}

// ─────────────────────────────────────────────────────────────────────────────
// deleteSubmission
// Elimina una práctica del historial del usuario autenticado.
// Seguridad:
//   1. Verifica sesión activa.
//   2. El SELECT usa `.eq('student_id', user.id)` → el usuario solo puede
//      borrar sus propias prácticas (doble capa: RLS + validación explícita).
//   3. Se elimina primero la imagen en Storage para no dejar huérfanos.
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteSubmission(submissionId: string) {
  const dictionary = await getServerDictionary()
  const messages = dictionary.actions.tracker
  const supabase = await createClient()

  // 1. Verificar usuario autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error(messages.unauthenticated)

  // 2. Obtener la práctica y verificar ownership en la misma query
  const { data: submission, error: fetchError } = await supabase
    .from('submissions')
    .select('id, image_url, student_id')
    .eq('id', submissionId)
    .eq('student_id', user.id) // ← solo el dueño puede borrar
    .single()

  if (fetchError || !submission) {
    throw new Error(messages.notFoundOrForbidden)
  }

  // 3. Eliminar imagen del Storage (no bloqueante: si falla, igual borramos el registro)
  if (submission.image_url) {
    // URL pública tiene el formato: ...supabase.co/storage/v1/object/public/practice_images/{storagePath}
    const parts = submission.image_url.split('/practice_images/')
    if (parts.length === 2) {
      const storagePath = decodeURIComponent(parts[1])
      await supabase.storage.from('practice_images').remove([storagePath])
    }
  }

  // 4. Eliminar registro de la DB
  const { error: deleteError } = await supabase
    .from('submissions')
    .delete()
    .eq('id', submissionId)
    .eq('student_id', user.id) // defensa en profundidad

  if (deleteError) {
    console.error('Error al eliminar práctica:', deleteError)
    throw new Error(messages.deleteFailed)
  }

  revalidatePath('/dashboard/tracker')
}