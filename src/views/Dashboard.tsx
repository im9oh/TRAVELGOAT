import { useStore } from '../store'
import type { TabKey } from '../App'
import { Card, ProgressBar, Badge } from '../components/ui'
import {
  formatMoney,
  formatDate,
  daysUntil,
  nightsBetween,
} from '../lib/format'

export default function Dashboard({
  onNavigate,
}: {
  onNavigate: (tab: TabKey) => void
}) {
  const { state } = useStore()
  const { trip, cities, expenses, places, packing, journal } = state
  const cur = trip.homeCurrency

  const spent = expenses.reduce((s, e) => s + e.amount, 0)
  const pctSpent = trip.totalBudget > 0 ? (spent / trip.totalBudget) * 100 : 0
  const remaining = trip.totalBudget - spent

  const tripDays =
    nightsBetween(trip.startDate, trip.endDate) || 0
  const countdown = daysUntil(trip.startDate)
  const today = new Date()

  // sort cities by arrival
  const sorted = [...cities].sort((a, b) =>
    a.arrival.localeCompare(b.arrival),
  )
  const upcoming = sorted
    .filter((c) => daysUntil(c.departure, today) >= 0)
    .slice(0, 3)

  const packedCount = packing.filter((p) => p.packed).length
  const visitedPlaces = places.filter((p) => p.visited).length

  return (
    <div className="space-y-5">
      {/* Hero */}
      <Card className="bg-gradient-to-br from-teal-600 to-cyan-600 text-white">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-teal-50/90">
              {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
            </p>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
              {trip.name}
            </h1>
            <p className="mt-1 text-teal-50/90">
              {cities.length} cities · {tripDays} days
            </p>
          </div>
          <div className="text-right">
            {countdown > 0 ? (
              <>
                <div className="text-4xl font-black leading-none">
                  {countdown}
                </div>
                <div className="text-sm text-teal-50/90">days to go</div>
              </>
            ) : (
              <div className="text-2xl font-bold">On the road ✈️</div>
            )}
          </div>
        </div>
      </Card>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Spent"
          value={formatMoney(spent, cur)}
          sub={`of ${formatMoney(trip.totalBudget, cur)}`}
          onClick={() => onNavigate('budget')}
        />
        <StatTile
          label="Remaining"
          value={formatMoney(remaining, cur)}
          tone={remaining < 0 ? 'red' : 'teal'}
          onClick={() => onNavigate('budget')}
        />
        <StatTile
          label="Places saved"
          value={`${visitedPlaces}/${places.length}`}
          sub="visited"
          onClick={() => onNavigate('places')}
        />
        <StatTile
          label="Packed"
          value={`${packedCount}/${packing.length}`}
          sub="items"
          onClick={() => onNavigate('packing')}
        />
      </div>

      {/* Budget bar */}
      <Card>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Budget</h2>
          <span className="text-sm text-slate-500">
            {Math.round(pctSpent)}% used
          </span>
        </div>
        <ProgressBar value={pctSpent} />
        <div className="mt-2 flex justify-between text-sm text-slate-600">
          <span>{formatMoney(spent, cur)} spent</span>
          <span className={remaining < 0 ? 'text-red-600 font-semibold' : ''}>
            {formatMoney(remaining, cur)} left
          </span>
        </div>
      </Card>

      {/* Upcoming stops */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Next stops</h2>
          <button
            onClick={() => onNavigate('itinerary')}
            className="text-sm font-semibold text-teal-600 hover:underline"
          >
            View itinerary →
          </button>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-500">No upcoming stops.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((city) => {
              const d = daysUntil(city.arrival, today)
              return (
                <li
                  key={city.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"
                >
                  <div>
                    <div className="font-semibold text-slate-800">
                      {city.name}
                      <span className="ml-2 text-sm font-normal text-slate-500">
                        {city.country}
                      </span>
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatDate(city.arrival)} ·{' '}
                      {nightsBetween(city.arrival, city.departure)} nights
                    </div>
                  </div>
                  {d > 0 ? (
                    <Badge color="teal">in {d}d</Badge>
                  ) : (
                    <Badge color="amber">now</Badge>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Card>

      {/* Recent journal */}
      {journal.length > 0 && (
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Latest journal</h2>
            <button
              onClick={() => onNavigate('journal')}
              className="text-sm font-semibold text-teal-600 hover:underline"
            >
              All entries →
            </button>
          </div>
          {[...journal]
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 1)
            .map((j) => (
              <div key={j.id}>
                <div className="text-sm text-slate-500">
                  {formatDate(j.date)}
                </div>
                <div className="font-semibold text-slate-800">{j.title}</div>
                <p className="mt-1 line-clamp-3 text-sm text-slate-600">
                  {j.body}
                </p>
              </div>
            ))}
        </Card>
      )}
    </div>
  )
}

function StatTile({
  label,
  value,
  sub,
  tone = 'slate',
  onClick,
}: {
  label: string
  value: string
  sub?: string
  tone?: 'slate' | 'teal' | 'red'
  onClick?: () => void
}) {
  const valueColor =
    tone === 'red'
      ? 'text-red-600'
      : tone === 'teal'
        ? 'text-teal-700'
        : 'text-slate-900'
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-teal-300 hover:shadow"
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className={`mt-1 text-lg font-bold ${valueColor}`}>{value}</div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </button>
  )
}
