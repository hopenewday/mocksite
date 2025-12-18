
import { ref, watch } from 'vue'
import { supabase } from '../../supabase/client'
import type { Test } from './types'

const tests = ref<Test[]>([])
const isLoading = ref(false)
const error = ref<Error | null>(null)
const filters = ref({
  search: '',
})
const sorting = ref({
  sortBy: 'title',
  sortingOrder: 'asc' as const,
})
const pagination = ref({
  page: 1,
  perPage: 10,
  total: 0,
})

export const useTests = () => {
  const fetchTests = async () => {
    isLoading.value = true
    error.value = null
    try {
      const from = (pagination.value.page - 1) * pagination.value.perPage
      const to = from + pagination.value.perPage - 1

      let query = supabase
        .from('tests')
        .select('*', { count: 'exact' })
        .order(sorting.value.sortBy, { ascending: sorting.value.sortingOrder === 'asc' })
        .range(from, to)

      if (filters.value.search) {
        query = query.ilike('title', `%${filters.value.search}%`)
      }

      const { data, error: fetchError, count } = await query

      if (fetchError) {
        throw fetchError
      }
      tests.value = data || []
      pagination.value.total = count || 0
    } catch (e: any) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  watch([filters, sorting, pagination], fetchTests, { deep: true, immediate: true })

  return { tests, isLoading, error, filters, sorting, pagination, fetch: fetchTests }
}
