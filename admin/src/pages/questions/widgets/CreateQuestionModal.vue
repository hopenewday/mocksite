
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { VaModal, VaInput, VaSelect, VaButton, VaIcon } from 'vuestic-ui'
import type { Question } from './types'

const props = defineProps<{
  modelValue: boolean
  question: Question | null
}>()

const emit = defineEmits(['update:modelValue', 'save', 'close'])

const newQuestion = ref<Question>({
  test_id: '',
  type: 'multiple_choice',
  content_en: {},
  content_hi: {},
  options: [],
  correct_answer: [],
  explanation_en: '',
  explanation_hi: '',
})

watch(
  () => props.question,
  (val) => {
    if (val) {
      newQuestion.value = { ...val }
    } else {
      newQuestion.value = {
        test_id: '',
        type: 'multiple_choice',
        content_en: {},
        content_hi: {},
        options: [],
        correct_answer: [],
        explanation_en: '',
        explanation_hi: '',
      }
    }
  },
  { immediate: true },
)

const isModalVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const handleSave = () => {
  emit('save', newQuestion.value)
}

const addOption = () => {
  newQuestion.value.options.push({ text_en: '', text_hi: '' })
}

const removeOption = (index: number) => {
  newQuestion.value.options.splice(index, 1)
}
</script>

<template>
  <VaModal v-model="isModalVisible" title="Create/Edit Question" @ok="handleSave" @cancel="emit('close')">
    <VaInput v-model="newQuestion.test_id" label="Test ID" class="mb-4" />
    <VaSelect
      v-model="newQuestion.type"
      label="Type"
      :options="['multiple_choice', 'multiple_answer', 'short_answer', 'long_answer']"
      class="mb-4"
    />
    <VaInput v-model="newQuestion.content_en.text" label="Content (English)" class="mb-4" />
    <VaInput v-model="newQuestion.content_hi.text" label="Content (Hindi)" class="mb-4" />

    <div v-if="newQuestion.type === 'multiple_choice' || newQuestion.type === 'multiple_answer'">
      <h3 class="mb-2">Options</h3>
      <div v-for="(option, index) in newQuestion.options" :key="index" class="flex items-center gap-2 mb-2">
        <VaInput v-model="option.text_en" placeholder="English" />
        <VaInput v-model="option.text_hi" placeholder="Hindi" />
        <VaButton @click="removeOption(index)" preset="secondary" icon="delete" />
      </div>
      <VaButton @click="addOption" preset="primary">Add Option</VaButton>
    </div>

    <VaInput v-model="newQuestion.correct_answer[0]" label="Correct Answer" class="mb-4" />
    <VaInput v-model="newQuestion.explanation_en" label="Explanation (English)" class="mb-4" type="textarea" />
    <VaInput v-model="newQuestion.explanation_hi" label="Explanation (Hindi)" class="mb-4" type="textarea" />
  </VaModal>
</template>
