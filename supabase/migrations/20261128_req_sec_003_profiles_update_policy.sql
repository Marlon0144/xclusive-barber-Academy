-- ============================================================================
-- REQ-SEC-003 — Política UPDATE para la tabla `profiles`
-- ============================================================================
-- Habilita que un usuario autenticado actualice SU PROPIO perfil
-- (full_name, avatar_url) sin Admin client. Nadie puede modificar perfiles
-- ajenos porque `USING`/`WITH CHECK` restringen a `id = auth.uid()`.

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

-- Verificación (Test):
--   1. Como alumno: UPDATE profiles SET full_name='Nuevo' WHERE id = auth.uid() → OK
--   2. Como alumno: UPDATE profiles SET role='admin' WHERE id = auth.uid()   → DENEGADO
--      (solo se permite a través del Admin client / gestión de usuarios)
--   3. Como alumno: UPDATE profiles SET full_name='X' WHERE id = <otro>      → DENEGADO (0 filas)