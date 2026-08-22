import api from './api'
import type { ApiResponse, AuthSession, AuthUser, LoginPayload, RefreshSession, RegisterPayload } from '@/types'

export const authService = {
  login: (payload: LoginPayload) => api.post<ApiResponse<AuthSession>>('/auth/login', payload),
  register: (payload: RegisterPayload) => api.post<ApiResponse<AuthSession>>('/auth/register', payload),
  me: () => api.get<ApiResponse<{ user: AuthUser }>>('/auth/me'),
  refresh: (refreshToken: string) => api.post<ApiResponse<RefreshSession>>('/auth/refresh', { refreshToken }),
  logout: (refreshToken: string) => api.post<ApiResponse<Record<string, never>>>('/auth/logout', { refreshToken }),
}
