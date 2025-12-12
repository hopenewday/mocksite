import axios from 'axios'
import { env } from '@/config/env'
import { supabase } from '@/supabase/client'

export async function uploadCSV(rows: unknown[]) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  const res = await axios.post(env.edgeCsvUrl, { rows }, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': env.csrfToken,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })
  return res.data
}