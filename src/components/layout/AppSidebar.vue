<script setup lang="ts">
import { computed } from 'vue'
import { LayoutDashboard, Link2, LogOut, Palette, Settings } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useDashboardStore } from '@/stores/dashboard.store'

defineEmits<{ navigate: [] }>()
const route = useRoute(); const router = useRouter(); const auth = useAuthStore(); const dashboard = useDashboardStore()
const school = computed(() => dashboard.data?.school)
const website = computed(() => dashboard.data?.website)
const items = computed(() => [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: '', disabled: false },
  { label: 'Edit Website', path: dashboard.data?.homePage ? `/editor/${dashboard.data.homePage.id}` : '/dashboard', icon: Palette, color: 'text-amber-500', disabled: !dashboard.data?.homePage },
  { label: 'Subdomain', path: '/dashboard/subdomain', icon: Link2, color: 'text-indigo-500', disabled: false },
  { label: 'Pengaturan Sekolah', path: '/dashboard/settings', icon: Settings, color: 'text-slate-500', disabled: false },
])
function active(path: string): boolean { return path === '/dashboard' ? route.path === path : route.path.startsWith(path) }
function logout(): void { auth.clearSession(); void router.push('/login') }
</script>
<template><div class="flex h-full min-h-0 w-full select-none flex-col p-4"><div class="min-h-0 flex-1 overflow-y-auto"><div class="flex items-center gap-3 px-2 py-1"><img v-if="school?.logo" :src="school.logo" alt="Logo sekolah" class="h-10 w-10 shrink-0 rounded-xl border border-slate-200 object-cover shadow-xs" /><div v-else class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-bold text-sky-700">{{ school?.name?.charAt(0) ?? '—' }}</div><div class="overflow-hidden"><h3 class="truncate text-xs font-bold leading-tight text-slate-900">{{ school?.name ?? (dashboard.loading ? 'Memuat sekolah…' : 'Data sekolah tidak tersedia') }}</h3><p class="mt-0.5 truncate font-mono text-[11px] text-slate-400">{{ website?.fullDomain ?? '—' }}</p></div></div><nav class="mt-5 space-y-1.5 pt-1"><RouterLink v-for="item in items" :key="`${item.label}-${item.path}`" :to="item.path" class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all" :class="[active(item.path) ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900', item.disabled ? 'pointer-events-none opacity-50' : '']" @click="$emit('navigate')"><span class="flex items-center gap-2.5"><component :is="item.icon" class="h-4 w-4" :class="active(item.path) ? '' : item.color" />{{ item.label }}</span></RouterLink></nav></div><div class="shrink-0 border-t border-slate-200/80 pt-4"><div class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2"><div class="overflow-hidden"><p class="truncate text-xs font-semibold text-slate-800">{{ auth.user?.name ?? 'Pengguna' }}</p><p class="truncate text-[10px] text-slate-400">{{ auth.user?.email ?? '' }}</p></div><button class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600" title="Keluar" @click="logout"><LogOut class="h-4 w-4" /></button></div></div></div></template>
