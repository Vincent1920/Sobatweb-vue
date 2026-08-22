export interface ApiErrorPayload {
  message: string
  status?: number
  errors?: Record<string, string | string[]>
}
export interface ApiResponse<T> {
  success: true
  message: string
  data: T
}
