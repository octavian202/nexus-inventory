import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getAllProducts } from '../api/products'
import type { Product } from '../api/types'

type ProductsState = {
  products: Product[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const ProductsContext = createContext<ProductsState | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllProducts()
      setProducts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo(() => ({ products, loading, error, refresh }), [products, loading, error, refresh])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}

