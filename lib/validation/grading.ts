import { z } from 'zod'

/**
 * Schemas de validación para el Server Action `submitGrade()`
 * `app/dashboard/grading/actions.ts` (REQ-FUNC-004).
 *
 * Módulo puro (sin dependencias de Next/Supabase) para poder ejecutarse en la
 * suite de tests del contenedor.
 */

export const gradesSchema = z
  .object({
    fade: z.number().min(0).max(10),
    cleanliness: z.number().min(0).max(10),
    technique: z.number().min(0).max(10),
    symmetry: z.number().min(0).max(10),
  })
  // REQ-FUNC-004: un cliente malicioso no debe poder inyectar campos
  // adicionales en `grades`; el shape es exacto.
  .strict()

export const submitGradeSchema = z.object({
  submissionId: z.string().uuid(),
  grades: gradesSchema,
})

export type Grades = z.infer<typeof gradesSchema>
export type SubmitGradeInput = z.infer<typeof submitGradeSchema>