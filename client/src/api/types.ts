export type ApiErrorResponse = {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  path?: string
}

export type Product = {
  id: string
  sku: string
  name: string
  category: string | null
  price: string | number
  stockQuantity: number
  minStockLevel: number
}

export type ProductCreate = {
  sku: string
  name: string
  category?: string | null
  price: number
  stockQuantity?: number | null
  minStockLevel?: number | null
}

export type StockMovementType = 'RECEIVING' | 'TRANSFER' | 'ADJUSTMENT'

export type StockMovement = {
  id: string
  productId: string
  sku: string
  productName: string
  type: StockMovementType
  adjustment: number
  resultingStock: number
  fromBusiness: string | null
  toBusiness: string | null
  note: string | null
  performedByUserId: string | null
  performedByEmail: string | null
  createdAt: string
}

export type AuditActionType =
  | 'PRODUCT_CREATED'
  | 'STOCK_RECEIVING'
  | 'STOCK_TRANSFER'
  | 'STOCK_ADJUSTMENT'

export type AuditLogEntry = {
  id: string
  userId: string
  userEmail: string
  userDisplayName: string | null
  actionType: AuditActionType
  entityType: string
  entityId: string | null
  description: string
  details: string | null
  createdAt: string
}

export type StockMovementCreate = {
  productId: string
  type: StockMovementType
  adjustment: number
  fromBusiness?: string | null
  toBusiness?: string | null
  note?: string | null
}

