/**
 * FAQ copy for the pillar pages (Spanish, English, Portuguese).
 *
 * Every answer states only facts confirmed by the owner (see
 * lib/data/contact.ts and docs/SEO_AND_ADS_PLAYBOOK.md). Group size and class
 * schedules are deliberately NOT quantified: no number was provided.
 *
 * The first question is the honest accreditation answer. It is the ONE place
 * where the words "acreditado / Cert III / RTO" legitimately appear — as a
 * disclosure that the course is NOT accredited. tests/seo-legal-words.test.ts
 * allows exactly this entry and nothing else.
 */

import type { FaqItem } from '@/lib/seo/organization-schema'

export const ACCREDITATION_FAQ_QUESTIONS = [
  '¿El curso es acreditado?',
  'Is the course accredited?',
  'O curso é credenciado?',
] as const

export const faqEs: readonly FaqItem[] = [
  {
    question: '¿El curso es acreditado?',
    answer:
      'Es formación privada y práctica de Xclusive Academy, enfocada en que cortes bien y consigas clientes. No es una cualificación nacional (Cert III). Si necesitas esa cualificación, debes hacerla con un RTO.',
  },
  {
    question: '¿Necesito experiencia?',
    answer:
      'No. El programa profesional te lleva de cero a profesional, y el Starter está pensado para descubrir si la barbería es lo tuyo antes de dar el siguiente paso.',
  },
  {
    question: '¿Las clases son en español?',
    answer: 'Sí. Enseñamos en español y también en inglés.',
  },
  {
    question: '¿Dónde son las clases?',
    answer:
      'Dentro de Xclusive Barber Coburg, una barbería real en funcionamiento: 112 Bell St, Coburg VIC 3058, Melbourne.',
  },
  {
    question: '¿Cuántos alumnos hay por grupo?',
    answer:
      'Trabajamos con grupos pequeños para que tengas atención personal, y también ofrecemos mentoría 1 a 1. El cupo de cada grupo te lo confirmamos al aplicar.',
  },
  {
    question: '¿Practico con clientes reales?',
    answer:
      'Sí. El Programa Profesional es 80 % práctica y 20 % teoría, y trabajas con clientes reales dentro de la barbería.',
  },
  {
    question: '¿Qué herramientas necesito?',
    answer:
      'El Programa Profesional incluye kit profesional y uniforme. Para los demás programas te indicamos qué llevar cuando confirmamos tu cupo.',
  },
  {
    question: '¿Cómo aplico?',
    answer:
      'Completa el formulario de solicitud (toma 2 minutos). Te escribimos por WhatsApp en menos de 24 horas para explicarte los siguientes pasos.',
  },
]

export const faqEn: readonly FaqItem[] = [
  {
    question: 'Is the course accredited?',
    answer:
      'It is private, hands-on training from Xclusive Academy, focused on helping you cut well and win clients. It is not a national qualification (Cert III). If you need that qualification, you must complete it with an RTO.',
  },
  {
    question: 'Do I need experience?',
    answer:
      'No. The professional program takes you from zero to professional, and the Starter is designed to find out whether barbering is right for you before taking the next step.',
  },
  {
    question: 'Are the classes taught in Spanish?',
    answer: 'Yes. We teach in Spanish and also in English.',
  },
  {
    question: 'Where are the classes held?',
    answer:
      'Inside Xclusive Barber Coburg, a real, working barbershop: 112 Bell St, Coburg VIC 3058, Melbourne.',
  },
  {
    question: 'How many students are in each group?',
    answer:
      'We work in small groups so you get personal attention, and we also offer 1-on-1 mentoring. We confirm the size of each group when you apply.',
  },
  {
    question: 'Do I practise on real clients?',
    answer:
      'Yes. The Professional Program is 80% practice and 20% theory, and you work on real clients inside the barbershop.',
  },
  {
    question: 'What tools do I need?',
    answer:
      'The Professional Program includes a professional kit and uniform. For the other programs, we tell you what to bring when we confirm your spot.',
  },
  {
    question: 'How do I apply?',
    answer:
      'Complete the application form (it takes 2 minutes). We message you on WhatsApp within 24 hours to explain the next steps.',
  },
]

export const faqPt: readonly FaqItem[] = [
  {
    question: 'O curso é credenciado?',
    answer:
      'É uma formação privada e prática da Xclusive Academy, focada em você cortar bem e conseguir clientes. Não é uma qualificação nacional (Cert III). Se você precisa dessa qualificação, deve fazê-la com uma RTO.',
  },
  {
    question: 'Em que idioma são as aulas?',
    answer:
      'As aulas são em espanhol e inglês, não em português. Se você tem dúvidas sobre o idioma, escreva para nós pelo WhatsApp antes de aplicar.',
  },
  {
    question: 'Preciso ter experiência?',
    answer:
      'Não. O programa profissional leva você do zero ao profissional, e o Starter serve para descobrir se a barbearia é para você.',
  },
]
