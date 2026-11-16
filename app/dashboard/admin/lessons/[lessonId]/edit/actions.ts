'use server'

import { z } from 'zod'
import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActionState = {
  success?: boolean
  error?: string | null
}

const contentSchema = z.string().max(200_000).nullable()
const videoUrlSchema = z.string().max(2000).nullable()
const titleEnSchema = z
  .union([z.string().trim().max(200), z.literal(''), z.null()])
  .transform((v) => (v ? v.trim() : null))

type AuthResult = { ok: true } | { ok: false; error: string }

/** REQ-SEC-001: verificar sesión y rol admin antes de mutar con client Admin. */
async function assertAdmin(): Promise<AuthResult> {
  const supabaseUser = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabaseUser.auth.getUser()

  if (authError || !user) {
    return { ok: false, error: 'No autorizado: Debes iniciar sesión.' }
  }

  const { data: profile } = await supabaseUser
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { ok: false, error: 'No tienes permisos de administrador.' }
  }

  return { ok: true }
}

export async function updateLessonContent(
  lessonId: string,
  htmlContent: string,
  videoUrl: string | null,
  opts?: { title_en?: string | null },
): Promise<ActionState> {
  // 1. CLIENTE NORMAL: verificar identidad y rol (REQ-SEC-001)
  const admin = await assertAdmin()
  if (!admin.ok) return { error: admin.error }

  // 2. Validación de inputs con Zod (REQ-SEC-001)
  const contentParsed = contentSchema.safeParse(htmlContent)
  if (!contentParsed.success) return { error: 'Error: contenido inválido.' }

  const videoParsed = videoUrlSchema.safeParse(videoUrl ?? null)
  if (!videoParsed.success) return { error: 'Error: URL de video inválida.' }

  const patch: Record<string, unknown> = {
    content: contentParsed.data,
    video_url: videoParsed.data,
  }
  if (opts && Object.prototype.hasOwnProperty.call(opts, 'title_en')) {
    const titleEnParsed = titleEnSchema.safeParse(opts.title_en ?? null)
    if (!titleEnParsed.success) return { error: 'Error: título EN inválido.' }
    patch.title_en = titleEnParsed.data
  }

  // 3. CLIENTE ADMIN: para escribir en la DB saltando RLS
  const supabaseAdmin = createAdminClient()
  const { error: updateError } = await supabaseAdmin
    .from('lessons')
    .update(patch)
    .eq('id', lessonId)

  if (updateError) {
    console.error('Error updating lesson:', updateError)
    return { error: 'Error DB: ' + updateError.message }
  }

  // 4. Limpiar caché
  revalidatePath('/dashboard/courses')
  revalidatePath(`/dashboard/admin/lessons/${lessonId}/edit`)

  return { success: true }
}