import { defineStore } from 'pinia'
import { supabase } from '@/supabase/client'
import type { Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', {
  state: () => ({ session: null as Session | null }),
  actions: {
    async init() {
      const { data } = await supabase.auth.getSession()
      this.session = data.session
      supabase.auth.onAuthStateChange((_event, s) => { this.session = s })
    },
    async login(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      this.session = data.session
    },
    async logout() {
      await supabase.auth.signOut()
      this.session = null
    }
  }
})
