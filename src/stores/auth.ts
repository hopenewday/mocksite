import { defineStore } from 'pinia'
import { supabase } from '@/supabase/client'
import type { Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', {
  state: () => ({ session: null as Session | null, profile: null as null | { id: string; role: 'super_admin' | 'junior_admin' | 'user' } }),
  getters: {
    isAdmin(state) { return !!state.profile && (state.profile.role === 'super_admin' || state.profile.role === 'junior_admin') }
  },
  actions: {
    async init() {
      const { data } = await supabase.auth.getSession()
      this.session = data.session
      if (this.session?.user?.id) {
        const { data: p } = await supabase.from('profiles').select('id, role').eq('id', this.session.user.id).single()
        this.profile = p as any
      }
      supabase.auth.onAuthStateChange((_event, s) => { this.session = s })
    },
    async login(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      this.session = data.session
      if (data.user?.id) {
        const { data: p } = await supabase.from('profiles').select('id, role').eq('id', data.user.id).single()
        this.profile = p as any
      }
    },
    async signUp(email: string, password: string) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      this.session = data.session
    },
    async loginWithGoogle() {
      await supabase.auth.signInWithOAuth({ provider: 'google' })
    },
    async requestOtp(phone: string) {
      const key = `otp:${phone}`
      const now = Date.now()
      const raw = localStorage.getItem(key)
      const arr = raw ? JSON.parse(raw) as number[] : []
      const windowStart = now - 60 * 60 * 1000
      const recent = arr.filter(t => t > windowStart)
      if (recent.length >= 5) throw new Error('Too many requests')
      recent.push(now)
      localStorage.setItem(key, JSON.stringify(recent))
      const { error } = await supabase.auth.signInWithOtp({ phone })
      if (error) throw error
    },
    async verifyOtp(phone: string, token: string) {
      const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' }) as any
      if (error) throw error
      this.session = data.session
    },
    async logout() {
      await supabase.auth.signOut()
      this.session = null
      this.profile = null
    }
  }
})
