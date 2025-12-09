<template>
  <section class="max-w-6xl mx-auto px-4 py-10">
    <div class="flex gap-3 mb-6">
      <router-link
        to="/admin/tests"
        class="px-3 py-1 rounded border"
      >
        Tests
      </router-link>
      <router-link
        to="/admin/questions"
        class="px-3 py-1 rounded border"
      >
        Questions
      </router-link>
      <router-link
        to="/admin/upload"
        class="px-3 py-1 rounded border"
      >
        Bulk Upload
      </router-link>
      <router-link
        to="/admin/analytics"
        class="px-3 py-1 rounded border"
      >
        Analytics
      </router-link>
      <router-link
        to="/admin/users"
        class="px-3 py-1 rounded border"
      >
        Users
      </router-link>
      <router-link
        to="/admin/activity"
        class="px-3 py-1 rounded border"
      >
        Activity
      </router-link>
      <router-link
        to="/admin/config"
        class="px-3 py-1 rounded border"
      >
        Config
      </router-link>
    </div>

    <ErrorBanner 
      v-if="errorMessage" 
      :message="errorMessage" 
      class="mb-6"
    />

    <div
      v-if="successMessage"
      class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg"
    >
      {{ successMessage }}
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="border rounded p-4">
        <div class="font-medium mb-2">
          System Analytics
        </div>
        <div
          v-if="loading"
          class="flex justify-center p-2"
        >
          <LoadingSpinner class="w-4 h-4" />
        </div>
        <div
          v-else
          class="grid grid-cols-2 gap-3"
        >
          <div class="border p-3">
            Tests: {{ analytics.totalTests }}
          </div>
          <div class="border p-3">
            Attempts: {{ analytics.totalAttempts }}
          </div>
          <div class="border p-3">
            Avg Score: {{ analytics.avgScore }}%
          </div>
          <div class="border p-3">
            Completion: {{ analytics.completionRate }}%
          </div>
        </div>
      </div>
      <div class="border rounded p-4">
        <div class="font-medium mb-2">
          Health
        </div>
        <ul class="space-y-2">
          <li>Supabase URL: {{ supaOk ? 'OK' : 'Missing' }}</li>
          <li>CSV Function: {{ csvOk ? 'Configured' : 'Missing' }}</li>
          <li>Admin Users Function: {{ adminOk ? 'Configured' : 'Missing' }}</li>
          <li>Analytics Function: {{ analyticsOk ? 'Configured' : 'Missing' }}</li>
        </ul>
      </div>
      <div class="border rounded p-4">
        <div class="font-medium mb-2">
          Maintenance
        </div>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 border rounded"
            @click="clearCache"
          >
            Clear Cache
          </button>
          <button
            class="px-3 py-1 border rounded"
            @click="reload"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
    <div class="mt-8 border rounded p-4">
      <div class="font-medium mb-3">
        User Management
      </div>
      <div class="flex gap-2 mb-3">
        <input
          v-model="q"
          class="border px-3 py-1 rounded flex-1"
          placeholder="Search email"
          aria-label="Search users"
          :disabled="tableLoading"
        >
        <select
          v-model="filterRole"
          class="border px-3 py-1 rounded"
          aria-label="Filter role"
          :disabled="tableLoading"
        >
          <option value="">
            All
          </option>
          <option value="user">
            User
          </option>
          <option value="junior_admin">
            Junior Admin
          </option>
          <option value="super_admin">
            Super Admin
          </option>
        </select>
        <button
          class="px-3 py-1 border rounded"
          :disabled="tableLoading"
          @click="search"
        >
          {{ tableLoading ? 'Searching...' : 'Search' }}
        </button>
      </div>
      <div class="overflow-auto relative">
        <div
          v-if="tableLoading"
          class="absolute inset-0 bg-white/50 flex items-center justify-center z-10"
        >
          <LoadingSpinner class="w-8 h-8" />
        </div>
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left">
              <th class="px-2 py-1">
                <input
                  type="checkbox"
                  :checked="allChecked"
                  aria-label="Select all"
                  @change="toggleAll"
                >
              </th>
              <th class="px-2 py-1">
                Email
              </th>
              <th class="px-2 py-1">
                Role
              </th>
              <th class="px-2 py-1">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="u in users"
              :key="u.id"
              class="border-t"
            >
              <td class="px-2 py-1">
                <input
                  v-model="selected[u.id]"
                  type="checkbox"
                  :aria-label="'Select user ' + u.email"
                >
              </td>
              <td class="px-2 py-1">
                {{ u.email }}
              </td>
              <td class="px-2 py-1">
                {{ u.role }}
              </td>
              <td class="px-2 py-1">
                <button
                  class="px-2 py-1 border rounded mr-2"
                  :disabled="tableLoading"
                  @click="reset(u.id)"
                >
                  Reset Password
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div
          v-if="!users.length && !tableLoading"
          class="text-center py-4 text-gray-500"
        >
          No users found.
        </div>
      </div>
      <div class="flex gap-2 mt-3 flex-wrap">
        <button
          class="px-3 py-1 border rounded"
          :disabled="tableLoading"
          @click="bulkBan"
        >
          Ban
        </button>
        <button
          class="px-3 py-1 border rounded"
          :disabled="tableLoading"
          @click="bulkUnban"
        >
          Unban
        </button>
        <button
          class="px-3 py-1 border rounded"
          :disabled="tableLoading"
          @click="makeJunior"
        >
          Make Junior Admin
        </button>
        <button
          class="px-3 py-1 border rounded"
          :disabled="tableLoading"
          @click="makeUser"
        >
          Make User
        </button>
      </div>
    </div>
    <div class="mt-6 border rounded p-4">
      <div class="font-medium mb-3">
        Assign Test to User
      </div>
      <div class="flex gap-2 mb-3">
        <select
          v-model="assignUserId"
          class="border px-3 py-1 rounded flex-1"
          aria-label="Select user"
          :disabled="actionLoading"
        >
          <option value="">
            Select user
          </option>
          <option
            v-for="u in users"
            :key="u.id"
            :value="u.id"
          >
            {{ u.email }}
          </option>
        </select>
        <select
          v-model="assignTestId"
          class="border px-3 py-1 rounded flex-1"
          aria-label="Select test"
          :disabled="actionLoading"
        >
          <option value="">
            Select test
          </option>
          <option
            v-for="t in tests"
            :key="t.id"
            :value="t.id"
          >
            {{ t.title }}
          </option>
        </select>
        <button
          class="px-3 py-1 border rounded flex items-center gap-2"
          :disabled="actionLoading"
          @click="assign"
        >
          <LoadingSpinner
            v-if="actionLoading"
            class="w-4 h-4"
          />
          <span>Assign</span>
        </button>
      </div>
    </div>
    <div class="grid lg:grid-cols-2 gap-6 mt-6">
      <div class="border rounded p-4">
        <div class="font-medium mb-2">
          Popular Tests
        </div>
        <div
          v-if="loading"
          class="text-sm"
        >
          Loading…
        </div>
        <ul
          v-else
          class="space-y-1"
        >
          <li
            v-for="p in analytics.popular"
            :key="p.test_id"
          >
            {{ p.test_id }} • {{ p.count }}
          </li>
        </ul>
      </div>
      <div class="border rounded p-4">
        <div class="font-medium mb-2">
          Recent Admin Actions
        </div>
        <ul class="space-y-1">
          <li
            v-for="log in logs"
            :key="log.id"
          >
            {{ log.created_at }} • {{ log.action }} • {{ log.user_id }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { env } from '@/config/env'
import { supabase } from '@/supabase/client'
import { adminAnalytics, listUsers, bulkUpdateUsers, resetPassword, assignTest } from '@/lib/adminApi'
import ErrorBanner from '@/components/ErrorBanner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const analytics = ref<{ totalTests: number; totalAttempts: number; avgScore: number; completionRate: number; popular: { test_id: string; count: number }[] }>({ totalTests: 0, totalAttempts: 0, avgScore: 0, completionRate: 0, popular: [] })
const loading = ref(true)
const tableLoading = ref(false)
const actionLoading = ref(false)
const supaOk = ref(!!env.supabaseUrl)
const csvOk = ref(!!env.edgeCsvUrl)
const adminOk = ref(!!env.edgeAdminUsersUrl)
const analyticsOk = ref(!!env.edgeAnalyticsUrl)
const logs = ref<{ id: string; user_id: string; action: string; created_at: string }[]>([])
const errorMessage = ref('')
const successMessage = ref('')

function clearCache() { 
  localStorage.clear()
  successMessage.value = 'Cache cleared.'
}
function reload() { window.location.reload() }

const q = ref('')
const filterRole = ref('')
const users = ref<Array<{ id: string; email: string; role: string }>>([])
const selected = ref<Record<string, boolean>>({})
const allChecked = ref(false)
const tests = ref<Array<{ id: string; title: string }>>([])
const assignUserId = ref('')
const assignTestId = ref('')

async function load() {
  errorMessage.value = ''
  try {
    const cached = sessionStorage.getItem('admin-analytics')
    if (cached) {
      analytics.value = JSON.parse(cached)
    } else {
      const data = await adminAnalytics()
      analytics.value = data
      sessionStorage.setItem('admin-analytics', JSON.stringify(data))
    }
    
    const { data: logData, error: logError } = await supabase.from('admin_audit_logs').select('id, user_id, action, created_at').order('created_at', { ascending: false }).range(0, 9)
    if (logError) throw logError
    logs.value = (logData || []) as any
    
    const { data: testsRes, error: testsError } = await supabase.from('tests').select('id, title').order('created_at', { ascending: false })
    if (testsError) throw testsError
    tests.value = (testsRes || []) as any
    
  } catch (err: any) {
    console.error('Dashboard load error:', err)
    errorMessage.value = 'Dashboard partial load failed: ' + (err.message || 'Check connection')
  } finally {
    loading.value = false
  }
}

async function search() {
  tableLoading.value = true
  errorMessage.value = ''
  try {
    const res = await listUsers({ q: q.value, role: filterRole.value || undefined, limit: 50 })
    users.value = res as any
    selected.value = {}
    allChecked.value = false
  } catch (err: any) {
    errorMessage.value = 'Search failed: ' + err.message
  } finally {
    tableLoading.value = false
  }
}

function toggleAll(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  allChecked.value = checked
  const map: Record<string, boolean> = {}
  for (const u of users.value) map[u.id] = checked
  selected.value = map
}

async function handleBulkAction(actionName: string, operation: (ops: any[]) => Promise<any>) {
  errorMessage.value = ''
  successMessage.value = ''
  
  const ops = Object.entries(selected.value).filter(([id, v]) => v).map(([id]) => ({ user_id: id }))
  if (!ops.length) return
  
  tableLoading.value = true
  try {
    await operation(ops)
    successMessage.value = `Bulk ${actionName} successful.`
    await search()
  } catch (err: any) {
    errorMessage.value = `Bulk ${actionName} failed: ` + err.message
  } finally {
    tableLoading.value = false
  }
}

async function bulkBan() {
  const ops = Object.entries(selected.value).filter(([id, v]) => v).map(([id]) => ({ user_id: id, status: 'banned' }))
  if (ops.length) {
    tableLoading.value = true
    try {
      await bulkUpdateUsers(ops)
      successMessage.value = 'Users banned successfully.'
      await search()
    } catch (err: any) { errorMessage.value = err.message } finally { tableLoading.value = false }
  }
}

async function bulkUnban() {
  const ops = Object.entries(selected.value).filter(([id, v]) => v).map(([id]) => ({ user_id: id, status: 'active' }))
  if (ops.length) {
    tableLoading.value = true
    try {
      await bulkUpdateUsers(ops)
      successMessage.value = 'Users unbanned successfully.'
      await search()
    } catch (err: any) { errorMessage.value = err.message } finally { tableLoading.value = false }
  }
}

async function makeJunior() {
  const ops = Object.entries(selected.value).filter(([id, v]) => v).map(([id]) => ({ user_id: id, role: 'junior_admin' }))
  if (ops.length) {
    tableLoading.value = true
    try {
      await bulkUpdateUsers(ops)
      successMessage.value = 'Promoted to Junior Admin.'
      await search()
    } catch (err: any) { errorMessage.value = err.message } finally { tableLoading.value = false }
  }
}

async function makeUser() {
  const ops = Object.entries(selected.value).filter(([id, v]) => v).map(([id]) => ({ user_id: id, role: 'user' }))
  if (ops.length) {
    tableLoading.value = true
    try {
      await bulkUpdateUsers(ops)
      successMessage.value = 'Demoted to User.'
      await search()
    } catch (err: any) { errorMessage.value = err.message } finally { tableLoading.value = false }
  }
}

async function reset(userId: string) { 
  if (!confirm('Reset password for this user?')) return
  errorMessage.value = ''
  successMessage.value = ''
  try { 
    await resetPassword(userId); 
    successMessage.value = 'Password reset email sent.'
  } catch (err: any) {
    errorMessage.value = 'Reset failed: ' + err.message
  }
}

async function assign() { 
  if (!assignUserId.value || !assignTestId.value) return
  
  actionLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try { 
    await assignTest(assignUserId.value, assignTestId.value); 
    successMessage.value = 'Test assigned successfully.'
    assignUserId.value=''; 
    assignTestId.value=''; 
  } catch (err: any) {
    errorMessage.value = 'Assignment failed: ' + err.message
  } finally {
    actionLoading.value = false
  }
}

onMounted(load)
</script>
