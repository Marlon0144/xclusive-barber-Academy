import type { Metadata } from "next";
import Link from "next/link";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Barber Training Programs in Coburg, Melbourne",
  description:
    "Explore every Xclusive Barber Academy training program in Coburg, Melbourne: Barber Starter Experience, Professional Xclusive Program, Elite Mentoring, and Barber Business Experience.",
  alternates: {
    canonical: "/courses",
  },
  openGraph: {
    title: "Xclusive Barber Academy | Barber Training Programs in Coburg, Melbourne",
    description:
      "Explore every Xclusive Barber Academy training program in Coburg, Melbourne: Barber Starter Experience, Professional Xclusive Program, Elite Mentoring, and Barber Business Experience.",
    url: "/courses",
  },
};

export default async function CoursesIndexPage() {
  const dictionary = await getServerDictionary();
  const { pricing } = dictionary.landing;
  const { heading, subtitle } = dictionary.coursesPage;

  return (
    <div className="min-h-screen bg-[#161616] text-[#d3cbba]">
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-8 md:py-24">
        <h1 className="mb-3 font-sans text-3xl font-extrabold uppercase leading-tight text-[#f0ece3] md:text-5xl">
          {heading}
        </h1>
        <p className="mb-12 max-w-2xl font-sans text-sm text-[#9ea79f] md:text-base">
          {subtitle}
        </p>

        <ul className="space-y-8">
          {pricing.plans.map((plan) => (
            <li
              key={plan.id}
              className="border-b border-[rgba(211,203,186,0.15)] pb-8 last:border-b-0"
            >
              <Link
                href={`/courses/${plan.id}`}
                className="font-sans text-xl font-extrabold uppercase text-[#f0ece3] transition-colors hover:text-[#D4AF37] md:text-2xl"
              >
                {plan.name}
              </Link>
              <p className="mt-2 font-sans text-[13px] leading-relaxed text-[#9ea79f] md:text-sm">
                {plan.hook}
              </p>
              <p className="mt-1 font-sans text-sm font-semibold tracking-wide text-[#D4AF37]">
                {plan.formatLabel}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
