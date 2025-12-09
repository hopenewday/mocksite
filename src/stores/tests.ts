import { defineStore } from 'pinia'
import { supabase } from '@/supabase/client'
import { z } from 'zod'
import { mockExams, type Exam } from '@/lib/data/examData'
import { useAuthStore } from '@/stores/auth'

const TestSchema = z.object({
  id: z.string(),
  name: z.string().optional().or(z.literal('')), // Supabase might return different fields, mapping needed
  title: z.string().optional(), // Supabase uses title
  exam: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard', 'easy', 'medium', 'hard']), // Handle case differences
  duration_minutes: z.number().optional(), // Supabase
  duration: z.number().optional(), // Mock
  questions: z.number().optional(), // Mock has this, Supabase might not yet
  language: z.enum(['en', 'hi']),
  isPremium: z.boolean().optional().default(false)
})

export type TestItem = Exam & {
  title?: string
  duration_minutes?: number
}

export const useTestsStore = defineStore('tests', {
  state: () => ({
    items: [] as TestItem[],
    loading: false,
    guestAttempts: 0
  }),
  getters: {
    isGuestLimitReached: (state) => state.guestAttempts >= 2
  },
  actions: {
    async fetch(filters?: { exam?: string; difficulty?: string; language?: string }) {
      this.loading = true
      const auth = useAuthStore()

      try {
        if (!auth.session) {
          // GUEST MODE: Return local demo tests from examData.ts
          // Simulate network delay for realism feels
          await new Promise(resolve => setTimeout(resolve, 500))
          this.items = mockExams
        } else {
          // USER MODE: Fetch from Supabase
          let q = supabase.from('tests').select('*')

          if (filters?.exam) q = q.eq('exam', filters.exam)
          // Map 'Easy' to 'easy' if needed, or handle case insensitivity
          if (filters?.difficulty) q = q.eq('difficulty', filters.difficulty.toLowerCase())
          if (filters?.language) q = q.eq('language', filters.language)

          const { data, error } = await q
          if (error) throw error

          // Map Supabase fields to Exam interface if necessary
          this.items = (data || []).map((t: any) => ({
            ...t,
            name: t.title, // Map title to name
            duration: t.duration_minutes,
            questions: 100, // Default or fetch count
            attempts: 0,
            avgScore: 0,
            rating: 0,
            tags: [],
            category: 'ssc', // Default or join
            subcategory: t.exam
          })) as TestItem[]
        }
      } catch (err) {
        console.error('Fetch tests error:', err)
      } finally {
        this.loading = false
      }
    },

    incrementGuestAttempt() {
      this.guestAttempts++
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('guest_attempts', String(this.guestAttempts))
      }
    },

    initGuestAttempts() {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('guest_attempts')
        if (stored) this.guestAttempts = parseInt(stored, 10)
      }
    }
  }
})