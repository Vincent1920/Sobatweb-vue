<script setup lang="ts">
import { ref, watch } from 'vue'
import { Check, FileText, MoreVertical, Plus } from 'lucide-vue-next'
import type { PageInput, WebsitePage } from '@/types/page'
import { getPagePath } from '@/types/page'

const props = defineProps<{ pages: WebsitePage[]; activePageId: string | null; saving?: boolean }>()
const emit = defineEmits<{
  select: [pageId: string]
  create: [payload: PageInput]
  update: [pageId: string, payload: PageInput]
  delete: [pageId: string]
  setHome: [pageId: string]
}>()
const formMode = ref<'create' | 'edit' | null>(null)
const editingId = ref<string | null>(null)
const name = ref('')
const slug = ref('')
const slugTouched = ref(false)
const menuPageId = ref<string | null>(null)
const confirmHome = ref<WebsitePage | null>(null)
const confirmDelete = ref<WebsitePage | null>(null)
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

watch(name, (value) => { if (formMode.value === 'create' && !slugTouched.value) slug.value = slugify(value) })
function openCreate(): void { formMode.value = 'create'; editingId.value = null; name.value = ''; slug.value = ''; slugTouched.value = false; menuPageId.value = null }
function openEdit(page: WebsitePage): void { formMode.value = 'edit'; editingId.value = page.id; name.value = page.name; slug.value = page.slug; slugTouched.value = true; menuPageId.value = null }
function closeForm(): void { formMode.value = null; editingId.value = null }
function submit(): void {
  const payload = { name: name.value.trim(), slug: slug.value.trim().replace(/^\/+|\/+$/g, '') }
  if (!payload.name || !payload.slug || props.saving) return
  if (formMode.value === 'edit' && editingId.value) emit('update', editingId.value, payload)
  else emit('create', payload)
  closeForm()
}
function requestHome(page: WebsitePage): void { menuPageId.value = null; confirmHome.value = page }
function requestDelete(page: WebsitePage): void { menuPageId.value = null; confirmDelete.value = page }
function setHome(): void { if (!confirmHome.value || props.saving) return; emit('setHome', confirmHome.value.id); confirmHome.value = null }
function remove(): void { if (!confirmDelete.value || props.saving) return; emit('delete', confirmDelete.value.id); confirmDelete.value = null }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div><h4 class="text-xs font-bold uppercase tracking-wider text-slate-800">Daftar Halaman</h4><p class="text-[11px] text-slate-400">Struktur halaman website sekolah</p></div>
      <button :disabled="saving" class="flex items-center gap-1 rounded-lg bg-sky-600 px-2.5 py-1 text-xs font-medium text-white shadow-xs hover:bg-sky-700 disabled:opacity-50" @click="openCreate"><Plus class="h-3.5 w-3.5" />Halaman</button>
    </div>
    <form v-if="formMode" class="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs" @submit.prevent="submit">
      <p class="font-bold text-slate-800">{{ formMode === 'create' ? 'Tambah Halaman' : 'Edit Halaman' }}</p>
      <label class="block font-semibold text-slate-700">Nama Halaman *<input v-model="name" required maxlength="191" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-normal" /></label>
      <label class="block font-semibold text-slate-700">Slug *<input v-model="slug" required maxlength="191" pattern="/?[a-z0-9]+(?:-[a-z0-9]+)*" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono font-normal" placeholder="tentang-sekolah" @input="slugTouched = true" /></label>
      <div class="flex justify-end gap-2"><button type="button" class="px-2.5 py-1 text-slate-500" @click="closeForm">Batal</button><button :disabled="saving" class="rounded-md bg-sky-600 px-3 py-1 font-medium text-white disabled:opacity-50">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button></div>
    </form>
    <div class="space-y-1.5">
      <div v-for="page in pages" :key="page.id" class="relative flex w-full items-center rounded-xl border p-2.5 text-xs transition-all" :class="activePageId === page.id ? 'border-sky-500 bg-sky-50/40 font-medium text-sky-900 ring-2 ring-sky-500/20' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'">
        <button class="flex min-w-0 flex-1 items-center justify-between text-left" @click="$emit('select', page.id)"><span class="flex min-w-0 items-center gap-2"><FileText class="h-3.5 w-3.5 shrink-0 text-slate-400" /><span class="truncate">{{ page.name }}</span><span v-if="page.isHome" class="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-semibold text-sky-700">Utama</span></span><span class="ml-2 shrink-0 font-mono text-[10px] text-slate-400">{{ getPagePath(page) }}</span></button>
        <button class="ml-1 shrink-0 rounded p-1 text-slate-500 hover:bg-slate-200" :aria-label="`Aksi ${page.name}`" @click.stop="menuPageId = menuPageId === page.id ? null : page.id"><MoreVertical class="h-3.5 w-3.5" /></button>
        <div v-if="menuPageId === page.id" class="absolute right-2 top-9 z-20 w-48 rounded-lg border border-slate-200 bg-white p-1 text-[11px] shadow-lg">
          <button class="block w-full rounded px-2.5 py-2 text-left hover:bg-slate-50" @click="openEdit(page)">Edit Halaman</button>
          <div v-if="page.isHome" class="flex items-center gap-2 px-2.5 py-2 font-semibold text-sky-700"><Check class="h-3.5 w-3.5" />Halaman Utama</div>
          <button v-else class="block w-full rounded px-2.5 py-2 text-left hover:bg-slate-50" @click="requestHome(page)">Jadikan Halaman Utama</button>
          <button v-if="!page.isHome" class="block w-full rounded px-2.5 py-2 text-left text-rose-600 hover:bg-rose-50" @click="requestDelete(page)">Hapus Halaman</button>
        </div>
      </div>
    </div>
    <div v-if="confirmHome" class="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div class="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"><h3 class="text-sm font-bold">Jadikan &quot;{{ confirmHome.name }}&quot; sebagai halaman utama?</h3><p class="mt-2 text-xs leading-relaxed text-slate-500">Halaman ini akan ditampilkan ketika pengunjung membuka website tanpa path tambahan.</p><div class="mt-5 flex justify-end gap-2"><button class="rounded-lg px-3 py-2 text-xs text-slate-600" @click="confirmHome = null">Batal</button><button :disabled="saving" class="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50" @click="setHome">{{ saving ? 'Memproses...' : 'Jadikan Utama' }}</button></div></div></div>
    <div v-if="confirmDelete" class="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4"><div class="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"><h3 class="text-sm font-bold">Hapus halaman &quot;{{ confirmDelete.name }}&quot;?</h3><p class="mt-2 text-xs leading-relaxed text-slate-500">Semua section pada halaman ini juga akan terhapus. Tindakan ini tidak dapat dibatalkan.</p><div class="mt-5 flex justify-end gap-2"><button class="rounded-lg px-3 py-2 text-xs text-slate-600" @click="confirmDelete = null">Batal</button><button :disabled="saving" class="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50" @click="remove">{{ saving ? 'Menghapus...' : 'Hapus' }}</button></div></div></div>
  </div>
</template>
