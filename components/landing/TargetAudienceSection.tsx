import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { getServerDictionary } from "@/lib/i18n/server";

/**
 * TargetAudienceSection
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MOBILE  (< md  |  ~436px canvas — Figma node 2113:43)
 * ─────────────────────────────────────────────────────────────────────────────
 * All coordinates are frame-relative (no header offset, standalone section).
 *
 *  green bar    → top: 0      h: 79px   bg-[#1c3123]  full-width
 *    ↳ text     → top: 13px  ExtraBold text-[26px] leading-[25px] centered w=359
 *  subtitle     → top: 91px  Regular   text-[7px]  centered  w=374
 *  dark card    → top: 144px h: 112px  w: 366px  bg-[#1d1d1d]  centered
 *    ↳ heading  → top: 158px (14px below card top) ExtraBold text-[17px] centered w=341
 *    ↳ items    → top: 197/212/226px  Light  text-[8px]  leading-[1.3]  centered
 *  logo icon    → top: 281px  w: 73px  h: 88px  centered
 *  total h      → ≈ 369px
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DESKTOP (≥ md) — fluid scale-up preserving all Figma proportions
 * ─────────────────────────────────────────────────────────────────────────────
 */
export default async function TargetAudienceSection() {
  const audience = (await getServerDictionary()).landing.targetAudience;
  const items = audience.items;

  return (
    <section className="relative z-10 w-full bg-[#161616]">

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE LAYOUT  (< md)
          Fixed-height canvas matching Figma frame exactly
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="md:hidden relative h-[409px]">

        {/* ── 1. Green CTA bar ─────────────────────────────────────────────── */}
        {/*
         * Figma: top=0  h=79  w=407 centered  bg-[#1c3123]
         */}
        <div
          className="
            absolute top-0 inset-x-0 h-[79px]
            bg-[#1c3123] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
            flex items-center justify-center
          "
        >
          <p
            className="
              font-sans font-extrabold uppercase text-[#d3cbba]
              text-[26px] leading-[25px] text-center w-[359px]
            "
          >
            {audience.ctaTitle}
          </p>
        </div>

        {/* ── 2. Subtitle ──────────────────────────────────────────────────── */}
        {/*
         * Figma: top=91  Poppins Regular  text-[7px]  centered  w=374
         */}
        <p
          className="
            absolute top-[91px] left-1/2 -translate-x-1/2
            w-[374px] text-center
            font-sans font-normal text-[7px] text-[#d3cbba] leading-normal
          "
        >
          {audience.subtitle}
        </p>

        {/* ── 3. Dark card ─────────────────────────────────────────────────── */}
        {/*
         * Figma: top=144  h=112  w=366  centered  bg-[#1d1d1d]
         */}
        <div
          className="
            absolute top-[144px] left-1/2 -translate-x-1/2
            w-[366px] h-[112px]
            bg-[#1d1d1d] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
          "
        />

        {/* ── 4. Card heading ──────────────────────────────────────────────── */}
        {/*
         * Figma: top=158  Poppins ExtraBold  text-[17px]  centered  w=341
         *        (14px below card top)
         */}
        <p
          className="
            absolute top-[158px] left-1/2 -translate-x-1/2
            w-[341px] text-center
            font-sans font-extrabold uppercase text-[#d3cbba]
            text-[17px] leading-normal
          "
        >
          {audience.cardTitle}
        </p>

        {/* ── 5. List items ────────────────────────────────────────────────── */}
        {/*
         * Figma: top=197/212/226  Poppins Light  text-[8px]  leading-[1.3]
         *        centered  w=357  h=15 each
         */}
        <div
          className="
            absolute top-[197px] left-1/2 -translate-x-1/2
            w-[357px] text-center
            font-sans font-light text-[8px] text-[#d3cbba] leading-[1.3]
          "
        >
          {items.map((item, i) => (
            <p key={i} className="h-[15px] whitespace-nowrap overflow-hidden text-ellipsis">
              {item}
            </p>
          ))}
        </div>

        {/* ── 6. Academy logo icon ─────────────────────────────────────────── */}
        {/*
         * Figma: top=281  w=73  h=88  centered
         */}
        <div
          className="
            absolute top-[281px] left-1/2 -translate-x-1/2
            w-[73px] h-[88px]
          "
        >
          <Image
            src="/assets/logo-academia.svg"
            alt={audience.logoAlt}
            fill
            className="object-contain"
            sizes="73px"
          />
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP LAYOUT  (≥ md)
          All Figma proportions scaled up; pixel values × ~3.3 for 1440px canvas
          Negative margin pulls the section up to overlap the Hero arm image.
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block md:-mt-[60px] lg:-mt-[120px] xl:-mt-[180px] 2xl:-mt-[220px]">

        {/* ── 1. Green CTA bar ─────────────────────────────────────────────── */}
        <ScrollReveal>
          <div
            className="
              w-full bg-[#1c3123] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
              flex items-center justify-center
              py-3 md:py-4 lg:py-6
            "
          >
            <h2
              className="
                font-sans font-extrabold uppercase text-[#d3cbba]
                text-[clamp(26px,4.2vw,72px)] leading-tight text-center
                max-w-[1270px] px-6
              "
            >
              {audience.ctaTitle}
            </h2>
          </div>
        </ScrollReveal>

        {/* ── 2. Subtitle ──────────────────────────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <div className="flex justify-center py-3 md:py-5 lg:py-8 px-4">
            <p
              className="
                font-sans font-normal text-[#d3cbba] text-center
                text-[clamp(14px,1.4vw,20px)]
                max-w-3xl leading-relaxed
              "
            >
              {audience.subtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* ── 3. Dark card (heading + list) ────────────────────────────────── */}
        <ScrollReveal delay={0.15}>
          <div className="flex justify-center px-4 pb-6 md:pb-8 lg:pb-14">
            <div
              className="
                w-full max-w-[1259px]
                bg-[#1d1d1d] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
                flex flex-col items-center text-center
                py-6 md:py-8 lg:py-12 px-6
              "
            >
              <h3
                className="
                  font-sans font-extrabold uppercase text-[#d3cbba]
                  text-[clamp(20px,3.8vw,60px)] leading-tight
                  mb-4 md:mb-6 lg:mb-10
                "
              >
                {audience.cardTitle}
              </h3>

              <div className="flex flex-col items-center gap-3 md:gap-4 w-full max-w-3xl">
                {items.map((item, i) => (
                  <p
                    key={i}
                    className="
                      font-sans font-light text-[#d3cbba]
                      text-[clamp(14px,1.67vw,24px)]
                      leading-[1.3] text-center
                    "
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── 4. Academy logo icon ─────────────────────────────────────────── */}
        <ScrollReveal delay={0.2}>
          <div className="flex justify-center pb-6 md:pb-10 lg:pb-20">
            <div className="relative w-[clamp(110px,11.7vw,168px)] h-[clamp(133px,14.2vw,204px)]">
              <Image
                src="/assets/logo-academia.svg"
                alt={audience.logoAlt}
                fill
                className="object-contain"
                sizes="180px"
              />
            </div>
          </div>
        </ScrollReveal>

      </div>

    </section>
  );
}
