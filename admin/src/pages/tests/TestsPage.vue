
<script setup lang="ts">
import { ref } from 'vue'
import { VaCard, VaCardTitle, VaCardContent, VaDataTable, VaInput, VaIcon, VaButton } from 'vuestic-ui'
import { useTests } from './composables/useTests'
import TestsTable from './widgets/TestsTable.vue'
import CreateTestModal from './widgets/CreateTestModal.vue'
import ManageQuestionsModal from './widgets/ManageQuestionsModal.vue'
import type { Test } from './types'
import { supabase } from '../../../supabase/client'
import { useToast } from 'vuestic-ui'

const { tests, isLoading, filters, sorting, pagination, fetch } = useTests()
const { init: notify } = useToast()

const showCreateTestModal = ref(false)
const showManageQuestionsModal = ref(false)
const editingTest = ref<Test | null>(null)
const managingQuestionsTest = ref<Test | null>(null)

const handleSave = async (test: Test) => {
  showCreateTestModal.value = false
  if (editingTest.value) {
    const { error } = await supabase.from('tests').update(test).eq('id', editingTest.value.id)
    if (error) {
      notify({ message: error.message, color: 'danger' })
    } else {
      notify({ message: 'Test updated successfully', color: 'success' })
    }
  } else {
    const { error } = await supabase.from('tests').insert(test)
    if (error) {
      notify({ message: error.message, color: 'danger' })
    } else {
      notify({ message: 'Test created successfully', color: 'success' })
    }
  }
  fetch()
}

const handleEdit = (test: Test) => {
  editingTest.value = test
  showCreateTestModal.value = true
}

const handleDelete = async (test: Test) => {
  if (confirm(`Are you sure you want to delete this test?`)) {
    const { error } = await supabase.from('tests').delete().eq('id', test.id)
    if (error) {
      notify({ message: error.message, color: 'danger' })
    } else {
      notify({ message: 'Test deleted successfully', color: 'success' })
    }
    fetch()
  }
}

const handleManageQuestions = (test: Test) => {
  managingQuestionsTest.value = test
  showManageQuestionsModal.value = true
}
</script>

<template>
  <h1 class="page-title">Test Management</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput v-model="filters.search" placeholder="Search by test">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
          <VaButton
            @click="
              editingTest = null
              showCreateTestModal = true
            "
            >Create Test</VaButton
          >
        </div>
      </div>

      <TestsTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :tests="tests"
        :loading="isLoading"
        :pagination="pagination"
        @edit="handleEdit"
        @delete="handleDelete"
        @manage-questions="handleManageQuestions"
      />
    </VaCardContent>
  </VaCard>

  <CreateTestModal
    v-model="showCreateTestModal"
    :test="editingTest"
    @save="handleSave"
    @close="showCreateTestModal = false"
  />

  <ManageQuestionsModal
    v-model="showManageQuestionsModal"
    :test="managingQuestionsTest"
    @save="
      fetch()
      showManageQuestionsModal = false
    "
    @close="showManageQuestionsModal = false"
  />
</template>
