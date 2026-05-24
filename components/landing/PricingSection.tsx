import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import { getServerDictionary } from "@/lib/i18n/server";

const INSTAGRAM_URL = "https://www.instagram.com/xclusiveacademy_au?igsh=bms4MHQ4bzB4a3Jy";
const INSTAGRAM_HANDLE = "@xclusiveacademy_au";
const WHATSAPP_NUMBER = "61413891977";
const WHATSAPP_LABEL = "+61 413 891 977";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hola equipo de Xclusive Barber Academy, quiero recibir asesoria sobre sus programas."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

type PricingPlan = {
  id: string;
  name: string;
  priceLabel: string;
  billingLabel: string;
  hook: string;
  formatLabel: string;
  description: string;
  benefits: readonly string[];
  ctaLabel: string;
  ctaHref: string;
  badge?: string;
};

function PricingPlanCard({ plan }: { plan: PricingPlan }) {
  const isHighlighted = Boolean(plan.badge);

  return (
    <article
      className={[
        "group relative flex w-full flex-col justify-between overflow-hidden rounded-[8px] border",
        "bg-gradient-to-b from-[#1D1D1D] to-[#141414]",
        "p-5 shadow-[0px_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 md:p-6",
        isHighlighted
          ? "border-[#D4AF37]/60 md:-translate-y-2 shadow-[0px_16px_40px_rgba(212,175,55,0.15)]"
          : "border-[rgba(211,203,186,0.15)] hover:border-[rgba(211,203,186,0.35)]",
      ].join(" ")}
    >
      {isHighlighted && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />
      )}

      <div className="relative z-10">
        <div className="flex flex-col items-start gap-3 mb-3">
          {plan.badge ? (
            <div className="inline-flex items-center rounded-xs border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-3 py-1.5">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#D4AF37]">
                {plan.badge}
              </span>
            </div>
          ) : (
            <div className="h-[28px]" /> /* Spacer when no badge exists directly on top */
          )}
          <h3 className="font-sans text-xl font-extrabold leading-tight text-[#f0ece3] md:text-[22px]">
            {plan.name}
          </h3>
        </div>

        <p className="font-sans text-[13px] leading-relaxed text-[#9ea79f] min-h-[38px]">
          {plan.hook}
        </p>

        <div className="mt-4 mb-5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          </div>
          <p className="mt-1.5 font-sans text-sm font-semibold tracking-wide text-[#D4AF37]">
            {plan.formatLabel}
          </p>
        </div>

        <p className="font-sans text-[13.5px] leading-relaxed text-[#c8c0ad]">
          {plan.description}
        </p>

        <div className="my-5 h-[1px] w-full bg-gradient-to-r from-[rgba(211,203,186,0.15)] to-transparent" />

        <ul className="space-y-2.5">
          {plan.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <svg className="mt-[2px] h-4 w-4 flex-shrink-0 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-sans text-[13px] leading-snug text-[#dfd8c8]">
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7 pt-2 relative z-10">
        <Link
          href={plan.ctaHref}
          className={[
            "relative inline-flex w-full min-h-[48px] items-center justify-center overflow-hidden rounded-sm px-5 py-3",
            "font-sans text-[13px] font-black uppercase tracking-[0.08em] text-[#161616] md:text-[14px]",
            "bg-gradient-to-r from-[#deba60] via-[#F2D794] to-[#deba60] bg-[length:200%_auto]",
            "shadow-[0_8px_20px_rgba(212,175,55,0.2)]",
            "transition-all duration-300 hover:bg-[position:100%_center] hover:shadow-[0_12px_25px_rgba(212,175,55,0.35)] hover:-translate-y-0.5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1d1d1d]"
          ].join(" ")}
        >
          {plan.ctaLabel}
        </Link>
      </div>
    </article>
  );
}

function PricingPlanGrid({ plans }: { plans: PricingPlan[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-4 xl:gap-6">
      {plans.map((plan) => (
        <PricingPlanCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}

export default async function PricingSection() {
  const pricing = (await getServerDictionary()).landing.pricing;
  const plans: PricingPlan[] = pricing.plans.map((plan) => ({
    ...plan,
    ctaHref: `/qualify?plan=${plan.id}`,
  }));

  return (
    <section className="relative w-full bg-[#161616] overflow-hidden -mt-10 z-50">
      <ScrollReveal>
        <div className="relative w-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(28,49,35,0.2),transparent_55%)] pointer-events-none" />

          <div className="relative mx-auto max-w-[1280px] px-4 pt-10 pb-12 md:px-8 md:pt-16 md:pb-16">
            <PricingPlanGrid plans={plans} />

            <div className="mt-10 md:mt-14">
              <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-5 md:flex-row md:gap-12">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir Instagram de Xclusive Barber Academy"
                  className="flex items-center gap-2.5 opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3cbba]/70 rounded-sm"
                >
                  <div className="relative h-[14px] w-[14px] opacity-75 md:h-[20px] md:w-[20px]">
                    <Image
                      src="/assets/landing/FinalSection/icono.ig.png"
                      alt={pricing.instagramAlt}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-sans text-[13px] font-medium text-[#d3cbba] md:text-[18px]">
                    {INSTAGRAM_HANDLE}
                  </span>
                </a>

                <div className="relative h-[44px] w-[36px] md:h-[78px] md:w-[64px]">
                  <Image
                    src="/assets/logo-academia.svg"
                    alt={pricing.logoAlt}
                    fill
                    className="object-contain"
                  />
                </div>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir chat de WhatsApp con el equipo de Xclusive"
                  className="flex items-center gap-2.5 opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d3cbba]/70 rounded-sm"
                >
                  <div className="relative h-[15px] w-[15px] opacity-75 md:h-[21px] md:w-[21px]">
                    <Image
                      src="/assets/landing/FinalSection/icono-wpp.png"
                      alt={pricing.whatsappAlt}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="font-sans text-[13px] font-medium text-[#d3cbba] md:text-[18px]">
                    {WHATSAPP_LABEL}
                  </span>
                </a>
              </div>
            </div>

            <div className="relative mt-9 h-[2px] w-full md:mt-12 md:h-[4px]">
              <Image src="/assets/divider.svg" alt="" fill className="object-cover" />
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}