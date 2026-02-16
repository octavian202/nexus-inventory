import { apiFetch } from './http'
import type { AuditLogEntry } from './types'

export function getAuditLogs(limit = 50): Promise<AuditLogEntry[]> {
  return apiFetch<AuditLogEntry[]>(
    `/api/v1/audit-logs?limit=${encodeURIComponent(String(limit))}`
  )
}
