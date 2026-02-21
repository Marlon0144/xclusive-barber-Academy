/**
 * Header Components – barrel export
 *
 * Three header variants for the app:
 * 1. Landing Header  → components/Header.tsx (existing, green, public pages)
 * 2. DashboardGreenHeader → Green variant for /dashboard home (welcome + profile)
 * 3. DashboardPageHeader  → Dark variant for inner dashboard pages (title + dashboard button)
 */

export { default as DashboardGreenHeader } from './DashboardGreenHeader'
export { default as DashboardPageHeader } from './DashboardPageHeader'
