import type { MarketDoc } from '@/types'

export const eventTypeLabels: Record<string, string> = {
  market: 'Market',
  'pop-up': 'Pop-up',
  festival: 'Festival',
  exhibition: 'Show',
  workshop: 'Workshop',
  stockist: 'Stockist',
}

function startOfTodayUTC() {
  const now = new Date()
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
}

function isPast(event: MarketDoc, today: number) {
  if (event.status === 'past') return true
  const last = event.endDate || event.startDate
  return last ? new Date(last).getTime() < today : false
}

function byStartDate(a: MarketDoc, b: MarketDoc) {
  // Dated events first (soonest first), then undated by sortOrder
  if (a.startDate && b.startDate) return a.startDate.localeCompare(b.startDate)
  if (a.startDate) return -1
  if (b.startDate) return 1
  return (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
}

/** Splits events into upcoming (soonest first), year-round stockists, and past (most recent first). */
export function groupEvents(events: MarketDoc[]) {
  const today = startOfTodayUTC()
  const upcoming: MarketDoc[] = []
  const stockists: MarketDoc[] = []
  const past: MarketDoc[] = []

  for (const event of events) {
    if (event.eventType === 'stockist') stockists.push(event)
    else if (isPast(event, today)) past.push(event)
    else upcoming.push(event)
  }

  upcoming.sort(byStartDate)
  stockists.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  past.sort((a, b) => byStartDate(b, a))

  return { upcoming, stockists, past }
}

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...opts })

/** "May 3, 2026" · "May 3–4, 2026" · "May 30 – Jun 1, 2026" · falls back to dateInfo or "Dates TBA". */
export function formatEventDate(event: MarketDoc): string {
  if (event.dateInfo) return event.dateInfo
  if (!event.startDate) return event.eventType === 'stockist' ? 'Year-round' : 'Dates TBA'

  const start = new Date(event.startDate)
  const end = event.endDate ? new Date(event.endDate) : null
  const full = fmt({ month: 'short', day: 'numeric', year: 'numeric' })

  if (!end || end.getTime() <= start.getTime()) return full.format(start)

  const sameYear = start.getUTCFullYear() === end.getUTCFullYear()
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth()
  if (sameMonth) {
    return `${fmt({ month: 'short', day: 'numeric' }).format(start)}–${end.getUTCDate()}, ${end.getUTCFullYear()}`
  }
  if (sameYear) {
    return `${fmt({ month: 'short', day: 'numeric' }).format(start)} – ${full.format(end)}`
  }
  return `${full.format(start)} – ${full.format(end)}`
}

/** Shown when the CMS has no events yet (or the DB is unreachable). */
export const fallbackEvents: MarketDoc[] = [
  { id: 'fb-1', name: "Spring Maker's Market", eventType: 'market', location: 'Denver, CO', status: 'tba' },
  { id: 'fb-2', name: 'Summer Art Walk', eventType: 'festival', location: 'Denver, CO', status: 'tba', dateInfo: 'Announced soon' },
  { id: 'fb-3', name: 'Abstract Denver', eventType: 'stockist', location: 'All locations', status: 'live', dateInfo: 'Stocked now' },
]
