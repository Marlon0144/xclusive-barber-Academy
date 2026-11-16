-- ============================================================================
-- Xclusive Barber Academy — Internacionalización de títulos de contenido
-- SRS: docs/specs/srs001.md (REQ-FUNC-007, REQ-FUNC-008, REQ-INST-001)
--
-- Propósito:
--   Agregar columnas traducidas al inglés para los títulos/descripciones de
--   módulos y lecciones. La columna base (title / description) conserva el
--   español como idioma de autoría; `*_en` es opcional (NULL permitido) y la
--   capa de UI resuelve el fallback al español cuando está ausente.
--
-- Fuera de alcance (diferido I2):
--   - lessons.content  (HTML rich-text del editor Tiptap)
--   - submissions.feedback_ai / cut_type / description
--   (ver REQ-ML-001 en la SRS)
--
-- Nota de verificación previa:
--   docs/DATABASE.md puede estar desactualizado respecto al esquema real (regla
--   de AGENTS.md: el código real prevalece). Confirmar antes de aplicar los
--   nombres exactos de columna de `modules` y `lessons` (order_index vs position).
-- ============================================================================

ALTER TABLE IF EXISTS public.modules
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS description_en text;

ALTER TABLE IF EXISTS public.lessons
  ADD COLUMN IF NOT EXISTS title_en text;

-- Idempotente: ADD COLUMN IF NOT EXISTS permite re-ejecución segura.
-- Las columnas son NULLables, por lo que no afecta filas existentes ni RLS.
