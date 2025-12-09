<template>
  <section class="max-w-6xl mx-auto px-4 py-10">
    <h2 class="text-xl font-semibold mb-4">
      User Management
    </h2>
    
    <ErrorBanner 
      v-if="errorMessage" 
      :message="errorMessage" 
      class="mb-6"
    />

    <form
      class="grid sm:grid-cols-3 gap-3 mb-6"
      @submit.prevent="create"
    >
      <input
        v-model="email"
        class="input"
        placeholder="Email"
        :disabled="isLoading"
      >
      <input
        v-model="password"
        class="input"
        placeholder="Password"
        :disabled="isLoading"
      >
      <select
        v-model="role"
        class="select"
        :disabled="isLoading"
      >
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
        class="btn-primary flex items-center justify-center gap-2"
        :disabled="isLoading"
      >
        <LoadingSpinner
          v-if="isLoading"
          class="w-4 h-4"
        />
        <span>Create</span>
      </button>
    </form>

    <div
      v-if="isLoading && !users.length"
      class="flex justify-center p-8"
    >
      <LoadingSpinner class="w-8 h-8 text-brutal-black" />
    </div>

    <div
      v-else
      class="grid gap-3"
    >
      <div
        v-if="users.length === 0"
        class="text-center py-8 text-neutral-500"
      >
        No users found.
      </div>
      <div
        v-for="u in users"
        :key="u.id"
        class="card p-5 grid sm:grid-cols-4 gap-3 items-center"
      >
        <div>
          <div class="font-semibold">
            {{ u.email }}
          </div>
          <div class="text-sm">
            {{ u.role }}
          </div>
        </div>
        <select
          v-model="u.role"
          class="select"
          :disabled="isLoading"
        >
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
        <select
          v-model="u.status"
          class="select"
          :disabled="isLoading"
        >
          <option value="active">
            Active
          </option>
          <option value="banned">
            Banned
          </option>
        </select>
        <div class="flex gap-2">
          <button
            class="btn-secondary"
            :disabled="isLoading"
            @click="update(u)"
          >
            Update
          </button>
          <button
            class="btn-secondary text-red-600 hover:bg-red-50 border-red-200"
            :disabled="isLoading"
            @click="remove(u)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase/client'
import { adminUsers } from '@/lib/adminApi'
import ErrorBanner from '@/components/ErrorBanner.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

type UIUser = { id: string; email: string; role: 'super_admin'|'junior_admin'|'user'; status: 'active'|'banned' }
const email = ref('')
const password = ref('')
const role = ref<'super_admin'|'junior_admin'|'user'>('user')
const users = ref<UIUser[]>([])
const isLoading = ref(false)
const errorMessage = ref('')

async function fetchUsers() {
  errorMessage.value = ''
  try {
    const { data, error } = await supabase.from('profiles').select('id, email, role')
    if (error) throw error
    users.value = (data || []).map((p: any) => ({ id: p.id, email: p.email || '', role: p.role, status: 'active' }))
  } catch (err: any) {
    console.error('Fetch users error:', err)
    errorMessage.value = 'Failed to load users: ' + (err.message || 'Unknown error')
  }
}

async function create() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    await adminUsers('create', { email: email.value, password: password.value, role: role.value })
    email.value = ''
    password.value = ''
    role.value = 'user'
    await fetchUsers()
  } catch (err: any) {
    console.error('Create user error:', err)
    errorMessage.value = 'Failed to create user: ' + (err.message || 'Server error')
  } finally {
    isLoading.value = false
  }
}

async function update(u: UIUser) {
  isLoading.value = true
  errorMessage.value = ''
  try {
    await adminUsers('update', { user_id: u.id, role: u.role, status: u.status })
    await fetchUsers()
  } catch (err: any) {
    console.error('Update user error:', err)
    errorMessage.value = 'Failed to update user: ' + (err.message || 'Server error')
  } finally {
    isLoading.value = false
  }
}

async function remove(u: UIUser) {
  if (!confirm(`Are you sure you want to delete user ${u.email}?`)) return
  
  isLoading.value = true
  errorMessage.value = ''
  try {
    await adminUsers('delete', { user_id: u.id })
    await fetchUsers()
  } catch (err: any) {
    console.error('Delete user error:', err)
    errorMessage.value = 'Failed to delete user: ' + (err.message || 'Server error')
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  await fetchUsers()
  isLoading.value = false
})
</script>
