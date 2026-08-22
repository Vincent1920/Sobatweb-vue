import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { DashboardData } from '@/types'
import { dashboardService } from '@/services/dashboard.service'
import { normalizeApiError } from '@/utils/error-handler'

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref<DashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard(): Promise<void> {
    loading.value = true
    error.value = null
    data.value = null
    try {
      const response = await dashboardService.get()
      data.value = response.data.data
    } catch (cause) {
      error.value = normalizeApiError(cause).message
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchDashboard }
})
