/**
 * Hand-off between the application form and its thank-you page.
 *
 * The form can't report the conversion itself (it navigates away right after
 * success) and the thank-you page must not report on every visit/reload. So the
 * form parks the payload in sessionStorage under this key, and the thank-you
 * page consumes it exactly once (reads it, deletes it, reports it).
 */
export const PENDING_CONVERSION_KEY = 'xba_pending_conversion'
