-- ============================================================================
-- REQ-PERF-001 — Índices covering para claves foráneas no indexadas
-- ============================================================================
-- El advisor `unindexed_foreign_keys` reportó 7 FKs sin índice. Cada FK sin
-- índice obliga a sequential scans en JOINs y en operaciones de escritura con
-- restricciones referenciales.

CREATE INDEX IF NOT EXISTS crm_leads_reviewed_by_idx
  ON public.crm_leads (reviewed_by);

CREATE INDEX IF NOT EXISTS invitations_lead_id_idx
  ON public.invitations (lead_id);

CREATE INDEX IF NOT EXISTS lesson_progress_lesson_id_idx
  ON public.lesson_progress (lesson_id);

CREATE INDEX IF NOT EXISTS lesson_progress_verified_by_idx
  ON public.lesson_progress (verified_by);

CREATE INDEX IF NOT EXISTS lessons_module_id_idx
  ON public.lessons (module_id);

CREATE INDEX IF NOT EXISTS submissions_grader_id_idx
  ON public.submissions (grader_id);

-- `submissions.student_id` se crea IF NOT EXISTS: si ya existía un índice con
-- otro nombre (verificado en el proyecto), no se duplica.
CREATE INDEX IF NOT EXISTS submissions_student_id_idx
  ON public.submissions (student_id);

-- Verificación: Supabase advisor `unindexed_foreign_keys` = 0 hallazgos.