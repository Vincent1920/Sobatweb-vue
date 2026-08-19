import type { RouteRecordRaw } from 'vue-router'

const placeholder = () => import('@/views/shared/PlaceholderView.vue')

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  {
    path: '/', component: () => import('@/layouts/AuthLayout.vue'), meta: { guestOnly: true },
    children: [
      { path: 'login', name: 'login', component: () => import('@/views/auth/LoginView.vue'), meta: { title: 'Masuk' } },
      { path: 'register', name: 'register', component: () => import('@/views/auth/RegisterView.vue'), meta: { title: 'Daftar' } },
    ],
  },
  {
    path: '/dashboard', component: () => import('@/layouts/DashboardLayout.vue'), meta: { requiresAuth: true, role: 'school' },
    children: [
      { path: '', name: 'dashboard', component: () => import('@/views/dashboard/DashboardView.vue'), meta: { title: 'Dashboard Sekolah' } },
      { path: 'pages', name: 'dashboard-pages', component: placeholder, meta: { title: 'Halaman Website' } },
      { path: 'navigation', name: 'dashboard-navigation', component: placeholder, meta: { title: 'Navigasi' } },
      { path: 'content', name: 'dashboard-content', component: placeholder, meta: { title: 'Konten' } },
      { path: 'media', name: 'dashboard-media', component: placeholder, meta: { title: 'Media' } },
      { path: 'templates', name: 'dashboard-templates', component: placeholder, meta: { title: 'Template' } },
      { path: 'subdomain', name: 'dashboard-subdomain', component: placeholder, meta: { title: 'Subdomain' } },
      { path: 'settings', name: 'dashboard-settings', component: placeholder, meta: { title: 'Pengaturan Sekolah' } },
    ],
  },
  { path: '/dashboard/website/pages', redirect: '/dashboard/pages' },
  { path: '/dashboard/website/navigation', redirect: '/dashboard/navigation' },
  { path: '/dashboard/website/templates', redirect: '/dashboard/templates' },
  {
    path: '/admin', component: () => import('@/layouts/AdminLayout.vue'), meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', name: 'admin', component: placeholder, meta: { title: 'Dashboard Admin' } },
      { path: 'schools', component: placeholder, meta: { title: 'Sekolah' } },
      { path: 'websites', component: placeholder, meta: { title: 'Website' } },
      { path: 'templates', component: placeholder, meta: { title: 'Template Admin' } },
      { path: 'subdomains', component: placeholder, meta: { title: 'Subdomain' } },
      { path: 'logs', component: placeholder, meta: { title: 'Log Aktivitas' } },
    ],
  },
  { path: '/editor/:pageId?', component: () => import('@/layouts/EditorLayout.vue'), meta: { requiresAuth: true, role: 'school' }, children: [{ path: '', component: placeholder, meta: { title: 'Website Editor' } }] },
  { path: '/onboarding', component: placeholder, meta: { requiresAuth: true, role: 'school', title: 'Onboarding' } },
  {
    path: '/site', component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      { path: ':subdomain', component: placeholder, meta: { title: 'Website Sekolah' } },
      { path: ':subdomain/:slug', component: placeholder, meta: { title: 'Halaman Sekolah' } },
    ],
  },
  { path: '/:pathMatch(.*)*', component: placeholder, meta: { title: 'Halaman tidak ditemukan' } },
]
