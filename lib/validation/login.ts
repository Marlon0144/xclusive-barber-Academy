import { z } from 'zod'

/**
 * Schema de validación para el Server Action `login()` (REQ-FUNC-002).
 *
 * Se mantiene como módulo puro (sin dependencias de Next/Supabase) para poder
 * ejecutarse en la suite de tests del contenedor.
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type LoginInput = z.infer<typeof loginSchema>