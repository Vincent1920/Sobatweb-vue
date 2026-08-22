<script setup lang="ts">
import { computed } from 'vue'
import type { SectionItem } from '@/types'
import type { WebsiteTheme } from '@/services/website.service'

const props = defineProps<{ section: SectionItem; selected?: boolean; theme?: WebsiteTheme }>()
defineEmits<{ select: [] }>()
const content = computed(() => props.section.content)
const items = computed<Record<string, unknown>[]>(() => Array.isArray(content.value.items) ? content.value.items.filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null) : [])
const text = (key: string, fallback = ''): string => typeof content.value[key] === 'string' ? content.value[key] as string : fallback
const itemText = (item: Record<string, unknown>, key: string): string => typeof item[key] === 'string' ? item[key] as string : ''
const safeMapUrl = computed(() => {
  const url = text('mapEmbedUrl')
  if (!url) return ''
  try { const parsed = new URL(url); return parsed.protocol === 'https:' && ['google.com', 'www.google.com', 'maps.google.com'].some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)) ? url : '' }
  catch { return '' }
})
const socialLinks = computed(() => ['instagram', 'youtube', 'tiktok', 'facebook', 'twitter'].map((name) => ({ name, url: text(name) })).filter((item) => item.url))
const themedBackground = computed(() => props.section.settings.bgStyle === 'brand' ? { backgroundColor: props.theme?.primaryColor } : props.section.settings.bgStyle === 'gradient' ? { backgroundImage: `linear-gradient(to right, ${props.theme?.primaryColor ?? '#0284c7'}, ${props.theme?.primaryDark ?? '#3730a3'})` } : undefined)
</script>

<template>
  <section
    v-if="!section.hidden"
    :data-section-id="section.id"
    :data-section-type="section.type"
    :aria-selected="selected"
    :style="themedBackground"
    :class="[
      'px-6 py-14',
      section.settings.bgStyle === 'dark' ? 'bg-slate-900 text-white' : section.settings.bgStyle === 'brand' ? 'bg-sky-600 text-white' : section.settings.bgStyle === 'muted' ? 'bg-slate-50' : section.settings.bgStyle === 'gradient' ? 'bg-gradient-to-r from-sky-600 to-indigo-700 text-white' : 'bg-white',
      selected ? 'ring-2 ring-inset ring-sky-500' : '',
    ]"
    @click="$emit('select')"
  >
    <div class="mx-auto max-w-6xl" :class="section.settings.alignment === 'left' ? 'text-left' : section.settings.alignment === 'right' ? 'text-right' : 'text-center'">
      <h2 class="text-2xl font-extrabold sm:text-3xl">{{ section.title }}</h2><p v-if="section.subtitle" class="mx-auto mt-2 max-w-2xl text-sm opacity-70">{{ section.subtitle }}</p>

      <template v-if="section.type === 'hero'"><span v-if="text('badge')" class="rounded-full bg-white/10 px-3 py-1 text-xs">{{ text('badge') }}</span><h1 class="mx-auto mt-5 max-w-3xl text-3xl font-extrabold sm:text-5xl">{{ text('headline', section.title) }}</h1><p class="mx-auto mt-4 max-w-2xl text-sm opacity-80">{{ section.subtitle }}</p><a :href="text('buttonUrl', '#')" class="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-sky-700">{{ text('buttonText', 'Daftar Sekarang') }}</a></template>
      <template v-else-if="section.type === 'about'"><div class="mx-auto mt-6 max-w-3xl text-sm leading-relaxed opacity-75">{{ text('description', 'Profil sekolah dapat diedit melalui panel editor.') }}</div></template>
      <template v-else-if="section.type === 'vision_mission'"><div class="mt-8 grid gap-4 md:grid-cols-2"><article class="rounded-2xl border border-slate-200/60 bg-white/10 p-5"><h3 class="font-bold">Visi</h3><p class="mt-2 text-sm opacity-75">{{ text('vision', 'Visi sekolah belum diisi.') }}</p></article><article class="rounded-2xl border border-slate-200/60 bg-white/10 p-5"><h3 class="font-bold">Misi, Tujuan & Nilai Sekolah</h3><p class="mt-2 text-sm opacity-75">Tambahkan misi, tujuan, dan nilai utama melalui panel editor.</p></article></div></template>
      <template v-else-if="section.type === 'faq'"><div class="mx-auto mt-8 max-w-3xl space-y-3 text-left"><details v-for="(item, index) in items" :key="index" class="rounded-xl border border-slate-200 bg-white p-4 text-slate-800"><summary class="cursor-pointer font-semibold">{{ itemText(item, 'question') || `Pertanyaan ${index + 1}` }}</summary><p class="mt-3 text-sm text-slate-600">{{ itemText(item, 'answer') }}</p></details><p v-if="!items.length" class="text-sm opacity-60">Belum ada pertanyaan.</p></div></template>
      <template v-else-if="section.type === 'cta'"><p class="mx-auto mt-4 max-w-2xl text-sm opacity-80">{{ section.subtitle }}</p><a :href="text('buttonUrl', '#')" class="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-sky-700 shadow">{{ text('buttonText', 'Daftar Sekarang') }}</a></template>
      <template v-else-if="section.type === 'ppdb'"><p class="mt-4 text-sm opacity-80">{{ text('description', 'Informasi PPDB akan segera tersedia.') }}</p><p v-if="text('registrationPeriod')" class="mt-2 font-semibold">{{ text('registrationPeriod') }}</p><a :href="text('buttonUrl', '#')" class="mt-6 inline-flex rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white">{{ text('buttonText', 'Daftar PPDB') }}</a></template>
      <template v-else-if="section.type === 'contact'"><div class="mt-8 grid gap-3 text-left sm:grid-cols-2"><p class="rounded-xl border p-4">{{ text('address', 'Alamat belum diisi') }}</p><p class="rounded-xl border p-4">{{ text('phone', 'Telepon belum diisi') }}</p><p class="rounded-xl border p-4">{{ text('email', 'Email belum diisi') }}</p><p class="rounded-xl border p-4">{{ text('whatsapp', 'WhatsApp belum diisi') }}</p></div></template>
      <template v-else-if="section.type === 'map'"><iframe v-if="safeMapUrl" :src="safeMapUrl" class="mt-8 h-80 w-full rounded-2xl border-0" loading="lazy" title="Lokasi sekolah" /><p v-else class="mt-6 text-sm opacity-60">URL Google Maps embed belum valid.</p></template>
      <template v-else-if="section.type === 'social_media'"><div class="mt-6 flex flex-wrap justify-center gap-3"><a v-for="item in socialLinks" :key="item.name" :href="item.url" target="_blank" rel="noopener noreferrer" class="rounded-xl border px-4 py-2 text-sm capitalize">{{ item.name }}</a><p v-if="!socialLinks.length" class="text-sm opacity-60">Belum ada media sosial.</p></div></template>
      <template v-else-if="section.type === 'video'"><div class="mx-auto mt-8 max-w-3xl rounded-2xl bg-slate-950 p-10 text-white">{{ text('videoUrl') ? 'Video sekolah siap ditampilkan' : 'URL video belum diisi' }}</div></template>
      <template v-else-if="section.type === 'footer'"><p class="mt-4 text-sm opacity-70">{{ text('description', text('schoolName', 'Identitas sekolah')) }}</p></template>
      <template v-else><div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><article v-for="(item, index) in items" :key="index" class="rounded-2xl border border-slate-200/60 bg-white/10 p-5 text-left"><h3 class="font-bold">{{ itemText(item, 'name') || itemText(item, 'title') || `Item ${index + 1}` }}</h3><p class="mt-2 text-sm opacity-70">{{ itemText(item, 'description') || itemText(item, 'message') }}</p></article><p v-if="!items.length" class="col-span-full text-sm opacity-60">Konten section dapat diedit melalui panel editor.</p></div></template>
    </div>
  </section>
</template>
