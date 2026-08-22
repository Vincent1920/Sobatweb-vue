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
      { path: 'pages', name: 'dashboard-pages', component: () => import('@/views/dashboard/FeatureView.vue'), meta: { title: 'Halaman Website' } },
      { path: 'navigation', name: 'dashboard-navigation', component: () => import('@/views/dashboard/FeatureView.vue'), meta: { title: 'Navigasi' } },
      { path: 'content/:tab?', name: 'dashboard-content', component: () => import('@/views/dashboard/FeatureView.vue'), meta: { title: 'Konten' } },
      { path: 'media', name: 'dashboard-media', component: () => import('@/views/dashboard/FeatureView.vue'), meta: { title: 'Media' } },
      { path: 'templates', name: 'dashboard-templates', component: () => import('@/views/dashboard/FeatureView.vue'), meta: { title: 'Template' } },
      { path: 'subdomain', name: 'dashboard-subdomain', component: () => import('@/views/dashboard/FeatureView.vue'), meta: { title: 'Subdomain' } },
      { path: 'settings', name: 'dashboard-settings', component: () => import('@/views/dashboard/SchoolSettingsView.vue'), meta: { title: 'Pengaturan Sekolah' } },
    ],
  },
  { path: '/dashboard/website/pages', redirect: '/dashboard/pages' },
  { path: '/dashboard/website/navigation', redirect: '/dashboard/navigation' },
  { path: '/dashboard/website/templates', redirect: '/dashboard/templates' },
  {
    path: '/admin', component: () => import('@/layouts/AdminLayout.vue'), meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', name: 'admin', component: () => import('@/views/admin/AdminView.vue'), meta: { title: 'Dashboard Admin' } },
      { path: 'schools', component: () => import('@/views/admin/AdminView.vue'), meta: { title: 'Sekolah' } },
      { path: 'websites', component: () => import('@/views/admin/AdminView.vue'), meta: { title: 'Website' } },
      { path: 'templates', component: () => import('@/views/admin/AdminView.vue'), meta: { title: 'Template Admin' } },
      { path: 'subdomains', component: () => import('@/views/admin/AdminView.vue'), meta: { title: 'Subdomain' } },
      { path: 'logs', component: () => import('@/views/admin/AdminView.vue'), meta: { title: 'Log Aktivitas' } },
    ],
  },
  { path: '/editor/:pageId?', component: () => import('@/layouts/EditorLayout.vue'), meta: { requiresAuth: true, role: 'school' }, children: [{ path: '', component: () => import('@/views/editor/WebsiteEditorView.vue'), meta: { title: 'Website Editor' } }] },
  { path: '/onboarding', component: () => import('@/views/onboarding/OnboardingView.vue'), meta: { requiresAuth: true, role: 'school', title: 'Onboarding' } },
  {
    path: '/site', component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      { path: ':subdomain', component: () => import('@/views/public/PublicSiteView.vue'), meta: { title: 'Website Sekolah' } },
      { path: ':subdomain/:slug', component: () => import('@/views/public/PublicSiteView.vue'), meta: { title: 'Halaman Sekolah' } },
    ],
  },
  { path: '/:pathMatch(.*)*', component: placeholder, meta: { title: 'Halaman tidak ditemukan' } },
]
