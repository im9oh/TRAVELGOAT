import { useState } from 'react'
import { useStore } from './store'
import { daysUntil } from './lib/format'
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

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Home', icon: '🏠' },
  { key: 'itinerary', label: 'Itinerary', icon: '🗺️' },
  { key: 'budget', label: 'Budget', icon: '💶' },
  { key: 'places', label: 'Places', icon: '📍' },
  { key: 'packing', label: 'Packing', icon: '🎒' },
  { key: 'journal', label: 'Journal', icon: '📔' },
  { key: 'docs', label: 'Docs', icon: '📄' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function App() {
  const [tab, setTab] = useState<TabKey>('dashboard')
  const { state } = useStore()
  const countdown = daysUntil(state.trip.startDate)

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
    <div className="min-h-full bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐐</span>
            <div className="leading-tight">
              <div className="text-base font-extrabold tracking-tight">
                TravelGoat
              </div>
              <div className="text-xs text-slate-500">{state.trip.name}</div>
            </div>
          </div>
          {countdown > 0 ? (
            <div className="rounded-full bg-teal-50 px-3 py-1 text-right">
              <span className="text-sm font-bold text-teal-700">
                {countdown}
              </span>
              <span className="ml-1 text-xs text-teal-600">days to go</span>
            </div>
          ) : countdown <= 0 ? (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Trip in progress ✈️
            </span>
          ) : null}
        </div>

        {/* Desktop tabs */}
        <nav className="mx-auto hidden max-w-5xl gap-1 overflow-x-auto px-2 pb-1 sm:flex">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                tab === t.key
                  ? 'bg-teal-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-5 sm:pb-10">{render()}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur sm:hidden">
        <div className="mx-auto grid max-w-5xl grid-cols-7">
          {TABS.filter((t) => t.key !== 'settings').map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition ${
                tab === t.key ? 'text-teal-700' : 'text-slate-500'
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
