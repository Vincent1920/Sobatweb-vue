export type UserRole = 'school' | 'admin'
export type AccountStatus = 'active' | 'suspended' | 'pending'
export interface AuthUser {
  id: number
  schoolId: number | null
  name: string
  email: string
  role: UserRole
  status: AccountStatus
}
export interface LoginPayload { email: string; password: string }
export interface RegisterPayload extends LoginPayload {
  schoolName: string
  npsn: string
  personInCharge: string
}
export interface AuthSession {
  accessToken: string
  token: string
  refreshToken: string
  tokenType: 'Bearer'
  expiresIn: number
  user: AuthUser
}
export interface RefreshSession extends Omit<AuthSession, 'user'> {}
