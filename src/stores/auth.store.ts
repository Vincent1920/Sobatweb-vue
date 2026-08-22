import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthSession, AuthUser, LoginPayload, RegisterPayload } from '@/types'
import { authService } from '@/services/auth.service'
import { normalizeApiError } from '@/utils/error-handler'
import { refreshTokenStorage, tokenStorage } from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const accessToken = ref<string | null>(tokenStorage.get())
  const refreshToken = ref<string | null>(refreshTokenStorage.get())
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => Boolean(accessToken.value && user.value))

  function saveSession(session: AuthSession): void {
    user.value = session.user
    accessToken.value = session.accessToken
    refreshToken.value = session.refreshToken
    tokenStorage.set(session.accessToken)
    refreshTokenStorage.set(session.refreshToken)
  }

  async function authenticate(request: () => ReturnType<typeof authService.login>): Promise<AuthUser> {
    loading.value = true
    error.value = null
    try {
      const response = await request()
      saveSession(response.data.data)
      return response.data.data.user
    } catch (cause) {
      error.value = normalizeApiError(cause).message
      throw cause
    } finally {
      loading.value = false
    }
  }

  const login = (payload: LoginPayload) => authenticate(() => authService.login(payload))
  const register = (payload: RegisterPayload) => authenticate(() => authService.register(payload))

  async function fetchMe(): Promise<AuthUser> {
    const response = await authService.me()
    user.value = response.data.data.user
    return user.value
  }

  async function restoreSession(): Promise<void> {
    if (!accessToken.value || !refreshToken.value) return clearSession()
    try {
      await fetchMe()
      accessToken.value = tokenStorage.get()
      refreshToken.value = refreshTokenStorage.get()
    } catch {
      clearSession()
    }
  }

  async function logout(): Promise<void> {
    const currentRefreshToken = refreshToken.value
    try {
      if (currentRefreshToken) await authService.logout(currentRefreshToken)
    } finally {
      clearSession()
    }
  }

  function clearSession(): void {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    tokenStorage.remove()
    refreshTokenStorage.remove()
  }
  return { user, accessToken, refreshToken, loading, error, isAuthenticated, login, register, fetchMe, restoreSession, logout, clearSession }
})
