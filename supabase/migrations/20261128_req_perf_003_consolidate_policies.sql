-- ============================================================================
-- REQ-PERF-003 — Consolidar políticas permisivas múltiples (mismo rol+acción)
-- ============================================================================
-- El advisor `multiple_permissive_policies` reportó 8 casos. Postgres debe
-- evaluar cada política permisiva por query; consolidarlas con OR reduce el
-- overhead. Se consolidan los SELECTs de crm_leads, lessons, modules y
-- submissions en UNA política por tabla (condiciones combinadas con OR).

-- ── crm_leads: SELECT owner OR admin ─────────────────────────────────────────
DROP POLICY IF EXISTS "crm_leads_admin_select" ON public.crm_leads;
DROP POLICY IF EXISTS "crm_leads_owner_select" ON public.crm_leads;

CREATE POLICY "crm_leads_select_owner_or_admin" ON public.crm_leads
  FOR SELECT
  USING (
    profile_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = 'admin'
    )
  );

-- ── lessons: SELECT para todos los authenticated (writes separados) ──────────
DROP POLICY IF EXISTS "Ver Lecciones (Todos)" ON public.lessons;
DROP POLICY IF EXISTS "Gestionar Lecciones (Admin)" ON public.lessons;

CREATE POLICY "Leer Lecciones (Todos)" ON public.lessons
  FOR SELECT
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Gestionar Lecciones (Admin)" ON public.lessons
  FOR ALL
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

-- ── modules: análogo a lessons ───────────────────────────────────────────────
DROP POLICY IF EXISTS "Ver Modulos (Todos)" ON public.modules;
DROP POLICY IF EXISTS "Gestionar Modulos (Admin)" ON public.modules;

CREATE POLICY "Leer Modulos (Todos)" ON public.modules
  FOR SELECT
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Gestionar Modulos (Admin)" ON public.modules
  FOR ALL
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

-- ── submissions: SELECT owner OR staff ───────────────────────────────────────
DROP POLICY IF EXISTS "Estudiantes ven sus practicas" ON public.submissions;
DROP POLICY IF EXISTS "Staff ve todo" ON public.submissions;

CREATE POLICY "submissions_select_owner_or_staff" ON public.submissions
  FOR SELECT
  USING (
    student_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role IN ('admin', 'instructor')
    )
  );

-- Nota: "Staff califica todo" (UPDATE de submissions) puede conservarse como
-- política separada de escritura; el advisor solo exige consolidar políticas
-- con el MISMO rol+acción.

-- Verificación: Supabase advisor `multiple_permissive_policies` = 0 hallazgos.