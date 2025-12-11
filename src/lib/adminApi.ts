import axios, { AxiosError } from 'axios'
import { env } from '@/config/env'
import { supabase } from '@/supabase/client'

function csrfToken() { return env.csrfToken }

async function postWithAuth(url: string, body: Record<string, unknown>) {
  try {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token || ''
    const res = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'X-CSRF-Token': csrfToken()
      }
    })
    return res.data
  } catch (err) {
    const error = err as AxiosError
    console.error('API Post Error:', error.response?.status, error.response?.data, error.config)
    throw new Error(`Request to ${url} failed: ${error.response?.status} ${error.message}`)
  }
}

export function adminUsers(action: 'create'|'update'|'delete', payload: Record<string, unknown>) {
  return postWithAuth(env.edgeAdminUsersUrl, { action, ...payload })
}

export function csvUpload(rows: unknown[]) {
  return postWithAuth(env.edgeCsvUrl, { rows })
}

export function adminAnalytics() {
  return postWithAuth(env.edgeAnalyticsUrl, {})
}

export function createTest(payload: { title: string; exam: string; difficulty: 'easy'|'medium'|'hard'; duration_minutes: number; language: 'en'|'hi' }) {
  return postWithAuth(env.edgeAdminTestsUrl, { action: 'create', ...payload })
}

export function deleteTest(id: string) {
  return postWithAuth(env.edgeAdminTestsUrl, { action: 'delete', id })
}

export function updateTest(id: string, updates: Partial<{ title: string; exam: string; difficulty: 'easy'|'medium'|'hard'; duration_minutes: number; language: 'en'|'hi'; passing_score: number; retake_policy: 'no_limit'|'once'|'thrice'|'cooldown'; category_id: string|null; module_id: string|null }>) {
  return postWithAuth(env.edgeAdminTestsUrl, { action: 'update', id, ...updates })
}

export async function listCategories() {
  const data = await postWithAuth(env.edgeAdminTestsUrl, { action: 'list_categories' })
  return data.categories
}

export function createCategory(name: string, description?: string) {
  return postWithAuth(env.edgeAdminTestsUrl, { action: 'create_category', name, description })
}

export function deleteCategory(id: string) {
  return postWithAuth(env.edgeAdminTestsUrl, { action: 'delete_category', id })
}

export async function listModules() {
  const data = await postWithAuth(env.edgeAdminTestsUrl, { action: 'list_modules' })
  return data.modules
}

export function createModule(name: string, description?: string) {
  return postWithAuth(env.edgeAdminTestsUrl, { action: 'create_module', name, description })
}

export function deleteModule(id: string) {
  return postWithAuth(env.edgeAdminTestsUrl, { action: 'delete_module', id })
}

export function resetPassword(user_id: string, new_password?: string) {
  return postWithAuth(env.edgeAdminUsersUrl, { action: 'reset_password', user_id, new_password })
}

export function assignTest(user_id: string, test_id: string) {
  return postWithAuth(env.edgeAdminUsersUrl, { action: 'assign_test', user_id, test_id })
}

export async function listUsers(params: { q?: string; role?: string; limit?: number }) {
  const data = await postWithAuth(env.edgeAdminUsersUrl, { action: 'list', ...params })
  return data.users
}

export function bulkUpdateUsers(operations: Array<{ user_id: string; role?: string; status?: string }>) {
  return postWithAuth(env.edgeAdminUsersUrl, { action: 'bulk_update', operations })
}
