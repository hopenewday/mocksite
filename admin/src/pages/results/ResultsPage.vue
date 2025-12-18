<script setup lang="ts">
import { VaCard, VaCardContent, VaDataTable } from 'vuestic-ui'
import { useResults } from './composables/useResults'

const { results, isLoading } = useResults()

const columns = [
  { key: 'tests.title', label: 'Test', sortable: true },
  { key: 'profiles.email', label: 'User', sortable: true },
  { key: 'score', label: 'Score', sortable: true },
  { key: 'completed_at', label: 'Completed At', sortable: true },
]
</script>

<template>
  <h1 class="page-title">Results & Analytics</h1>

  <VaCard>
    <VaCardContent>
      <VaDataTable :items="results" :columns="columns" :loading="isLoading" />
    </VaCardContent>
  </VaCard>
</template>
