import { isCourseSlug, type CourseSlug } from '@/lib/data/course-slugs'

/** Program names as they must appear in Meta Pixel `content_name` (same in every language). */
export const PROGRAM_CONTENT_NAMES: Record<CourseSlug, string> = {
  starter: 'Barber Starter',
  profesional: 'Programa Profesional',
  elite: 'Mentoría Elite 1 a 1',
  business: 'Barber Business',
}

export function programContentName(courseId: string): string | null {
  return isCourseSlug(courseId) ? PROGRAM_CONTENT_NAMES[courseId] : null
}
