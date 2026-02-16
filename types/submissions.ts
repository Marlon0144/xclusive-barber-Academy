/**
 * Submission type definition
 * Used across tracker, grading, and feedback components
 */

export interface Scores {
  fade: number
  cleanliness: number
  technique: number
  symmetry: number
}

export interface Submission {
  id: string
  image_url: string
  cut_type: string
  description: string
  status: 'pending' | 'reviewed'
  created_at: string
  scores: Scores | null
  feedback_ai: string | null
}
