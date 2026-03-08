import Image from "next/image";

/**
 * HeroSection
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MOBILE  (< md  |  ~436px canvas — Figma node 2112:27)
 * ─────────────────────────────────────────────────────────────────────────────
 * The Figma frame embeds the header (h=69px) at the top, so every positional
 * value below is (Figma y − 69) to produce hero-section-relative coordinates.
 *
 *  bg image  → top: 30px   h: 245px   blur-[2px]   opacity-66%
 *  arm       → left: 0     top: 182px  w: 189px   h: 283px
 *  subtitle  → top: 68px   centered   text-[11px]  tracking-[0.99px]
 *  heading   → top: 103px  centered   text-[20px] (lines 1-2) / text-[24px] (line 3)
 *  divider   → top: 230px  left: 195px  w: 223px   h: 1px
 *  paragraph → top: 313px  right: 50px  w: 206px   text-[8px]  text-right
 *  cta box   → top: 386px  full-width  h: 79px  bg-[#1c3123]   text-[26px]
 *  total h   → 465px
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DESKTOP (≥ md  |  1440px canvas — Figma node 164:150)
 * ─────────────────────────────────────────────────────────────────────────────
 *  bg image  → top: 88px   h: 860px   opacity-55%  + dual vignette
 *  subtitle  → Poppins ExtraLight 24px  tracking 2.16px  centered
 *  h1 L1-2   → Poppins ExtraBold clamp(22px,4.45vw,64px) centered
 *  h1 L3     → Poppins ExtraBold clamp(34px,6.67vw,96px) centered
 *  divider   → right-aligned, width 56% of container (812/1440)
 *  paragraph → Poppins Regular 32px  text-right  w-60%
 *  arm       → x=-62 left-overflow  y=808  w=617  h=924  anchored bottom
 *
 * Assets: /public/assets/landing/HeroSection/
 */
export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#161616]">

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT  (< md)
          Total section height = 465px  (body 386px  +  CTA bar 79px)
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden relative h-[386px]">

        {/* ── 1. Background image ──────────────────────────────────────────── */}
        {/*
         * Figma: rotated container  top=99px (frame) → top=30px (hero)
         *        h=245px  blur-[2px]  opacity-66%
         */}
        <div className="absolute inset-x-0 top-[30px] h-[245px] z-0 pointer-events-none overflow-hidden">
          <Image
            src="/assets/landing/HeroSection/hero-bg.png"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="436px"
          />
          {/* Light vignette so text remains readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#161616]/60 via-transparent to-[#161616]/40" />
        </div>

        {/* ── 2. Tattoo arm ────────────────────────────────────────────────── */}
        {/*
         * Figma: left=0  top=251 (frame) → top=182 (hero)  w=189  h=283
         * z-0: TargetAudienceSection (z-10) sits on top, covering any overflow.
         */}
        <div className="absolute left-0 top-[182px] w-[189px] h-[283px] z-0 pointer-events-none">
          <Image
            src="/assets/landing/HeroSection/hero-tattoo-arm.png"
            alt="Barber profesional"
            fill
            className="object-cover object-top"
            sizes="189px"
          />
        </div>

        {/* ── 3. Subtitle ──────────────────────────────────────────────────── */}
        {/*
         * Figma: top=137 (frame) → top=68 (hero)
         *        Poppins ExtraLight  text-[11px]  tracking-[0.99px]  centered
         *        w=338px centered inside 436px → mx=49px each side
         */}
        <p
          className="
            absolute top-[68px] inset-x-0 z-20
            font-sans font-extralight uppercase text-center
            text-[11px] text-[#d3cbba] tracking-[0.09em] leading-normal
          "
        >
          EDUCACIÓN PROFESIONAL EN BARBERÍA PARA LATINOS
        </p>

        {/* ── 4. Main heading ──────────────────────────────────────────────── */}
        {/*
         * Figma: top=172 (frame) → top=103 (hero)
         *        centered, w=359px, Poppins ExtraBold
         *        line 1-2: text-[20px]  |  spacer: 17px  |  line 3: text-[24px]
         */}
        <div
          className="absolute top-[103px] left-1/2 -translate-x-1/2 z-20 w-[359px] text-center"
        >
          <p className="font-sans font-extrabold uppercase text-[#d3cbba] text-[20px] leading-[1.25] tracking-tight">
            FORMACIÓN ORIENTADA A LOS ESTÁNDARES REALES DEL
          </p>
          {/* Figma blank line between heading rows ≈ 17px */}
          <div className="h-[17px]" aria-hidden />
          <p className="font-sans font-extrabold uppercase text-[#d3cbba] text-[24px] leading-none tracking-tight">
            MERCADO AUSTRALIANO
          </p>
        </div>

        {/* ── 5. Gold divider ──────────────────────────────────────────────── */}
        {/*
         * Figma: top=299 (frame) → top=230 (hero)
         *        left=195  w=223  h=1px
         */}
        <div
          className="absolute top-[230px] left-[195px] h-px w-[223px] z-20 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
        >
          <Image
            src="/assets/landing/HeroSection/divider-dorado.png"
            alt=""
            fill
            className="object-cover"
            sizes="223px"
            aria-hidden
          />
        </div>

        {/* ── 6. Paragraph ─────────────────────────────────────────────────── */}
        {/*
         * Figma: top=382 (frame) → top=313 (hero)
         *        left=386 -translate-x-full w=206  → right edge at x=386
         *        → 436-386 = 50px from right edge
         *        Poppins Regular  text-[8px]  text-right  leading-[1.3]
         */}
        <p
          className="
            absolute top-[313px] right-[50px] w-[206px] z-20
            font-sans font-normal text-[8px] text-[#d3cbba]
            text-right leading-[1.3]
          "
        >
          Sistema de aprendizaje práctico y estructurado para construir una
          carrera real, con estándares profesionales y mentalidad de negocio.
        </p>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT  (≥ md)
          1440px Figma canvas
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block relative min-h-[420px] lg:min-h-[560px] xl:min-h-[780px] 2xl:min-h-[1000px]">

        {/* ── 1. Background image ──────────────────────────────────────────── */}
        {/*
         * Figma: y=246 from page top (header ≈158px) → ~88px into section.
         * Intrinsic region: 860px tall. Dual vignette fades into #161616.
         */}
        <div className="absolute inset-x-0 top-[40px] lg:top-[60px] h-[340px] lg:h-[460px] xl:h-[680px] z-0 pointer-events-none">
          <Image
            src="/assets/landing/HeroSection/hero-bg.png"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-55"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#161616] via-transparent to-[#161616]" />
        </div>

        {/* Hard bottom fade so the section blends seamlessly below */}
        <div className="absolute inset-x-0 bottom-0 h-[120px] lg:h-[200px] xl:h-[350px] bg-gradient-to-t from-[#161616] to-transparent z-10 pointer-events-none" />

        {/* ── 2. Text block ────────────────────────────────────────────────── */}
        <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16">
          <div className="pt-6 md:pt-8 lg:pt-15">

            {/* Subtitle — Poppins ExtraLight 24px · tracking 2.16px · center */}
            <p
              className="
                font-sans font-extralight uppercase text-center text-[#d3cbba]
                text-sm md:text-base lg:text-lg xl:text-2xl
                tracking-[0.09em] mb-2 md:mb-3
              "
            >
              Educación profesional en barbería para latinos
            </p>

            {/* H1 block — Poppins ExtraBold · center */}
            <div className="text-center">
              {/* Lines 1-2: 64px Figma → clamp 22px→64px */}
              <h1
                className="
                  font-sans font-extrabold uppercase text-[#d3cbba]
                  leading-[1.1] tracking-tight
                  text-[clamp(22px,4.45vw,64px)]
                "
              >
                Formación orientada a los estándares reales del
              </h1>

              {/* Line 3: 96px Figma → clamp 34px→96px */}
              <h2
                className="
                  font-sans font-extrabold uppercase text-[#d3cbba]
                  leading-none tracking-tight
                  text-[clamp(34px,6.67vw,96px)]
                  mt-1 md:mt-3
                "
              >
                Mercado Australiano
              </h2>
            </div>

            {/* Gold divider — right-aligned, width 56.4% (812/1440) */}
            <div className="mt-4 md:mt-6 flex justify-end">
              <div className="relative h-[3px] md:h-[5px] w-[56%] overflow-hidden">
                <Image
                  src="/assets/landing/HeroSection/divider-dorado.png"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 56vw, 812px"
                  aria-hidden
                />
              </div>
            </div>

            {/* Paragraph — Poppins Regular 32px · text-right · right ~57% */}
            <div className="mt-16 lg:mt-28 xl:mt-44 flex justify-end">
              <p
                className="
                  font-sans font-normal text-[#d3cbba] text-right leading-[1.3]
                  text-sm md:text-lg lg:text-xl xl:text-[32px]
                  w-full md:w-[60%]
                "
              >
                Sistema de aprendizaje práctico y estructurado para construir una
                carrera real, con estándares profesionales y mentalidad de negocio.
              </p>
            </div>

            {/* Spacer so arm image doesn't overlap paragraph */}
            <div className="h-2 lg:h-4 xl:h-8" />

          </div>
        </div>

        {/* ── 3. Tattoo arm ────────────────────────────────────────────────── */}
        {/*
         * Figma: x=-62 (left overflow)  y=808  w=617  h=924
         * Anchored bottom-left; slight left overflow mirrors Figma's x=-62.
         * z-0: TargetAudienceSection (z-10) sits on top, covering any overflow.
         */}
        <div
          className="
            absolute z-0 pointer-events-none
            bottom-0 left-[-10px] lg:left-[-24px] xl:left-[-50px]
            w-[180px] lg:w-[300px] xl:w-[420px] 2xl:w-[540px]
            h-[270px] lg:h-[440px] xl:h-[600px] 2xl:h-[780px]
          "
        >
          <Image
            src="/assets/landing/HeroSection/hero-tattoo-arm.png"
            alt="Barber profesional cortando cabello"
            fill
            className="object-contain object-bottom"
            sizes="(max-width: 1024px) 380px, 617px"
          />
        </div>

      </div>

    </section>
  );
}