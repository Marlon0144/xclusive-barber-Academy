-- Enlace opcional de invitacion a lead CRM especifico.

ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS lead_id uuid REFERENCES public.crm_leads(id) ON DELETE SET NULL;
