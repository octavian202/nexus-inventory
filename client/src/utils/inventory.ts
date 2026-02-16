import type { Product } from '../api/types'

export function getStatus(p: Product): 'in-stock' | 'low-stock' | 'out-of-stock' {
  const qty = p.stockQuantity ?? 0
  const min = p.minStockLevel ?? 0
  if (qty <= 0) return 'out-of-stock'
  if (qty <= min) return 'low-stock'
  return 'in-stock'
}

export function totalValue(p: Product): number {
  const price = Number(p.price)
  const qty = Number(p.stockQuantity ?? 0)
  if (!Number.isFinite(price) || !Number.isFinite(qty)) return 0
  return price * qty
}

