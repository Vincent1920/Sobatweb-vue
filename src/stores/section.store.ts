import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { NewSection, SectionItem } from '@/types'
import { sectionService } from '@/services/section.service'
import { normalizeApiError } from '@/utils/error-handler'

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'
const AUTOSAVE_DELAY = 800

export const useSectionStore = defineStore('sections', () => {
  const items = ref<SectionItem[]>([])
  const pageId = ref<string | null>(null)
  const selectedSectionId = ref<string | null>(null)
  const loading = ref(false)
  const savingSectionIds = reactive(new Set<string>())
  const sectionStatuses = reactive<Record<string, SaveStatus>>({})
  const lastSavedAt = reactive<Record<string, string>>({})
  const errors = reactive<Record<string, string>>({})
  const validationBlockedIds = reactive(new Set<string>())
  const revisions = new Map<string, number>()
  const timers = new Map<string, ReturnType<typeof setTimeout>>()
  const inFlight = new Map<string, Promise<void>>()

  const visibleItems = computed(() => items.value.filter((item) => !item.hidden))
  const hasUnsavedChanges = computed(() => Object.values(sectionStatuses).some((status) => status === 'dirty' || status === 'saving' || status === 'error'))
  const saveStatus = computed<SaveStatus>(() => {
    const statuses = Object.values(sectionStatuses)
    if (statuses.includes('error')) return 'error'
    if (statuses.includes('saving')) return 'saving'
    if (statuses.includes('dirty')) return 'dirty'
    if (statuses.includes('saved')) return 'saved'
    return 'idle'
  })

  function resetTracking(): void {
    timers.forEach(clearTimeout); timers.clear(); revisions.clear(); inFlight.clear()
    Object.keys(sectionStatuses).forEach((key) => delete sectionStatuses[key])
    Object.keys(lastSavedAt).forEach((key) => delete lastSavedAt[key])
    Object.keys(errors).forEach((key) => delete errors[key])
    savingSectionIds.clear(); validationBlockedIds.clear()
  }

  async function fetchSections(nextPageId: string): Promise<void> {
    await flushPendingSaves()
    loading.value = true; pageId.value = nextPageId
    try {
      const loaded = (await sectionService.list(nextPageId)).data.data
      resetTracking(); items.value = loaded
      for (const item of loaded) { sectionStatuses[item.id] = 'idle'; revisions.set(item.id, 0) }
      selectedSectionId.value = loaded[0]?.id ?? null
    } finally { loading.value = false }
  }

  function scheduleSectionSave(id: string): void {
    const existing = timers.get(id); if (existing) clearTimeout(existing)
    timers.set(id, setTimeout(() => { timers.delete(id); void saveSection(id).catch(() => undefined) }, AUTOSAVE_DELAY))
  }

  function updateSectionLocal(id: string, patch: Partial<Pick<SectionItem, 'title' | 'subtitle' | 'content' | 'settings' | 'hidden'>>): void {
    const item = items.value.find((section) => section.id === id); if (!item) return
    Object.assign(item, patch)
    revisions.set(id, (revisions.get(id) ?? 0) + 1)
    validationBlockedIds.delete(id); sectionStatuses[id] = 'dirty'; delete errors[id]
    scheduleSectionSave(id)
  }

  function markSectionError(id: string, message: string): void {
    const timer = timers.get(id); if (timer) clearTimeout(timer); timers.delete(id)
    validationBlockedIds.add(id); sectionStatuses[id] = 'error'; errors[id] = message
  }

  async function saveSection(id: string): Promise<void> {
    const running = inFlight.get(id)
    if (running) { await running; if (sectionStatuses[id] === 'dirty') return saveSection(id); return }
    const item = items.value.find((section) => section.id === id)
    if (!item || !['dirty', 'error'].includes(sectionStatuses[id] ?? 'idle')) return
    if (validationBlockedIds.has(id)) throw new Error(errors[id] ?? 'Data section belum valid')
    const revisionAtSave = revisions.get(id) ?? 0
    const payload = JSON.parse(JSON.stringify({ title: item.title, subtitle: item.subtitle, content: item.content, settings: item.settings, hidden: item.hidden })) as Pick<SectionItem, 'title' | 'subtitle' | 'content' | 'settings' | 'hidden'>
    sectionStatuses[id] = 'saving'; savingSectionIds.add(id)
    const request = sectionService.update(id, payload).then(({ data }) => {
      const persisted = data.data?.section
      if (!data.success || !persisted || persisted.id !== id) throw new Error('Respons penyimpanan section tidak valid')
      lastSavedAt[id] = persisted.updatedAt ?? new Date().toISOString()
      if ((revisions.get(id) ?? 0) === revisionAtSave) {
        const local = items.value.find((section) => section.id === id)
        if (local) Object.assign(local, persisted)
        delete errors[id]; sectionStatuses[id] = 'saved'
      }
      else { sectionStatuses[id] = 'dirty'; scheduleSectionSave(id) }
    }).catch((cause: unknown) => {
      sectionStatuses[id] = 'error'; errors[id] = normalizeApiError(cause).message
      throw cause
    }).finally(() => { savingSectionIds.delete(id); inFlight.delete(id) })
    inFlight.set(id, request)
    await request
  }

  async function flushPendingSaves(): Promise<void> {
    timers.forEach(clearTimeout); timers.clear()
    const candidates = () => items.value.filter((item) => ['dirty', 'error'].includes(sectionStatuses[item.id] ?? '')).map((item) => item.id)
    let ids = candidates()
    while (ids.length) { await Promise.all(ids.map(saveSection)); ids = candidates() }
    await Promise.all([...inFlight.values()])
    const failed = Object.values(sectionStatuses).some((status) => status === 'error')
    if (failed) throw new Error('Sebagian perubahan gagal disimpan')
  }

  async function addToPage(targetPageId: string, payload: NewSection): Promise<SectionItem> {
    const targetsActivePage = targetPageId === pageId.value
    if (targetsActivePage && payload.type === 'footer' && items.value.some((item) => item.type === 'footer')) throw new Error('Footer website sudah tersedia')
    const response = await sectionService.create(targetPageId, payload)
    const item = response.data.data.section
    if (targetsActivePage) {
      items.value.push(item); revisions.set(item.id, 0); sectionStatuses[item.id] = 'saved'; lastSavedAt[item.id] = item.updatedAt ?? new Date().toISOString(); selectedSectionId.value = item.id
    }
    return item
  }
  async function add(payload: NewSection): Promise<SectionItem> { if (!pageId.value) throw new Error('Page belum dipilih'); return addToPage(pageId.value, payload) }

  async function remove(id: string): Promise<void> {
    const timer = timers.get(id); if (timer) clearTimeout(timer); timers.delete(id)
    const running = inFlight.get(id); if (running) await running
    await sectionService.remove(id)
    items.value = items.value.filter((item) => item.id !== id); revisions.delete(id); validationBlockedIds.delete(id); delete sectionStatuses[id]; delete errors[id]; delete lastSavedAt[id]
  }

  async function duplicate(id: string): Promise<SectionItem> {
    if (['dirty', 'error'].includes(sectionStatuses[id] ?? '')) await saveSection(id)
    const response = await sectionService.duplicate(id); const item = response.data.data.section
    const sourceIndex = items.value.findIndex((section) => section.id === id)
    items.value.splice(sourceIndex + 1, 0, item); revisions.set(item.id, 0); sectionStatuses[item.id] = 'saved'; selectedSectionId.value = item.id
    return item
  }

  async function move(id: string, direction: 'up' | 'down'): Promise<void> {
    const from = items.value.findIndex((item) => item.id === id); const to = direction === 'up' ? from - 1 : from + 1
    if (from < 0 || to < 0 || to >= items.value.length) return
    const snapshot = [...items.value]; const [moved] = items.value.splice(from, 1); if (!moved) return; items.value.splice(to, 0, moved)
    items.value.forEach((item, index) => { item.sortOrder = index + 1 })
    try { await sectionService.reorder(items.value.map((item) => item.id)) }
    catch (cause) { items.value = snapshot; throw cause }
  }

  function toggle(item: SectionItem): void { updateSectionLocal(item.id, { hidden: !item.hidden }) }
  function retryFailed(): Promise<void> { return flushPendingSaves() }

  return { items, pageId, selectedSectionId, loading, savingSectionIds, sectionStatuses, lastSavedAt, errors, visibleItems, saveStatus, hasUnsavedChanges, fetchSections, updateSectionLocal, markSectionError, scheduleSectionSave, saveSection, flushPendingSaves, add, addToPage, remove, duplicate, move, toggle, retryFailed }
})
