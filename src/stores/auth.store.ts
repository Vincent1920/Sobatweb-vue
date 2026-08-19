import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser } from '@/types'
import { tokenStorage } from '@/utils/storage'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const token = ref<string | null>(tokenStorage.get())
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => Boolean(token.value))
  function loginDemo(role: 'school' | 'admin'): void {
    const nextUser: AuthUser = {
      id: role === 'admin' ? 'admin-1' : 'school-user-1',
      name: role === 'admin' ? 'Super Admin' : 'Ahmad Fauzi, S.Kom.',
      email: role === 'admin' ? 'superadmin@edusite.id' : 'admin@smksobat.sch.id',
      role,
    }
    token.value = `demo-${role}-token`
    user.value = nextUser
    tokenStorage.set(token.value)
  }
  function clearSession(): void {
    user.value = null
    token.value = null
    tokenStorage.remove()
  }
  return { user, token, loading, error, isAuthenticated, loginDemo, clearSession }
})
