/**
 * Canonical list of program slugs for /courses/[courseId].
 *
 * Sourced from the existing pricing plan ids in lib/i18n/dictionaries.ts
 * (landing.pricing.plans[].id) — kept as a separate constant here because
 * generateStaticParams/notFound need the id list without pulling in the
 * full dictionary (which is cookie/language-dependent).
 */
export const COURSE_SLUGS = ['starter', 'profesional', 'elite', 'business'] as const

export type CourseSlug = (typeof COURSE_SLUGS)[number]

export function isCourseSlug(value: string): value is CourseSlug {
  return (COURSE_SLUGS as readonly string[]).includes(value)
}
