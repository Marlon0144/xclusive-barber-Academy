const DIGITS_ONLY_REGEX = /\D/g

export type NormalizedPhoneResult = {
  value: string
  isValid: boolean
}

/**
 * Normaliza telefonos a un formato cercano a E.164.
 * Si no incluye +, asume prefijo +61 (AU) para mantener consistencia inicial del embudo.
 */
export function normalizePhoneNumber(rawPhone: string): NormalizedPhoneResult {
  const trimmed = rawPhone.trim()
  if (!trimmed) return { value: '', isValid: false }

  const hasPlusPrefix = trimmed.startsWith('+')
  const digits = trimmed.replace(DIGITS_ONLY_REGEX, '')

  if (digits.length < 8 || digits.length > 15) {
    return { value: '', isValid: false }
  }

  const normalized = hasPlusPrefix ? `+${digits}` : `+61${digits.replace(/^0+/, '')}`

  // Guard rail basico para evitar prefijos invalidos tras normalizacion.
  if (!/^\+[1-9]\d{7,14}$/.test(normalized)) {
    return { value: '', isValid: false }
  }

  return { value: normalized, isValid: true }
}
