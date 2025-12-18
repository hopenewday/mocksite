import { ref, watch } from 'vue'
import { supabase } from '../../../supabase/client'
import type { AuditLog } from '../types'

const auditLogs = ref<AuditLog[]>([])
const isLoading = ref(false)
const error = ref<Error | null>(null)

export const useAuditLogs = () => {
  const fetchAuditLogs = async () => {
    isLoading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('audit_logs')
        .select('*, profiles(email)')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }
      auditLogs.value = data || []
    } catch (e: any) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  watch([], fetchAuditLogs, { immediate: true })

  return { auditLogs, isLoading, error, fetch: fetchAuditLogs }
}
