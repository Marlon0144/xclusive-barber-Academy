-- ============================================================================
-- REQ-SEC-001 — Unificar criterio de autorización RLS: usar `profiles.role`
-- ============================================================================
-- Las políticas admin de `modules` y `lessons` usaban `auth.jwt() ->
-- 'app_metadata' ->> 'role'` (manipulable por el cliente). Se reemplazan por
-- una consulta a `profiles.role` (fuente de verdad en BD).
--
-- Verificación: Supabase advisor / query
--   SELECT schemaname, tablename, policyname, qual
--   FROM pg_policies
--   WHERE schemaname = 'public'
--     AND (qual ILIKE '%auth.jwt()%' OR with_check ILIKE '%auth.jwt()%');
-- Debe devolver 0 filas.

-- Nótese que la expresión usa `(SELECT auth.uid())` (initPlan, REQ-PERF-002)
-- en lugar de `auth.uid()`.
ALTER POLICY "Gestionar Modulos (Admin)" ON public.modules
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

ALTER POLICY "Gestionar Lecciones (Admin)" ON public.lessons
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

-- Verificación de consistencia: la fuente de verdad única debe ser profiles.role
-- en TODAS las políticas de public (tablas submissions/crm_leads/invitations
-- ya la usan correctamente).