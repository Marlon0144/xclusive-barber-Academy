/**
 * Australian mobile number validation/normalisation for the application form
 * ("WhatsApp" field).
 *
 * Accepts the ways people actually type it — `0412 345 678`, `412345678`,
 * `+61 412 345 678`, `61412345678`, `0061 412 345 678` — and returns E.164
 * (`+61412345678`), or null when it isn't an Australian mobile (04xx xxx xxx).
 */
export function normalizeAuMobile(raw: string): string | null {
  // Keep digits and "+" only; a "+" anywhere but the start makes the number invalid below.
  let digits = raw.replace(/[^\d+]/g, '').replace(/^\+/, '')

  if (digits.startsWith('0061')) digits = digits.slice(2) // 0061… → 61… (international "00" prefix)

  if (digits.startsWith('61')) digits = digits.slice(2)
  else if (digits.startsWith('0')) digits = digits.slice(1)

  // National significant number of an AU mobile: 4 + 8 digits.
  return /^4\d{8}$/.test(digits) ? `+61${digits}` : null
}
