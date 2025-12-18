
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { VaModal, VaInput } from 'vuestic-ui'
import type { Test } from './types'

const props = defineProps<{
  modelValue: boolean
  test: Test | null
}>()

const emit = defineEmits(['update:modelValue', 'save', 'close'])

const newTest = ref<Test>({
  title: '',
  time_limit: 60,
})

watch(
  () => props.test,
  (val) => {
    if (val) {
      newTest.value = { ...val }
    } else {
      newTest.value = {
        title: '',
        time_limit: 60,
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
  emit('save', newTest.value)
}
</script>

<template>
  <VaModal v-model="isModalVisible" title="Create/Edit Test" @ok="handleSave" @cancel="emit('close')">
    <VaInput v-model="newTest.title" label="Title" class="mb-4" />
    <VaInput v-model.number="newTest.time_limit" label="Time Limit (minutes)" type="number" class="mb-4" />
  </VaModal>
</template>
