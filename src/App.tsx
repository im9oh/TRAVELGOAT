import { useState } from 'react'
import { useStore } from './store'
import { daysUntil } from './lib/format'
import { computeXp, levelFromXp } from './lib/game'
import { Goat } from './components/Goat'
import {
  HomeIcon,
  RouteIcon,
  CoinsIcon,
  CompassIcon,
  BackpackIcon,
  SlidersIcon,
  FlameIcon,
  GemIcon,
  CalendarIcon,
  type IconProps,
} from './components/icons'
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

const BOTTOM: { key: TabKey; label: string; Icon: (p: IconProps) => JSX.Element }[] = [
  { key: 'dashboard', label: 'Home', Icon: HomeIcon },
  { key: 'itinerary', label: 'Journey', Icon: RouteIcon },
  { key: 'budget', label: 'Budget', Icon: CoinsIcon },
  { key: 'places', label: 'Places', Icon: CompassIcon },
  { key: 'packing', label: 'Pack', Icon: BackpackIcon },
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
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2">
          <button onClick={() => setTab('dashboard')} className="flex items-center gap-1.5">
            <Goat size={32} blink={false} />
            <span className="text-lg font-extrabold tracking-tight text-[#3c3c3c]">
              TravelGoat
            </span>
          </button>
          <div className="flex items-center gap-3.5">
            <Stat Icon={FlameIcon} value={state.game.streak} color="#ff9600" />
            <Stat Icon={GemIcon} value={level} color="#1cb0f6" />
            <Stat Icon={CalendarIcon} value={countdown > 0 ? countdown : 0} color="#58cc02" />
            <button
              onClick={() => setTab('settings')}
              className={`transition ${tab === 'settings' ? 'text-[#1cb0f6]' : 'text-[#bcbcbc] hover:text-[#777]'}`}
              aria-label="Settings"
            >
              <SlidersIcon size={22} strokeWidth={2.6} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main key={tab} className="tg-view mx-auto max-w-2xl px-4 pb-28 pt-5 sm:pb-10">
        {render()}
      </main>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-[#eee] bg-white pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto grid max-w-2xl grid-cols-5">
          {BOTTOM.map(({ key, label, Icon }) => {
            const active = tab === key
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="flex flex-col items-center gap-0.5 py-2"
              >
                <span
                  className={`flex h-10 w-14 items-center justify-center rounded-2xl transition ${
                    active ? 'bg-[#ddf4ff] text-[#1cb0f6] tg-tab-pop' : 'text-[#b0b0b0]'
                  }`}
                >
                  <Icon size={26} strokeWidth={2.6} />
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wide ${
                    active ? 'text-[#1cb0f6]' : 'text-[#b0b0b0]'
                  }`}
                >
                  {label}
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
  Icon,
  value,
  color,
}: {
  Icon: (p: IconProps) => JSX.Element
  value: number
  color: string
}) {
  return (
    <div className="flex items-center gap-1" style={{ color }}>
      <Icon size={20} strokeWidth={2.6} />
      <span className="text-base font-extrabold">{value}</span>
    </div>
  )
}
