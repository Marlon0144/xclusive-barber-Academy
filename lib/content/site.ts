/**
 * Copy for the site-wide marketing chrome that isn't part of the legacy
 * dictionary (footer, mobile sticky CTA, differentiators, breadcrumbs).
 *
 * Typed as Record<Language, SiteCopy> so a missing translation is a compile
 * error. LEGAL: private, non-accredited training — see lib/seo/page-meta.ts for
 * the forbidden-word list (enforced by tests).
 */

import type { Language } from '@/lib/i18n/config'

export type SiteCopy = {
  differentiators: { heading: string; items: readonly string[] }
  stickyCta: { apply: string; whatsapp: string; whatsappMessage: string }
  footer: {
    programs: string
    guides: string
    contact: string
    pillarLabel: string
    guideLabel: string
    ptLabel: string
    addressLabel: string
    haveCode: string
    privateTraining: string
  }
  breadcrumbs: { home: string; courses: string }
  courseExtras: { learnMore: string; pillarCta: string }
}

export const siteCopy: Record<Language, SiteCopy> = {
  es: {
    differentiators: {
      heading: 'Por qué Xclusive Academy',
      items: [
        'Dentro de una barbería real en funcionamiento (Xclusive Barber Coburg)',
        '80 % práctica, con clientes reales',
        'Enseñado en español (y en inglés)',
        'Grupos pequeños + opción 1 a 1',
        'De cero a profesional, y además cómo conseguir clientes',
      ],
    },
    stickyCta: {
      apply: 'Aplica ahora',
      whatsapp: 'Escríbenos por WhatsApp',
      whatsappMessage: 'Hola equipo de Xclusive Barber Academy, quiero información sobre los cursos.',
    },
    footer: {
      programs: 'Programas',
      guides: 'Guías',
      contact: 'Contacto',
      pillarLabel: 'Curso de barbería en Melbourne',
      guideLabel: 'Cómo ser barbero en Australia',
      ptLabel: 'Curso de barbeiro em Melbourne (PT)',
      addressLabel: 'Dónde estamos',
      haveCode: 'Tengo un código de invitación',
      privateTraining: 'Formación privada y práctica de Xclusive Academy.',
    },
    breadcrumbs: { home: 'Inicio', courses: 'Cursos' },
    courseExtras: {
      learnMore: '¿Quieres saber cómo son las clases?',
      pillarCta: 'Conoce el curso de barbería en Melbourne',
    },
  },
  en: {
    differentiators: {
      heading: 'Why Xclusive Academy',
      items: [
        'Inside a real, working barbershop (Xclusive Barber Coburg)',
        '80% practice, on real clients',
        'Taught in Spanish (and English)',
        'Small groups + a 1-on-1 option',
        'From zero to professional — and how to win clients',
      ],
    },
    stickyCta: {
      apply: 'Apply now',
      whatsapp: 'Message us on WhatsApp',
      whatsappMessage: 'Hi Xclusive Barber Academy team, I would like information about the courses.',
    },
    footer: {
      programs: 'Programs',
      guides: 'Guides',
      contact: 'Contact',
      pillarLabel: 'Barber course in Melbourne',
      guideLabel: 'How to become a barber in Australia (ES)',
      ptLabel: 'Curso de barbeiro em Melbourne (PT)',
      addressLabel: 'Find us',
      haveCode: 'I have an invitation code',
      privateTraining: 'Private, hands-on training by Xclusive Academy.',
    },
    breadcrumbs: { home: 'Home', courses: 'Courses' },
    courseExtras: {
      learnMore: 'Want to know what the classes are like?',
      pillarCta: 'See the barber course in Melbourne',
    },
  },
}

export function getSiteCopy(language: Language): SiteCopy {
  return siteCopy[language]
}
