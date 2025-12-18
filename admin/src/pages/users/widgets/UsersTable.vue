<script setup lang="ts">
import { defineVaDataTableColumns } from 'vuestic-ui'
import { User } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/users'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
  { label: 'Email', key: 'email', sortable: true },
  { label: 'Role', key: 'role', sortable: true },
  { label: 'Created At', key: 'created_at', sortable: true },
  { label: 'Actions', key: 'actions' },
])

const props = defineProps({
  users: {
    type: Array as PropType<User[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
  sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, default: null },
  showActions: { type: Boolean, default: true },
})

const emit = defineEmits<{
  (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
  (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
  (event: 'edit', user: User): void
  (event: 'delete', user: User): void
}>()

const users = toRef(props, 'users')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="users"
    :loading="$props.loading"
  >
    <template #cell(actions)="{ rowData }">
      <div v-if="showActions" class="flex gap-2">
        <VaButton preset="primary" size="small" @click="$emit('edit', rowData)">Edit</VaButton>
        <VaButton preset="danger" size="small" @click="$emit('delete', rowData)">Delete</VaButton>
      </div>
    </template>
  </VaDataTable>

  <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
    <div>
      <b>{{ $props.pagination.total }} results.</b>
      Results per page
      <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
    </div>

    <div v-if="totalPages > 1" class="flex">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        aria-label="Previous page"
        :disabled="$props.pagination.page === 1"
        @click="$props.pagination.page--"
      />
      <VaButton
        class="mr-2"
        preset="secondary"
        icon="va-arrow-right"
        aria-label="Next page"
        :disabled="$props.pagination.page === totalPages"
        @click="$props.pagination.page++"
      />
      <VaPagination
        v-model="$props.pagination.page"
        buttons-preset="secondary"
        :pages="totalPages"
        :visible-pages="5"
        :boundary-links="false"
        :direction-links="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
