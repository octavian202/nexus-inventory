import { apiFetch } from './http'
import type { Product, ProductCreate } from './types'

export function getAllProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/api/v1/products')
}

export function createProduct(dto: ProductCreate): Promise<Product> {
  return apiFetch<Product>('/api/v1/products', {
    method: 'POST',
    body: JSON.stringify({
      sku: dto.sku,
      name: dto.name,
      category: dto.category ?? null,
      price: dto.price,
      stockQuantity: dto.stockQuantity ?? null,
      minStockLevel: dto.minStockLevel ?? null,
    }),
  })
}

export function updateStock(productId: string, adjustment: number): Promise<Product> {
  return apiFetch<Product>(`/api/v1/products/${productId}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ adjustment }),
  })
}

