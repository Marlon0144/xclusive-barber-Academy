import React from 'react'
import { createClient } from './supabase/server'

/**
 * Cached helper to get the current authenticated user.
 * Deduplicates within the same render/request cycle.
 * Used in: Header, Dashboard, LessonPage
 */
export const getUser = React.cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

/**
 * Cached helper to get user profile (role, etc).
 * Deduplicates within the same render/request cycle.
 * Used in: Dashboard
 */
export const getProfile = React.cache(async (userId: string) => {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  return profile
})

/**
 * Cached helper to get lesson details by ID.
 * Deduplicates within the same render/request cycle.
 * Used in: LessonPage
 */
export const getLessonById = React.cache(async (id: string) => {
  const supabase = await createClient()
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single()
  return { lesson, error }
})
