import { useMemo, useState } from 'react'
import { StockAdjustModal } from '../components/StockAdjustModal'
import { updateStock } from '../api/products'
import type { Product } from '../api/types'
import { useProducts } from '../data/ProductsContext'
import { getStatus } from '../utils/inventory'

export function AlertsPage() {
  const { products, loading, error, refresh } = useProducts()
  const [stockModal, setStockModal] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  })
  const [actionError, setActionError] = useState<string | null>(null)

  const { low, out } = useMemo(() => {
    const low = products.filter((p) => getStatus(p) === 'low-stock')
    const out = products.filter((p) => getStatus(p) === 'out-of-stock')
    return { low, out }
  }, [products])

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
        <h1 className="page-title">Alerts</h1>
        <p className="page-subtitle">Items below minimum stock or out of stock that need attention.</p>
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

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Low stock</span>
            <div className="stat-icon yellow">⚠️</div>
          </div>
          <div className="stat-value">{loading ? '…' : low.length}</div>
          <div className="stat-change negative">
            <span>↘</span>
            <span>Below min stock level</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Out of stock</span>
            <div className="stat-icon red">❌</div>
          </div>
          <div className="stat-value">{loading ? '…' : out.length}</div>
          <div className="stat-change negative">
            <span>↗</span>
            <span>Immediate action required</span>
          </div>
        </div>
      </div>

      <div className="inventory-section">
        <div className="section-header">
          <h2 className="section-title">Items needing attention</h2>
          <div className="section-actions">
            <button className="btn btn-secondary" onClick={() => void refresh()} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Min</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>Loading…</td>
                </tr>
              ) : low.length + out.length === 0 ? (
                <tr>
                  <td colSpan={6}>No alerts. Nice.</td>
                </tr>
              ) : (
                [...out, ...low].map((p) => {
                  const status = getStatus(p)
                  return (
                    <tr key={p.id}>
                      <td>{p.sku}</td>
                      <td style={{ fontWeight: 700 }}>{p.name}</td>
                      <td>
                        <span className={`status-badge ${status}`}>
                          <span className="status-dot" />
                          {status === 'out-of-stock' ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </td>
                      <td>{p.stockQuantity ?? 0}</td>
                      <td>{p.minStockLevel ?? 0}</td>
                      <td>
                        <button className="btn btn-primary" onClick={() => setStockModal({ open: true, product: p })}>
                          Restock
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StockAdjustModal
        open={stockModal.open}
        product={stockModal.product}
        onClose={() => setStockModal({ open: false, product: null })}
        onSubmit={onAdjustStock}
      />
    </>
  )
}

