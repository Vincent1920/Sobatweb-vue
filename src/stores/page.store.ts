import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { pageService } from '@/services/page.service'
import type { PageInput, WebsitePage } from '@/types/page'
import { normalizeApiError } from '@/utils/error-handler'

export const usePageStore = defineStore('pages', () => {
  const pages = ref<WebsitePage[]>([])
  const activePageId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const activePage = computed(() => pages.value.find((page) => page.id === activePageId.value) ?? null)
  const homePage = computed(() => pages.value.find((page) => page.isHome) ?? null)

  function hydrate(items: WebsitePage[]): void {
    pages.value = items
    if (!items.some((page) => page.id === activePageId.value)) {
      activePageId.value = items.find((page) => page.isHome)?.id ?? items[0]?.id ?? null
    }
  }

  async function fetchPages(): Promise<void> {
    loading.value = true
    error.value = null
    try { hydrate((await pageService.list()).data.data) }
    catch (cause) { error.value = normalizeApiError(cause).message; throw cause }
    finally { loading.value = false }
  }

  async function createPage(payload: PageInput): Promise<WebsitePage> {
    loading.value = true; error.value = null
    try {
      const page = (await pageService.create(payload)).data.data.page
      pages.value = [...pages.value, page].sort((a, b) => a.order - b.order || Number(a.id) - Number(b.id))
      activePageId.value = page.id
      return page
    } catch (cause) { error.value = normalizeApiError(cause).message; throw cause }
    finally { loading.value = false }
  }

  async function updatePage(id: string, payload: PageInput): Promise<WebsitePage> {
    loading.value = true; error.value = null
    try {
      const page = (await pageService.update(id, payload)).data.data.page
      pages.value = pages.value.map((item) => item.id === id ? page : item)
      return page
    } catch (cause) { error.value = normalizeApiError(cause).message; throw cause }
    finally { loading.value = false }
  }

  async function deletePage(id: string): Promise<void> {
    loading.value = true; error.value = null
    try {
      await pageService.remove(id)
      pages.value = pages.value.filter((page) => page.id !== id)
      if (activePageId.value === id) activePageId.value = homePage.value?.id ?? pages.value[0]?.id ?? null
    } catch (cause) { error.value = normalizeApiError(cause).message; throw cause }
    finally { loading.value = false }
  }

  async function setHomePage(id: string): Promise<WebsitePage> {
    loading.value = true; error.value = null
    try {
      const page = (await pageService.setHome(id)).data.data.page
      pages.value = pages.value.map((item) => item.id === id ? page : { ...item, isHome: false })
      return page
    } catch (cause) { error.value = normalizeApiError(cause).message; throw cause }
    finally { loading.value = false }
  }

  function selectPage(id: string): void {
    if (pages.value.some((page) => page.id === id)) activePageId.value = id
  }

  return { pages, activePageId, loading, error, activePage, homePage, hydrate, fetchPages, createPage, updatePage, deletePage, setHomePage, selectPage }
})
