import api from './api'
import type { ApiResponse, SchoolProfile, SupportedTimezone } from '@/types'

export const schoolService = {
  getProfile: () => api.get<ApiResponse<SchoolProfile>>('/school/profile'),
  updateTimezone: (timezone: SupportedTimezone) =>
    api.put<ApiResponse<{ timezone: SupportedTimezone }>>('/school/profile', { timezone }),
}
