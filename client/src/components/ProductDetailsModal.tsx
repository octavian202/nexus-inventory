import type { Product } from '../api/types'
import { Modal } from './Modal'
import { formatMoneyExact } from '../utils/format'

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

export function ProductDetailsModal({
  open,
  product,
  onClose,
  onAdjustStock,
}: {
  open: boolean
  product: Product | null
  onClose: () => void
  onAdjustStock?: (p: Product) => void
}) {
  if (!product) return null

  const price = Number(product.price) || 0
  const qty = product.stockQuantity ?? 0
  const min = product.minStockLevel ?? 0
  const value = price * qty

  return (
    <Modal open={open} title="Product details" onClose={onClose}>
      <div className="product-details-modal">
        <div className="product-details-header">
          <div className="product-details-icon">{categoryIcon(product.category)}</div>
          <div className="product-details-heading">
            <h3 className="product-details-name">{product.name}</h3>
            <span className="product-details-sku">SKU: {product.sku}</span>
          </div>
        </div>
        <dl className="product-details-list">
          <div className="product-details-row">
            <dt>Category</dt>
            <dd>{product.category || '—'}</dd>
          </div>
          <div className="product-details-row">
            <dt>Unit price</dt>
            <dd>{formatMoneyExact(price)}</dd>
          </div>
          <div className="product-details-row">
            <dt>Current stock</dt>
            <dd>{qty} units</dd>
          </div>
          <div className="product-details-row">
            <dt>Minimum stock level</dt>
            <dd>{min} units</dd>
          </div>
          <div className="product-details-row">
            <dt>Total value</dt>
            <dd className="product-details-value">{formatMoneyExact(value)}</dd>
          </div>
        </dl>
        <div className="modal-actions product-details-actions">
          {onAdjustStock ? (
            <button className="btn btn-primary" onClick={() => { onClose(); onAdjustStock(product); }}>
              Adjust stock
            </button>
          ) : null}
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}
