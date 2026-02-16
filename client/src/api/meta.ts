import { apiFetch } from './http'

export type MetaResponse = {
  appName: string
  serverTime: string
}

export function getMeta(): Promise<MetaResponse> {
  return apiFetch<MetaResponse>('/api/v1/meta')
}

