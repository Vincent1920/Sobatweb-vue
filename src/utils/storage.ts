const TOKEN_KEY = 'sobat_access_token'
const REFRESH_TOKEN_KEY = 'sobat_refresh_token'

const storage = (): Storage | null => (typeof window === 'undefined' ? null : window.localStorage)

export const tokenStorage = {
  get: (): string | null => storage()?.getItem(TOKEN_KEY) ?? null,
  set: (token: string): void => storage()?.setItem(TOKEN_KEY, token),
  remove: (): void => storage()?.removeItem(TOKEN_KEY),
}

export const refreshTokenStorage = {
  get: (): string | null => storage()?.getItem(REFRESH_TOKEN_KEY) ?? null,
  set: (token: string): void => storage()?.setItem(REFRESH_TOKEN_KEY, token),
  remove: (): void => storage()?.removeItem(REFRESH_TOKEN_KEY),
}
