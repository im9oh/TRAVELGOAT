import { useStore } from '../store'
import { useReward } from '../components/toast'
import type { TabKey } from '../App'
import {
  Card,
  Button,
  ProgressRing,
  ProgressBar,
  Mascot,
  SpeechBubble,
  Badge,
} from '../components/ui'
import { formatMoney, daysUntil, nightsBetween } from '../lib/format'
import {
  computeXp,
  levelFromXp,
  computeReadiness,
  computeAchievements,
  applyCheckIn,
  checkedInToday,
} from '../lib/game'

export default function Dashboard({
  onNavigate,
}: {
  onNavigate: (tab: TabKey) => void
}) {
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
      ? `${countdown} days until ${trip.name}! Let's get you ready 🌍`
      : countdown > 0
        ? `Only ${countdown} days to go — final prep time! ✨`
        : `You're on your adventure. Have a blast! ✈️`

  function doCheckIn() {
    const updated = applyCheckIn(game)
    if (!updated) return
    setState((prev) => ({ ...prev, game: updated }))
    cheer(`${updated.streak} day streak!`, '🔥')
    reward(15, '⭐')
    celebrate()
  }

  return (
    <div className="space-y-5">
      {/* Mascot greeting */}
      <div className="flex items-start gap-3">
        <Mascot size={68} bob />
        <div className="flex-1 pt-1">
          <SpeechBubble>{greeting}</SpeechBubble>
        </div>
      </div>

      {/* Readiness ring */}
      <Card className="bg-gradient-to-b from-[#f7fff0] to-white">
        <div className="flex items-center gap-5">
          <ProgressRing value={readiness.pct} size={128} stroke={14}>
            <span className="text-3xl font-black text-[#58cc02]">
              {readiness.pct}%
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#afafaf]">
              ready
            </span>
          </ProgressRing>
          <div className="flex-1 space-y-2">
            {readiness.parts.map((p) => (
              <div key={p.label}>
                <div className="mb-0.5 flex justify-between text-xs font-extrabold text-[#777]">
                  <span>
                    {p.icon} {p.label}
                  </span>
                  <span>{Math.round(p.pct)}%</span>
                </div>
                <ProgressBar value={p.pct} color="green" className="h-2.5" />
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="green"
          block
          className="mt-4"
          onClick={() => onNavigate('itinerary')}
        >
          {nextStop ? `Continue to ${nextStop.name}` : 'Start your journey'}
        </Button>
      </Card>

      {/* Streak check-in + Level */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col items-center text-center">
          <div className="text-4xl">🔥</div>
          <div className="mt-1 text-3xl font-black text-[#ff9600]">
            {game.streak}
          </div>
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
            {checkedIn ? 'Done today ✓' : 'Check in'}
          </Button>
        </Card>

        <Card className="flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wide text-[#afafaf]">
              Level
            </span>
            <span className="text-2xl font-black text-[#1cb0f6]">
              {lvl.level}
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar
              value={(lvl.intoLevel / lvl.levelSpan) * 100}
              color="blue"
            />
          </div>
          <div className="mt-1.5 text-xs font-extrabold text-[#777]">
            {lvl.toNext} XP to level {lvl.level + 1}
          </div>
          <div className="mt-2 text-xs font-extrabold text-[#afafaf]">
            ⭐ {xp} XP total
          </div>
        </Card>
      </div>

      {/* Budget glance */}
      <Card onClick={() => onNavigate('budget')}>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-extrabold text-[#3c3c3c]">💰 Budget</h3>
          <span className="text-sm font-extrabold text-[#afafaf]">
            {formatMoney(spent, trip.homeCurrency)} /{' '}
            {formatMoney(trip.totalBudget, trip.homeCurrency)}
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
          <h3 className="text-lg font-extrabold text-[#3c3c3c]">
            🏆 Achievements
          </h3>
          <Badge color="gold">
            {unlocked}/{achievements.length}
          </Badge>
        </div>
        <div className="tg-noscroll -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={`flex w-[104px] shrink-0 flex-col items-center rounded-2xl border-2 p-3 text-center ${
                a.done
                  ? 'border-[#ffe08a] bg-[#fff9e6]'
                  : 'border-[#eee] bg-white'
              }`}
            >
              <div className={`text-3xl ${a.done ? '' : 'opacity-30 grayscale'}`}>
                {a.emoji}
              </div>
              <div className="mt-1 text-[11px] font-extrabold leading-tight text-[#4b4b4b]">
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
          ))}
        </div>
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { key: 'itinerary' as const, icon: '🗺️', label: 'Journey', bg: 'bg-[#ddf4ff]' },
          { key: 'places' as const, icon: '📍', label: 'Places', bg: 'bg-[#f3e6ff]' },
          { key: 'packing' as const, icon: '🎒', label: 'Packing', bg: 'bg-[#d7ffb8]' },
          { key: 'journal' as const, icon: '📔', label: 'Journal', bg: 'bg-[#fff4d6]' },
          { key: 'docs' as const, icon: '📄', label: 'Docs', bg: 'bg-[#ffe9e9]' },
          { key: 'settings' as const, icon: '⚙️', label: 'Settings', bg: 'bg-[#f0f0f0]' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => onNavigate(s.key)}
            className={`flex flex-col items-center gap-1 rounded-2xl border-2 border-[#eee] ${s.bg} py-4 active:translate-y-0.5 transition`}
          >
            <span className="text-2xl">{s.icon}</span>
            <span className="text-xs font-extrabold text-[#4b4b4b]">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      <p className="pt-2 text-center text-xs font-bold text-[#cfcfcf]">
        {cities.length} cities ·{' '}
        {sorted.reduce((s, c) => s + nightsBetween(c.arrival, c.departure), 0)}{' '}
        nights · TravelGoat 🐐
      </p>
    </div>
  )
}
