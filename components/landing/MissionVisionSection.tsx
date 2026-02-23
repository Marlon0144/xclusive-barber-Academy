import Image from "next/image";

/**
 * MissionVisionSection
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MOBILE  (< md  |  ~402px canvas — Figma node 2125:82)
 * ─────────────────────────────────────────────────────────────────────────────
 * Canvas: w=402  h=298
 *
 *  dark card      → top=0   left=50% -translate-x-1/2  w=300  h=298  bg-[#1d1d1d]
 *  gold divider   → top=144  left=0  full-width w=402  h=1px
 *
 *  MISIÓN:
 *   recurso-texto1 → top=30   left=50% -t-x-1/2  w=118  h=27
 *   desc           → top=73   left=50% -t-x-1/2  w=228  text-[7px]  leading-[1.3]
 *
 *  VISIÓN:
 *   recurso-texto2 → top=175  left=50% -t-x-1/2  w=116  h=27
 *   desc           → top=225  left=50% -t-x-1/2  w=229  text-[7px]  leading-[1.3]
 *
 *  total h → 298px
 *
 * Assets: /assets/landing/MisionSection/
 * ─────────────────────────────────────────────────────────────────────────────
 * DESKTOP (≥ md) — fluid scale preserving Figma proportions
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default function MissionVisionSection() {
  return (
    <section className="relative w-full bg-[#161616] pt-10 md:pt-0">

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT  (< md)
          Fixed-height canvas: 298px matching Figma frame exactly
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden relative h-[298px]">

        {/* ── 1. Dark card ─────────────────────────────────────────────────── */}
        {/*
         * Figma: left=50% -translate-x-1/2  top=0  w=300  h=298  bg-[#1d1d1d]
         */}
        <div
          className="
            absolute top-0 left-1/2 -translate-x-1/2
            w-[300px] h-[298px]
            bg-[#1d1d1d] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
          "
        />

        {/* ── 2. Gold divider ──────────────────────────────────────────────── */}
        {/*
         * Figma: top=144  left=0  w=402  h=1px  — full-width horizontal rule
         */}
        <div
          className="absolute top-[144px] inset-x-0 h-[3px] z-10 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        >
          <Image
            src="/assets/landing/MisionSection/divider (2).png"
            alt=""
            fill
            className="object-fill"
            sizes="402px"
            aria-hidden
          />
        </div>

        {/* ── 3. MISIÓN header image ────────────────────────────────────────── */}
        {/*
         * Figma: Recurso 13  top=30  left=142  w=117.857  h=27
         * Centered in card (card x=51, image x=142 → 91px from card left,
         * 118px wide → center at 150px ≈ card center 150px). Use left-1/2.
         */}
        <div
          className="absolute top-[30px] left-1/2 -translate-x-1/2 z-10 w-[118px] h-[27px]"
        >
          <Image
            src="/assets/landing/MisionSection/recurso-texto1.png"
            alt="Misión"
            fill
            className="object-contain object-center"
            sizes="118px"
          />
        </div>

        {/* ── 4. MISIÓN description ─────────────────────────────────────────── */}
        {/*
         * Figma: top=73  left=50% -translate-x-1/2  w=228  h=44
         *        Poppins Light  text-[7px]  leading-[1.3]  text-center
         */}
        <p
          className="
            absolute top-[73px] left-1/2 -translate-x-1/2 z-10
            w-[228px] text-center
            font-sans font-light text-[7px] text-[#d3cbba] leading-[1.3]
          "
        >
          Formar barberos con nivel profesional, disciplina y mentalidad de crecimiento, capaces de insertarse laboralmente en Australia y construir estabilidad económica a través de una habilidad real.{" "}
          No formamos solo técnicos, formamos personas con criterio, ética y visión de futuro.
        </p>

        {/* ── 5. VISIÓN header image ────────────────────────────────────────── */}
        {/*
         * Figma: Recurso 12  top=175  left=143  w=116  h=27  — centered
         */}
        <div
          className="absolute top-[175px] left-1/2 -translate-x-1/2 z-10 w-[116px] h-[27px]"
        >
          <Image
            src="/assets/landing/MisionSection/recurso-texto2.png"
            alt="Visión"
            fill
            className="object-contain object-center"
            sizes="116px"
          />
        </div>

        {/* ── 6. VISIÓN description ─────────────────────────────────────────── */}
        {/*
         * Figma: top=225  left=50% -translate-x-1/2  w=229  h=37
         *        Poppins Light  text-[7px]  leading-[1.3]  text-center
         */}
        <p
          className="
            absolute top-[225px] left-1/2 -translate-x-1/2 z-10
            w-[229px] text-center
            font-sans font-light text-[7px] text-[#d3cbba] leading-[1.3]
          "
        >
          Construir una de las academias de barbería más sólidas para la comunidad latina en Australia,
          con proyección a largo plazo, alianzas estratégicas, programas formativos más amplios e
          impacto real en la vida de quienes confían en este proceso.
        </p>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT  (≥ md)
          Fluid scale-up preserving all Figma proportions
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block py-20 md:py-28 lg:py-36 px-4">
        <div
          className="
            relative mx-auto w-full max-w-[875px]
            bg-[#1d1d1d] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
          "
        >

          {/* ── MISIÓN ─────────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center text-center px-10 md:px-16 lg:px-20 pt-12 md:pt-16 lg:pt-20 pb-14 md:pb-16">

            {/* recurso-texto1 — MISIÓN heading */}
            <div className="relative w-[clamp(118px,19vw,270px)] h-[clamp(27px,4.4vw,63px)] mb-8 md:mb-10">
              <Image
                src="/assets/landing/MisionSection/recurso-texto1.png"
                alt="Misión"
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 200px, 270px"
              />
            </div>

            <p
              className="
                font-sans font-light text-[#d3cbba]
                text-base md:text-lg lg:text-xl
                leading-[1.3] text-center max-w-xl
              "
            >
              Formar barberos con nivel profesional, disciplina y mentalidad de crecimiento,
              capaces de insertarse laboralmente en Australia y construir estabilidad económica
              a través de una habilidad real.{" "}
              No formamos solo técnicos, formamos personas con criterio, ética y visión de futuro.
            </p>
          </div>

          {/* Gold divider */}
          <div className="relative w-full h-[3px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <Image
              src="/assets/landing/MisionSection/divider (2).png"
              alt=""
              fill
              className="object-fill"
              sizes="875px"
              aria-hidden
            />
          </div>

          {/* ── VISIÓN ─────────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center text-center px-10 md:px-16 lg:px-20 pt-14 md:pt-16 pb-12 md:pb-16 lg:pb-20">

            {/* recurso-texto2 — VISIÓN heading */}
            <div className="relative w-[clamp(116px,18.6vw,268px)] h-[clamp(27px,4.3vw,62px)] mb-8 md:mb-10">
              <Image
                src="/assets/landing/MisionSection/recurso-texto2.png"
                alt="Visión"
                fill
                className="object-contain object-center"
                sizes="(max-width: 1024px) 200px, 268px"
              />
            </div>

            <p
              className="
                font-sans font-light text-[#d3cbba]
                text-base md:text-lg lg:text-xl
                leading-[1.3] text-center max-w-xl
              "
            >
              Construir una de las academias de barbería más sólidas para la comunidad latina en
              Australia, con proyección a largo plazo, alianzas estratégicas, programas formativos
              más amplios e impacto real en la vida de quienes confían en este proceso.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
