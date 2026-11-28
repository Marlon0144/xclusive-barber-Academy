-- ============================================================================
-- REQ-DATA-002 — Conversión de CHECK constraints textuales a ENUMs nativos
-- ============================================================================
-- Impacto evaluado (criterio 1): `modules` y `lessons` tienen 0 filas;
-- `crm_leads` tiene 3 filas (estado 'new'/'contacted'). Migración segura.

-- ── 1) ENUMs nativos ─────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.competency_type AS ENUM (
    'desarrollo_tecnico',
    'aplicacion_estandares',
    'atencion_cliente',
    'mentalidad_profesional'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.lead_status_type AS ENUM (
    'new',
    'contacted',
    'qualified',
    'lost',
    'converted'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── 2) Migrar columnas (3 pasos: add -> copy -> drop -> rename) ──────────────
ALTER TABLE public.modules
  ADD COLUMN competency_new public.competency_type;

UPDATE public.modules
  SET competency_new = competency::public.competency_type
  WHERE competency IS NOT NULL;

ALTER TABLE public.modules
  DROP COLUMN competency;

ALTER TABLE public.modules
  RENAME COLUMN competency_new TO competency;

ALTER TABLE public.crm_leads
  ADD COLUMN status_new public.lead_status_type;

UPDATE public.crm_leads
  SET status_new = status::public.lead_status_type
  WHERE status IS NOT NULL;

ALTER TABLE public.crm_leads
  DROP COLUMN status;

ALTER TABLE public.crm_leads
  RENAME COLUMN status_new TO status;

-- ── 3) Defaults (replicar el default original de cada columna) ───────────────
ALTER TABLE public.modules
  ALTER COLUMN competency SET DEFAULT 'desarrollo_tecnico'::public.competency_type;

ALTER TABLE public.crm_leads
  ALTER COLUMN status SET DEFAULT 'new'::public.lead_status_type;

-- Verificación: los tipos TypeScript en types/crm.ts (LeadStatus) y
-- types/progress.ts (CompetencyKey) reflejan los mismos valores.