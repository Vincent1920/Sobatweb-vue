import axios from 'axios'
import type { ApiErrorPayload } from '@/types'

export function normalizeApiError(error: unknown): ApiErrorPayload {
  if (!axios.isAxiosError(error)) return { message: 'Terjadi kesalahan yang tidak terduga.' }
  const status = error.response?.status
  const payload = error.response?.data as Partial<ApiErrorPayload> | undefined
  if (!error.response) return { message: 'Tidak dapat terhubung ke server. Periksa koneksi Anda.' }
  return { status, errors: payload?.errors, message: payload?.message ?? statusMessage(status) }
}

function statusMessage(status?: number): string {
  const messages: Record<number, string> = {
    400: 'Permintaan tidak valid.', 401: 'Sesi Anda berakhir. Silakan masuk kembali.',
    403: 'Anda tidak memiliki akses.', 404: 'Data tidak ditemukan.',
    409: 'Data sudah digunakan.', 422: 'Periksa kembali data yang diisi.',
    429: 'Terlalu banyak permintaan. Coba lagi nanti.', 500: 'Server sedang bermasalah.',
  }
  return status ? (messages[status] ?? 'Permintaan gagal diproses.') : 'Permintaan gagal diproses.'
}
