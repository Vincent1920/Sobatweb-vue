<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeRouteLeave } from 'vue-router'
import { CheckCircle2, ChevronDown, ChevronLeft, ChevronUp, Copy, Eye, EyeOff, GripVertical, Image, Monitor, Plus, Save, Smartphone, Sparkles, Tablet, Trash2 } from 'lucide-vue-next'
import AddSectionModal from '@/components/editor/AddSectionModal.vue'
import SectionRenderer from '@/components/editor/SectionRenderer.vue'
import WebsitePreviewNavbar from '@/components/editor/WebsitePreviewNavbar.vue'
import EditorSidebarTabs, { type EditorSidebarTab } from '@/components/editor/sidebar/EditorSidebarTabs.vue'
import PagesPanel from '@/components/editor/sidebar/PagesPanel.vue'
import ThemePanel from '@/components/editor/sidebar/ThemePanel.vue'
import SeoPanel from '@/components/editor/sidebar/SeoPanel.vue'
import type { SectionPreset } from '@/data/section-presets'
import { useSectionStore } from '@/stores/section.store'
import { useEditorStore } from '@/stores/editor.store'
import { useToastStore } from '@/stores/toast.store'
import { websiteService } from '@/services/website.service'
import { normalizeApiError } from '@/utils/error-handler'
import type { SectionItem } from '@/types'
import type { PageInput } from '@/types/page'
import { getPagePath } from '@/types/page'

type Device = 'desktop' | 'tablet' | 'mobile'
const route = useRoute(); const router = useRouter(); const sections = useSectionStore(); const editor = useEditorStore(); const toast = useToastStore()
const device = ref<Device>('desktop'); const preview = ref(false); const modalOpen = ref(false); const pageMutationBusy = ref(false); const creatingSectionType = ref<SectionPreset['type'] | null>(null); const contentJson = ref('{}'); const activeSidebarTab = ref<EditorSidebarTab>('sections')
const sidebarScroll = ref<HTMLElement | null>(null); const canvasScroll = ref<HTMLElement | null>(null)
const current = computed(() => sections.items.find((section) => section.id === sections.selectedSectionId) ?? null)
const selectedIndex = computed(() => sections.items.findIndex((section) => section.id === sections.selectedSectionId))
const canvasThemeStyle = computed(() => ({
  fontFamily: editor.theme.fontFamily,
  '--editor-radius': ({ sm: '0.375rem', md: '0.5rem', lg: '0.75rem', full: '9999px' } as const)[editor.theme.borderRadius],
}))
const devices: { key: Device; icon: typeof Monitor }[] = [{ key: 'desktop', icon: Monitor }, { key: 'tablet', icon: Tablet }, { key: 'mobile', icon: Smartphone }]
const statusText = computed(() => ({ idle: 'Belum ada perubahan', dirty: 'Ada perubahan belum tersimpan', saving: 'Menyimpan...', saved: 'Tersimpan', error: 'Gagal menyimpan' })[sections.saveStatus])

watch(current, (item) => { contentJson.value = JSON.stringify(item?.content ?? {}, null, 2) }, { immediate: true })

onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnload)
  try {
    await editor.load()
    const requested = typeof route.params.pageId === 'string' && /^\d+$/.test(route.params.pageId) ? route.params.pageId : null
    const pageId = requested && editor.pages.some((page) => page.id === requested) ? requested : editor.activePageId
    if (!pageId) throw new Error('Website belum memiliki halaman')
    editor.activePageId = pageId
    await sections.fetchSections(pageId)
    if (!requested) await router.replace(`/editor/${pageId}`)
  } catch (error) { toast.show(normalizeApiError(error).message, 'error') }
})
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
onBeforeRouteLeave(async () => {
  try { await Promise.all([sections.flushPendingSaves(), editor.flush()]); return true }
  catch (error) { toast.show(normalizeApiError(error).message, 'error'); return false }
})

function beforeUnload(event: BeforeUnloadEvent): void { if (sections.hasUnsavedChanges || editor.hasUnsavedChanges) event.preventDefault() }
type SelectionScrollTarget = 'canvas' | 'sidebar' | 'both' | 'none'
function findSectionElement(container: HTMLElement | null, attribute: 'data-section-id' | 'data-sidebar-section-id', sectionId: SectionItem['id']): HTMLElement | null {
  if (!container) return null
  return [...container.querySelectorAll<HTMLElement>(`[${attribute}]`)].find((element) => element.dataset[attribute === 'data-section-id' ? 'sectionId' : 'sidebarSectionId'] === sectionId) ?? null
}
function scrollWithin(container: HTMLElement | null, element: HTMLElement | null, block: 'center' | 'nearest'): void {
  if (!container || !element) return
  const containerRect = container.getBoundingClientRect(); const elementRect = element.getBoundingClientRect()
  if (block === 'nearest' && elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom) return
  const top = block === 'center'
    ? container.scrollTop + elementRect.top - containerRect.top - (container.clientHeight - elementRect.height) / 2
    : container.scrollTop + (elementRect.top < containerRect.top ? elementRect.top - containerRect.top : elementRect.bottom - containerRect.bottom)
  container.scrollTo({ top, behavior: 'smooth' })
}
async function selectSection(sectionId: SectionItem['id'], target: SelectionScrollTarget = 'none'): Promise<void> {
  sections.selectedSectionId = sectionId
  await nextTick()
  if (target === 'canvas' || target === 'both') scrollWithin(canvasScroll.value, findSectionElement(canvasScroll.value, 'data-section-id', sectionId), 'center')
  if (target === 'sidebar' || target === 'both') scrollWithin(sidebarScroll.value, findSectionElement(sidebarScroll.value, 'data-sidebar-section-id', sectionId), 'nearest')
}
function onTitleInput(event: Event): void { if (current.value) sections.updateSectionLocal(current.value.id, { title: (event.target as HTMLInputElement).value }) }
function onSubtitleInput(event: Event): void { if (current.value) sections.updateSectionLocal(current.value.id, { subtitle: (event.target as HTMLTextAreaElement).value }) }
function onContentInput(event: Event): void { contentJson.value = (event.target as HTMLTextAreaElement).value; if (!current.value) return; try { sections.updateSectionLocal(current.value.id, { content: JSON.parse(contentJson.value) as Record<string, unknown> }) } catch { sections.markSectionError(current.value.id, 'Data konten belum berupa JSON yang valid') } }

async function addSection(preset: SectionPreset, targetPageId: string): Promise<void> { if (creatingSectionType.value) return; creatingSectionType.value = preset.type; const targetPage = editor.pages.find((page) => page.id === targetPageId); try { const added = await sections.addToPage(targetPageId, structuredClone(preset.defaultData)); modalOpen.value = false; if (targetPageId === editor.activePageId) await selectSection(added.id, 'both'); toast.show(`${preset.defaultData.title} berhasil ditambahkan ke ${targetPage?.name ?? 'halaman tujuan'}`, 'success') } catch (error) { toast.show(`Gagal menambahkan section ke ${targetPage?.name ?? 'halaman tujuan'}: ${normalizeApiError(error).message}`, 'error') } finally { creatingSectionType.value = null } }
async function selectPage(pageId: string): Promise<void> { if (pageId === editor.activePageId) return; try { await sections.flushPendingSaves(); editor.selectPage(pageId); await sections.fetchSections(pageId); activeSidebarTab.value = 'sections'; await router.replace(`/editor/${pageId}`) } catch (error) { toast.show(normalizeApiError(error).message, 'error') } }
async function createPage(payload: PageInput): Promise<void> { if (pageMutationBusy.value) return; pageMutationBusy.value = true; try { const page = await editor.createPage(payload); await sections.fetchSections(page.id); activeSidebarTab.value = 'sections'; await router.replace(`/editor/${page.id}`); toast.show('Halaman berhasil dibuat', 'success') } catch (error) { toast.show(normalizeApiError(error).message, 'error') } finally { pageMutationBusy.value = false } }
async function updatePage(pageId: string, payload: PageInput): Promise<void> { if (pageMutationBusy.value) return; pageMutationBusy.value = true; try { await editor.updatePage(pageId, payload); toast.show('Halaman berhasil diperbarui', 'success') } catch (error) { toast.show(normalizeApiError(error).message, 'error') } finally { pageMutationBusy.value = false } }
async function deletePage(pageId: string): Promise<void> { if (pageMutationBusy.value) return; const wasActive = editor.activePageId === pageId; pageMutationBusy.value = true; try { await editor.deletePage(pageId); if (wasActive && editor.activePageId) { await sections.fetchSections(editor.activePageId); await router.replace(`/editor/${editor.activePageId}`) } toast.show('Halaman berhasil dihapus', 'success') } catch (error) { toast.show(normalizeApiError(error).message, 'error') } finally { pageMutationBusy.value = false } }
async function setHomePage(pageId: string): Promise<void> { if (pageMutationBusy.value) return; pageMutationBusy.value = true; try { await editor.setHomePage(pageId); toast.show('Halaman utama berhasil diperbarui', 'success') } catch (error) { toast.show(`Gagal menjadikan halaman utama: ${normalizeApiError(error).message}`, 'error') } finally { pageMutationBusy.value = false } }
async function save(): Promise<void> { try { await sections.flushPendingSaves(); toast.show('Perubahan tersimpan', 'success') } catch (error) { toast.show(normalizeApiError(error).message, 'error') } }
async function duplicate(sectionId: SectionItem['id'] = current.value?.id ?? ''): Promise<void> { if (!sectionId) return; try { const item = await sections.duplicate(sectionId); await selectSection(item.id, 'both'); toast.show('Section berhasil diduplikasi', 'success') } catch (error) { toast.show(normalizeApiError(error).message, 'error') } }
async function remove(sectionId: SectionItem['id'] = current.value?.id ?? ''): Promise<void> { if (!sectionId) return; const deletedIndex = sections.items.findIndex((section) => section.id === sectionId); if (deletedIndex < 0) return; const wasSelected = sections.selectedSectionId === sectionId; try { await sections.remove(sectionId); if (wasSelected) { const fallback = sections.items[Math.min(deletedIndex, sections.items.length - 1)]; sections.selectedSectionId = fallback?.id ?? null; if (fallback) await selectSection(fallback.id, 'both') } toast.show('Section berhasil dihapus', 'success') } catch (error) { toast.show(normalizeApiError(error).message, 'error') } }
async function move(direction: 'up' | 'down', sectionId: SectionItem['id'] = current.value?.id ?? ''): Promise<void> { if (!sectionId) return; const selectionBeforeMove = sections.selectedSectionId; try { await sections.move(sectionId, direction); sections.selectedSectionId = selectionBeforeMove; await nextTick(); if (selectionBeforeMove) scrollWithin(sidebarScroll.value, findSectionElement(sidebarScroll.value, 'data-sidebar-section-id', selectionBeforeMove), 'nearest') } catch (error) { toast.show(normalizeApiError(error).message, 'error') } }
function toggle(): void { if (current.value) sections.toggle(current.value) }
async function flushEditor(): Promise<void> { await Promise.all([sections.flushPendingSaves(), editor.flush()]) }
async function publish(): Promise<void> { try { await flushEditor(); await websiteService.publish(); toast.show('Website berhasil dipublish', 'success') } catch (error) { toast.show(normalizeApiError(error).message, 'error') } }
async function leaveEditor(): Promise<void> { try { await flushEditor(); await router.push('/dashboard') } catch (error) { toast.show(normalizeApiError(error).message, 'error') } }
async function togglePreview(): Promise<void> { try { await flushEditor(); preview.value = !preview.value } catch (error) { toast.show(normalizeApiError(error).message, 'error') } }
</script>

<template>
  <div class="flex h-[calc(100vh-5rem)] flex-col bg-slate-100">
    <header class="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3">
      <div class="flex items-center gap-3"><button class="rounded-lg p-2 hover:bg-slate-100" @click="leaveEditor"><ChevronLeft class="h-4 w-4" /></button><div><strong class="block text-xs">Visual Editor</strong><span class="block max-w-[24rem] truncate text-[10px] text-slate-400"><b class="font-semibold text-sky-700">Mengedit: {{ editor.activePage?.name ?? 'Tidak ada halaman' }} • {{ editor.activePage ? getPagePath(editor.activePage) : '/' }}</b><span class="hidden xl:inline"> · {{ editor.domain }}</span></span></div></div>
      <div class="flex rounded-xl border border-slate-200 bg-slate-100 p-1"><button v-for="item in devices" :key="item.key" class="rounded-lg p-1.5 sm:px-3" :class="device === item.key ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500'" @click="device = item.key"><component :is="item.icon" class="h-3.5 w-3.5" /></button></div>
      <div class="flex gap-2"><button class="rounded-lg border px-3 py-1.5 text-xs" @click="togglePreview"><Eye class="mr-1 inline h-3.5 w-3.5" />Preview</button><button class="rounded-lg bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white" @click="publish"><Sparkles class="mr-1 inline h-3.5 w-3.5" />Publish</button></div>
    </header>
    <div class="flex min-h-0 flex-1">
      <aside v-if="!preview" class="z-20 hidden w-80 shrink-0 select-none flex-col border-r border-slate-200 bg-white md:flex">
        <EditorSidebarTabs v-model="activeSidebarTab" />
        <div ref="sidebarScroll" class="flex-1 overflow-y-auto p-4">
          <div v-if="activeSidebarTab === 'sections'" class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800">Susunan Section</h4>
                <p class="text-[11px] text-slate-400">{{ sections.items.length }} blok pada halaman {{ editor.activePage?.name ?? 'aktif' }}</p>
              </div>
              <button class="flex items-center gap-1 rounded-lg bg-sky-600 px-2.5 py-1 text-xs font-medium text-white shadow-xs transition-colors hover:bg-sky-700" @click="modalOpen = true">
                <Plus class="h-3.5 w-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            <p v-if="sections.loading" class="py-8 text-center text-xs text-slate-400">Memuat section...</p>
            <div v-else class="space-y-2">
              <div
                v-for="(section, index) in sections.items"
                :key="section.id"
                :data-sidebar-section-id="section.id"
                :aria-selected="sections.selectedSectionId === section.id"
                role="option"
                tabindex="0"
                class="group cursor-pointer rounded-xl border bg-white p-2.5 text-left transition-all"
                :class="sections.selectedSectionId === section.id ? 'border-sky-500 bg-sky-50/30 shadow-xs ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'"
                @click="selectSection(section.id, 'canvas')"
                @keydown.enter.prevent="selectSection(section.id, 'canvas')"
                @keydown.space.prevent="selectSection(section.id, 'canvas')"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="flex min-w-0 items-center gap-2 overflow-hidden">
                    <GripVertical class="h-3.5 w-3.5 shrink-0 cursor-grab text-slate-300 group-hover:text-slate-500" />
                    <div class="min-w-0 truncate">
                      <span class="block truncate text-xs font-semibold text-slate-800">{{ section.title || section.type }}</span>
                      <span class="font-mono text-[10px] uppercase tracking-wider text-slate-400">{{ section.type }} • {{ section.settings.bgStyle }}</span>
                    </div>
                  </div>

                  <div class="flex shrink-0 items-center gap-0.5 opacity-60 transition-opacity group-hover:opacity-100">
                    <button :disabled="index === 0" class="rounded p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30" title="Pindah ke Atas" @click.stop="move('up', section.id)"><ChevronUp class="h-3 w-3" /></button>
                    <button :disabled="index === sections.items.length - 1" class="rounded p-1 text-slate-500 hover:bg-slate-200 disabled:opacity-30" title="Pindah ke Bawah" @click.stop="move('down', section.id)"><ChevronDown class="h-3 w-3" /></button>
                    <button class="rounded p-1 text-slate-500 hover:bg-slate-200" title="Duplikat Section" @click.stop="duplicate(section.id)"><Copy class="h-3 w-3" /></button>
                    <button class="rounded p-1 text-rose-500 hover:bg-rose-100" title="Hapus Section" @click.stop="remove(section.id)"><Trash2 class="h-3 w-3" /></button>
                  </div>
                </div>
              </div>
            </div>

            <button class="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:border-sky-400 hover:bg-sky-50/40 hover:text-sky-600" @click="modalOpen = true">
              <Plus class="h-4 w-4" />
              <span>Tambah Section Baru</span>
            </button>
          </div>
          <PagesPanel v-else-if="activeSidebarTab === 'pages'" :pages="editor.pages" :active-page-id="editor.activePageId" :saving="pageMutationBusy" @select="selectPage" @create="createPage" @update="updatePage" @delete="deletePage" @set-home="setHomePage" />
          <ThemePanel v-else-if="activeSidebarTab === 'theme'" :theme="editor.theme" :status="editor.themeStatus" @update="editor.updateTheme" />
          <SeoPanel v-else :seo="editor.seo" :status="editor.seoStatus" @update="editor.updateSeo" />
        </div>
      </aside>
      <main ref="canvasScroll" class="min-w-0 flex-1 overflow-auto bg-slate-200 p-4"><div class="editor-theme-preview mx-auto bg-white shadow-xl transition-all" :class="device === 'mobile' ? 'max-w-[390px]' : device === 'tablet' ? 'max-w-[768px]' : 'max-w-[1200px]'" :style="canvasThemeStyle"><WebsitePreviewNavbar v-if="editor.pages.length" :school-name="editor.schoolName" :pages="editor.pages" :active-page-id="editor.activePageId" :device="device" @navigate="selectPage" /><SectionRenderer v-for="section in sections.items" :key="section.id" :section="section" :selected="sections.selectedSectionId === section.id" :theme="editor.theme" @select="selectSection(section.id, 'sidebar')" /><div v-if="!sections.loading && !sections.items.length" class="px-6 py-20 text-center text-sm text-slate-400"><p>Halaman &quot;{{ editor.activePage?.name }}&quot; belum memiliki section.</p><button v-if="!preview" class="mt-4 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700" @click="modalOpen = true"><Plus class="mr-1 inline h-3.5 w-3.5" />Tambah Section</button></div></div></main>
      <aside v-if="!preview" class="hidden w-72 shrink-0 overflow-y-auto border-l border-slate-200 bg-white p-4 lg:block">
        <h3 class="text-xs font-bold">Properti Section</h3>
        <div v-if="current" class="mt-5 space-y-4 text-xs">
          <label class="block font-semibold">Judul Section<input :value="current.title" class="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-normal" @input="onTitleInput" /></label>
          <label class="block font-semibold">Subjudul<textarea :value="current.subtitle" rows="2" class="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-normal" @input="onSubtitleInput" /></label>
          <label class="block font-semibold">Data Konten<textarea :value="contentJson" rows="8" class="mt-1 w-full rounded-xl border border-slate-200 p-2.5 font-mono text-[10px] font-normal" @input="onContentInput" /></label>
          <button class="w-full rounded-xl border p-2.5"><Image class="mr-1 inline h-4 w-4" />Ganti Gambar</button>
          <div class="grid grid-cols-2 gap-2"><button class="rounded-xl border p-2" :disabled="selectedIndex <= 0" @click="move('up')"><ChevronUp class="mr-1 inline h-3.5 w-3.5" />Naik</button><button class="rounded-xl border p-2" :disabled="selectedIndex < 0 || selectedIndex === sections.items.length - 1" @click="move('down')"><ChevronDown class="mr-1 inline h-3.5 w-3.5" />Turun</button><button class="rounded-xl border p-2" @click="duplicate()"><Copy class="mr-1 inline h-3.5 w-3.5" />Duplikat</button><button class="rounded-xl border p-2" @click="toggle"><EyeOff v-if="!current.hidden" class="mr-1 inline h-3.5 w-3.5" /><Eye v-else class="mr-1 inline h-3.5 w-3.5" />{{ current.hidden ? 'Tampil' : 'Sembunyi' }}</button></div>
          <button class="w-full rounded-xl border border-rose-200 p-2 text-rose-600" @click="remove()"><Trash2 class="mr-1 inline h-3.5 w-3.5" />Hapus</button>
          <button class="w-full rounded-xl bg-sky-600 p-2.5 font-bold text-white" @click="save"><Save class="mr-1 inline h-4 w-4" />Simpan</button>
          <button class="flex items-center gap-1 text-left" :class="sections.saveStatus === 'error' ? 'text-rose-600' : sections.saveStatus === 'dirty' ? 'text-amber-600' : 'text-emerald-600'" @click="sections.saveStatus === 'error' && sections.retryFailed()"><CheckCircle2 class="h-3.5 w-3.5" />{{ statusText }}</button>
        </div>
      </aside>
    </div>
    <AddSectionModal :open="modalOpen" :saving="creatingSectionType !== null" :pending-type="creatingSectionType" :pages="editor.pages" :active-page-id="editor.activePageId" @close="modalOpen = false" @select="addSection" />
  </div>
</template>

<style scoped>
.editor-theme-preview :deep(.rounded-xl),
.editor-theme-preview :deep(.rounded-2xl),
.editor-theme-preview :deep(.rounded-3xl) { border-radius: var(--editor-radius); }
</style>
