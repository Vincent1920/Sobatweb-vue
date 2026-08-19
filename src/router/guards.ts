import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function registerGuards(router: Router): void {
  router.beforeEach((to) => {
    const auth = useAuthStore()
    if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
    if (to.meta.guestOnly && auth.isAuthenticated) return auth.user?.role === 'admin' ? '/admin' : '/dashboard'
    if (to.meta.role && auth.user && to.meta.role !== auth.user.role) return auth.user.role === 'admin' ? '/admin' : '/dashboard'
    return true
  })
}
