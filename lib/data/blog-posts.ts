/**
 * Blog content-gap articles (see docs from the SearchFit content-strategist
 * audit — Task #18). Each post is grounded only in facts that already exist
 * in lib/i18n/dictionaries.ts (program names, prices, formats, benefits) or
 * in verified copy already live on the site (organization-schema.ts,
 * instructor bio). No fabricated stats, testimonials, outcomes, or
 * accreditation claims — every program is described as issuing a private
 * certificate, never a government-accredited qualification.
 *
 * `publishedAt` is a real, static publish date (the day this article was
 * actually written and shipped) — not a `new Date()` stamped at build time.
 * That distinction matters: see the comment in app/sitemap.ts for why a
 * fabricated per-build date is worse than none, but a true historical
 * publish date is legitimate and useful for BlogPosting structured data.
 */

export type BlogBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'pricingTable' }

export type BlogCta = {
  label: string
  href: string
}

export type BlogPost = {
  slug: string
  language: 'en' | 'es'
  title: string
  description: string
  publishedAt: string
  body: BlogBlock[]
  ctas: BlogCta[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'how-to-become-a-barber-in-australia-without-an-apprenticeship',
    language: 'en',
    title: 'How to Become a Barber in Australia (Without an Apprenticeship)',
    description:
      'The two real paths into barbering in Australia — a TAFE apprenticeship or private, practical training — explained honestly, with no accreditation claims either way.',
    publishedAt: '2026-09-29',
    body: [
      {
        type: 'paragraph',
        text: "If you're researching how to become a barber in Australia, you've probably run into two very different answers: a multi-year TAFE apprenticeship, or a private, practical training course. Both are real, legitimate paths — they just lead to different outcomes, take different amounts of time, and cost money in different ways. It's worth understanding the difference before you commit to either.",
      },
      { type: 'heading', text: 'The apprenticeship route' },
      {
        type: 'paragraph',
        text: "The traditional path is a barbering apprenticeship through a Registered Training Organisation (RTO) or TAFE, working toward a nationally recognised qualification (a Certificate III in Barbering). This route usually combines paid on-the-job work at a wage with structured TAFE attendance, and typically takes a few years to complete. It's the right route if a government-accredited trade qualification is a requirement for what you want to do next.",
      },
      { type: 'heading', text: 'The private, practical training route' },
      {
        type: 'paragraph',
        text: "The other path is private, intensive training — learning the trade hands-on, outside the apprenticeship system. Xclusive Barber Academy's Professional Xclusive Program is an example: 12 weeks, about 80% practical and 20% theory, roughly 100 hours of hands-on practice, delivered inside a real, operating barbershop in Coburg, Melbourne. It's paid tuition rather than an apprentice wage, and it ends with a private certificate — not a government-accredited qualification. That distinction matters, and any private provider worth training with should be upfront about it.",
      },
      { type: 'heading', text: 'Which path suits you?' },
      {
        type: 'list',
        items: [
          "If a nationally recognised trade qualification is essential for your goals and you're comfortable with a multi-year timeline, the TAFE/apprenticeship route is the right one.",
          'If you want a faster, hands-on introduction to real barbering and are comfortable investing in tuition rather than earning an apprentice wage while you learn, a private program can get you working with real techniques much sooner.',
          "If you're not sure yet, a short, low-commitment taster (like a 3-class Starter Experience) is a lower-risk way to find out if barbering is for you before choosing either path.",
        ],
      },
      { type: 'heading', text: 'Before you commit to either path' },
      {
        type: 'paragraph',
        text: 'Whichever route you consider, ask directly: is the certificate awarded government-accredited or private? What is the full price, including anything not covered in the headline number? How many actual hands-on hours are included? A provider that answers those questions clearly, before you pay anything, is one worth trusting.',
      },
    ],
    ctas: [
      { label: 'See all four Xclusive Barber Academy programs', href: '/courses' },
      { label: 'Start with the Barber Starter Experience', href: '/courses/starter' },
    ],
  },
  {
    slug: 'how-much-does-it-cost-to-learn-barbering-in-melbourne',
    language: 'en',
    title: 'How Much Does It Cost to Learn Barbering in Melbourne?',
    description:
      'A transparent, current price breakdown of every Xclusive Barber Academy program in Coburg, Melbourne — what each one costs and what it includes.',
    publishedAt: '2026-09-29',
    body: [
      {
        type: 'paragraph',
        text: "Cost is one of the first real questions anyone has before committing to barber training, and it's a hard one to answer online in general — prices vary wildly between a short taster class, a full-time TAFE apprenticeship, and a private intensive program. Rather than give a vague answer, here's exactly what each Xclusive Barber Academy program costs today, and what's included in each one.",
      },
      { type: 'heading', text: 'Xclusive Barber Academy pricing' },
      { type: 'pricingTable' },
      { type: 'heading', text: "What's included at each price point" },
      {
        type: 'list',
        items: [
          'Barber Starter Experience — essential fundamentals, tool handling, guided first cuts, and direct feedback across 3 in-person classes. Built to answer one question: is this trade actually for you?',
          "Professional Xclusive Program — the full 12-week course: barbershop hygiene, fades, scissor work, beards, and modern styles, practice with real clients, a professional kit and uniform, and a private certificate on completion. Early-bird pricing applies before the standard rate.",
          'Elite Mentoring — 1-on-1, in-person: a personalised assessment, real-time technique correction, an improvement plan, and professional strategy for barbers who already cut hair and want to sharpen specific skills fast.',
          'Barber Business Experience — an in-person workshop on the business side of the trade: attracting clients, raising your prices, personal brand, and real-world business experience — not haircutting technique.',
        ],
      },
      { type: 'heading', text: 'How this compares to other paths' },
      {
        type: 'paragraph',
        text: "A TAFE apprenticeship typically has a different cost structure altogether — lower up-front tuition, but a multi-year time investment, usually at an apprentice wage rather than full pay. A private program like this one has the opposite trade-off: a real, published price now, in exchange for a much shorter timeline. Neither is automatically cheaper — it depends on how you value your time versus your up-front budget. Compare total cost and total time, not just the headline number, before deciding.",
      },
    ],
    ctas: [
      { label: 'Apply to the Academy', href: '/apply' },
      { label: 'Compare all four programs in detail', href: '/courses' },
    ],
  },
  {
    slug: 'one-on-one-mentoring-vs-group-training',
    language: 'en',
    title: '1-on-1 Mentoring vs. Group Training: Which Xclusive Program Fits You?',
    description:
      'Elite Mentoring or the Professional Xclusive Program? A straight comparison to help working barbers and beginners pick the right format.',
    publishedAt: '2026-09-29',
    body: [
      {
        type: 'paragraph',
        text: "Xclusive Barber Academy runs two very different training formats, and mixing them up leads people to the wrong program. Here's the real difference between 1-on-1 Elite Mentoring and the group-based Professional Xclusive Program, so you can pick the one that actually matches where you're starting from.",
      },
      { type: 'heading', text: 'Professional Xclusive Program — building the foundation' },
      {
        type: 'paragraph',
        text: 'This is a 12-week, in-person course (about 80% practical, 20% theory, roughly 100 hours hands-on) for people starting from zero or close to it. It covers barbershop hygiene, fades, scissor work, beards, and modern styles, with practice on real clients, a professional kit and uniform, and a private certificate at completion. It exists to build a complete skill set from the ground up.',
      },
      { type: 'heading', text: 'Elite Mentoring — sharpening what you already have' },
      {
        type: 'paragraph',
        text: "Elite Mentoring is 1-on-1, in-person training for barbers who already cut hair and want to improve fast: a personalised assessment, real-time technique correction, an improvement plan, and professional strategy. It's not a place to learn the basics — it's built for fixing specific mistakes and pushing an existing skill set to a higher level.",
      },
      { type: 'heading', text: 'Which one is right for you?' },
      {
        type: 'list',
        items: [
          "Never cut hair professionally before, or only just starting out? The Professional Xclusive Program builds the full foundation you don't have yet.",
          'Already working with clients but plateaued, or making avoidable mistakes? Elite Mentoring gives you direct, personalised correction instead of relearning things you already know.',
          "Not sure how much experience you actually have relative to either program? A short Barber Starter Experience class is a low-risk way to get an honest read before committing to either.",
        ],
      },
    ],
    ctas: [
      { label: 'See the Professional Xclusive Program', href: '/courses/profesional' },
      { label: 'See Elite Mentoring', href: '/courses/elite' },
    ],
  },
  {
    slug: 'how-to-get-more-clients-as-a-barber',
    language: 'en',
    title: 'How to Get More Barber Clients (Without Relying on Walk-Ins)',
    description:
      'Practical, honest ways barbers build a steady client base beyond walk-in traffic — personal brand, rebooking, and referrals.',
    publishedAt: '2026-09-29',
    body: [
      {
        type: 'paragraph',
        text: "Technical skill gets you a good haircut. It doesn't automatically get you a full book. A lot of barbers — including genuinely skilled ones — plateau because they've never been taught the business side of the chair. Here are the fundamentals that actually move the needle, without relying on luck or walk-in traffic.",
      },
      { type: 'heading', text: 'Rebook before the client leaves the chair' },
      {
        type: 'paragraph',
        text: "The single highest-leverage habit in barbering is asking for the next booking while the client is still in the chair, not hoping they remember to come back. A client who leaves with their next appointment already set is dramatically more likely to become a repeat client than one who leaves to \"book again sometime.\"",
      },
      { type: 'heading', text: 'Build a personal brand, not just a portfolio' },
      {
        type: 'paragraph',
        text: "Clients increasingly choose a specific barber, not just a barbershop. A consistent presence — clean before/after photos, a recognisable style, and showing up the same way every time — builds the kind of trust that makes someone travel across the suburb specifically for you, instead of walking into whichever shop is closest.",
      },
      { type: 'heading', text: 'Make referrals easy, not just hoped-for' },
      {
        type: 'paragraph',
        text: "Happy clients refer people naturally, but it happens far more often when you make it easy and worth their while — a simple, direct ask, or a small incentive for both sides. Waiting passively for word-of-mouth leaves a lot of growth on the table.",
      },
      { type: 'heading', text: "Know your numbers before you raise your prices" },
      {
        type: 'paragraph',
        text: "Raising prices without losing clients isn't guesswork — it's about understanding your actual demand (are you fully booked out days in advance?) before you make the call. Pricing, personal brand, and client retention are exactly the kind of practical, real-world skills covered in the Barber Business Experience workshop — the technical side of barbering and the business side of it are two different skill sets, and most training only teaches one.",
      },
    ],
    ctas: [{ label: 'See the Barber Business Experience workshop', href: '/courses/business' }],
  },
  {
    slug: 'starting-a-barbering-career-as-a-migrant-in-melbourne',
    language: 'en',
    title: 'Starting a Barbering Career as a Migrant in Melbourne: What Are Your Options?',
    description:
      "Practical considerations for migrants in Melbourne exploring barbering as a trade — skills, timelines, and training paths, honestly explained.",
    publishedAt: '2026-09-29',
    body: [
      {
        type: 'paragraph',
        text: 'Barbering is a trade that travels well — it depends on hands-on skill more than on language fluency or local qualifications from your country of origin, which is part of why it appeals to a lot of people rebuilding a career after moving to Australia. If you\'re a recent migrant in Melbourne considering it, here are the real, practical options and questions worth thinking through.',
      },
      { type: 'heading', text: 'Your training-path options are the same as anyone else\'s' },
      {
        type: 'paragraph',
        text: "There's no separate 'migrant pathway' into barbering — you're choosing between the same two broad routes as any local: a TAFE apprenticeship toward a nationally recognised Certificate III (a multi-year commitment, usually at an apprentice wage), or private, practical training that trades a shorter timeline for paid tuition and a private certificate rather than a government-accredited one. Whichever provider you're considering, ask directly which of the two it is — don't assume.",
      },
      { type: 'heading', text: 'What matters most in the early stage' },
      {
        type: 'list',
        items: [
          'How much hands-on practice time is actually included, versus theory — hands-on hours are what build real, employable skill.',
          'Whether the program trains you inside a real, operating barbershop environment, or only in a classroom setting disconnected from real client interactions.',
          "Whether the certificate you'll receive is what you think it is — private versus government-accredited changes what doors it opens.",
        ],
      },
      { type: 'heading', text: 'One example, for context' },
      {
        type: 'paragraph',
        text: "Xclusive Barber Academy was founded by Julian, himself a migrant, professional barber, and entrepreneur who built a career in Australia from the ground up. The Academy trains people from all backgrounds in Melbourne — migrants, including the Latino community specifically, are one part of who it serves, alongside anyone else in Melbourne wanting to learn the trade practically. It's one option among several, not the only path — the right choice depends on your own timeline, budget, and goals.",
      },
    ],
    ctas: [
      { label: 'See the Professional Xclusive Program', href: '/courses/profesional' },
      { label: 'Apply to the Academy', href: '/apply' },
    ],
  },
  {
    slug: 'como-aprender-barberia-en-melbourne-guia-practica',
    language: 'es',
    title: 'Cómo Aprender Barbería en Melbourne: Guía Práctica',
    description:
      'Guía honesta sobre cómo empezar en la barbería en Melbourne: las rutas reales de formación y cuánto cuesta cada programa de Xclusive Barber Academy.',
    publishedAt: '2026-09-29',
    body: [
      {
        type: 'paragraph',
        text: 'Si estás buscando cómo aprender barbería en Melbourne, seguramente ya te encontraste con dos caminos muy distintos: un aprendizaje (apprenticeship) de varios años a través de TAFE, o formación práctica privada más corta. Los dos son caminos reales — lo importante es entender la diferencia antes de comprometerte con cualquiera de los dos.',
      },
      { type: 'heading', text: 'La ruta de TAFE / apprenticeship' },
      {
        type: 'paragraph',
        text: 'Es la ruta tradicional: un aprendizaje con una institución registrada (RTO/TAFE) que lleva a una calificación reconocida a nivel nacional (Certificate III in Barbering). Normalmente combina trabajo pago con salario de aprendiz y asistencia estructurada a clases, y suele tomar varios años en completarse.',
      },
      { type: 'heading', text: 'La ruta de formación práctica privada' },
      {
        type: 'paragraph',
        text: 'La otra opción es formación privada e intensiva, fuera del sistema de aprendizaje formal. El Programa Profesional Xclusive de Xclusive Barber Academy es un ejemplo: 12 semanas, alrededor de 80% práctico y 20% teórico, cerca de 100 horas de práctica real, dentro de una barbería real y en funcionamiento en Coburg, Melbourne. Es matrícula paga (no un salario de aprendiz), y termina con un certificado privado — no una calificación acreditada por el gobierno. Esa diferencia es importante, y cualquier academia privada seria debe ser clara al respecto desde el principio.',
      },
      { type: 'heading', text: 'Cuánto cuesta cada programa de Xclusive Barber Academy' },
      { type: 'pricingTable' },
      { type: 'heading', text: '¿Qué camino te conviene?' },
      {
        type: 'list',
        items: [
          'Si necesitas una calificación reconocida a nivel nacional y no te molesta un proceso de varios años, la ruta de TAFE/apprenticeship es la indicada.',
          'Si buscas una introducción práctica y más rápida al oficio, y prefieres invertir en matrícula en vez de ganar un salario de aprendiz mientras aprendes, un programa privado te permite trabajar con técnicas reales mucho antes.',
          'Si todavía no estás seguro, la Experiencia Barber Starter (3 clases presenciales) es una forma de bajo riesgo para descubrir si la barbería es lo tuyo antes de elegir cualquiera de las dos rutas.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Xclusive Barber Academy nace de la experiencia directa de su fundador, Julian, como migrante, barbero profesional y emprendedor en Australia. La academia entrena a personas de Melbourne en general — la comunidad latina es parte importante de a quién sirve, pero no la única.',
      },
    ],
    ctas: [
      { label: 'Ver los cuatro programas', href: '/courses' },
      { label: 'Aplicar a la Academia', href: '/apply' },
    ],
  },
  {
    slug: 'beginner-vs-intermediate-barber-which-program',
    language: 'en',
    title: 'Beginner vs. Intermediate Barber: Which Xclusive Program Is Right for You?',
    description:
      'A decision guide to all four Xclusive Barber Academy programs, based on your actual starting skill level — from complete beginner to working barber.',
    publishedAt: '2026-09-29',
    body: [
      {
        type: 'paragraph',
        text: "Xclusive Barber Academy runs four programs, and they're built for four different starting points — not four difficulty levels of the same course. Picking the wrong one wastes time and money in either direction: too basic if you already have experience, or too advanced if you don't. Here's how to match your actual starting point to the right program.",
      },
      { type: 'heading', text: "Complete beginner, not sure barbering is for you" },
      {
        type: 'paragraph',
        text: 'Start with the Barber Starter Experience — 3 in-person classes covering essential fundamentals, tool handling, and guided first cuts, with direct feedback. It exists specifically to answer "is this actually for me?" before you invest in anything bigger.',
      },
      { type: 'heading', text: "Beginner, ready to commit to becoming a professional" },
      {
        type: 'paragraph',
        text: 'The Professional Xclusive Program is the full 12-week training — barbershop hygiene, fades, scissor work, beards, modern styles, practice with real clients, a professional kit and uniform, and a private certificate at the end. This is the program built to take someone from zero to job-ready technical skill.',
      },
      { type: 'heading', text: 'Already working as a barber, want to level up fast' },
      {
        type: 'paragraph',
        text: "Elite Mentoring is 1-on-1 training for barbers who already cut hair professionally: a personalised assessment, real-time correction, and a specific improvement plan. It's not for building foundational skills — it's for barbers who have them and want to refine specific weak points quickly.",
      },
      { type: 'heading', text: 'Already trained, want to earn more from the trade' },
      {
        type: 'paragraph',
        text: "The Barber Business Experience is a workshop on the business side of barbering — attracting clients, raising prices, personal brand — for barbers who already have the technical skill and want to grow their income from it, not learn to cut hair.",
      },
      {
        type: 'list',
        items: [
          'Never cut hair before → Barber Starter Experience',
          'Ready to train from scratch, full-time → Professional Xclusive Program',
          'Already a working barber, want fast correction → Elite Mentoring',
          'Already skilled, want to earn more → Barber Business Experience',
        ],
      },
    ],
    ctas: [{ label: 'See all four programs in detail', href: '/courses' }],
  },
]

export function getBlogPost(slug: string): BlogPost | null {
  return BLOG_POSTS.find((post) => post.slug === slug) ?? null
}

export const BLOG_SLUGS = BLOG_POSTS.map((post) => post.slug)
