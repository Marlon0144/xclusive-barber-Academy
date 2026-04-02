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
  summary: string;
  benefits: readonly string[];
  ctaLabel: string;
  ctaHref: string;
  badge?: string;
};

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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
              {plans.map((plan) => {
                const isHighlighted = plan.id === "premium";

                return (
                  <article
                    key={plan.id}
                    className={[
                      "relative rounded-sm border bg-[#1D1D1D] p-5 shadow-[0px_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300",
                      "md:p-6",
                      isHighlighted
                        ? "border-[#d3cbba] md:-translate-y-2"
                        : "border-[rgba(211,203,186,0.2)] hover:border-[rgba(211,203,186,0.45)]",
                    ].join(" ")}
                  >
                    {plan.badge ? (
                      <div className="absolute right-4 top-4 rounded-sm border border-[#2d5a3b] bg-[#1c3123] px-2 py-1">
                        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-[#d3cbba]">
                          {plan.badge}
                        </span>
                      </div>
                    ) : null}

                    <div className="pr-20 md:pr-0">
                      <h3 className="font-sans text-[24px] font-extrabold leading-none text-[#f0ece3] md:text-[28px]">
                        {plan.name}
                      </h3>
                      <div className="mt-3 flex items-end gap-2">
                        <p className="font-sans text-[40px] font-black leading-[0.9] text-[#f0ece3] md:text-[46px]">
                          {plan.priceLabel}
                        </p>
                        <span className="pb-1 font-sans text-[11px] font-medium uppercase tracking-[0.06em] text-[#9ea79f] md:text-xs">
                          {plan.billingLabel}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 font-sans text-[13px] leading-relaxed text-[#c8c0ad] md:text-[14px]">
                      {plan.summary}
                    </p>

                    <ul className="mt-5 space-y-3">
                      {plan.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2.5">
                          <span className="mt-[5px] inline-block h-2.5 w-2.5 rounded-full bg-[#2d5a3b]" />
                          <span className="font-sans text-[13px] leading-relaxed text-[#dfd8c8] md:text-[14px]">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={plan.ctaHref}
                      className={[
                        "mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-sm px-4 py-3",
                        "font-sans text-[13px] font-bold uppercase tracking-[0.04em] text-[#dce8dd] md:text-[14px]",
                        "bg-[#1c3123] shadow-[0_8px_20px_rgba(15,35,22,0.5)]",
                        "transition-colors duration-200 hover:bg-[#274932] focus-visible:outline-none",
                        "focus-visible:ring-2 focus-visible:ring-[#6ea87d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1d1d1d]",
                      ].join(" ")}
                    >
                      {plan.ctaLabel}
                    </Link>
                  </article>
                );
              })}
            </div>

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