import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getAuditLogs } from '../api/auditLogs'
import type { AuditLogEntry } from '../api/types'

type AuditLogsState = {
  entries: AuditLogEntry[]
  loading: boolean
  error: string | null
  refresh: (limit?: number) => Promise<void>
}

const AuditLogsContext = createContext<AuditLogsState | null>(null)

export function AuditLogsProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (limit = 50) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAuditLogs(limit)
      setEntries(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load audit log')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh(50)
  }, [refresh])

  const value = useMemo(
    () => ({ entries, loading, error, refresh }),
    [entries, loading, error, refresh]
  )

  return (
    <AuditLogsContext.Provider value={value}>{children}</AuditLogsContext.Provider>
  )
}

export function useAuditLogs() {
  const ctx = useContext(AuditLogsContext)
  if (!ctx) throw new Error('useAuditLogs must be used within AuditLogsProvider')
  return ctx
}
