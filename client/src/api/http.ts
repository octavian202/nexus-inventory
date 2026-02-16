import type { ApiErrorResponse } from './types'
import { getAccessToken } from '../auth/tokenStore'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

async function readErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get('content-type') ?? ''
  try {
    if (contentType.includes('application/json')) {
      const body = (await res.json()) as ApiErrorResponse | { message?: string } | unknown
      if (body && typeof body === 'object' && 'message' in body && typeof (body as any).message === 'string') {
        return (body as any).message
      }
      return JSON.stringify(body)
    }
    const text = await res.text()
    return text || res.statusText
  } catch {
    return res.statusText
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  })

  if (!res.ok) {
    const msg = await readErrorMessage(res)
    throw new Error(msg || `Request failed with ${res.status}`)
  }

  // If server returns empty body, still satisfy typing
  if (res.status === 204) return undefined as T

  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return (await res.json()) as T
  }
  return (await res.text()) as unknown as T
}

