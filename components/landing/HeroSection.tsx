import Image from "next/image";

/**
 * HeroSection — Figma source: Node 164:150 (Landing desktop Op 2, rows 0–1490)
 *
 * Layout specs (1440px canvas):
 *  - Background image (image 12):  y=246, full-width, 860px tall
 *  - Subtitle:  Poppins ExtraLight 24px · center · tracking 2.16px
 *  - H1 lines 1-2:  Poppins ExtraBold 64px · center
 *  - H1 line 3 "MERCADO AUSTRALIANO":  Poppins ExtraBold 96px · center (50% larger)
 *  - Gold divider (Rect 9): right-aligned, starts x=628/1440 ≈ 43.6%, w=812px
 *  - Paragraph: Poppins Regular 32px · text-right · right 56.5% of container
 *  - Tattoo arm (upscalemedia 5): x=-62 left-overflow, y=808, w=617, h=924
 *
 * Assets: /public/assets/landing/HeroSection/
 */
export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#050505] min-h-[900px] md:min-h-[1100px] lg:min-h-[1332px]">

      {/* ── 1. BACKGROUND IMAGE ─────────────────────────────────────────────── */}
      {/*
       * In Figma it starts at y=246 from the page top (header is ~158px),
       * so within the hero section it begins ~88px from the top.
       * We reproduce this with top-[88px] and a 860px intrinsic height region.
       */}
      <div className="absolute inset-x-0 top-[60px] md:top-[88px] h-[500px] md:h-[700px] lg:h-[860px] z-0 pointer-events-none">
        <Image
          src="/assets/landing/heroSection/herp-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-55"
          sizes="100vw"
        />
        {/* Vignette: dark top edge + strong fade to black at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      {/* Hard bottom fade so the section blends into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-[350px] md:h-[500px] bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />

      {/* ── 2. TEXT CONTENT ──────────────────────────────────────────────────── */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16">

        {/* Vertical padding mirrors Figma's ~280px gap from frame top to subtitle */}
        <div className="pt-20 md:pt-28 lg:pt-36">

          {/* Subtitle — Poppins ExtraLight 24px, tracking 2.16px, center */}
          <p className="
            font-sans font-extralight uppercase text-center text-[#d3cbba]
            text-xs sm:text-sm md:text-base lg:text-lg xl:text-2xl
            tracking-[0.09em]
            mb-4 md:mb-6
          ">
            Educación profesional en barbería para latinos
          </p>

          {/* Main heading block — Poppins ExtraBold, center */}
          <div className="text-center">
            {/*
             * Lines 1–2: 64px in Figma
             * clamp scales naturally: 28px (320px screen) → 64px (1440px screen)
             */}
            <h1 className="
              font-sans font-extrabold uppercase text-[#d3cbba]
              leading-[1.1] tracking-tight
              text-[clamp(22px,4.45vw,64px)]
            ">
              Formación orientada a los estándares reales del
            </h1>

            {/*
             * Line 3: 96px in Figma — 50% bigger than lines 1-2
             * clamp scales naturally: 34px (320px) → 96px (1440px)
             */}
            <h2 className="
              font-sans font-extrabold uppercase text-[#d3cbba]
              leading-none tracking-tight
              text-[clamp(34px,6.67vw,96px)]
              mt-1 md:mt-3
            ">
              Mercado Australiano
            </h2>
          </div>

          {/*
           * Gold divider — Figma: x=628, w=812 on a 1440px canvas.
           * x=628 → left offset = 628/1440 = 43.6% → the divider takes the right 56.4%.
           * We use ml-auto (push to right) on a container sized to 56.4% of parent.
           */}
          <div className="mt-4 md:mt-6 flex justify-end">
            <div className="relative h-[3px] md:h-[5px] w-[56%] overflow-hidden">
              <Image
                src="/assets/landing/heroSection/divider-dorado.png"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 56vw, 812px"
                aria-hidden
              />
            </div>
          </div>

          {/*
           * Paragraph — Figma: x=532, w=814, y=1236 (1440px canvas).
           * x=532 → left start = 532/1440 = 36.9% → occupies right 63.1%.
           * We show it right-aligned, clipped to the right ~57% of container.
           * The vertical gap (y=1236 - y≈496 = ~740px of Figma space) maps to
           * the mt values below.
           */}
          <div className="mt-24 md:mt-40 lg:mt-52 flex justify-end">
            <p className="
              font-sans font-normal text-[#d3cbba] text-right leading-[1.3]
              text-sm md:text-lg lg:text-xl xl:text-[32px]
              w-full md:w-[60%]
            ">
              Sistema de aprendizaje práctico y estructurado para construir una
              carrera real, con estándares profesionales y mentalidad de negocio.
            </p>
          </div>

          {/* Bottom spacer so the arm image doesn't clip the paragraph */}
          <div className="h-24 md:h-48 lg:h-64" />

        </div>
      </div>

      {/* ── 3. TATTOO ARM IMAGE ──────────────────────────────────────────────── */}
      {/*
       * Figma: x=-62 (left overflow), y=808, w=617, h=924.
       * Arm starts at roughly y=650 from section top and extends 924px.
       * We anchor it to the bottom of the section so it naturally fades into
       * the gradient overlay.
       */}
      <div className="
        absolute z-30 pointer-events-none
        bottom-0 left-[-16px] md:left-[-30px] lg:left-[-62px]
        w-[240px] md:w-[380px] lg:w-[500px] xl:w-[617px]
        h-[360px] md:h-[570px] lg:h-[760px] xl:h-[924px]
      ">
        <Image
          src="/assets/landing/heroSection/hero-tattoo-arm.png"
          alt="Barber profesional cortando cabello"
          fill
          className="object-contain object-bottom"
          sizes="(max-width: 768px) 240px, (max-width: 1024px) 380px, 617px"
        />
      </div>

    </section>
  );
}