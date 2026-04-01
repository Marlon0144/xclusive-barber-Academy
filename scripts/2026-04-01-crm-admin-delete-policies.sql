-- CRM admin delete policy hardening
-- Date: 2026-04-01
-- Goal: guarantee admin-only DELETE permissions for crm_leads and crm_lead_answers.

BEGIN;

ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_lead_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS crm_leads_admin_delete ON public.crm_leads;
CREATE POLICY crm_leads_admin_delete
  ON public.crm_leads
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'::public.user_role
    )
  );

DROP POLICY IF EXISTS crm_lead_answers_admin_delete ON public.crm_lead_answers;
CREATE POLICY crm_lead_answers_admin_delete
  ON public.crm_lead_answers
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'::public.user_role
    )
  );

COMMIT;
