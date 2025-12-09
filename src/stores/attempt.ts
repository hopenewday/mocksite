import { defineStore } from 'pinia'
import { supabase } from '@/supabase/client'

type Answer = { question_id: string; option_index: number | null; text?: string | null; marked: boolean }

export const useAttemptStore = defineStore('attempt', {
  state: () => ({
    testId: null as string | null,
    answers: [] as Answer[],
    startedAt: 0,
    durationMs: 0,
    currentIndex: 0
  }),
  getters: {
    timeLeft(state) {
      const elapsed = Date.now() - state.startedAt
      return Math.max(state.durationMs - elapsed, 0)
    }
  },
  actions: {
    start(testId: string, durationMinutes: number, questions: { id: string }[]) {
      this.testId = testId
      this.durationMs = durationMinutes * 60 * 1000
      this.startedAt = Date.now()
      this.answers = questions.map(q => ({ question_id: q.id, option_index: null, marked: false } as Answer))
      this.currentIndex = 0
      localStorage.setItem(`attempt:${testId}`, JSON.stringify(this.$state))
    },
    load(testId: string) {
      const raw = localStorage.getItem(`attempt:${testId}`)
      if (raw) Object.assign(this, JSON.parse(raw))
    },
    setAnswer(questionId: string, index: number | null) {
      const a = this.answers.find((x: Answer) => x.question_id === questionId)
      if (a) a.option_index = index
      localStorage.setItem(`attempt:${this.testId}`, JSON.stringify(this.$state))
    },
    setTextAnswer(questionId: string, value: string | null) {
      const a = this.answers.find((x: Answer) => x.question_id === questionId)
      if (a) a.text = value
      localStorage.setItem(`attempt:${this.testId}`, JSON.stringify(this.$state))
    },
    toggleMark(questionId: string) {
      const a = this.answers.find((x: Answer) => x.question_id === questionId)
      if (a) a.marked = !a.marked
      localStorage.setItem(`attempt:${this.testId}`, JSON.stringify(this.$state))
    },
    next(total: number) { this.currentIndex = Math.min(this.currentIndex + 1, total - 1) },
    prev() { this.currentIndex = Math.max(this.currentIndex - 1, 0) },
    jump(index: number) { this.currentIndex = index },
    async submit(score: number) {
      if (!this.testId) return null

      // Check if Supabase is available
      if (!supabase) {
        console.warn('Supabase not available, submit will be handled by fallback')
        return null
      }

      try {
        const { data: userData } = await supabase.auth.getUser()
        const user = userData?.user
        if (!user) throw new Error('Login required')
        const { data, error } = await supabase
          .from('user_attempts')
          .insert({
            user_id: user.id,
            test_id: this.testId,
            answers: this.answers,
            score,
            completed_at: new Date().toISOString()
          })
          .select('id, test_id')
          .single()
        if (error) throw error
        localStorage.removeItem(`attempt:${this.testId}`)
        return data?.id as string
      } catch (error) {
        console.warn('Supabase submission failed:', error)
        // Return null to trigger fallback in TestRunner
        return null
      }
    }
  }
})
