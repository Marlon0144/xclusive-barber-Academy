import { z } from 'zod'

/**
 * Schemas de validación para los Server Actions de gestión de usuarios
 * `app/dashboard/admin/gestion_users/actions.ts` (REQ-FUNC-003).
 *
 * Módulo puro (sin dependencias de Next/Supabase) para poder ejecutarse en la
 * suite de tests del contenedor.
 */

export const userRoleSchema = z.enum(['admin', 'instructor', 'student'])

export const uuidSchema = z.string().uuid()

/** Creación de invitación — reemplaza parseRole()/parseMaxUses(). */
export const createInvitationSchema = z.object({
  role: userRoleSchema,
  // FormData entrega strings; coerce valida el valor numérico tras coercionar.
  maxUses: z.coerce.number().int().min(1).max(50),
})

/** Eliminación de invitación. */
export const deleteInvitationSchema = z.object({
  invitationId: uuidSchema,
})

/** Toggle de estado activo/inactivo de una invitación. */
export const toggleInvitationStatusSchema = z.object({
  invitationId: uuidSchema,
  nextActive: z.enum(['true', 'false']),
})

/** Cambio de rol de un usuario. */
export const updateUserRoleSchema = z.object({
  userId: uuidSchema,
  role: userRoleSchema,
})

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>
export type DeleteInvitationInput = z.infer<typeof deleteInvitationSchema>
export type ToggleInvitationStatusInput = z.infer<typeof toggleInvitationStatusSchema>
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>