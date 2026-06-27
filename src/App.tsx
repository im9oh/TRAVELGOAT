import { useState } from 'react'
import { useStore } from './store'
import { daysUntil } from './lib/format'
import { computeXp, levelFromXp } from './lib/game'
import Dashboard from './views/Dashboard'
import Itinerary from './views/Itinerary'
import Budget from './views/Budget'
import Places from './views/Places'
import Packing from './views/Packing'
import Journal from './views/Journal'
import Docs from './views/Docs'
import Settings from './views/Settings'

export type TabKey =
  | 'dashboard'
  | 'itinerary'
  | 'budget'
  | 'places'
  | 'packing'
  | 'journal'
  | 'docs'
  | 'settings'

const BOTTOM: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Home', icon: '🏠' },
  { key: 'itinerary', label: 'Journey', icon: '🗺️' },
  { key: 'budget', label: 'Budget', icon: '💰' },
  { key: 'places', label: 'Places', icon: '📍' },
  { key: 'packing', label: 'Pack', icon: '🎒' },
]

export default function App() {
  const [tab, setTab] = useState<TabKey>('dashboard')
  const { state } = useStore()
  const countdown = daysUntil(state.trip.startDate)
  const { level } = levelFromXp(computeXp(state))

  function render() {
    switch (tab) {
      case 'dashboard':
        return <Dashboard onNavigate={setTab} />
      case 'itinerary':
        return <Itinerary />
      case 'budget':
        return <Budget />
      case 'places':
        return <Places />
      case 'packing':
        return <Packing />
      case 'journal':
        return <Journal />
      case 'docs':
        return <Docs />
      case 'settings':
        return <Settings />
    }
  }

  return (
    <div className="min-h-full">
      {/* Top stat bar */}
      <header className="sticky top-0 z-30 border-b-2 border-[#eee] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2.5">
          <button
            onClick={() => setTab('dashboard')}
            className="flex items-center gap-1.5"
          >
            <span className="text-2xl">🐐</span>
            <span className="text-lg font-extrabold tracking-tight text-[#3c3c3c]">
              TravelGoat
            </span>
          </button>
          <div className="flex items-center gap-3.5">
            <Stat icon="🔥" value={state.game.streak} color="#ff9600" />
            <Stat icon="💎" value={level} color="#1cb0f6" />
            {countdown > 0 ? (
              <Stat icon="📅" value={countdown} color="#58cc02" />
            ) : (
              <span className="text-lg">✈️</span>
            )}
            <button
              onClick={() => setTab('settings')}
              className="text-xl text-[#afafaf] hover:text-[#777]"
              aria-label="Settings"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 pb-28 pt-5 sm:pb-10">
        {render()}
      </main>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-[#eee] bg-white">
        <div className="mx-auto grid max-w-2xl grid-cols-5">
          {BOTTOM.map((t) => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex flex-col items-center gap-0.5 py-2"
              >
                <span
                  className={`flex h-11 w-14 items-center justify-center rounded-2xl text-2xl transition ${
                    active ? 'bg-[#ddf4ff]' : ''
                  }`}
                >
                  {t.icon}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wide ${
                    active ? 'text-[#1cb0f6]' : 'text-[#afafaf]'
                  }`}
                >
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

function Stat({
  icon,
  value,
  color,
}: {
  icon: string
  value: number
  color: string
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-lg leading-none">{icon}</span>
      <span className="text-base font-extrabold" style={{ color }}>
        {value}
      </span>
    </div>
  )
}
