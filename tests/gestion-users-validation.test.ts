import { describe, expect, it } from 'vitest'
import {
  createInvitationSchema,
  deleteInvitationSchema,
  toggleInvitationStatusSchema,
  updateUserRoleSchema,
  userRoleSchema,
  uuidSchema,
} from '@/lib/validation/gestion-users'

const UUID = '3d5a9b0e-6f5a-4a1b-8c2d-9e7f1a2b3c4d'

describe('gestion_users — validación Zod (REQ-FUNC-003)', () => {
  describe('createInvitationSchema', () => {
    it('acepta un rol válido y maxUses numérico dentro de [1,50]', () => {
      const result = createInvitationSchema.safeParse({ role: 'instructor', maxUses: 10 })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.role).toBe('instructor')
        expect(result.data.maxUses).toBe(10)
      }
    })

    it('coerciona maxUses enviado como string (FormData)', () => {
      const result = createInvitationSchema.safeParse({ role: 'student', maxUses: '25' })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.maxUses).toBe(25)
      }
    })

    it('rechaza un rol fuera del enum user_role', () => {
      const result = createInvitationSchema.safeParse({ role: 'moderator', maxUses: 5 })
      expect(result.success).toBe(false)
    })

    it('rechaza maxUses menor a 1 o mayor a 50', () => {
      expect(createInvitationSchema.safeParse({ role: 'admin', maxUses: 0 }).success).toBe(false)
      expect(createInvitationSchema.safeParse({ role: 'admin', maxUses: 51 }).success).toBe(false)
    })

    it('rechaza maxUses no entero o no numérico', () => {
      expect(createInvitationSchema.safeParse({ role: 'admin', maxUses: 1.5 }).success).toBe(false)
      expect(createInvitationSchema.safeParse({ role: 'admin', maxUses: 'abc' }).success).toBe(false)
    })

    it('rechaza un objeto incompleto', () => {
      expect(createInvitationSchema.safeParse({ role: 'admin' }).success).toBe(false)
      expect(createInvitationSchema.safeParse({}).success).toBe(false)
    })
  })

  describe('deleteInvitationSchema', () => {
    it('acepta un invitationId UUID válido', () => {
      const result = deleteInvitationSchema.safeParse({ invitationId: UUID })
      expect(result.success).toBe(true)
    })

    it('rechaza un invitationId que no es UUID', () => {
      expect(deleteInvitationSchema.safeParse({ invitationId: 'no-uuid' }).success).toBe(false)
      expect(deleteInvitationSchema.safeParse({ invitationId: '' }).success).toBe(false)
    })
  })

  describe('toggleInvitationStatusSchema', () => {
    it('acepta nextActive "true" o "false" con UUID válido', () => {
      expect(
        toggleInvitationStatusSchema.safeParse({ invitationId: UUID, nextActive: 'true' }).success,
      ).toBe(true)
      expect(
        toggleInvitationStatusSchema.safeParse({ invitationId: UUID, nextActive: 'false' }).success,
      ).toBe(true)
    })

    it('rechaza nextActive distinto de "true"/"false"', () => {
      expect(
        toggleInvitationStatusSchema.safeParse({ invitationId: UUID, nextActive: 'yes' }).success,
      ).toBe(false)
    })
  })

  describe('updateUserRoleSchema', () => {
    it('acepta un userId UUID y un rol válido', () => {
      const result = updateUserRoleSchema.safeParse({ userId: UUID, role: 'student' })
      expect(result.success).toBe(true)
    })

    it('rechaza userId no UUID o rol inválido', () => {
      expect(
        updateUserRoleSchema.safeParse({ userId: 'xyz', role: 'admin' }).success,
      ).toBe(false)
      expect(
        updateUserRoleSchema.safeParse({ userId: UUID, role: 'superuser' }).success,
      ).toBe(false)
    })
  })

  describe('helpers de bajo nivel', () => {
    it('userRoleSchema acepta exactamente admin, instructor, student', () => {
      expect(userRoleSchema.safeParse('admin').success).toBe(true)
      expect(userRoleSchema.safeParse('instructor').success).toBe(true)
      expect(userRoleSchema.safeParse('student').success).toBe(true)
      expect(userRoleSchema.safeParse('owner').success).toBe(false)
    })

    it('uuidSchema acepta UUIDs y rechaza el resto', () => {
      expect(uuidSchema.safeParse(UUID).success).toBe(true)
      expect(uuidSchema.safeParse('abc').success).toBe(false)
      expect(uuidSchema.safeParse(123).success).toBe(false)
    })
  })
})