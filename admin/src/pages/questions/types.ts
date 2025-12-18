
export type Question = {
  id?: string
  test_id: string
  type: 'multiple_choice' | 'multiple_answer' | 'short_answer' | 'long_answer'
  content_en: Record<string, any>
  content_hi: Record<string, any>
  options: Record<string, any>[]
  correct_answer: string[]
  explanation_en: string
  explanation_hi: string
  created_at?: string
  updated_at?: string
}
