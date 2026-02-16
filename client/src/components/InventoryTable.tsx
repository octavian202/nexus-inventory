import type { Product } from '../api/types'
import { formatMoneyExact } from '../utils/format'

type FilterId = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'high-value'

function getStatus(p: Product): 'in-stock' | 'low-stock' | 'out-of-stock' {
  const qty = p.stockQuantity ?? 0
  const min = p.minStockLevel ?? 0
  if (qty <= 0) return 'out-of-stock'
  if (qty <= min) return 'low-stock'
  return 'in-stock'
}

function categoryIcon(category: string | null | undefined): string {
  const c = (category ?? '').toLowerCase()
  if (c.includes('elect')) return '💻'
  if (c.includes('bever') || c.includes('drink')) return '🍵'
  if (c.includes('apparel') || c.includes('cloth') || c.includes('fashion')) return '👕'
  if (c.includes('office')) return '📌'
  if (c.includes('light')) return '💡'
  if (c.includes('fitness') || c.includes('sport')) return '🧘'
  if (c.includes('access')) return '🧴'
  if (c.includes('food')) return '🍽️'
  return '📦'
}

function totalValue(p: Product): number {
  const price = Number(p.price)
  const qty = Number(p.stockQuantity ?? 0)
  if (!Number.isFinite(price) || !Number.isFinite(qty)) return 0
  return price * qty
}

export function InventoryTable({
  products,
  loading,
  filter,
  onFilterChange,
  onAdd,
  onRestock,
  onDetails,
}: {
  products: Product[]
  loading: boolean
  filter: FilterId
  onFilterChange: (f: FilterId) => void
  onAdd: () => void
  onRestock: (p: Product) => void
  onDetails?: (p: Product) => void
}) {
  const chips: Array<{ id: FilterId; label: string }> = [
    { id: 'all', label: 'All Items' },
    { id: 'in-stock', label: 'In Stock' },
    { id: 'low-stock', label: 'Low Stock' },
    { id: 'out-of-stock', label: 'Out of Stock' },
    { id: 'high-value', label: 'High Value' },
  ]

  return (
    <div className="inventory-section">
      <div className="section-header">
        <h2 className="section-title">Current Inventory</h2>
        <div className="section-actions">
          <button className="btn btn-secondary" onClick={() => {}} disabled title="Coming soon">
            <span>📥</span>
            <span>Import</span>
          </button>
          <button className="btn btn-primary" onClick={onAdd}>
            <span>➕</span>
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <div className="table-filters">
        {chips.map((c) => (
          <button
            key={c.id}
            className={`filter-chip ${filter === c.id ? 'active' : ''}`}
            onClick={() => onFilterChange(c.id)}
            type="button"
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={7}>
                    <div className="row-skeleton">
                      <div className="skeleton skeleton-avatar" />
                      <div className="skeleton skeleton-line" />
                      <div className="skeleton skeleton-line" />
                    </div>
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-title">No products found</div>
                    <div className="empty-subtitle">Try changing filters, search, or add your first item.</div>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const status = getStatus(p)
                const qty = p.stockQuantity ?? 0
                const min = p.minStockLevel ?? 0
                const max = Math.max(qty, min * 4, 20)
                const fillPercentage = Math.min(100, Math.round((qty / max) * 100))
                const fillClass = fillPercentage < 20 ? 'low' : fillPercentage < 50 ? 'medium' : 'high'
                const price = Number(p.price) || 0
                const value = totalValue(p)

                return (
                  <tr key={p.id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-image">{categoryIcon(p.category)}</div>
                        <div className="product-info">
                          <div className="product-name">{p.name}</div>
                          <div className="product-sku">SKU: {p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category || '—'}</td>
                    <td>
                      <span className={`status-badge ${status}`}>
                        <span className="status-dot" />
                        {status === 'in-stock'
                          ? 'In Stock'
                          : status === 'low-stock'
                            ? 'Low Stock'
                            : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div className="quantity-indicator">
                        <span style={{ fontWeight: 600 }}>{qty}</span>
                        <div className="quantity-bar" title={`Min stock: ${min}`}>
                          <div className={`quantity-fill ${fillClass}`} style={{ width: `${fillPercentage}%` }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{formatMoneyExact(price)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatMoneyExact(value)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" title="Adjust Stock" onClick={() => onRestock(p)}>
                          📦
                        </button>
                        {onDetails ? (
                          <button
                            className="action-btn"
                            title="View details"
                            onClick={() => onDetails(p)}
                          >
                            ⋮
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

