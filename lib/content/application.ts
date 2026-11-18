/**
 * Copy for the short application form (/aplicar, /en/apply-now) and its
 * thank-you page, in Spanish and English. Typed as Record<Language, …> so a
 * missing translation is a compile error.
 *
 * LEGAL: private, non-accredited training — no accreditation/visa/guarantee
 * claims (enforced by tests/seo-legal-words.test.ts).
 */

import type { Language } from '@/lib/i18n/config'

export const COURSE_CHOICES = ['starter', 'profesional', 'elite', 'business', 'not_sure'] as const
export const EXPERIENCE_CHOICES = ['none', 'some', 'already_cuts'] as const
export const HOW_HEARD_CHOICES = ['instagram', 'facebook', 'google', 'tiktok', 'friend', 'other'] as const

export type CourseChoice = (typeof COURSE_CHOICES)[number]
export type ExperienceChoice = (typeof EXPERIENCE_CHOICES)[number]
export type HowHeardChoice = (typeof HOW_HEARD_CHOICES)[number]

type Option<T extends string> = { value: T; label: string }

export type ApplicationCopy = {
  page: {
    heading: string
    intro: string
    haveCodePrompt: string
    haveCodeLink: string
  }
  form: {
    fullName: string
    email: string
    whatsapp: string
    whatsappHint: string
    course: string
    coursePlaceholder: string
    courseOptions: readonly Option<CourseChoice>[]
    experience: string
    experiencePlaceholder: string
    experienceOptions: readonly Option<ExperienceChoice>[]
    suburb: string
    howHeard: string
    howHeardPlaceholder: string
    howHeardOptions: readonly Option<HowHeardChoice>[]
    consent: string
    submit: string
    submitting: string
  }
  errors: {
    rateLimited: string
    invalidName: string
    invalidEmail: string
    invalidPhone: string
    invalidSuburb: string
    invalidChoice: string
    consentRequired: string
    saveFailed: string
  }
  thanks: {
    heading: string
    text: string
    nextStep: string
    whatsappButton: string
    whatsappMessage: string
    programsLink: string
    homeLink: string
  }
}

export const applicationCopy: Record<Language, ApplicationCopy> = {
  es: {
    page: {
      heading: 'Aplica a la academia',
      intro: 'Completa tu solicitud en 2 minutos. Te escribimos por WhatsApp en menos de 24 h.',
      haveCodePrompt: '¿Ya te aceptamos y tienes un código de invitación?',
      haveCodeLink: 'Crea tu cuenta aquí',
    },
    form: {
      fullName: 'Nombre completo',
      email: 'Correo electrónico',
      whatsapp: 'WhatsApp',
      whatsappHint: 'Celular australiano, ej. 0412 345 678',
      course: 'Curso de interés',
      coursePlaceholder: 'Elige un curso',
      courseOptions: [
        { value: 'starter', label: 'Experiencia Barber Starter' },
        { value: 'profesional', label: 'Programa Profesional Xclusive (12 semanas)' },
        { value: 'elite', label: 'Mentoría Elite 1 a 1' },
        { value: 'business', label: 'Experiencia Barber Business' },
        { value: 'not_sure', label: 'Aún no estoy seguro/a' },
      ],
      experience: 'Tu experiencia',
      experiencePlaceholder: 'Elige una opción',
      experienceOptions: [
        { value: 'none', label: 'Ninguna' },
        { value: 'some', label: 'Algo' },
        { value: 'already_cuts', label: 'Ya corto pelo' },
      ],
      suburb: 'Suburbio donde vives',
      howHeard: '¿Cómo nos conociste?',
      howHeardPlaceholder: 'Elige una opción',
      howHeardOptions: [
        { value: 'instagram', label: 'Instagram' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'google', label: 'Google' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'friend', label: 'Un amigo o conocido' },
        { value: 'other', label: 'Otro' },
      ],
      consent:
        'Acepto que Xclusive Barber Academy me contacte por WhatsApp o email sobre mi solicitud y use mis datos solo para ese fin.',
      submit: 'Enviar solicitud',
      submitting: 'Enviando…',
    },
    errors: {
      rateLimited: 'Demasiados intentos. Inténtalo de nuevo en unos minutos.',
      invalidName: 'Escribe tu nombre completo.',
      invalidEmail: 'Escribe un correo electrónico válido.',
      invalidPhone: 'Escribe un celular australiano válido, por ejemplo 0412 345 678.',
      invalidSuburb: 'Escribe el suburbio donde vives.',
      invalidChoice: 'Revisa las opciones que elegiste.',
      consentRequired: 'Debes aceptar el consentimiento para enviar la solicitud.',
      saveFailed: 'No pudimos guardar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.',
    },
    thanks: {
      heading: '¡Recibimos tu solicitud!',
      text: 'Te escribimos por WhatsApp en menos de 24 h.',
      nextStep:
        'Revisaremos tu solicitud y te explicaremos los siguientes pasos: cursos disponibles, horarios y cupos.',
      whatsappButton: 'Escribir por WhatsApp ahora',
      whatsappMessage: 'Hola equipo de Xclusive Barber Academy, acabo de enviar mi solicitud.',
      programsLink: 'Mientras tanto, conoce los programas',
      homeLink: 'Volver al inicio',
    },
  },
  en: {
    page: {
      heading: 'Apply to the academy',
      intro: "Complete your application in 2 minutes. We'll message you on WhatsApp within 24 hours.",
      haveCodePrompt: 'Already accepted and have an invitation code?',
      haveCodeLink: 'Create your account here',
    },
    form: {
      fullName: 'Full name',
      email: 'Email address',
      whatsapp: 'WhatsApp',
      whatsappHint: 'Australian mobile, e.g. 0412 345 678',
      course: 'Course of interest',
      coursePlaceholder: 'Choose a course',
      courseOptions: [
        { value: 'starter', label: 'Barber Starter Experience' },
        { value: 'profesional', label: 'Professional Xclusive Program (12 weeks)' },
        { value: 'elite', label: '1-on-1 Elite Mentoring' },
        { value: 'business', label: 'Barber Business Experience' },
        { value: 'not_sure', label: "I'm not sure yet" },
      ],
      experience: 'Your experience',
      experiencePlaceholder: 'Choose an option',
      experienceOptions: [
        { value: 'none', label: 'None' },
        { value: 'some', label: 'Some' },
        { value: 'already_cuts', label: 'I already cut hair' },
      ],
      suburb: 'Suburb where you live',
      howHeard: 'How did you hear about us?',
      howHeardPlaceholder: 'Choose an option',
      howHeardOptions: [
        { value: 'instagram', label: 'Instagram' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'google', label: 'Google' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'friend', label: 'A friend or acquaintance' },
        { value: 'other', label: 'Other' },
      ],
      consent:
        'I agree that Xclusive Barber Academy may contact me by WhatsApp or email about my application and use my details only for that purpose.',
      submit: 'Send application',
      submitting: 'Sending…',
    },
    errors: {
      rateLimited: 'Too many attempts. Please try again in a few minutes.',
      invalidName: 'Enter your full name.',
      invalidEmail: 'Enter a valid email address.',
      invalidPhone: 'Enter a valid Australian mobile number, for example 0412 345 678.',
      invalidSuburb: 'Enter the suburb where you live.',
      invalidChoice: 'Please check the options you selected.',
      consentRequired: 'You must accept the consent to send your application.',
      saveFailed: "We couldn't save your application. Please try again or message us on WhatsApp.",
    },
    thanks: {
      heading: 'We got your application!',
      text: "We'll message you on WhatsApp within 24 hours.",
      nextStep:
        "We'll review your application and explain the next steps: available courses, schedules and spots.",
      whatsappButton: 'Message us on WhatsApp now',
      whatsappMessage: 'Hi Xclusive Barber Academy team, I just sent my application.',
      programsLink: 'In the meantime, explore the programs',
      homeLink: 'Back to home',
    },
  },
}

export function getApplicationCopy(language: Language): ApplicationCopy {
  return applicationCopy[language]
}
