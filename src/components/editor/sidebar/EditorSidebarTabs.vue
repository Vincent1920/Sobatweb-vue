<script setup lang="ts">
import { FileText, Layers, Palette, Settings } from 'lucide-vue-next'
export type EditorSidebarTab = 'sections' | 'pages' | 'theme' | 'seo'
defineProps<{ modelValue: EditorSidebarTab }>()
defineEmits<{ 'update:modelValue': [value: EditorSidebarTab] }>()
const tabs = [{ id: 'sections', label: 'Sections', icon: Layers, title: 'Kelola Section Tata Letak' }, { id: 'pages', label: 'Halaman', icon: FileText, title: 'Kelola Halaman' }, { id: 'theme', label: 'Tema', icon: Palette, title: 'Gaya & Tema Warna' }, { id: 'seo', label: 'SEO', icon: Settings, title: 'Pengaturan SEO & Web' }] as const
</script>

<template>
  <div class="sticky top-0 z-20 grid w-full shrink-0 grid-cols-4 gap-1 border-b border-slate-200 bg-white p-1.5 text-[11px] font-medium text-slate-500 shadow-xs" role="tablist" aria-label="Navigasi sidebar editor">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :title="tab.title"
      :aria-selected="modelValue === tab.id"
      role="tab"
      class="flex min-w-0 flex-col items-center gap-1 rounded-lg border px-1 py-2 transition-all"
      :class="modelValue === tab.id ? 'border-sky-300 bg-sky-50 font-semibold text-sky-700 shadow-sm' : 'border-transparent bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'"
      @click="$emit('update:modelValue', tab.id)"
    >
      <component :is="tab.icon" class="h-4 w-4 shrink-0" />
      <span class="block w-full truncate text-center">{{ tab.label }}</span>
    </button>
  </div>
</template>
