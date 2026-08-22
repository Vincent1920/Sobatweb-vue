import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, RefreshSession } from '@/types'
import { refreshTokenStorage, tokenStorage } from '@/utils/storage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }
let refreshRequest: Promise<string> | null = null

function clearTokens(): void {
  tokenStorage.remove()
  refreshTokenStorage.remove()
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined
    const refreshToken = refreshTokenStorage.get()
    const isAuthRequest = config?.url?.includes('/auth/login') || config?.url?.includes('/auth/register') || config?.url?.includes('/auth/refresh')

    if (error.response?.status !== 401 || !config || config._retry || !refreshToken || isAuthRequest) {
      return Promise.reject(error)
    }

    config._retry = true
    refreshRequest ??= api
      .post<ApiResponse<RefreshSession>>('/auth/refresh', { refreshToken })
      .then(({ data }) => {
        tokenStorage.set(data.data.accessToken)
        refreshTokenStorage.set(data.data.refreshToken)
        return data.data.accessToken
      })
      .catch((refreshError: unknown) => {
        clearTokens()
        throw refreshError
      })
      .finally(() => {
        refreshRequest = null
      })

    config.headers.Authorization = `Bearer ${await refreshRequest}`
    return api(config)
  },
)
export default api
