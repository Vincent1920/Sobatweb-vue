<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import type { WebsitePage } from '@/services/website.service'

type PreviewDevice = 'desktop' | 'tablet' | 'mobile'
const props = defineProps<{ schoolName: string; pages: WebsitePage[]; activePageId: string | null; device: PreviewDevice }>()
const emit = defineEmits<{ navigate: [pageId: string] }>()
const mobileMenuOpen = ref(false)
const navbarPages = computed(() => [...props.pages].sort((a, b) => a.order - b.order))
const compact = computed(() => props.device !== 'desktop')
watch(() => props.device, () => { mobileMenuOpen.value = false })
watch(() => props.pages, () => { if (!props.pages.length) mobileMenuOpen.value = false }, { deep: true })
function navigate(pageId: string): void { mobileMenuOpen.value = false; emit('navigate', pageId) }
</script>

<template>
  <header class="relative w-full border-b border-slate-100 bg-white px-4 py-3">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4">
      <strong class="min-w-0 truncate text-sm font-extrabold text-slate-900">{{ schoolName }}</strong>
      <nav v-if="!compact" class="flex min-w-0 flex-wrap items-center justify-end gap-1" aria-label="Navigasi website">
        <button v-for="page in navbarPages" :key="page.id" class="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition-colors" :class="activePageId === page.id ? 'bg-sky-50 font-bold text-sky-700' : 'font-semibold text-slate-600 hover:bg-slate-100 hover:text-sky-700'" @click="navigate(page.id)">{{ page.name }}</button>
      </nav>
      <button v-else class="shrink-0 rounded-lg p-2 text-slate-700 hover:bg-slate-100" :aria-expanded="mobileMenuOpen" aria-label="Buka menu website" @click="mobileMenuOpen = !mobileMenuOpen"><X v-if="mobileMenuOpen" class="h-5 w-5" /><Menu v-else class="h-5 w-5" /></button>
    </div>
    <nav v-if="compact && mobileMenuOpen" class="absolute inset-x-0 top-full z-30 space-y-1 border-t border-slate-100 bg-white p-3 shadow-lg" aria-label="Navigasi website mobile"><button v-for="page in navbarPages" :key="page.id" class="block w-full rounded-lg px-3 py-2 text-left text-xs" :class="activePageId === page.id ? 'bg-sky-50 font-bold text-sky-700' : 'font-semibold text-slate-600 hover:bg-slate-100'" @click="navigate(page.id)">{{ page.name }}</button></nav>
  </header>
</template>
