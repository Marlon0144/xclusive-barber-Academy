-- ============================================================================
-- REQ-PERF-002 — Optimizar políticas RLS: `(SELECT auth.uid())` (initPlan)
-- ============================================================================
-- `auth.uid()` dentro de una política se re-evalúa por cada fila. Envolverlo en
-- `(SELECT auth.uid())` permite a Postgres calcularlo una sola vez (initPlan).
--
-- El advisor `auth_rls_initplan` reportó 23 políticas. Este artefacto contiene:
--   1) Una query de auditoría para localizar TODAS las políticas pendientes.
--   2) Ejemplos canónicos de reescritura por tabla (aplicar el mismo patrón
--      a las 23 políticas identificadas, verificando con la query de auditoría).

-- ── 1) Auditoría: políticas que aún usan auth.uid() directamente ─────────────
-- SELECT schemaname, tablename, policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND (qual ILIKE '%auth.uid()%' OR with_check ILIKE '%auth.uid()%')
-- ORDER BY tablename, policyname;

-- ── 2) Reescrituras canónicas (usar para cada política del reporte) ─────────

-- profiles: leer su propio perfil
ALTER POLICY "Users can view own profile" ON public.profiles
  USING ((SELECT auth.uid()) = id);

-- invitations: admins pueden todo
ALTER POLICY "Admins can *" ON public.invitations
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- modules / lessons: lectura para authenticated (ver REQ-PERF-003 para la
-- consolidación de SELECTs); escritura admin con profiles.role.
ALTER POLICY "Ver Modulos (Todos)" ON public.modules
  USING ((SELECT auth.uid()) IS NOT NULL);

ALTER POLICY "Ver Lecciones (Todos)" ON public.lessons
  USING ((SELECT auth.uid()) IS NOT NULL);

-- lesson_progress: estudiante ve/edita su propio progreso
ALTER POLICY "Estudiantes ven su progreso" ON public.lesson_progress
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- submissions: estudiante ve sus prácticas (ver REQ-PERF-003 para la
-- consolidación con "Staff ve todo").
ALTER POLICY "Estudiantes ven sus practicas" ON public.submissions
  USING (student_id = (SELECT auth.uid()));

-- crm_leads: owner y admin (ver REQ-PERF-003 para la consolidación).
ALTER POLICY "crm_leads_owner_select" ON public.crm_leads
  USING (profile_id = (SELECT auth.uid()));

-- Verificación: Supabase advisor `auth_rls_initplan` = 0 hallazgos.