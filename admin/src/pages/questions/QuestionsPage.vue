
<script setup lang="ts">
import { ref } from 'vue'
import {
  VaCard,
  VaCardTitle,
  VaCardContent,
  VaDataTable,
  VaInput,
  VaIcon,
  VaButton,
  VaFileUpload,
} from 'vuestic-ui'
import { useQuestions } from './composables/useQuestions'
import QuestionsTable from './widgets/QuestionsTable.vue'
import CreateQuestionModal from './widgets/CreateQuestionModal.vue'
import type { Question } from './types'
import { supabase } from '../../../supabase/client'
import { useToast } from 'vuestic-ui'
import { unparse } from 'papaparse'
import { env } from '../../../config/env'

const { questions, isLoading, filters, sorting, pagination, fetch } = useQuestions()
const { init: notify } = useToast()

const showCreateQuestionModal = ref(false)
const editingQuestion = ref<Question | null>(null)
const file = ref<File | null>(null)

const handleSave = async (question: Question) => {
  showCreateQuestionModal.value = false
  if (editingQuestion.value) {
    const { error } = await supabase.from('questions').update(question).eq('id', editingQuestion.value.id)
    if (error) {
      notify({ message: error.message, color: 'danger' })
    } else {
      notify({ message: 'Question updated successfully', color: 'success' })
    }
  } else {
    const { error } = await supabase.from('questions').insert(question)
    if (error) {
      notify({ message: error.message, color: 'danger' })
    } else {
      notify({ message: 'Question created successfully', color: 'success' })
    }
  }
  fetch()
}

const handleEdit = (question: Question) => {
  editingQuestion.value = question
  showCreateQuestionModal.value = true
}

const handleDelete = async (question: Question) => {
  if (confirm(`Are you sure you want to delete this question?`)) {
    const { error } = await supabase.from('questions').delete().eq('id', question.id)
    if (error) {
      notify({ message: error.message, color: 'danger' })
    } else {
      notify({ message: 'Question deleted successfully', color: 'success' })
    }
    fetch()
  }
}

const handleFileUpload = (files: File[]) => {
  file.value = files[0]
}

const handleImport = async () => {
  if (!file.value) {
    notify({
      message: 'Please select a file to import.',
      color: 'danger',
    })
    return
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const token = session?.access_token

  if (!token) {
    notify({
      message: 'You must be logged in to import questions.',
      color: 'danger',
    })
    return
  }

  const formData = new FormData()
  formData.append('file', file.value)

  try {
    const response = await fetch(env.edgeCsvUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRF-Token': env.csrfToken,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to import questions.')
    }

    notify({
      message: 'Questions imported successfully.',
      color: 'success',
    })
    fetch() // Refresh the table
  } catch (e: any) {
    notify({
      message: e.message,
      color: 'danger',
    })
  }
}

const handleExport = async () => {
  try {
    const { data, error } = await supabase.from('questions').select('*, tests(title)')
    if (error) throw error

    const csvData = data.map((q) => ({
      ...q,
      test_title: q.tests.title,
      content_en: JSON.stringify(q.content_en),
      content_hi: JSON.stringify(q.content_hi),
      options: JSON.stringify(q.options),
    }))

    const csv = unparse(csvData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'questions.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (e: any) {
    notify({
      message: e.message,
      color: 'danger',
    })
  }
}
</script>

<template>
  <h1 class="page-title">Question Bank</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput v-model="filters.search" placeholder="Search by question">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
          <VaButton
            @click="
              editingQuestion = null
              showCreateQuestionModal = true
            "
            >Create Question</VaButton
          >
        </div>
        <div class="flex flex-col md:flex-row gap-2 justify-end">
          <VaFileUpload v-model="file" @file-added="handleFileUpload" />
          <VaButton @click="handleImport">Import</VaButton>
          <VaButton @click="handleExport" color="secondary">Export to CSV</VaButton>
        </div>
      </div>

      <QuestionsTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :questions="questions"
        :loading="isLoading"
        :pagination="pagination"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </VaCardContent>
  </VaCard>

  <CreateQuestionModal
    v-model="showCreateQuestionModal"
    :question="editingQuestion"
    @save="handleSave"
    @close="showCreateQuestionModal = false"
  />
</template>
