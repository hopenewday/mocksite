<script setup lang="ts">
import { VaCard, VaCardContent, VaDataTable } from 'vuestic-ui'
import { useAuditLogs } from './composables/useAuditLogs'

const { auditLogs, isLoading } = useAuditLogs()

const columns = [
  { key: 'profiles.email', label: 'User', sortable: true },
  { key: 'action', label: 'Action', sortable: true },
  { key: 'details', label: 'Details', sortable: true },
  { key: 'created_at', label: 'Timestamp', sortable: true },
]
</script>

<template>
  <h1 class="page-title">Audit Logs</h1>

  <VaCard>
    <VaCardContent>
      <VaDataTable :items="auditLogs" :columns="columns" :loading="isLoading" />
    </VaCardContent>
  </VaCard>
</template>
