import { ref, watch } from 'vue'
import { supabase } from '../../../supabase/client'
import type { Category } from '../types'

const categories = ref<Category[]>([])
const isLoading = ref(false)
const error = ref<Error | null>(null)

export const useCategories = () => {
  const fetchCategories = async () => {
    isLoading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await supabase.from('categories').select('*')

      if (fetchError) {
        throw fetchError
      }
      categories.value = data || []
    } catch (e: any) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  watch([], fetchCategories, { immediate: true })

  return { categories, isLoading, error, fetch: fetchCategories }
}
