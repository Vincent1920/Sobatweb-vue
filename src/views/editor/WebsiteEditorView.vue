<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle2, ChevronLeft, Copy, Eye, GripVertical, Image, Monitor, Palette, Plus, Save, Smartphone, Sparkles, Tablet, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useWebsiteStore } from '@/stores/website.store'
import { useToastStore } from '@/stores/toast.store'

type Device = 'desktop' | 'tablet' | 'mobile'
const router = useRouter(); const data = useWebsiteStore(); const toast = useToastStore()
const device = ref<Device>('desktop'); const selected = ref(0); const preview = ref(false)
const sections = ref(data.website.sections.map((s, i) => ({ id: i, title: s[0], type: s[1] })))
const devices: { key: Device; icon: typeof Monitor }[] = [{ key: 'desktop', icon: Monitor }, { key: 'tablet', icon: Tablet }, { key: 'mobile', icon: Smartphone }]
function duplicate(): void { const current = sections.value[selected.value]; if (current) sections.value.splice(selected.value + 1, 0, { ...current, id: Date.now() }); toast.show('Section berhasil diduplikasi', 'success') }
function remove(): void { if (sections.value.length > 1) { sections.value.splice(selected.value, 1); selected.value = 0 } }
</script>

<template>
  <div class="flex h-[calc(100vh-5rem)] flex-col bg-slate-100">
    <header class="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3">
      <div class="flex items-center gap-3"><button class="rounded-lg p-2 hover:bg-slate-100" @click="router.push('/dashboard')"><ChevronLeft class="h-4 w-4" /></button><div><strong class="block text-xs">Visual Editor</strong><span class="text-[10px] text-slate-400">{{ data.website.fullDomain }}</span></div></div>
      <div class="flex rounded-xl border border-slate-200 bg-slate-100 p-1"><button v-for="item in devices" :key="item.key" class="rounded-lg p-1.5 sm:px-3" :class="device === item.key ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500'" @click="device = item.key"><component :is="item.icon" class="h-3.5 w-3.5" /></button></div>
      <div class="flex gap-2"><button class="rounded-lg border px-3 py-1.5 text-xs" @click="preview = !preview"><Eye class="mr-1 inline h-3.5 w-3.5" />Preview</button><button class="rounded-lg bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white" @click="toast.show('Website berhasil dipublish', 'success')"><Sparkles class="mr-1 inline h-3.5 w-3.5" />Publish</button></div>
    </header>
    <div class="flex min-h-0 flex-1">
      <aside v-if="!preview" class="hidden w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-3 md:block"><div class="mb-3 flex items-center justify-between"><b class="text-xs">Section Halaman</b><button class="rounded-lg bg-sky-50 p-1.5 text-sky-600"><Plus class="h-4 w-4" /></button></div><button v-for="(section, index) in sections" :key="section.id" class="mb-2 flex w-full items-center gap-2 rounded-xl border p-3 text-left text-xs" :class="selected === index ? 'border-sky-400 bg-sky-50' : 'border-slate-200'" @click="selected = index"><GripVertical class="h-4 w-4 text-slate-400" /><span class="min-w-0 flex-1"><b class="block truncate">{{ section.title }}</b><small class="uppercase text-slate-400">{{ section.type }}</small></span></button></aside>
      <main class="min-w-0 flex-1 overflow-auto bg-slate-200 p-4"><div class="mx-auto min-h-full overflow-hidden bg-white shadow-xl transition-all" :class="device === 'mobile' ? 'max-w-[390px]' : device === 'tablet' ? 'max-w-[768px]' : 'max-w-[1200px]'"><section class="bg-gradient-to-r from-sky-600 to-indigo-700 px-6 py-20 text-center text-white"><span class="rounded-full bg-white/10 px-3 py-1 text-xs">PPDB 2026/2027 Telah Dibuka</span><h1 class="mx-auto mt-5 max-w-3xl text-3xl font-extrabold sm:text-5xl">Membangun Generasi Digital Berkeahlian Industri Global</h1><p class="mx-auto mt-4 max-w-2xl text-sm text-sky-100">SMK Pusat Keunggulan dengan kurikulum berbasis Project Based Learning dan sertifikasi internasional.</p><button class="mt-7 rounded-xl bg-white px-5 py-3 text-sm font-bold text-sky-700">Daftar PPDB Online</button></section><section class="grid gap-6 p-8 sm:grid-cols-3"><div v-for="n in 3" :key="n" class="rounded-2xl border p-5"><Palette class="h-7 w-7 text-sky-600" /><h3 class="mt-3 font-bold">Program Keahlian {{ n }}</h3><p class="mt-2 text-xs text-slate-500">Konten section dapat diedit melalui panel editor.</p></div></section></div></main>
      <aside v-if="!preview" class="hidden w-72 shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-4 lg:block"><h3 class="text-xs font-bold">Properti Section</h3><div class="mt-5 space-y-4 text-xs"><label class="block font-semibold">Judul Section<input :value="sections[selected]?.title" class="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-normal" /></label><label class="block font-semibold">Teks Konten<textarea rows="4" class="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-normal">Edit konten website sekolah di sini.</textarea></label><button class="w-full rounded-xl border p-2.5"><Image class="mr-1 inline h-4 w-4" />Ganti Gambar</button><div class="grid grid-cols-2 gap-2"><button class="rounded-xl border p-2" @click="duplicate"><Copy class="mr-1 inline h-3.5 w-3.5" />Duplikat</button><button class="rounded-xl border border-rose-200 p-2 text-rose-600" @click="remove"><Trash2 class="mr-1 inline h-3.5 w-3.5" />Hapus</button></div><button class="w-full rounded-xl bg-sky-600 p-2.5 font-bold text-white" @click="toast.show('Perubahan tersimpan', 'success')"><Save class="mr-1 inline h-4 w-4" />Simpan</button><p class="flex items-center gap-1 text-emerald-600"><CheckCircle2 class="h-3.5 w-3.5" />Semua perubahan tersimpan</p></div></aside>
    </div>
  </div>
</template>
