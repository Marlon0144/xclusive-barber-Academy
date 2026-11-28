import { permanentRedirect } from 'next/navigation'

// Ruta legacy de registro (REQ-FUNC-001/005 — Opción A: deprecar).
// La única ruta de registro es `/apply`. Esta página solo emite un redirect
// permanente (308) para no romper enlaces guardados ni indexados previamente.
export default function SignupPage() {
  permanentRedirect('/apply')
}