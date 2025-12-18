<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { VaModal, VaInput } from 'vuestic-ui'
import type { Category } from '../types'

const props = defineProps<{
  modelValue: boolean
  category: Category | null
}>()

const emit = defineEmits(['update:modelValue', 'save', 'close'])

const newCategory = ref<Category>({
  id: '',
  name: '',
  created_at: '',
})

watch(
  () => props.category,
  (val) => {
    if (val) {
      newCategory.value = { ...val }
    } else {
      newCategory.value = { id: '', name: '', created_at: '' }
    }
  },
  { immediate: true },
)

const isModalVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const handleSave = () => {
  emit('save', newCategory.value)
}
</script>

<template>
  <VaModal v-model="isModalVisible" title="Edit Category" @ok="handleSave" @cancel="emit('close')">
    <VaInput v-model="newCategory.name" label="Name" class="mb-4" />
  </VaModal>
</template>
