/**
 * Analytics event taxonomy for the marketing site + CRM funnel.
 *
 * Keep this list in sync with docs/ANALYTICS_TRACKING_PLAN.md. Adding a new
 * touchpoint should mean: add the name here, add the param shape, then call
 * track() at the call site — nothing else needs to change.
 */

export type AnalyticsEventName =
  // Stage 1 → 2: landing page phone/email capture (PhoneLeadCaptureForm)
  | 'lead_capture_success'
  // Stage 3 → 4: invite-code gated application form (ApplyForm)
  | 'application_submit'
  // Outbound contact touchpoints (PricingSection, DashboardFooter, FinalCtaSection)
  | 'whatsapp_click'
  | 'instagram_click'
  // Pricing plan CTA → /qualify wizard
  | 'pricing_plan_select'
  // Final CTA section → /apply
  | 'apply_click'

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>
