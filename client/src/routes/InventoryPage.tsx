import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { InventoryTable } from '../components/InventoryTable'
import { ProductFormModal } from '../components/ProductFormModal'
import { ProductDetailsModal } from '../components/ProductDetailsModal'
import { StockAdjustModal } from '../components/StockAdjustModal'
import { createProduct, updateStock } from '../api/products'
import type { Product, ProductCreate } from '../api/types'
import { useProducts } from '../data/ProductsContext'
import { getStatus, totalValue } from '../utils/inventory'

type FilterId = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'high-value'
type LayoutContext = { search: string; business: string }

export function InventoryPage() {
  const { search } = useOutletContext<LayoutContext>()
  const { products, loading, error, refresh } = useProducts()

  const [filter, setFilter] = useState<FilterId>('all')
  const [addOpen, setAddOpen] = useState(false)
  const [detailsModal, setDetailsModal] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  })
  const [stockModal, setStockModal] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  })
  const [actionError, setActionError] = useState<string | null>(null)

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    const searched = q
      ? products.filter((p) => {
          const hay = `${p.name ?? ''} ${p.sku ?? ''} ${p.category ?? ''}`.toLowerCase()
          return hay.includes(q)
        })
      : products

    return searched.filter((p) => {
      const status = getStatus(p)
      if (filter === 'all') return true
      if (filter === 'high-value') return totalValue(p) >= 1000
      return status === filter
    })
  }, [products, search, filter])

  async function onCreateProduct(dto: ProductCreate) {
    setActionError(null)
    try {
      await createProduct(dto)
      setAddOpen(false)
      await refresh()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to create product')
    }
  }

  async function onAdjustStock(productId: string, adjustment: number) {
    setActionError(null)
    try {
      await updateStock(productId, adjustment)
      setStockModal({ open: false, product: null })
      await refresh()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Failed to update stock')
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Inventory</h1>
        <p className="page-subtitle">Manage products and stock levels.</p>
      </div>

      {(error || actionError) ? (
        <div className="alert alert-danger" role="alert">
          <div>
            <div className="alert-title">Something went wrong</div>
            <div className="alert-body">{actionError ?? error}</div>
          </div>
          <button className="alert-action" onClick={() => void refresh()}>
            Try again
          </button>
        </div>
      ) : null}

      <InventoryTable
        products={visible}
        loading={loading}
        filter={filter}
        onFilterChange={setFilter}
        onAdd={() => setAddOpen(true)}
        onRestock={(p) => setStockModal({ open: true, product: p })}
        onDetails={(p) => setDetailsModal({ open: true, product: p })}
      />

      <ProductFormModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={onCreateProduct} />

      <ProductDetailsModal
        open={detailsModal.open}
        product={detailsModal.product}
        onClose={() => setDetailsModal({ open: false, product: null })}
        onAdjustStock={(p) => {
          setDetailsModal({ open: false, product: null })
          setStockModal({ open: true, product: p })
        }}
      />

      <StockAdjustModal
        open={stockModal.open}
        product={stockModal.product}
        onClose={() => setStockModal({ open: false, product: null })}
        onSubmit={onAdjustStock}
      />
    </>
  )
}

