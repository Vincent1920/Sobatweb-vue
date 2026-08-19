import api from './api'
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from '@/types'

export const authService = {
  login: (payload: LoginPayload) => api.post<AuthResponse>('/auth/login', payload),
  register: (payload: RegisterPayload) => api.post<AuthResponse>('/auth/register', payload),
  me: () => api.get<AuthUser>('/auth/me'),
  logout: () => api.post<void>('/auth/logout'),
}
