import api from './api'
import type { ApiResponse, NewSection, SectionItem } from '@/types'

export const sectionService = {
  list: (pageId: string) => api.get<ApiResponse<SectionItem[]>>(`/pages/${pageId}/sections`),
  create: (pageId: string, payload: NewSection) =>
    api.post<ApiResponse<{ section: SectionItem }>>(`/pages/${pageId}/sections`, payload),
  update: (id: string, payload: Partial<Pick<SectionItem, 'title' | 'subtitle' | 'content' | 'settings' | 'hidden' | 'sortOrder'>>) =>
    api.put<ApiResponse<{ section: SectionItem }>>(`/sections/${id}`, payload),
  remove: (id: string) => api.delete<ApiResponse<Record<string, never>>>(`/sections/${id}`),
  duplicate: (id: string) => api.post<ApiResponse<{ section: SectionItem }>>(`/sections/${id}/duplicate`),
  move: (id: string, direction: 'up' | 'down') =>
    api.put<ApiResponse<Record<string, never>>>(`/sections/${id}/move`, { direction }),
  reorder: (ids: string[]) => api.put<ApiResponse<Record<string, never>>>('/sections/reorder', { ids }),
}
