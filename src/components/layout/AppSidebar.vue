<script setup lang="ts">
import { LayoutDashboard, Link2, LogOut, Palette, Settings } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useWebsiteStore } from '@/stores/website.store'
defineEmits<{ navigate: [] }>()
const route = useRoute(); const router = useRouter(); const auth = useAuthStore(); const data = useWebsiteStore()
const items = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: '' },
  { label: 'Edit Website', path: `/editor/${data.website.id}`, icon: Palette, color: 'text-amber-500' },
  { label: 'Subdomain', path: '/dashboard/subdomain', icon: Link2, color: 'text-indigo-500' },
  { label: 'Pengaturan Sekolah', path: '/dashboard/settings', icon: Settings, color: 'text-slate-500' },
]
function active(path: string): boolean { return path === '/dashboard' ? route.path === path : route.path.startsWith(path) }
function logout(): void { auth.clearSession(); void router.push('/login') }
</script>
<template><div class="flex h-full select-none flex-col justify-between p-4"><div class="space-y-5"><div class="flex items-center gap-3 px-2 py-1"><img :src="data.school.logo" alt="Logo" class="h-10 w-10 shrink-0 rounded-xl border border-slate-200 object-cover shadow-xs" /><div class="overflow-hidden"><h3 class="truncate text-xs font-bold leading-tight text-slate-900">{{ data.school.name }}</h3><p class="mt-0.5 truncate font-mono text-[11px] text-slate-400">{{ data.website.subdomain }}.smktelkom.com</p></div></div><nav class="space-y-1.5 pt-1"><RouterLink v-for="item in items" :key="item.path" :to="item.path" class="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all" :class="active(item.path) ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'" @click="$emit('navigate')"><span class="flex items-center gap-2.5"><component :is="item.icon" class="h-4 w-4" :class="active(item.path) ? '' : item.color" />{{ item.label }}</span></RouterLink></nav></div><div class="space-y-2 border-t border-slate-200/80 pt-4"><div class="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2"><div class="overflow-hidden"><p class="truncate text-xs font-semibold text-slate-800">{{ data.school.personInCharge }}</p><p class="truncate text-[10px] text-slate-400">{{ data.school.email }}</p></div><button class="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600" title="Keluar" @click="logout"><LogOut class="h-4 w-4" /></button></div></div></div></template>
