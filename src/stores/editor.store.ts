import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { websiteService, type WebsiteSeo, type WebsiteTheme } from '@/services/website.service'
import { usePageStore } from '@/stores/page.store'
import type { PageInput } from '@/types/page'

type PersistStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'
const SAVE_DELAY = 800

export const useEditorStore = defineStore('editor', () => {
  const domain = ref('')
  const schoolName = ref('')
  const pageStore = usePageStore()
  const { pages, activePageId, activePage } = storeToRefs(pageStore)
  const theme = ref<WebsiteTheme>({ primaryColor: '#0284c7', primaryDark: '#0369a1', accentColor: '#f59e0b', fontFamily: 'Inter, sans-serif', borderRadius: 'md' })
  const seo = ref<WebsiteSeo>({ title: '', description: '', keywords: '', ogImage: '' })
  const themeStatus = ref<PersistStatus>('idle')
  const seoStatus = ref<PersistStatus>('idle')
  let themeTimer: ReturnType<typeof setTimeout> | null = null
  let seoTimer: ReturnType<typeof setTimeout> | null = null

  const hasUnsavedChanges = computed(() => [themeStatus.value, seoStatus.value].some((status) => ['dirty', 'saving', 'error'].includes(status)))

  async function load(): Promise<void> {
    const context = (await websiteService.get()).data.data
    domain.value = context.fullDomain; schoolName.value = context.schoolName; pageStore.hydrate(context.pages)
    theme.value = { ...theme.value, ...(context.theme ?? {}) }; seo.value = { ...seo.value, ...(context.seo ?? {}) }
    themeStatus.value = 'saved'; seoStatus.value = 'saved'
  }
  const createPage = (payload: PageInput) => pageStore.createPage(payload)
  function updateTheme(patch: Partial<WebsiteTheme>): void {
    theme.value = { ...theme.value, ...patch }; themeStatus.value = 'dirty'
    if (themeTimer) clearTimeout(themeTimer)
    themeTimer = setTimeout(() => { themeTimer = null; void saveTheme().catch(() => undefined) }, SAVE_DELAY)
  }
  function updateSeo(patch: Partial<WebsiteSeo>): void {
    seo.value = { ...seo.value, ...patch }; seoStatus.value = 'dirty'
    if (seoTimer) clearTimeout(seoTimer)
    seoTimer = setTimeout(() => { seoTimer = null; void saveSeo().catch(() => undefined) }, SAVE_DELAY)
  }
  async function saveTheme(): Promise<void> { if (!['dirty', 'error'].includes(themeStatus.value)) return; themeStatus.value = 'saving'; try { await websiteService.updateTheme(theme.value); themeStatus.value = 'saved' } catch (error) { themeStatus.value = 'error'; throw error } }
  async function saveSeo(): Promise<void> { if (!['dirty', 'error'].includes(seoStatus.value)) return; seoStatus.value = 'saving'; try { await websiteService.updateSeo(seo.value); seoStatus.value = 'saved' } catch (error) { seoStatus.value = 'error'; throw error } }
  async function flush(): Promise<void> {
    if (themeTimer) { clearTimeout(themeTimer); themeTimer = null }
    if (seoTimer) { clearTimeout(seoTimer); seoTimer = null }
    await Promise.all([saveTheme(), saveSeo()])
  }

  return { domain, schoolName, pages, activePageId, activePage, theme, seo, themeStatus, seoStatus, hasUnsavedChanges, load, createPage, updatePage: pageStore.updatePage, deletePage: pageStore.deletePage, setHomePage: pageStore.setHomePage, selectPage: pageStore.selectPage, updateTheme, updateSeo, flush }
})
