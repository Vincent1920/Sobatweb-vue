export interface WebsitePage {
  id: string
  websiteId?: string
  name: string
  slug: string
  title?: string | null
  status: 'draft' | 'published'
  isHome: boolean
  order: number
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface PageInput { name: string; slug: string }

export function getPagePath(page: WebsitePage): string {
  return page.isHome ? '/' : `/${page.slug}`
}
