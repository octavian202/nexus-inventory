import { useMemo } from 'react'
import { useProducts } from '../data/ProductsContext'
import { formatMoneyExact } from '../utils/format'
import { totalValue } from '../utils/inventory'

type CategoryRow = { category: string; skus: number; units: number; value: number }

export function ReportsPage() {
  const { products, loading, error, refresh } = useProducts()

  const byCategory = useMemo(() => {
    const map = new Map<string, CategoryRow>()
    for (const p of products) {
      const cat = (p.category && p.category.trim()) || 'Uncategorized'
      const existing = map.get(cat) ?? { category: cat, skus: 0, units: 0, value: 0 }
      existing.skus += 1
      existing.units += Number(p.stockQuantity ?? 0)
      existing.value += totalValue(p)
      map.set(cat, existing)
    }
    return [...map.values()].sort((a, b) => b.value - a.value)
  }, [products])

  const totals = useMemo(() => {
    const units = products.reduce((a, p) => a + Number(p.stockQuantity ?? 0), 0)
    const value = products.reduce((a, p) => a + totalValue(p), 0)
    return { units, value }
  }, [products])

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">View inventory value and units by category.</p>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          <div>
            <div className="alert-title">Something went wrong</div>
            <div className="alert-body">{error}</div>
          </div>
          <button className="alert-action" onClick={() => void refresh()}>
            Try again
          </button>
        </div>
      ) : null}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total units</span>
            <div className="stat-icon blue">📦</div>
          </div>
          <div className="stat-value">{loading ? '…' : totals.units.toLocaleString()}</div>
          <div className="stat-change positive">
            <span>↗</span>
            <span>Across all products</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total value</span>
            <div className="stat-icon green">💰</div>
          </div>
          <div className="stat-value">{loading ? '…' : formatMoneyExact(totals.value)}</div>
          <div className="stat-change positive">
            <span>↗</span>
            <span>Stock × price</span>
          </div>
        </div>
      </div>

      <div className="inventory-section">
        <div className="section-header">
          <h2 className="section-title">Value by category</h2>
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
                <th>Category</th>
                <th>SKUs</th>
                <th>Units</th>
                <th>Total value</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>Loading…</td>
                </tr>
              ) : byCategory.length === 0 ? (
                <tr>
                  <td colSpan={4}>No products yet.</td>
                </tr>
              ) : (
                byCategory.map((r) => (
                  <tr key={r.category}>
                    <td style={{ fontWeight: 800 }}>{r.category}</td>
                    <td>{r.skus}</td>
                    <td>{r.units}</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{formatMoneyExact(r.value)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

