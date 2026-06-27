import { useStore } from '../store'
import { useReward } from '../components/toast'
import type { TabKey } from '../App'
import {
  Card,
  Button,
  ProgressRing,
  ProgressBar,
  SpeechBubble,
  ListRow,
} from '../components/ui'
import { Goat } from '../components/Goat'
import { SavingsJar } from '../components/SavingsJar'
import {
  BackpackIcon,
  BedIcon,
  DocIcon,
  PinIcon,
  FlameIcon,
  CoinsIcon,
  BookIcon,
  CompassIcon,
  StarIcon,
  TrophyIcon,
  LockIcon,
  WalkIcon,
  GlobeIcon,
  ForkKnifeIcon,
  JarIcon,
  SlidersIcon,
  ChevronRightIcon,
  type IconProps,
} from '../components/icons'
import type { AchievementIcon, ReadinessKey } from '../lib/game'
import { formatMoney, daysUntil } from '../lib/format'
import {
  computeXp,
  levelFromXp,
  computeReadiness,
  computeAchievements,
  applyCheckIn,
  checkedInToday,
  savedTotal,
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
  jar: JarIcon,
}

function Label({ children }: { children: string }) {
  return (
    <h3 className="mb-2 ml-1 text-xs font-extrabold uppercase tracking-[0.12em] text-[#afafaf]">
      {children}
    </h3>
  )
}

export default function Dashboard({ onNavigate }: { onNavigate: (tab: TabKey) => void }) {
  const { state, setState } = useStore()
  const { reward, cheer, celebrate } = useReward()
  const { trip, game } = state

  const xp = computeXp(state)
  const lvl = levelFromXp(xp)
  const readiness = computeReadiness(state)
  const achievements = computeAchievements(state)
  const unlocked = achievements.filter((a) => a.done).length
  const countdown = daysUntil(trip.startDate)
  const saved = savedTotal(state)
  const savePct = trip.savingsGoal > 0 ? (saved / trip.savingsGoal) * 100 : 0
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
    <div className="space-y-6">
      {/* Mascot greeting */}
      <div className="flex items-start gap-2">
        <Goat size={72} className="tg-bob shrink-0" />
        <div className="flex-1 pt-2">
          <SpeechBubble>{greeting}</SpeechBubble>
        </div>
      </div>

      {/* Daily goal */}
      <section>
        <Label>Get trip-ready</Label>
        <Card className="bg-gradient-to-b from-[#f7fff0] to-white">
          <div className="flex items-center gap-5">
            <ProgressRing value={readiness.pct} size={120} stroke={13}>
              <span className="text-3xl font-black text-[#58cc02]">{readiness.pct}%</span>
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#afafaf]">ready</span>
            </ProgressRing>
            <div className="flex-1 space-y-2.5">
              {readiness.parts.map((p) => {
                const Icon = READY_ICON[p.key]
                return (
                  <div key={p.key}>
                    <div className="mb-0.5 flex items-center justify-between text-xs font-extrabold text-[#777]">
                      <span className="flex items-center gap-1.5"><Icon size={16} strokeWidth={2.6} /> {p.label}</span>
                      <span>{Math.round(p.pct)}%</span>
                    </div>
                    <ProgressBar value={p.pct} color="green" className="h-2.5" />
                  </div>
                )
              })}
            </div>
          </div>
          <Button variant="green" block className="mt-4" onClick={() => onNavigate('itinerary')}>
            Open journey
          </Button>
        </Card>
      </section>

      {/* Streak + level */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col items-center text-center">
          <FlameIcon size={36} className="text-[#ff9600]" strokeWidth={2.4} />
          <div className="mt-1 text-3xl font-black text-[#ff9600]">{game.streak}</div>
          <div className="text-xs font-extrabold uppercase tracking-wide text-[#afafaf]">day streak</div>
          <Button variant={checkedIn ? 'white' : 'gold'} size="sm" block className="mt-3" disabled={checkedIn} onClick={doCheckIn}>
            {checkedIn ? 'Done today' : 'Check in'}
          </Button>
        </Card>
        <Card className="flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wide text-[#afafaf]">Level</span>
            <span className="text-2xl font-black text-[#1cb0f6]">{lvl.level}</span>
          </div>
          <div className="mt-2"><ProgressBar value={(lvl.intoLevel / lvl.levelSpan) * 100} color="blue" /></div>
          <div className="mt-1.5 text-xs font-extrabold text-[#777]">{lvl.toNext} XP to level {lvl.level + 1}</div>
          <div className="mt-2 flex items-center gap-1 text-xs font-extrabold text-[#afafaf]">
            <StarIcon size={14} className="text-[#ffc800]" /> {xp} XP total
          </div>
        </Card>
      </div>

      {/* Savings */}
      <section>
        <Label>Savings jar</Label>
        <Card onClick={() => onNavigate('budget')} className="flex items-center gap-4 bg-gradient-to-b from-[#eaf6ff] to-white">
          <SavingsJar pct={savePct} size={92} dropKey={0} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-extrabold text-[#3c3c3c]">
                <CoinsIcon size={20} className="text-[#e6a700]" /> Saved
              </h3>
              <ChevronRightIcon size={18} className="text-[#cbd3da]" />
            </div>
            <div className="mt-1 text-2xl font-black text-[#1c8a3c]">{formatMoney(saved, trip.homeCurrency)}</div>
            <div className="mb-1.5 text-xs font-extrabold text-[#9bb0c2]">
              of {formatMoney(trip.savingsGoal, trip.homeCurrency)} · {Math.round(savePct)}%
            </div>
            <ProgressBar value={savePct} color="gold" />
          </div>
        </Card>
      </section>

      {/* Achievements */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <Label>Rewards</Label>
          <span className="mb-2 flex items-center gap-1 rounded-full bg-[#fff4d6] px-2.5 py-0.5 text-xs font-extrabold text-[#e6a700]">
            <TrophyIcon size={13} /> {unlocked}/{achievements.length}
          </span>
        </div>
        <div className="tg-noscroll -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {achievements.map((a) => {
            const Icon = ACH_ICON[a.icon]
            return (
              <div key={a.id} className={`flex w-[108px] shrink-0 flex-col items-center rounded-2xl border-2 border-b-[3px] p-3 text-center ${a.done ? 'border-[#ffe08a] bg-[#fff9e6]' : 'border-[#eee] bg-white'}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${a.done ? 'bg-[#ffc800] text-white' : 'bg-[#f0f0f0] text-[#c4c4c4]'}`}>
                  {a.done ? <Icon size={24} strokeWidth={2.6} /> : <LockIcon size={20} />}
                </div>
                <div className="mt-1.5 text-[11px] font-extrabold leading-tight text-[#4b4b4b]">{a.title}</div>
                {a.done ? (
                  <div className="mt-1 text-[10px] font-extrabold uppercase text-[#e6a700]">Unlocked</div>
                ) : (
                  <div className="mt-1.5 w-full"><ProgressBar value={a.progress * 100} color="gold" className="h-1.5" /></div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* More */}
      <section>
        <Label>More</Label>
        <div className="space-y-2.5">
          <ListRow icon={<BookIcon size={22} strokeWidth={2.4} />} iconBg="#fff4d6" iconFg="#e6a700" title="Journal" subtitle="Capture the trip" onClick={() => onNavigate('journal')} />
          <ListRow icon={<DocIcon size={22} strokeWidth={2.4} />} iconBg="#ffe9e9" iconFg="#ff4b4b" title="Docs & logistics" subtitle="Bookings & key dates" onClick={() => onNavigate('docs')} />
          <ListRow icon={<SlidersIcon size={22} strokeWidth={2.4} />} iconBg="#eef1f4" iconFg="#8a97a3" title="Settings" subtitle="Trip details & data" onClick={() => onNavigate('settings')} />
        </div>
      </section>
    </div>
  )
}
