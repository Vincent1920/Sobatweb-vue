export type DashboardWebsiteStatus = 'published' | 'draft' | 'changed'

export interface DashboardSection {
  id: string
  title: string
  type: string
  sortOrder: number
  hidden: boolean
}

export interface DashboardData {
  school: { id: string; name: string; logo: string | null; email: string; timezone: string }
  website: {
    id: string
    name: string
    status: DashboardWebsiteStatus
    subdomain: string
    fullDomain: string
    template: { id: string; name: string } | null
    updatedAt: string
    publishedAt: string | null
  }
  stats: { pages: number; sections: number; media: number }
  homePage: { id: string; name: string; slug: string; sections: DashboardSection[] } | null
}
