import { defineStore } from 'pinia'
import { supabase } from '@/supabase/client'
import { z } from 'zod'

const TestSchema = z.object({
  id: z.string(),
  title: z.string(),
  exam: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  duration_minutes: z.number(),
  language: z.enum(['en', 'hi'])
})

export type TestItem = z.infer<typeof TestSchema>

export const useTestsStore = defineStore('tests', {
  state: () => ({ items: [] as TestItem[], loading: false }),
  actions: {
    async fetch(filters?: { exam?: string; difficulty?: string; language?: string }) {
      this.loading = true
      let q = supabase.from('tests').select('*')
      if (filters?.exam) q = q.eq('exam', filters.exam)
      if (filters?.difficulty) q = q.eq('difficulty', filters.difficulty)
      if (filters?.language) q = q.eq('language', filters.language)
      const { data, error } = await q
      this.loading = false
      if (error) throw error
      const parsed = z.array(TestSchema).safeParse(data)
      if (!parsed.success) throw new Error('Invalid data')
      this.items = parsed.data
    }
  }
})