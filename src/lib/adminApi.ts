import axios from 'axios'
import { env } from '@/config/env'
import { supabase } from '@/supabase/client'

function csrfToken() { return env.csrfToken }

export async function adminUsers(action: 'create'|'update'|'delete', payload: Record<string, unknown>) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const res = await axios.post(env.edgeAdminUsersUrl, { action, ...payload }, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-CSRF-Token': csrfToken()
    }
  })
  return res.data
}

export async function csvUpload(rows: unknown[]) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const res = await axios.post(env.edgeCsvUrl, { rows }, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-CSRF-Token': csrfToken()
    }
  })
  return res.data
}

export async function adminAnalytics() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAnalyticsUrl
  const res = await axios.post(url, {}, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-CSRF-Token': csrfToken()
    }
  })
  return res.data
}

export async function createTest(payload: { title: string; exam: string; difficulty: 'easy'|'medium'|'hard'; duration_minutes: number; language: 'en'|'hi' }) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminTestsUrl
  const res = await axios.post(url, { action: 'create', ...payload }, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-CSRF-Token': csrfToken()
    }
  })
  return res.data
}

export async function deleteTest(id: string) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminTestsUrl
  const res = await axios.post(url, { action: 'delete', id }, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-CSRF-Token': csrfToken()
    }
  })
  return res.data
}
export async function updateTest(id: string, updates: Partial<{ title: string; exam: string; difficulty: 'easy'|'medium'|'hard'; duration_minutes: number; language: 'en'|'hi'; passing_score: number; retake_policy: 'no_limit'|'once'|'thrice'|'cooldown'; category_id: string|null; module_id: string|null }>) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminTestsUrl
  const res = await axios.post(url, { action: 'update', id, ...updates }, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-CSRF-Token': csrfToken()
    }
  })
  return res.data
}

export async function listCategories() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminTestsUrl
  const res = await axios.post(url, { action: 'list_categories' }, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), 'X-CSRF-Token': csrfToken() }
  })
  return res.data.categories
}
export async function createCategory(name: string, description?: string) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminTestsUrl
  const res = await axios.post(url, { action: 'create_category', name, description }, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), 'X-CSRF-Token': csrfToken() }
  })
  return res.data
}
export async function deleteCategory(id: string) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminTestsUrl
  const res = await axios.post(url, { action: 'delete_category', id }, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), 'X-CSRF-Token': csrfToken() }
  })
  return res.data
}
export async function listModules() {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminTestsUrl
  const res = await axios.post(url, { action: 'list_modules' }, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), 'X-CSRF-Token': csrfToken() }
  })
  return res.data.modules
}
export async function createModule(name: string, description?: string) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminTestsUrl
  const res = await axios.post(url, { action: 'create_module', name, description }, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), 'X-CSRF-Token': csrfToken() }
  })
  return res.data
}
export async function deleteModule(id: string) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminTestsUrl
  const res = await axios.post(url, { action: 'delete_module', id }, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), 'X-CSRF-Token': csrfToken() }
  })
  return res.data
}

export async function resetPassword(user_id: string, new_password?: string) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminUsersUrl
  const res = await axios.post(url, { action: 'reset_password', user_id, new_password }, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), 'X-CSRF-Token': csrfToken() }
  })
  return res.data
}
export async function assignTest(user_id: string, test_id: string) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminUsersUrl
  const res = await axios.post(url, { action: 'assign_test', user_id, test_id }, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), 'X-CSRF-Token': csrfToken() }
  })
  return res.data
}
export async function listUsers(params: { q?: string; role?: string; limit?: number }) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminUsersUrl
  const res = await axios.post(url, { action: 'list', ...params }, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-CSRF-Token': csrfToken()
    }
  })
  return res.data.users
}

export async function bulkUpdateUsers(operations: Array<{ user_id: string; role?: string; status?: string }>) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token || ''
  const url = env.edgeAdminUsersUrl
  const res = await axios.post(url, { action: 'bulk_update', operations }, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-CSRF-Token': csrfToken()
    }
  })
  return res.data
}
