export function formatMoney(amount: number, currency = 'USD'): string {
  if (!Number.isFinite(amount)) return '-'
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `$${Math.round(amount).toLocaleString()}`
  }
}

export function formatMoneyExact(amount: number, currency = 'USD'): string {
  if (!Number.isFinite(amount)) return '-'
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

