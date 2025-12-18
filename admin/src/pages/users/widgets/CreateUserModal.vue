<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { VaModal, VaInput, VaSelect } from 'vuestic-ui'
import type { User } from '../types'

const props = defineProps<{
  modelValue: boolean
  user: User | null
}>()

const emit = defineEmits(['update:modelValue', 'save', 'close'])

const newUser = ref<User>({
  id: '',
  email: '',
  role: 'student',
  created_at: '',
  updated_at: '',
})

watch(
  () => props.user,
  (val) => {
    if (val) {
      newUser.value = { ...val }
    } else {
      // Reset for creation if needed
    }
  },
  { immediate: true },
)

const isModalVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const handleSave = () => {
  emit('save', newUser.value)
}
</script>

<template>
  <VaModal v-model="isModalVisible" title="Edit User" @ok="handleSave" @cancel="emit('close')">
    <VaInput v-model="newUser.email" label="Email" class="mb-4" disabled />
    <VaSelect
      v-model="newUser.role"
      label="Role"
      :options="['super_admin', 'junior_admin', 'student']"
      class="mb-4"
    />
  </VaModal>
</template>
