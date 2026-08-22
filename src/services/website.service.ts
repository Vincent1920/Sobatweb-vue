import api from './api'
import type { ApiResponse } from '@/types'
import type { WebsitePage } from '@/types/page'
export type { WebsitePage } from '@/types/page'

export interface WebsiteEditorContext {
  id: string
  schoolName: string
  fullDomain: string
  pages: WebsitePage[]
  theme: WebsiteTheme
  seo: WebsiteSeo
}

export interface WebsiteTheme { primaryColor: string; primaryDark: string; accentColor: string; fontFamily: string; borderRadius: 'sm' | 'md' | 'lg' | 'full'; colorMode?: string }
export interface WebsiteSeo { title: string; description: string; keywords: string; ogImage: string }
export interface WebsiteNavigationItem { id: string; label: string; url: string; target: '_self' | '_blank'; order: number; isSystem: boolean }

export const websiteService = {
  get: () => api.get<ApiResponse<WebsiteEditorContext>>('/website'),
  listNavigation: () => api.get<ApiResponse<WebsiteNavigationItem[]>>('/website/navigation'),
  updateTheme: (payload: WebsiteTheme) => api.put<ApiResponse<Record<string, never>>>('/website/theme', payload),
  updateSeo: (payload: WebsiteSeo) => api.put<ApiResponse<Record<string, never>>>('/website/seo', payload),
  publish: () => api.post<ApiResponse<Record<string, never>>>('/website/publish'),
}
