import { describe, expect, it } from 'vitest'
import { gradesSchema, submitGradeSchema } from '@/lib/validation/grading'

const UUID = '3d5a9b0e-6f5a-4a1b-8c2d-9e7f1a2b3c4d'

const VALID_GRADES = {
  fade: 8,
  cleanliness: 7.5,
  technique: 9,
  symmetry: 6,
}

describe('grading — validación Zod (REQ-FUNC-004)', () => {
  describe('gradesSchema', () => {
    it('acepta 4 criterios numéricos en [0,10]', () => {
      const result = gradesSchema.safeParse(VALID_GRADES)
      expect(result.success).toBe(true)
    })

    it('acepta extremos 0 y 10', () => {
      const edges = {
        fade: 0,
        cleanliness: 10,
        technique: 0,
        symmetry: 10,
      }
      expect(gradesSchema.safeParse(edges).success).toBe(true)
    })

    it('rechaza valores fuera de rango [0,10]', () => {
      expect(
        gradesSchema.safeParse({ ...VALID_GRADES, fade: -1 }).success,
      ).toBe(false)
      expect(
        gradesSchema.safeParse({ ...VALID_GRADES, technique: 10.5 }).success,
      ).toBe(false)
    })

    it('rechaza strings y campos adicionales', () => {
      expect(
        gradesSchema.safeParse({ ...VALID_GRADES, fade: '8' }).success,
      ).toBe(false)
      expect(
        gradesSchema.safeParse({ ...VALID_GRADES, extra: 5 }).success,
      ).toBe(false)
    })

    it('rechaza criterios faltantes', () => {
      expect(
        gradesSchema.safeParse({ fade: 8, cleanliness: 7, technique: 9 }).success,
      ).toBe(false)
    })
  })

  describe('submitGradeSchema', () => {
    it('acepta submissionId UUID y grades válidos', () => {
      const result = submitGradeSchema.safeParse({
        submissionId: UUID,
        grades: VALID_GRADES,
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.submissionId).toBe(UUID)
        expect(result.data.grades.symmetry).toBe(6)
      }
    })

    it('rechaza submissionId que no es UUID sin tocar la BD', () => {
      const result = submitGradeSchema.safeParse({
        submissionId: 'no-es-uuid',
        grades: VALID_GRADES,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('submissionId')
      }
    })

    it('rechaza grades fuera de rango dentro del objeto completo', () => {
      const result = submitGradeSchema.safeParse({
        submissionId: UUID,
        grades: { ...VALID_GRADES, cleanliness: 11 },
      })
      expect(result.success).toBe(false)
    })

    it('rechaza payload incompleto', () => {
      expect(submitGradeSchema.safeParse({ submissionId: UUID }).success).toBe(false)
      expect(submitGradeSchema.safeParse({ grades: VALID_GRADES }).success).toBe(false)
    })
  })
})