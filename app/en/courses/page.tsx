import type { Metadata } from 'next'
import CoursesIndexPage from '../../courses/page'
import { buildPageMetadata } from '@/lib/seo/page-meta'

export const metadata: Metadata = buildPageMetadata('/en/courses')

export default CoursesIndexPage
