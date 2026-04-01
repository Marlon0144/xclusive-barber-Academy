-- Pre-lead phone capture rollout
-- Date: 2026-04-01
-- Goal: enable crm_leads rows that start with phone only.

BEGIN;

ALTER TABLE public.crm_leads
  ALTER COLUMN full_name DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL;

-- Keep email unique when present. Postgres allows multiple NULL values
-- under a UNIQUE constraint, which is what we need for pre-leads.

CREATE UNIQUE INDEX IF NOT EXISTS crm_leads_phone_number_unique_idx
  ON public.crm_leads (phone_number)
  WHERE phone_number IS NOT NULL;

COMMIT;
