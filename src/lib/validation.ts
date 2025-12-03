import { z } from 'zod'

export const QuestionCSVSchema = z.object({
  test_id: z.string(),
  type: z.enum(['mcq','tf','fib','match']).optional().default('mcq'),
  content_en: z.string(),
  content_hi: z.string().optional().default(''),
  options: z.string(),
  correct_answer: z.number().int(),
  topic: z.string().optional().default(''),
  section: z.string().optional().default(''),
  explanation_en: z.string().optional().default(''),
  explanation_hi: z.string().optional().default('')
})

export type QuestionCSVRow = z.infer<typeof QuestionCSVSchema>
