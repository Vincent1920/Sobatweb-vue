export type UserRole = 'school' | 'admin'
export interface AuthUser { id: string; name: string; email: string; role: UserRole }
export interface LoginPayload { email: string; password: string }
export interface RegisterPayload extends LoginPayload { name: string }
export interface AuthResponse { token?: string; user?: AuthUser; message?: string }
