-- ============================================================================
-- REQ-DATA-001 — Resolver columnas duplicadas de ordenamiento en `lessons`
-- ============================================================================
-- `lessons` tenía `order_index` (int4, default 0) y `position` (int2, default 0).
--
-- Verificación previa (criterio 1): `grep -r "\bposition\b" app/ lib/ utils/`
-- NO devuelve resultados — el código usa únicamente `order_index`
-- (reorderLessonsInModule en app/dashboard/admin/courses/actions.ts).
--
-- `position` era un artefacto sin uso → se elimina. La fuente de verdad de
-- ordenamiento pasa a ser exclusivamente `order_index`.

ALTER TABLE public.lessons
  DROP COLUMN IF EXISTS position;

-- Nota: `order_index` se documenta como NULLABLE con default 0 en DATABASE.md
-- (REQ-MAINT-001). No se altera su nulabilidad para no romper inserciones
-- existentes; el código siempre envía un valor explícito.

-- Verificación: `grep -r "\bposition\b" app/ lib/ utils/` = 0 resultados y
-- DATABASE.md refleja una única columna de ordenamiento.