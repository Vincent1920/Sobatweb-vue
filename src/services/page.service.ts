import api from './api'
import type { ApiResponse } from '@/types'
import type { PageInput, WebsitePage } from '@/types/page'

interface PageMutationResponse { page: WebsitePage }
interface PageCreateResponse extends PageMutationResponse { id: string }

export const pageService = {
  list: () => api.get<ApiResponse<WebsitePage[]>>('/website/pages'),
  create: (payload: PageInput) => api.post<ApiResponse<PageCreateResponse>>('/website/pages', payload),
  update: (id: string, payload: PageInput) => api.patch<ApiResponse<PageMutationResponse>>(`/website/pages/${id}`, payload),
  remove: (id: string) => api.delete<ApiResponse<Record<string, never>>>(`/website/pages/${id}`),
  setHome: (id: string) => api.patch<ApiResponse<PageMutationResponse>>(`/website/pages/${id}/set-home`),
}
