import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getMeta, type MetaResponse } from '../api/meta'

type MetaState = {
  meta: MetaResponse | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const MetaContext = createContext<MetaState | null>(null)

export function MetaProvider({ children }: { children: React.ReactNode }) {
  const [meta, setMeta] = useState<MetaResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMeta()
      setMeta(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load server meta')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo(() => ({ meta, loading, error, refresh }), [meta, loading, error, refresh])

  return <MetaContext.Provider value={value}>{children}</MetaContext.Provider>
}

export function useMeta() {
  const ctx = useContext(MetaContext)
  if (!ctx) throw new Error('useMeta must be used within MetaProvider')
  return ctx
}

