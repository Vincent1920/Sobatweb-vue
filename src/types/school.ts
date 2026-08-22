export type SupportedTimezone = 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura'

export interface SchoolProfile {
  id: string
  name: string
  timezone: SupportedTimezone
}
