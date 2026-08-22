<script setup lang="ts">
import { computed } from 'vue'
import { ExternalLink, Globe, Menu, Palette } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard.store'

defineEmits<{ menu: [] }>()
const router = useRouter(); const dashboard = useDashboardStore()
const website = computed(() => dashboard.data?.website)
const editorPath = computed(() => dashboard.data?.homePage ? `/editor/${dashboard.data.homePage.id}` : null)
const previewPath = computed(() => website.value?.subdomain ? `/site/${website.value.subdomain}` : null)
</script>
<template><nav class="z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-5"><div class="flex items-center gap-3"><button class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden" @click="$emit('menu')"><Menu class="h-5 w-5" /></button><div class="flex items-center gap-2"><span class="text-sm font-extrabold tracking-tight text-slate-900">Edusite</span><span class="text-slate-300">/</span><span class="hidden text-xs font-semibold text-slate-700 sm:inline">School Dashboard</span></div></div><div class="flex items-center gap-3"><RouterLink v-if="previewPath" :to="previewPath" class="hidden items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-100 sm:inline-flex"><Globe class="h-3.5 w-3.5" />{{ website?.fullDomain }}<ExternalLink class="ml-0.5 h-3 w-3" /></RouterLink><span v-else class="hidden text-xs text-slate-400 sm:inline">{{ dashboard.loading ? 'Memuat website…' : (website ? 'Subdomain belum diatur' : 'Website belum tersedia') }}</span><button :disabled="!editorPath" class="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300" @click="editorPath && router.push(editorPath)"><Palette class="h-3.5 w-3.5" />Edit Website</button></div></nav></template>
