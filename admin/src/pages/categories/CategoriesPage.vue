<script setup lang="ts">
import { ref } from 'vue'
import { VaCard, VaCardContent, VaDataTable, VaButton } from 'vuestic-ui'
import { useCategories } from './composables/useCategories'
import CreateCategoryModal from './widgets/CreateCategoryModal.vue'
import type { Category } from './types'
import { supabase } from '../../../supabase/client'
import { useToast } from 'vuestic-ui'

const { categories, isLoading, fetch } = useCategories()
const { init: notify } = useToast()

const showCreateCategoryModal = ref(false)
const editingCategory = ref<Category | null>(null)

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'created_at', label: 'Created At', sortable: true },
  { key: 'actions', label: 'Actions' },
]

const handleSave = async (category: Category) => {
  showCreateCategoryModal.value = false
  if (editingCategory.value) {
    const { error } = await supabase.from('categories').update(category).eq('id', editingCategory.value.id)
    if (error) {
      notify({ message: error.message, color: 'danger' })
    } else {
      notify({ message: 'Category updated successfully', color: 'success' })
    }
  } else {
    const { error } = await supabase.from('categories').insert([category])
    if (error) {
      notify({ message: error.message, color: 'danger' })
    } else {
      notify({ message: 'Category created successfully', color: 'success' })
    }
  }
  fetch()
}

const handleEdit = (category: Category) => {
  editingCategory.value = category
  showCreateCategoryModal.value = true
}

const handleDelete = async (category: Category) => {
  if (confirm()) {
    const { error } = await supabase.from('categories').delete().eq('id', category.id)
    if (error) {
      notify({ message: error.message, color: 'danger' })
    } else {
      notify({ message: 'Category deleted successfully', color: 'success' })
    }
    fetch()
  }
}
</script>

<template>
  <h1 class="page-title">Category Management</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex justify-end mb-4">
        <VaButton @click="showCreateCategoryModal = true">Create Category</VaButton>
      </div>

      <VaDataTable :items="categories" :columns="columns" :loading="isLoading">
        <template #cell(actions)="{ rowData }">
          <div class="flex gap-2">
            <VaButton preset="primary" size="small" @click="handleEdit(rowData)">Edit</VaButton>
            <VaButton preset="danger" size="small" @click="handleDelete(rowData)">Delete</VaButton>
          </div>
        </template>
      </VaDataTable>
    </VaCardContent>
  </VaCard>

  <CreateCategoryModal
    v-model="showCreateCategoryModal"
    :category="editingCategory"
    @save="handleSave"
    @close="showCreateCategoryModal = false"
  />
</template>
