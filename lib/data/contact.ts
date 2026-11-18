/**
 * Verified business contact facts, shared by new code (schema.org, footer,
 * thank-you page, WhatsApp links). Older components still hold their own copy
 * of the WhatsApp number — keep them in sync if it ever changes.
 */

/** WhatsApp / phone number in wa.me format (no "+"). */
export const WHATSAPP_NUMBER = '61413891977'
export const PHONE_E164 = '+61413891977'

export const INSTAGRAM_URL = 'https://www.instagram.com/xclusiveacademy_au'

/** Training happens inside the existing Xclusive Barber shop (confirmed by the owner, 2026-11-18). */
export const ACADEMY_VENUE_NAME = 'Xclusive Barber Coburg'
export const ACADEMY_ADDRESS = {
  streetAddress: '112 Bell St',
  addressLocality: 'Coburg',
  addressRegion: 'VIC',
  postalCode: '3058',
  addressCountry: 'AU',
} as const

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
