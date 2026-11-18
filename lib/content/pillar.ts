/**
 * Long-form copy for the pillar pages (Spanish, English, Portuguese) and the
 * Spanish guide.
 *
 * Keyword policy (docs/SEO_AND_ADS_PLAYBOOK.md): one search intent per page,
 * keywords used naturally in the H1, the first paragraph, one H2 and an image
 * alt — never stuffed. LEGAL: private, non-accredited training (see
 * lib/seo/page-meta.ts). Testimonials are intentionally absent until real ones
 * are supplied: inventing them is not an option.
 */

import type { FaqItem } from '@/lib/seo/organization-schema'
import { faqEn, faqEs, faqPt } from './faq'

export type ContentSection = {
  heading: string
  paragraphs?: readonly string[]
  bullets?: readonly string[]
}

export type PageContent = {
  /** Site-relative URL of this page. */
  path: string
  h1: string
  /** First paragraphs under the H1 (primary keywords live here). */
  lead: readonly string[]
  sections: readonly ContentSection[]
  /** Renders the 4-program comparison table (names/prices come from the dictionary). */
  programsTable?: { heading: string; intro: string; columns: readonly [string, string, string, string]; linkLabel: string }
  faq?: { heading: string; items: readonly FaqItem[] }
  cta: { heading: string; text: string; apply: string; whatsapp: string }
  imageAlt: string
  breadcrumbName: string
  /** Overrides the breadcrumb "home" label (the Portuguese page keeps Spanish chrome otherwise). */
  homeLabel?: string
  /** The shared differentiators bar only exists in es/en; pages in other languages list them inline. */
  hideDifferentiators?: boolean
  /** Related internal links shown at the bottom. */
  related?: { heading: string; links: readonly { href: string; label: string }[] }
}

export const pillarEs: PageContent = {
  path: '/curso-barberia-melbourne',
  h1: 'Curso de barbería en Melbourne, en español',
  lead: [
    'Xclusive Barber Academy es una academia de barbería en Melbourne que enseña dentro de una barbería real en funcionamiento, en Coburg. Si buscas una escuela de barberos en Melbourne donde aprender en español, aquí practicas con clientes reales desde el primer día de taller.',
    'Es un curso de barbería en español en Australia pensado para llevarte de cero a profesional: 80 % práctica, 20 % teoría, y además aprendes cómo conseguir y mantener clientes.',
  ],
  sections: [
    {
      heading: 'Qué aprendes en el curso de barbero profesional',
      paragraphs: [
        'El Programa Profesional Xclusive dura 12 semanas y está organizado por módulos, con alrededor de 100 horas de práctica. Trabajas con técnicas reales y con clientes dentro de la barbería.',
      ],
      bullets: [
        'Higiene de la barbería',
        'Fades (degradados), tijera, barba y estilos modernos',
        'Práctica con clientes reales',
        'Kit profesional + uniforme',
        'Certificado de finalización de Xclusive Academy',
      ],
    },
    {
      heading: 'Cómo son las clases',
      paragraphs: [
        'Las clases son presenciales, dentro de Xclusive Barber Coburg. Enseñamos en español y también en inglés, en grupos pequeños, y ofrecemos mentoría 1 a 1 si quieres corregir tu técnica más rápido.',
        'Cada grupo es distinto, así que los horarios y las fechas se confirman cuando aplicas: te los enviamos por WhatsApp.',
      ],
    },
    {
      heading: 'Dónde estamos',
      paragraphs: [
        'Xclusive Barber Coburg: 112 Bell St, Coburg VIC 3058, Melbourne. Es una barbería real, con clientes reales, y ahí es donde aprendes.',
      ],
    },
  ],
  programsTable: {
    heading: 'Compara los programas',
    intro:
      'Elige según dónde estás hoy: probar la barbería, formarte desde cero, mejorar tu técnica o aprender a llenar tu agenda.',
    columns: ['Programa', 'Formato', 'Precio (AUD)', 'Más información'],
    linkLabel: 'Ver programa',
  },
  faq: { heading: 'Preguntas frecuentes', items: faqEs },
  cta: {
    heading: '¿Listo para dar el siguiente paso?',
    text: 'Completa tu solicitud en 2 minutos. Te escribimos por WhatsApp en menos de 24 h.',
    apply: 'Aplicar ahora',
    whatsapp: 'Escribir por WhatsApp',
  },
  imageAlt:
    'Interior de Xclusive Barber Coburg, la barbería real donde se dan las clases: techo hexagonal de luces LED, pared de ladrillo verde y sillones de barbero',
  breadcrumbName: 'Curso de barbería en Melbourne',
  related: {
    heading: 'Sigue leyendo',
    links: [
      { href: '/como-ser-barbero-en-australia', label: 'Cómo ser barbero en Australia: guía práctica' },
      { href: '/courses', label: 'Todos los programas' },
      { href: '/en/barber-course-melbourne', label: 'English version' },
      { href: '/pt/curso-de-barbeiro-melbourne', label: 'Versão em português' },
    ],
  },
}

export const pillarEn: PageContent = {
  path: '/en/barber-course-melbourne',
  h1: 'Barber course in Melbourne',
  lead: [
    'Xclusive Barber Academy is a barber academy in Melbourne that teaches inside a real, working barbershop in Coburg. If you are looking for a barber course in Melbourne where you practise on real clients from day one, this is it.',
    'It is a beginner-friendly barber course designed to take you from zero to professional: 80% practice, 20% theory — and you also learn how to win and keep clients. Classes are taught in Spanish and English.',
  ],
  sections: [
    {
      heading: 'What you learn in the professional barber program',
      paragraphs: [
        'The Professional Xclusive Program runs for 12 weeks, is organised in modules and includes around 100 hours of hands-on practice. You work with real techniques and real clients inside the barbershop.',
      ],
      bullets: [
        'Barbershop hygiene',
        'Fades, scissor work, beards and modern styles',
        'Practice on real clients',
        'Professional kit + uniform',
        'Xclusive Academy certificate of completion',
      ],
    },
    {
      heading: 'What the classes are like',
      paragraphs: [
        'Classes are in person, inside Xclusive Barber Coburg. We teach in Spanish and in English, in small groups, and offer 1-on-1 mentoring if you want to fix your technique faster.',
        'Every group is different, so schedules and start dates are confirmed when you apply — we send them to you on WhatsApp.',
      ],
    },
    {
      heading: 'Where to find us',
      paragraphs: [
        'Xclusive Barber Coburg: 112 Bell St, Coburg VIC 3058, Melbourne. It is a real barbershop with real clients, and that is where you learn.',
      ],
    },
  ],
  programsTable: {
    heading: 'Compare the programs',
    intro:
      'Pick based on where you are today: try barbering, train from zero, improve your technique, or learn how to fill your book.',
    columns: ['Program', 'Format', 'Price (AUD)', 'More information'],
    linkLabel: 'View program',
  },
  faq: { heading: 'Frequently asked questions', items: faqEn },
  cta: {
    heading: 'Ready for the next step?',
    text: "Complete your application in 2 minutes. We'll message you on WhatsApp within 24 hours.",
    apply: 'Apply now',
    whatsapp: 'Message us on WhatsApp',
  },
  imageAlt:
    'Inside Xclusive Barber Coburg, the real barbershop where classes are held: hexagonal LED ceiling, green brick wall and barber chairs',
  breadcrumbName: 'Barber course in Melbourne',
  related: {
    heading: 'Keep reading',
    links: [
      { href: '/en/courses', label: 'All programs' },
      { href: '/curso-barberia-melbourne', label: 'Versión en español' },
      { href: '/pt/curso-de-barbeiro-melbourne', label: 'Versão em português' },
    ],
  },
}

export const pillarPt: PageContent = {
  path: '/pt/curso-de-barbeiro-melbourne',
  h1: 'Curso de barbeiro em Melbourne',
  lead: [
    'A Xclusive Barber Academy é uma escola de barbeiros em Melbourne que ensina dentro de uma barbearia de verdade, em Coburg. Se você procura um curso de barbeiro em Melbourne e quer aprender a ser barbeiro na Austrália com muita prática, esta é a sua opção.',
    'São 80% de prática com clientes reais e 20% de teoria, do zero ao profissional, e você também aprende a conseguir clientes.',
  ],
  sections: [
    {
      heading: 'Por que a Xclusive Academy',
      bullets: [
        'Dentro de uma barbearia de verdade em funcionamento (Xclusive Barber Coburg)',
        '80% prática, com clientes reais',
        'Aulas em espanhol e inglês',
        'Grupos pequenos + opção 1 a 1',
        'Do zero ao profissional, e também como conseguir clientes',
      ],
    },
    {
      heading: 'Em que idioma são as aulas',
      paragraphs: [
        'As aulas são em espanhol e em inglês — não em português. Se você entende espanhol básico ou inglês, escreva para nós pelo WhatsApp antes de aplicar e conversamos sobre o seu caso.',
      ],
    },
    {
      heading: 'O que você aprende',
      paragraphs: [
        'O Programa Profissional dura 12 semanas e tem cerca de 100 horas de prática, organizado em módulos.',
      ],
      bullets: [
        'Higiene da barbearia',
        'Fades (degradê), tesoura, barba e estilos modernos',
        'Prática com clientes reais',
        'Kit profissional + uniforme',
      ],
    },
    {
      heading: 'Onde fica',
      paragraphs: ['Xclusive Barber Coburg: 112 Bell St, Coburg VIC 3058, Melbourne.'],
    },
  ],
  faq: { heading: 'Perguntas frequentes', items: faqPt },
  cta: {
    heading: 'Pronto para o próximo passo?',
    text: 'O formulário de solicitação está em espanhol e leva 2 minutos. Respondemos pelo WhatsApp em menos de 24 horas.',
    apply: 'Aplicar agora',
    whatsapp: 'Falar pelo WhatsApp',
  },
  imageAlt:
    'Interior da Xclusive Barber Coburg, a barbearia de verdade onde são as aulas: teto hexagonal de luzes LED, parede de tijolo verde e cadeiras de barbeiro',
  breadcrumbName: 'Curso de barbeiro em Melbourne',
  homeLabel: 'Início',
  hideDifferentiators: true,
  related: {
    heading: 'Veja também',
    links: [
      { href: '/curso-barberia-melbourne', label: 'Versión en español' },
      { href: '/en/barber-course-melbourne', label: 'English version' },
    ],
  },
}

export const guideEs: PageContent = {
  path: '/como-ser-barbero-en-australia',
  h1: 'Cómo ser barbero en Australia: guía práctica',
  lead: [
    'Si quieres trabajar como barbero en Australia, el camino es menos misterioso de lo que parece: aprender con método, practicar mucho, mostrar tu trabajo y conseguir tus primeros clientes. Esta guía resume cada paso, sin humo.',
  ],
  sections: [
    {
      heading: '1. Aprende con método y práctica real',
      paragraphs: [
        'Ver videos ayuda, pero cortar pelo se aprende cortando. Busca una formación donde practiques con clientes reales y recibas corrección en vivo: es lo que más acelera tu técnica, sobre todo en fades, tijera y barba.',
      ],
    },
    {
      heading: '2. Practica hasta tener criterio',
      paragraphs: [
        'Repite los fundamentos hasta que salgan sin pensar: guardas, transiciones, líneas limpias y simetría. La velocidad llega después de la limpieza, no antes.',
      ],
      bullets: [
        'Haz sesiones cortas y frecuentes en lugar de maratones ocasionales',
        'Pide feedback a barberos con más experiencia',
        'Anota qué corrección se repite y trabájala a propósito',
      ],
    },
    {
      heading: '3. Cuida la higiene y la seguridad',
      paragraphs: [
        'Desinfecta herramientas entre clientes, mantén limpio tu puesto y aprende a manejar la navaja con cuidado. La confianza de un cliente empieza por ver un puesto impecable.',
      ],
    },
    {
      heading: '4. Arma tu portafolio',
      paragraphs: [
        'Tu portafolio es tu currículum. Fotografía cada trabajo con buena luz, desde varios ángulos (frente, lado y nuca), y pide permiso al cliente antes de publicarlo.',
      ],
      bullets: [
        'Muestra variedad: fades, tijera, barba y diseños',
        'Prefiere pocas fotos buenas a muchas mediocres',
        'Guarda un antes y un después cuando el cambio sea claro',
      ],
    },
    {
      heading: '5. Construye tu presencia online',
      paragraphs: [
        'Un perfil de Instagram ordenado y una ficha de Google con fotos y reseñas reales hacen que te encuentren. Deja claro dónde trabajas, qué servicios ofreces y cómo reservar.',
      ],
    },
    {
      heading: '6. Consigue tus primeros clientes',
      paragraphs: [
        'Empieza por tu círculo cercano y por modelos que quieran un buen corte. Cobra precios claros, cumple los horarios y pide a cada cliente satisfecho que te recomiende: el boca a boca sigue siendo lo que más llena una agenda.',
      ],
    },
    {
      heading: '7. Elige tu camino',
      paragraphs: [
        'Puedes trabajar como empleado en una barbería, alquilar una silla o, más adelante, abrir la tuya. Cada opción cambia tus ingresos, tu libertad y tus riesgos: empieza por la que te permita aprender más rápido y ganar experiencia real.',
        'Antes de dar el paso por tu cuenta, revisa con tu asesor o con tu ayuntamiento los permisos y seguros que apliquen a tu caso.',
      ],
    },
  ],
  cta: {
    heading: 'Empieza con práctica real',
    text: 'En Xclusive Academy aprendes dentro de una barbería real, en español y en inglés. Aplica en 2 minutos y te escribimos por WhatsApp en menos de 24 h.',
    apply: 'Aplicar ahora',
    whatsapp: 'Escribir por WhatsApp',
  },
  imageAlt:
    'Interior de Xclusive Barber Coburg, una barbería en Melbourne: pared de ladrillo verde, luces LED hexagonales y sillones de barbero',
  breadcrumbName: 'Cómo ser barbero en Australia',
  related: {
    heading: 'Programas relacionados',
    links: [
      { href: '/courses/profesional', label: 'Programa Profesional de 12 semanas' },
      { href: '/courses/business', label: 'Barber Business: cómo llenar tu agenda' },
      { href: '/curso-barberia-melbourne', label: 'Curso de barbería en Melbourne' },
    ],
  },
}
