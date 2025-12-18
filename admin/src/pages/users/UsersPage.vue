<script setup lang="ts">
import { ref } from 'vue'
import { VaCard, VaCardTitle, VaCardContent, VaDataTable, VaInput, VaIcon, VaButton } from 'vuestic-ui'
import { useUsers } from './composables/useUsers'
import UsersTable from './widgets/UsersTable.vue'
import CreateUserModal from './widgets/CreateUserModal.vue'
import type { User } from './types'
import { supabase } from '../../../supabase/client'
import { useToast } from 'vuestic-ui'

const { users, isLoading, filters, sorting, pagination, fetch } = useUsers()
const { init: notify } = useToast()

const showCreateUserModal = ref(false)
const editingUser = ref<User | null>(null)

const handleSave = async (user: User) => {
  showCreateUserModal.value = false
  if (editingUser.value) {
    const { error } = await supabase.from('profiles').update(user).eq('id', editingUser.value.id)
    if (error) {
      notify({ message: error.message, color: 'danger' })
    } else {
      notify({ message: 'User updated successfully', color: 'success' })
    }
  } else {
    // Note: Creating a user requires a different flow (e.g., inviting a user)
    // This is a simplified example.
    notify({ message: 'User creation not implemented in this demo.', color: 'warning' })
  }
  fetch()
}

const handleEdit = (user: User) => {
  editingUser.value = user
  showCreateUserModal.value = true
}

const handleDelete = async (user: User) => {
  if (confirm()) {
    const { error } = await supabase.from('profiles').delete().eq('id', user.id)
    if (error) {
      notify({ message: error.message, color: 'danger' })
    } else {
      notify({ message: 'User deleted successfully', color: 'success' })
    }
    fetch()
  }
}
</script>

<template>
  <h1 class="page-title">User Management</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput v-model="filters.search" placeholder="Search by user">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
      </div>

      <UsersTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :users="users"
        :loading="isLoading"
        :pagination="pagination"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </VaCardContent>
  </VaCard>

  <CreateUserModal
    v-model="showCreateUserModal"
    :user="editingUser"
    @save="handleSave"
    @close="showCreateUserModal = false"
  />
</template>
