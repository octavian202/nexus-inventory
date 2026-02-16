import { apiFetch } from './http'
import type { StockMovement, StockMovementCreate } from './types'

export function getStockMovements(limit = 50): Promise<StockMovement[]> {
  return apiFetch<StockMovement[]>(`/api/v1/stock-movements?limit=${encodeURIComponent(String(limit))}`)
}

export function createStockMovement(dto: StockMovementCreate): Promise<StockMovement> {
  return apiFetch<StockMovement>('/api/v1/stock-movements', {
    method: 'POST',
    body: JSON.stringify({
      productId: dto.productId,
      type: dto.type,
      adjustment: dto.adjustment,
      fromBusiness: dto.fromBusiness ?? null,
      toBusiness: dto.toBusiness ?? null,
      note: dto.note ?? null,
    }),
  })
}

