// Small formatting + id helpers used across views.

export function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  )
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function parseDate(d: string): Date | null {
  if (!d) return null
  const parts = d.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null
  const [y, m, day] = parts
  return new Date(y, m - 1, day)
}

export function formatDate(d: string, opts?: Intl.DateTimeFormatOptions): string {
  const date = parseDate(d)
  if (!date) return '—'
  return date.toLocaleDateString(undefined, opts ?? {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDateShort(d: string): string {
  return formatDate(d, { month: 'short', day: 'numeric' })
}

/** Whole nights between two yyyy-mm-dd dates. */
export function nightsBetween(arrival: string, departure: string): number {
  const a = parseDate(arrival)
  const b = parseDate(departure)
  if (!a || !b) return 0
  const ms = b.getTime() - a.getTime()
  return Math.max(0, Math.round(ms / 86_400_000))
}

/** Days from today (local) until the given date. Negative = in the past. */
export function daysUntil(d: string, today = new Date()): number {
  const target = parseDate(d)
  if (!target) return 0
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const ms = target.getTime() - t0.getTime()
  return Math.round(ms / 86_400_000)
}

export const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'CHF',
  'CZK',
  'PLN',
  'HUF',
  'SEK',
  'NOK',
  'DKK',
  'JPY',
  'CAD',
  'AUD',
]
