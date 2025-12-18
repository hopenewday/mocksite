
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { VaModal, VaDataTable, VaCheckbox } from 'vuestic-ui'
import { useQuestions } from '../../questions/composables/useQuestions'
import type { Test } from '../types'
import type { Question } from '../../questions/types'
import { supabase } from '../../../supabase/client'

const props = defineProps<{
  modelValue: boolean
  test: Test | null
}>()

const emit = defineEmits(['update:modelValue', 'save', 'close'])

const { questions, fetch: fetchQuestions } = useQuestions()
const selectedQuestions = ref<string[]>([])

watch(
  () => props.test,
  async (val) => {
    if (val) {
      const { data, error } = await supabase
        .from('questions')
        .select('id')
        .eq('test_id', val.id)
      if (error) {
        console.error(error)
      } else {
        selectedQuestions.value = data.map((q) => q.id)
      }
    } else {
      selectedQuestions.value = []
    }
  },
  { immediate: true },
)

const isModalVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const handleSave = async () => {
  if (props.test) {
    const { error } = await supabase
      .from('questions')
      .update({ test_id: null })
      .eq('test_id', props.test.id)

    if (error) {
      console.error(error)
      return
    }

    const { error: updateError } = await supabase
      .from('questions')
      .update({ test_id: props.test.id })
      .in('id', selectedQuestions.value)

    if (updateError) {
      console.error(updateError)
    } else {
      emit('save')
    }
  }
}

const columns = [
  { key: 'selection', label: '' },
  { key: 'content_en.text', label: 'Question' },
]
</script>

<template>
  <VaModal v-model="isModalVisible" title="Manage Questions" @ok="handleSave" @cancel="emit('close')">
    <VaDataTable :items="questions" :columns="columns">
      <template #cell(selection)="{ rowData }">
        <VaCheckbox v-model="selectedQuestions" :array-value="rowData.id" />
      </template>
    </VaDataTable>
  </VaModal>
</template>
