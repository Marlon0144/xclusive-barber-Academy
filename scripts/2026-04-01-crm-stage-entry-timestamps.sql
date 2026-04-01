-- Captura fecha de entrada por etapa CRM.

ALTER TABLE public.crm_leads
  ADD COLUMN IF NOT EXISTS stage1_entered_at timestamptz,
  ADD COLUMN IF NOT EXISTS stage2_entered_at timestamptz,
  ADD COLUMN IF NOT EXISTS stage3_entered_at timestamptz,
  ADD COLUMN IF NOT EXISTS stage4_entered_at timestamptz;
