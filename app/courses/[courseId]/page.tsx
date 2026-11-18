import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewContentTracker } from "@/components/analytics/ViewContentTracker";
import DifferentiatorsBar from "@/components/landing/DifferentiatorsBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteCopy } from "@/lib/content/site";
import { COURSE_SLUGS, isCourseSlug } from "@/lib/data/course-slugs";
import { programContentName } from "@/lib/data/programs";
import { localizedPath } from "@/lib/i18n/routes";
import { getServerDictionary, getServerLanguage } from "@/lib/i18n/server";
import { getCourseSchema } from "@/lib/seo/course-schema";
import { getBreadcrumbSchema } from "@/lib/seo/organization-schema";
import { buildPageMetadata } from "@/lib/seo/page-meta";

type PageProps = {
  params: Promise<{ courseId: string }>;
};

// Known slugs today: starter, profesional, elite, business (see
// lib/data/course-slugs.ts). Pages still render dynamically per-request
// (getServerDictionary reads the language from the URL), this just hints the
// known routes to Next.js. The English routes (/en/courses/professional…)
// reuse this page: see app/en/courses/[courseId]/page.tsx.
export function generateStaticParams() {
  return COURSE_SLUGS.map((courseId) => ({ courseId }));
}

async function getPlan(courseId: string) {
  const pricing = (await getServerDictionary()).landing.pricing;
  return pricing.plans.find((plan) => plan.id === courseId) ?? null;
}

// Plan names are stored ALL CAPS for on-page display emphasis; structured data reads better in
// natural case ("Professional Xclusive Program"), so title-case it for schema.org only.
function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { courseId } = await params;
  if (!isCourseSlug(courseId)) return {};

  const language = await getServerLanguage();
  return buildPageMetadata(localizedPath(`/courses/${courseId}`, language));
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;
  if (!isCourseSlug(courseId)) notFound();

  const plan = await getPlan(courseId);
  if (!plan) notFound();

  const dictionary = await getServerDictionary();
  const language = await getServerLanguage();
  const site = getSiteCopy(language);

  const pagePath = localizedPath(`/courses/${courseId}`, language);
  const homePath = language === "en" ? "/en" : "/";
  const coursesPath = localizedPath("/courses", language);

  const courseSchema = getCourseSchema({
    path: pagePath,
    name: toTitleCase(plan.name),
    description: plan.description,
  });
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: site.breadcrumbs.home, path: homePath },
    { name: site.breadcrumbs.courses, path: coursesPath },
    { name: toTitleCase(plan.name), path: pagePath },
  ]);

  const contentName = programContentName(courseId);

  return (
    <div className="min-h-screen bg-[#161616] text-[#d3cbba]">
      <JsonLd data={courseSchema} />
      <JsonLd data={breadcrumbSchema} />
      {contentName ? <ViewContentTracker contentName={contentName} contentId={courseId} /> : null}

      <div className="mx-auto max-w-3xl px-4 pt-16 md:px-8 md:pt-24">
        <Link
          href={coursesPath}
          className="mb-8 inline-block font-sans text-xs uppercase tracking-[0.14em] text-[#9ea79f] transition-colors hover:text-[#D4AF37]"
        >
          {dictionary.courseDetailPage.backLink}
        </Link>

        <h1 className="mb-2 font-sans text-3xl font-extrabold uppercase leading-tight text-[#f0ece3] md:text-5xl">
          {plan.name}
        </h1>
        <p className="mb-6 font-sans text-sm font-semibold tracking-wide text-[#D4AF37] md:text-base">
          {plan.formatLabel}
        </p>
      </div>

      <DifferentiatorsBar language={language} />

      <div className="mx-auto max-w-3xl px-4 py-10 md:px-8 md:pb-24">
        <p className="mb-8 font-sans text-base leading-relaxed text-[#c8c0ad] md:text-lg">
          {plan.description}
        </p>

        <ul className="mb-10 space-y-3">
          {plan.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <svg
                className="mt-[3px] h-4 w-4 flex-shrink-0 text-[#D4AF37]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-sans text-sm leading-snug text-[#dfd8c8] md:text-base">
                {benefit}
              </span>
            </li>
          ))}
        </ul>

        <Link
          href={`/qualify?plan=${plan.id}`}
          className={[
            "relative inline-flex min-h-[48px] items-center justify-center overflow-hidden rounded-sm px-8 py-3",
            "font-sans text-[13px] font-black uppercase tracking-[0.08em] text-[#161616] md:text-[14px]",
            "bg-gradient-to-r from-[#deba60] via-[#F2D794] to-[#deba60] bg-[length:200%_auto]",
            "shadow-[0_8px_20px_rgba(212,175,55,0.2)]",
            "transition-all duration-300 hover:bg-[position:100%_center] hover:shadow-[0_12px_25px_rgba(212,175,55,0.35)] hover:-translate-y-0.5",
          ].join(" ")}
        >
          {plan.ctaLabel}
        </Link>

        <p className="mt-10 font-sans text-sm text-[#9ea79f]">
          {site.courseExtras.learnMore}{" "}
          <Link
            href={language === "en" ? "/en/barber-course-melbourne" : "/curso-barberia-melbourne"}
            className="text-[#D4AF37] underline-offset-4 hover:underline"
          >
            {site.courseExtras.pillarCta}
          </Link>
        </p>
      </div>
    </div>
  );
}
