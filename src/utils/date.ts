export const timezoneOptions = [
  { value: 'Asia/Jakarta', label: 'WIB', description: 'Waktu Indonesia Barat' },
  { value: 'Asia/Makassar', label: 'WITA', description: 'Waktu Indonesia Tengah' },
  { value: 'Asia/Jayapura', label: 'WIT', description: 'Waktu Indonesia Timur' },
] as const

export const timezoneLabelMap: Record<string, string> = {
  'Asia/Jakarta': 'WIB',
  'Asia/Makassar': 'WITA',
  'Asia/Jayapura': 'WIT',
}

export function formatDateTime(value: string | Date | null, timezone: string, nullLabel = 'Belum pernah dipublish'): string {
  if (!value) return nullLabel
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return 'Tanggal tidak tersedia'
  const formatted = new Intl.DateTimeFormat('id-ID', {
    timeZone: timezone,
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date).replace(':', '.')
  return `${formatted} ${timezoneLabelMap[timezone] ?? timezone}`
}
