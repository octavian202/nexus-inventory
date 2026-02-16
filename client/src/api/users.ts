import { apiFetch } from './http'

export type AppUser = {
  id: string
  authUserId: string
  email: string
  displayName: string | null
  avatarUrl: string | null
  createdAt: string
  lastLoginAt: string
}

export function getCurrentUser(): Promise<AppUser> {
  return apiFetch<AppUser>('/api/v1/users/me')
}

export function getAllUsers(): Promise<AppUser[]> {
  return apiFetch<AppUser[]>('/api/v1/users')
}

