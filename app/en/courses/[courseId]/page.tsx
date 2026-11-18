import type { Metadata } from 'next'
import CourseDetailPage, {
  generateMetadata as baseGenerateMetadata,
} from '../../../courses/[courseId]/page'
import { EN_COURSE_SLUGS, toInternalCourseSlug } from '@/lib/i18n/routes'

type PageProps = { params: Promise<{ courseId: string }> }

/**
 * English course routes (/en/courses/professional …) reuse the Spanish page.
 * Only the URL slug differs ("professional" ↔ internal id "profesional"), so the
 * slug is mapped here. An unknown slug — including the Spanish one under /en —
 * maps to '' and the page responds 404.
 */
async function toInternalParams(params: PageProps['params']) {
  const { courseId } = await params
  return { courseId: toInternalCourseSlug(courseId) ?? '' }
}

export function generateStaticParams() {
  return Object.keys(EN_COURSE_SLUGS).map((courseId) => ({ courseId }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return baseGenerateMetadata({ params: toInternalParams(params) })
}

export default async function EnglishCourseDetailPage({ params }: PageProps) {
  return CourseDetailPage({ params: toInternalParams(params) })
}
