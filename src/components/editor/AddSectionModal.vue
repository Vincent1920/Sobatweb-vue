<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Plus, X } from 'lucide-vue-next'
import { SECTION_CATEGORIES, SECTION_PRESETS, type SectionPreset } from '@/data/section-presets'
import type { WebsitePage } from '@/services/website.service'

const props = defineProps<{ open: boolean; saving?: boolean; pendingType?: SectionPreset['type'] | null; pages: WebsitePage[]; activePageId: string | null }>()
const emit = defineEmits<{ close: []; select: [preset: SectionPreset, targetPageId: string] }>()
const selectedCategory = ref<(typeof SECTION_CATEGORIES)[number]>('Semua')
const targetPageId = ref<string | null>(null)
const filteredPresets = computed(() => selectedCategory.value === 'Semua'
  ? SECTION_PRESETS
  : SECTION_PRESETS.filter((preset) => preset.category === selectedCategory.value))

function select(preset: SectionPreset): void {
  if (!props.saving && targetPageId.value) emit('select', preset, targetPageId.value)
}
watch(() => props.open, (open) => { if (open) { targetPageId.value = props.activePageId && props.pages.some((page) => page.id === props.activePageId) ? props.activePageId : props.pages[0]?.id ?? null } else { selectedCategory.value = 'Semua'; targetPageId.value = null } }, { immediate: true })
watch(() => props.pages, (pages) => { if (props.open && !pages.some((page) => page.id === targetPageId.value)) targetPageId.value = props.activePageId && pages.some((page) => page.id === props.activePageId) ? props.activePageId : pages[0]?.id ?? null }, { deep: true })
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
    <div class="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      <div class="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <div><h3 class="flex items-center gap-2 text-lg font-semibold text-slate-900"><Plus class="h-5 w-5 text-sky-600" />Tambah Section ke Website</h3><p class="mt-0.5 text-xs text-slate-500">Pilih blok tata letak siap pakai yang sesuai dengan konten sekolah Anda</p></div>
        <button class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" @click="emit('close')"><X class="h-5 w-5" /></button>
      </div>
      <div class="border-b border-slate-100 bg-white px-6 py-3">
        <p class="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Halaman Tujuan</p>
        <div class="flex gap-2 overflow-x-auto pb-1">
          <button v-for="page in pages" :key="page.id" class="shrink-0 whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium transition-all" :class="targetPageId === page.id ? 'border-sky-600 bg-sky-600 text-white shadow-xs' : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700'" @click="targetPageId = page.id">{{ page.name }}</button>
        </div>
      </div>
      <div class="border-b border-slate-100 bg-white px-6 py-3">
        <p class="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Kategori Section</p>
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button v-for="category in SECTION_CATEGORIES" :key="category" class="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all" :class="selectedCategory === category ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'" @click="selectedCategory = category">{{ category }}</button>
        </div>
      </div>
      <div class="max-h-[60vh] flex-1 overflow-y-auto p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <button v-for="preset in filteredPresets" :key="preset.type" :disabled="saving && pendingType === preset.type" class="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-all duration-200 hover:border-sky-500 hover:shadow-md disabled:cursor-wait disabled:opacity-60" @click="select(preset)">
            <div class="relative flex h-24 items-center justify-between overflow-hidden bg-gradient-to-br p-4 text-white" :class="preset.previewGradient"><div class="z-10 flex items-center gap-2"><div class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xs"><component :is="preset.icon" class="h-5 w-5 text-white" /></div><span class="text-xs font-medium uppercase tracking-wider text-white/80">{{ preset.type }}</span></div><span class="rounded-md bg-black/20 px-2 py-0.5 text-[10px] font-medium text-white">{{ preset.category }}</span></div>
            <div class="flex flex-1 flex-col p-4"><h4 class="text-sm font-semibold text-slate-900 transition-colors group-hover:text-sky-700">{{ preset.name }}</h4><p class="mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed text-slate-500">{{ preset.description }}</p><span class="mt-4 flex items-center gap-1 text-xs font-semibold text-sky-600"><Plus class="h-3.5 w-3.5" />{{ saving && pendingType === preset.type ? 'Menambahkan...' : 'Sisipkan ke Halaman' }}</span></div>
          </button>
        </div>
      </div>
      <div class="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-3"><button class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100" @click="emit('close')">Tutup</button></div>
    </div>
  </div>
</template>
