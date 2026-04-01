-- Elimina segmentacion legacy en CRM.
-- La priorizacion comercial ahora se gestiona por etapa + estado.

ALTER TABLE public.crm_leads
  DROP COLUMN IF EXISTS auto_segment,
  DROP COLUMN IF EXISTS admin_segment_override;
