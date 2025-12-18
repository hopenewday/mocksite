import { ref, watch } from 'vue'
import { supabase } from '../../../supabase/client'
import type { Result } from '../types'

const results = ref<Result[]>([])
const isLoading = ref(false)
const error = ref<Error | null>(null)

export const useResults = () => {
  const fetchResults = async () => {
    isLoading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase
        .from('results')
        .select('*, tests(title), profiles(email)')

      if (fetchError) {
        throw fetchError
      }
      results.value = data || []
    } catch (e: any) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  watch([], fetchResults, { immediate: true })

  return { results, isLoading, error, fetch: fetchResults }
}
