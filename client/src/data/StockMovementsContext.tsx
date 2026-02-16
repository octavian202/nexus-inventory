import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getStockMovements } from '../api/stockMovements'
import type { StockMovement } from '../api/types'

type StockMovementsState = {
  movements: StockMovement[]
  loading: boolean
  error: string | null
  refresh: (limit?: number) => Promise<void>
}

const StockMovementsContext = createContext<StockMovementsState | null>(null)

export function StockMovementsProvider({ children }: { children: React.ReactNode }) {
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (limit = 50) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getStockMovements(limit)
      setMovements(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load stock movements')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh(50)
  }, [refresh])

  const value = useMemo(() => ({ movements, loading, error, refresh }), [movements, loading, error, refresh])

  return <StockMovementsContext.Provider value={value}>{children}</StockMovementsContext.Provider>
}

export function useStockMovements() {
  const ctx = useContext(StockMovementsContext)
  if (!ctx) throw new Error('useStockMovements must be used within StockMovementsProvider')
  return ctx
}

