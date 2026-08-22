export type SectionType =
  | 'hero' | 'about' | 'statistics' | 'programs' | 'teachers' | 'news' | 'gallery'
  | 'vision_mission' | 'facilities' | 'extracurricular' | 'achievements' | 'agenda'
  | 'testimonials' | 'partners' | 'video' | 'faq' | 'cta' | 'ppdb' | 'contact'
  | 'map' | 'social_media' | 'footer'

export type SectionBackground = 'white' | 'muted' | 'brand' | 'dark' | 'gradient'

export interface SectionSettings {
  bgStyle: SectionBackground
  paddingY: 'sm' | 'md' | 'lg'
  alignment: 'left' | 'center' | 'right'
  showSubtitle?: boolean
  showBadge?: boolean
  badgeText?: string
}

export interface SectionItem {
  id: string
  pageId: string
  type: SectionType
  title: string
  subtitle?: string | null
  content: Record<string, unknown>
  settings: SectionSettings
  hidden: boolean
  sortOrder: number
  updatedAt?: string
}

export type NewSection = Omit<SectionItem, 'id' | 'pageId' | 'sortOrder'>
