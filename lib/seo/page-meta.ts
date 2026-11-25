/**
 * Title / description / social metadata for every public marketing page.
 *
 * One table, one builder, so every page gets — consistently — an absolute
 * title (the brand is already inside it, hence NOT run through the layout's
 * `%s | Xclusive Barber Academy` template), a self-referencing canonical, the
 * hreflang set from lib/i18n/routes.ts, Open Graph and Twitter cards with the
 * real 1200×630 photo of the barbershop.
 *
 * Limits (enforced by tests/seo-page-meta.test.ts): title ≤ 60 chars,
 * description ≤ 155 chars.
 *
 * LEGAL: the Academy is private, NON-accredited training. Never write
 * "acreditado / certificado oficial / nationally recognised / Cert III / RTO /
 * visa / garantizado / #1 / el mejor" in any copy — the test scans for them.
 */

import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/config'
import { alternatesFor, normalizePathname } from '@/lib/i18n/routes'

export type PageMeta = { title: string; description: string }

export const OG_IMAGE_PATH = '/og/xclusive-barber-academy.jpg'

const OG_IMAGE_ALT = {
  es: 'Interior de Xclusive Barber Coburg: techo hexagonal de luces LED, pared de ladrillo verde y sillones de barbero',
  en: 'Inside Xclusive Barber Coburg: hexagonal LED ceiling lights, green brick wall and barber chairs',
  pt: 'Interior da Xclusive Barber Coburg: teto hexagonal de luzes LED, parede de tijolo verde e cadeiras de barbeiro',
} as const

export const PAGE_META: Record<string, PageMeta> = {
  // ── Español ──────────────────────────────────────────────────────────────
  '/': {
    title: 'Academia de Barbería en Melbourne · Xclusive Academy',
    description:
      'Aprende barbería en español dentro de una barbería real en Coburg. 80 % práctica con clientes reales. De cero a profesional. Aplica hoy.',
  },
  '/courses': {
    title: 'Programas de Barbería en Melbourne · Xclusive Academy',
    description:
      'Compara los 4 programas de Xclusive Academy en Coburg: Starter, Profesional, Mentoría Elite 1 a 1 y Barber Business. Clases en español.',
  },
  '/courses/starter': {
    title: 'Curso de Barbería para Principiantes Melbourne',
    description:
      '3 clases para empezar desde cero: herramientas, máquina, degradado básico. En español, en una barbería real de Coburg.',
  },
  '/courses/profesional': {
    title: 'Curso de Barbero Profesional 12 Semanas · Melbourne',
    description:
      'Programa de 12 semanas, ~100 h, 80 % práctica con clientes reales. Fades, tijera, barba y atención al cliente. En español.',
  },
  '/courses/elite': {
    title: 'Mentoría de Barbería 1 a 1 · Fades y Técnica',
    description:
      'Mentoría personalizada para barberos: corrección en vivo de tus fades, velocidad y acabados. Plan de mejora a tu medida.',
  },
  '/courses/business': {
    title: 'Cómo Abrir y Llenar tu Barbería · Barber Business',
    description:
      'Taller para barberos: precios, clientes, redes y marketing local para llenar tu agenda en Australia.',
  },
  '/aplicar': {
    title: 'Aplica a la Academia de Barbería · Xclusive Academy',
    description:
      'Completa tu solicitud en 2 minutos y te escribimos por WhatsApp en menos de 24 h. Barbería en español, en una barbería real de Coburg.',
  },
  '/aplicar/gracias': {
    title: 'Solicitud recibida · Xclusive Academy',
    description: 'Recibimos tu solicitud. Te escribimos por WhatsApp en menos de 24 h.',
  },
  '/curso-barberia-melbourne': {
    title: 'Curso de Barbería en Melbourne · Xclusive Academy',
    description:
      'Qué aprendes, cómo son las clases y cómo aplicar. Curso de barbería en español en Coburg: 80 % práctica con clientes reales, de cero a profesional.',
  },
  '/como-ser-barbero-en-australia': {
    title: 'Cómo Ser Barbero en Australia · Guía Práctica',
    description:
      'Pasos para trabajar de barbero en Australia: practicar con método, armar tu portafolio y conseguir tus primeros clientes.',
  },

  // ── English ──────────────────────────────────────────────────────────────
  '/en': {
    title: 'Barber Academy Melbourne · Xclusive Academy',
    description:
      'Hands-on barber training inside a real Coburg barbershop. 80% practice on real clients. Taught in Spanish and English. Apply now.',
  },
  '/en/courses': {
    title: 'Barber Training Programs Melbourne · Xclusive Academy',
    description:
      'Compare the 4 Xclusive Academy programs in Coburg: Starter, Professional, 1-on-1 Elite Mentorship and Barber Business. Taught in Spanish and English.',
  },
  '/en/courses/starter': {
    title: 'Beginner Barber Course Melbourne · Xclusive Academy',
    description:
      '3 hands-on classes to start from zero: tools, clippers and a basic fade. Inside a real Coburg barbershop, taught in Spanish and English.',
  },
  '/en/courses/professional': {
    title: '12-Week Barber Course Melbourne · Xclusive Academy',
    description:
      '12-week hands-on barber program, ~100 hours, real clients, fades, scissor work and beard. Small groups in Coburg.',
  },
  '/en/courses/elite': {
    title: '1-on-1 Barber Mentorship Melbourne · Fade Training',
    description:
      'Personalised mentorship for barbers: live correction of your fades, speed and finishing. A tailored improvement plan.',
  },
  '/en/courses/business': {
    title: 'How to Open and Fill a Barbershop · Barber Business',
    description:
      'Workshop for barbers: pricing, clients, social media and local marketing to fill your book in Australia.',
  },
  '/en/apply-now': {
    title: 'Apply to the Barber Academy · Xclusive Academy',
    description:
      "Complete your application in 2 minutes and we'll message you on WhatsApp within 24 hours. Barber training inside a real Coburg barbershop.",
  },
  '/en/apply-now/thank-you': {
    title: 'Application received · Xclusive Academy',
    description: "We got your application. We'll message you on WhatsApp within 24 hours.",
  },
  '/en/barber-course-melbourne': {
    title: 'Barber Course Melbourne · Xclusive Academy',
    description:
      'What you learn, how classes work and how to apply. Hands-on barber course in Coburg: 80% practice on real clients, from zero to professional.',
  },

  // ── Português ────────────────────────────────────────────────────────────
  '/pt/curso-de-barbeiro-melbourne': {
    title: 'Curso de Barbeiro em Melbourne · Xclusive Academy',
    description:
      'Curso de barbeiro em Melbourne: 80% prática com clientes reais, dentro de uma barbearia em Coburg. Aulas em espanhol e inglês.',
  },
}

/**
 * /apply is the invite-code registration for already-accepted students. It has no
 * language-specific URL (the language is the visitor's preference), so its metadata
 * is chosen by language instead of by path.
 */
export const APPLY_META: Record<Language, PageMeta> = {
  es: {
    title: 'Registro con código de invitación · Xclusive Academy',
    description:
      'Crea tu cuenta de alumno con tu código de invitación. ¿Aún no aplicaste? Envía tu solicitud en 2 minutos y te escribimos por WhatsApp.',
  },
  en: {
    title: 'Join with Your Invitation Code · Xclusive Academy',
    description:
      "Create your student account with your invitation code. Haven't applied yet? Send your application in 2 minutes and we'll message you on WhatsApp.",
  },
}

export function buildApplyMetadata(language: Language): Metadata {
  const meta = APPLY_META[language]
  const { og, imageAlt } = localeFor(language === 'en' ? '/en' : '/')
  const image = { url: OG_IMAGE_PATH, width: 1200, height: 630, alt: imageAlt }

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: { canonical: '/apply' },
    openGraph: {
      type: 'website',
      siteName: 'Xclusive Barber Academy',
      locale: og,
      title: meta.title,
      description: meta.description,
      url: '/apply',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [{ url: OG_IMAGE_PATH, alt: imageAlt }],
    },
  }
}

const NOINDEX_PATHS = new Set<string>(['/aplicar/gracias', '/en/apply-now/thank-you'])

function localeFor(path: string): { og: string; imageAlt: string } {
  if (path === '/en' || path.startsWith('/en/')) return { og: 'en_AU', imageAlt: OG_IMAGE_ALT.en }
  if (path.startsWith('/pt/')) return { og: 'pt_AU', imageAlt: OG_IMAGE_ALT.pt }
  return { og: 'es_AU', imageAlt: OG_IMAGE_ALT.es }
}

/**
 * Next.js `Metadata` for a public page. Unknown paths return `{}` so a typo
 * can never ship a broken <head> — the unit test guards that every public path
 * has an entry.
 */
export function buildPageMetadata(pathname: string): Metadata {
  const path = normalizePathname(pathname)
  const meta = PAGE_META[path]
  if (!meta) return {}

  const { canonical, languages } = alternatesFor(path)
  const { og, imageAlt } = localeFor(path)
  const image = { url: OG_IMAGE_PATH, width: 1200, height: 630, alt: imageAlt }

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      siteName: 'Xclusive Barber Academy',
      locale: og,
      title: meta.title,
      description: meta.description,
      url: canonical,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [{ url: OG_IMAGE_PATH, alt: imageAlt }],
    },
    ...(NOINDEX_PATHS.has(path) ? { robots: { index: false, follow: true } } : {}),
  }
}
