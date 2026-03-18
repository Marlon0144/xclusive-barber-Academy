import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

/**
 * FeaturesSection
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MOBILE  (< md  |  ~506px canvas — Figma node 2116:66)
 * ─────────────────────────────────────────────────────────────────────────────
 * Canvas: w=506  h=397
 *
 *  bg image       → inset  object-cover object-top  opacity-[0.39]
 *
 *  heading        → top=35  Poppins Bold  centered
 *                   "FORMAMOS"       text-[44px]  leading-none
 *                   "PROFESIONALES"  text-[32px]  leading-none
 *
 *  recurso-texto1 → top=142  w=240  h=11   (MENTALIDAD PROFESIONAL)
 *  desc 1         → top=161  w=240  text-[10px]  leading-[1.3]
 *
 *  recurso-texto2 → top=225  w=247  h=13   (FORMACIÓN PRÁCTICA REAL)
 *  desc 2         → top=249  w=247  text-[10px]  leading-[1.3]
 *
 *  recurso-texto3 → top=313  w=288  h=12   (ENFOQUE EN CARRERA Y NEGOCIO)
 *  desc 3         → top=333  w=288  text-[10px]  leading-[1.3]
 *
 *  total h        → 397px
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DESKTOP (≥ md) — fluid scale preserving Figma proportions
 * ─────────────────────────────────────────────────────────────────────────────
 */

const features = [
  {
    recurso: "/assets/landing/landing_mentalidad.svg",
    alt: "Mentalidad Profesional",
    /* Figma mobile: w=240 h=11 on 506px canvas */
    figmaW: 240,
    figmaH: 11,
    /* Figma desktop (1440px): Recurso 10 w=822 h=37.7 */
    desktopW: 822,
    desktopH: 37.7,
    desc: "Disciplina, puntualidad, trato al cliente y presentación personal como parte del proceso.",
    top: { title: 142, desc: 161 },
    descW: 240,
  },
  {
    recurso: "/assets/landing/landing_formacion.svg",
    alt: "Formación Práctica Real",
    /* Figma mobile: w=247 h=13 on 506px canvas */
    figmaW: 247,
    figmaH: 13,
    /* Figma desktop (1440px): Recurso 9 w=836 h=45.6 */
    desktopW: 836,
    desktopH: 45.6,
    desc: "Aprendes haciendo, con corrección constante y estándares reales del mercado australiano.",
    top: { title: 225, desc: 249 },
    descW: 247,
  },
  {
    recurso: "/assets/landing/landing_enfoque.svg",
    alt: "Enfoque en Carrera y Negocio",
    /* Figma mobile: w=288 h=12 on 506px canvas */
    figmaW: 288,
    figmaH: 12,
    /* Figma desktop (1440px): Recurso 11 w=972 h=42.2 */
    desktopW: 972,
    desktopH: 42.2,
    desc: "No solo técnica: preparación para el mundo laboral y bases de mentalidad emprendedora.",
    top: { title: 313, desc: 333 },
    descW: 288,
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative w-full bg-[#161616]">

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT  (< md)
          Fixed-height canvas: 397px matching Figma frame exactly
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden relative h-[397px] overflow-hidden">

        {/* ── 1. Background image ──────────────────────────────────────────── */}
        {/*
         * Figma: left=0 top=0 w=506 h=397  opacity-[0.39]
         * h-[258.86%] vertical overflow in Figma → object-cover object-top
         */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/assets/landing/FeatureSection/bg.png"
            alt=""
            fill
            priority
            className="object-cover object-top"
            sizes="506px"
          />
        </div>

        {/* ── 2. Heading ───────────────────────────────────────────────────── */}
        {/*
         * Figma: top=35  Poppins Bold  centered  tracking-[1.44px]
         *   "FORMAMOS"       text-[44px]  leading-none
         *   "PROFESIONALES"  text-[32px]  leading-none
         */}
        <div className="absolute top-[35px] inset-x-0 z-10 text-center leading-none tracking-[0.033em]">
          <p className="font-sans font-bold uppercase text-[#d3cbba] text-[44px] leading-none">
            FORMAMOS
          </p>
          <p className="font-sans font-bold uppercase text-[#d3cbba] text-[32px] leading-none">
            PROFESIONALES
          </p>
        </div>

        {/* ── 3. Feature 1 — MENTALIDAD PROFESIONAL ────────────────────────── */}
        {/*
         * Figma: recurso-texto1  top=142  w=240  h=11
         * desc:                  top=161  w=240  text-[10px]
         */}
        <div
          className="absolute top-[142px] left-1/2 -translate-x-1/2 z-10 w-[240px] h-[11px]"
        >
          <Image
            src="/assets/landing/landing_mentalidad.svg"
            alt="Mentalidad Profesional"
            fill
            className="object-contain object-center"
            sizes="240px"
          />
        </div>
        <p
          className="
            absolute top-[161px] left-1/2 -translate-x-1/2 z-10
            w-[240px] text-center
            font-sans font-normal text-[#d3cbba] text-[10px] leading-[1.3]
          "
        >
          Disciplina, puntualidad, trato al cliente y presentación personal como parte del proceso.
        </p>

        {/* ── 4. Feature 2 — FORMACIÓN PRÁCTICA REAL ───────────────────────── */}
        {/*
         * Figma: recurso-texto2  top=225  w=247  h=13
         * desc:                  top=249  w=247  text-[10px]
         */}
        <div
          className="absolute top-[225px] left-1/2 -translate-x-1/2 z-10 w-[247px] h-[13px]"
        >
          <Image
            src="/assets/landing/landing_formacion.svg"
            alt="Formación Práctica Real"
            fill
            className="object-contain object-center"
            sizes="247px"
          />
        </div>
        <p
          className="
            absolute top-[249px] left-1/2 -translate-x-1/2 z-10
            w-[247px] text-center
            font-sans font-normal text-[#d3cbba] text-[10px] leading-[1.3]
          "
        >
          Aprendes haciendo, con corrección constante y estándares reales del mercado australiano.
        </p>

        {/* ── 5. Feature 3 — ENFOQUE EN CARRERA Y NEGOCIO ──────────────────── */}
        {/*
         * Figma: recurso-texto3  top=313  w=288  h=12
         * desc:                  top=333  w=288  text-[10px]
         */}
        <div
          className="absolute top-[313px] left-1/2 -translate-x-1/2 z-10 w-[288px] h-[12px]"
        >
          <Image
            src="/assets/landing/landing_enfoque.svg"
            alt="Enfoque en Carrera y Negocio"
            fill
            className="object-contain object-center"
            sizes="288px"
          />
        </div>
        <p
          className="
            absolute top-[333px] left-1/2 -translate-x-1/2 z-10
            w-[288px] text-center
            font-sans font-normal text-[#d3cbba] text-[10px] leading-[1.3]
          "
        >
          No solo técnica: preparación para el mundo laboral y bases de mentalidad emprendedora.
        </p>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT  (≥ md)
          Fluid scale-up of all Figma proportions
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block relative overflow-hidden">

        {/* ── 1. Background image ──────────────────────────────────────────── */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/assets/landing/FeatureSection/bg.png"
            alt=""
            fill
            priority
            className="object-cover object-top opacity-[0.39]"
            sizes="100vw"
          />
        </div>

        {/* ── 2. Content ───────────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-8 md:pt-12 lg:pt-18 pb-8 md:pb-12 lg:pb-18">

          {/* Heading */}
          <ScrollReveal>
            <div className="leading-none mb-6 md:mb-8 lg:mb-12 tracking-[0.033em]">
              <h2
                className="
                  font-sans font-bold uppercase text-[#d3cbba]
                  text-[clamp(44px,7.5vw,130px)] leading-none
                "
              >
                FORMAMOS
              </h2>
              <h2
                className="
                  font-sans font-bold uppercase text-[#d3cbba]
                  text-[clamp(32px,5.5vw,96px)] leading-none
                "
              >
                PROFESIONALES
              </h2>
            </div>
          </ScrollReveal>

          {/* Features — staggered scroll-reveal */}
          <div className="w-full max-w-[1100px] flex flex-col gap-6 md:gap-8 lg:gap-12">
            {features.map((item, i) => {
              const vwPct = ((item.desktopW / 1440) * 100).toFixed(2);
              return (
                <ScrollReveal key={i} delay={0.1 * (i + 1)}>
                  <div className="flex flex-col items-center">
                    {/* recurso-texto title image */}
                    <div
                      className="relative mb-4 md:mb-5 w-full"
                      style={{
                        maxWidth: `${item.desktopW}px`,
                        aspectRatio: `${item.desktopW} / ${item.desktopH}`,
                      }}
                    >
                      <Image
                        src={item.recurso}
                        alt={item.alt}
                        fill
                        className="object-contain object-center"
                        sizes={`(max-width: 1440px) ${vwPct}vw, ${item.desktopW}px`}
                      />
                    </div>
                    {/* Description */}
                    <p
                      className="
                        font-sans font-normal text-[#d3cbba]
                        text-[clamp(14px,1.67vw,24px)] leading-[1.3]
                        max-w-3xl text-center
                      "
                    >
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

        </div>
      </div>

    </section>
  );
}
