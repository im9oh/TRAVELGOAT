import { useStore } from '../store'
import { useReward } from '../components/toast'
import type { TabKey } from '../App'
import { Card, Button, ProgressRing, ProgressBar, SpeechBubble } from '../components/ui'
import { Goat } from '../components/Goat'
import {
  BackpackIcon,
  BedIcon,
  DocIcon,
  PinIcon,
  FlameIcon,
  CoinsIcon,
  RouteIcon,
  CompassIcon,
  BookIcon,
  StarIcon,
  CheckIcon,
  ChevronRightIcon,
  TrophyIcon,
  LockIcon,
  WalkIcon,
  GlobeIcon,
  ForkKnifeIcon,
  type IconProps,
} from '../components/icons'
import type { AchievementIcon, ReadinessKey } from '../lib/game'
import { formatMoney, daysUntil, nightsBetween } from '../lib/format'
import {
  computeXp,
  levelFromXp,
  computeReadiness,
  computeAchievements,
  applyCheckIn,
  checkedInToday,
} from '../lib/game'

const READY_ICON: Record<ReadinessKey, (p: IconProps) => JSX.Element> = {
  packing: BackpackIcon,
  stays: BedIcon,
  docs: DocIcon,
  places: PinIcon,
}
const ACH_ICON: Record<AchievementIcon, (p: IconProps) => JSX.Element> = {
  footsteps: WalkIcon,
  globe: GlobeIcon,
  bed: BedIcon,
  backpack: BackpackIcon,
  compass: CompassIcon,
  fork: ForkKnifeIcon,
  book: BookIcon,
  coins: CoinsIcon,
  flame: FlameIcon,
}

export default function Dashboard({ onNavigate }: { onNavigate: (tab: TabKey) => void }) {
  const { state, setState } = useStore()
  const { reward, cheer, celebrate } = useReward()
  const { trip, cities, expenses, game } = state

  const xp = computeXp(state)
  const lvl = levelFromXp(xp)
  const readiness = computeReadiness(state)
  const achievements = computeAchievements(state)
  const unlocked = achievements.filter((a) => a.done).length
  const countdown = daysUntil(trip.startDate)
  const spent = expenses.reduce((s, e) => s + e.amount, 0)
  const today = new Date()

  const sorted = [...cities].sort((a, b) => a.arrival.localeCompare(b.arrival))
  const nextStop = sorted.find((c) => daysUntil(c.departure, today) >= 0)
  const checkedIn = checkedInToday(game)

  const greeting =
    countdown > 60
      ? `${countdown} days until ${trip.name}. Let's get you ready!`
      : countdown > 0
        ? `Only ${countdown} days to go — final prep time!`
        : `You're on your adventure. Have a blast!`

  function doCheckIn() {
    const updated = applyCheckIn(game)
    if (!updated) return
    setState((prev) => ({ ...prev, game: updated }))
    cheer(`${updated.streak} day streak!`, <FlameIcon size={18} />)
    reward(15)
    celebrate()
  }

  return (
    <div className="space-y-5">
      {/* Mascot greeting */}
      <div className="flex items-start gap-2">
        <Goat size={72} className="tg-bob shrink-0" />
        <div className="flex-1 pt-2">
          <SpeechBubble>{greeting}</SpeechBubble>
        </div>
      </div>

      {/* Readiness ring */}
      <Card className="bg-gradient-to-b from-[#f7fff0] to-white">
        <div className="flex items-center gap-5">
          <ProgressRing value={readiness.pct} size={128} stroke={14}>
            <span className="text-3xl font-black text-[#58cc02]">{readiness.pct}%</span>
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#afafaf]">
              ready
            </span>
          </ProgressRing>
          <div className="flex-1 space-y-2.5">
            {readiness.parts.map((p) => {
              const Icon = READY_ICON[p.key]
              return (
                <div key={p.key}>
                  <div className="mb-0.5 flex items-center justify-between text-xs font-extrabold text-[#777]">
                    <span className="flex items-center gap-1.5">
                      <Icon size={16} strokeWidth={2.6} /> {p.label}
                    </span>
                    <span>{Math.round(p.pct)}%</span>
                  </div>
                  <ProgressBar value={p.pct} color="green" className="h-2.5" />
                </div>
              )
            })}
          </div>
        </div>
        <Button variant="green" block className="mt-4" onClick={() => onNavigate('itinerary')}>
          {nextStop ? `Continue to ${nextStop.name}` : 'Start your journey'}
        </Button>
      </Card>

      {/* Streak + Level */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col items-center text-center">
          <FlameIcon size={38} className="text-[#ff9600]" strokeWidth={2.4} />
          <div className="mt-1 text-3xl font-black text-[#ff9600]">{game.streak}</div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-[#afafaf]">
            day streak
          </div>
          <Button
            variant={checkedIn ? 'white' : 'gold'}
            size="sm"
            block
            className="mt-3"
            disabled={checkedIn}
            onClick={doCheckIn}
          >
            {checkedIn ? 'Done today' : 'Check in'}
          </Button>
        </Card>

        <Card className="flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wide text-[#afafaf]">
              Level
            </span>
            <span className="text-2xl font-black text-[#1cb0f6]">{lvl.level}</span>
          </div>
          <div className="mt-2">
            <ProgressBar value={(lvl.intoLevel / lvl.levelSpan) * 100} color="blue" />
          </div>
          <div className="mt-1.5 text-xs font-extrabold text-[#777]">
            {lvl.toNext} XP to level {lvl.level + 1}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs font-extrabold text-[#afafaf]">
            <StarIcon size={14} className="text-[#ffc800]" /> {xp} XP total
          </div>
        </Card>
      </div>

      {/* Budget glance */}
      <Card onClick={() => onNavigate('budget')}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-extrabold text-[#3c3c3c]">
            <CoinsIcon size={20} className="text-[#e6a700]" /> Budget
          </h3>
          <span className="flex items-center gap-1 text-sm font-extrabold text-[#afafaf]">
            {formatMoney(spent, trip.homeCurrency)} / {formatMoney(trip.totalBudget, trip.homeCurrency)}
            <ChevronRightIcon size={16} />
          </span>
        </div>
        <ProgressBar
          value={trip.totalBudget > 0 ? (spent / trip.totalBudget) * 100 : 0}
          color={spent > trip.totalBudget ? 'red' : 'gold'}
        />
      </Card>

      {/* Achievements */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-[#3c3c3c]">
            <TrophyIcon size={22} className="text-[#ffc800]" /> Achievements
          </h3>
          <span className="rounded-full bg-[#fff4d6] px-2.5 py-0.5 text-xs font-extrabold text-[#e6a700]">
            {unlocked}/{achievements.length}
          </span>
        </div>
        <div className="tg-noscroll -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {achievements.map((a) => {
            const Icon = ACH_ICON[a.icon]
            return (
              <div
                key={a.id}
                className={`flex w-[108px] shrink-0 flex-col items-center rounded-2xl border-2 p-3 text-center ${
                  a.done ? 'border-[#ffe08a] bg-[#fff9e6]' : 'border-[#eee] bg-white'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    a.done ? 'bg-[#ffc800] text-white' : 'bg-[#f0f0f0] text-[#c4c4c4]'
                  }`}
                >
                  {a.done ? <Icon size={24} strokeWidth={2.6} /> : <LockIcon size={20} />}
                </div>
                <div className="mt-1.5 text-[11px] font-extrabold leading-tight text-[#4b4b4b]">
                  {a.title}
                </div>
                {a.done ? (
                  <div className="mt-1 text-[10px] font-extrabold uppercase text-[#e6a700]">
                    Unlocked
                  </div>
                ) : (
                  <div className="mt-1.5 w-full">
                    <ProgressBar value={a.progress * 100} color="gold" className="h-1.5" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { key: 'itinerary', Icon: RouteIcon, label: 'Journey', bg: 'bg-[#ddf4ff]', fg: 'text-[#1cb0f6]' },
          { key: 'places', Icon: CompassIcon, label: 'Places', bg: 'bg-[#f3e6ff]', fg: 'text-[#a568cc]' },
          { key: 'packing', Icon: BackpackIcon, label: 'Packing', bg: 'bg-[#d7ffb8]', fg: 'text-[#58a700]' },
          { key: 'journal', Icon: BookIcon, label: 'Journal', bg: 'bg-[#fff4d6]', fg: 'text-[#e6a700]' },
          { key: 'docs', Icon: DocIcon, label: 'Docs', bg: 'bg-[#ffe9e9]', fg: 'text-[#ff4b4b]' },
          { key: 'settings', Icon: PinIcon, label: 'More', bg: 'bg-[#eef1f4]', fg: 'text-[#8a97a3]' },
        ] as const).map((s) => (
          <button
            key={s.key}
            onClick={() => onNavigate(s.key as TabKey)}
            className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 border-[#eee] ${s.bg} py-4 transition active:translate-y-0.5`}
          >
            <s.Icon size={26} strokeWidth={2.6} className={s.fg} />
            <span className="text-xs font-extrabold text-[#4b4b4b]">{s.label}</span>
          </button>
        ))}
      </div>

      <p className="flex items-center justify-center gap-1.5 pt-2 text-center text-xs font-bold text-[#cfcfcf]">
        {cities.length} cities ·{' '}
        {sorted.reduce((s, c) => s + nightsBetween(c.arrival, c.departure), 0)} nights
        <CheckIcon size={13} />
      </p>
    </div>
  )
}
