import 'vue-router'
import type { UserRole } from '@/types'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    guestOnly?: boolean
    role?: UserRole
  }
}
