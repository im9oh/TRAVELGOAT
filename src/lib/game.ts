import type { AppState } from '../types'

// ---- XP rules: everything you do to prep earns XP ----
export const XP = {
  cityAdded: 10,
  cityAccommodation: 20,
  placeSaved: 5,
  placeVisited: 25,
  expenseLogged: 5,
  journalEntry: 40,
  docAdded: 15,
  perStreakDay: 15,
}

export interface LevelInfo {
  level: number
  intoLevel: number // xp earned within current level
  levelSpan: number // xp needed to clear current level
  toNext: number // xp remaining to next level
  totalXp: number
}

/** XP required to advance FROM level L to L+1. Ramps up gently. */
function spanForLevel(level: number): number {
  return 100 + (level - 1) * 50
}

export function levelFromXp(totalXp: number): LevelInfo {
  let level = 1
  let remaining = totalXp
  while (remaining >= spanForLevel(level)) {
    remaining -= spanForLevel(level)
    level++
  }
  const levelSpan = spanForLevel(level)
  return {
    level,
    intoLevel: remaining,
    levelSpan,
    toNext: levelSpan - remaining,
    totalXp,
  }
}

export function computeXp(s: AppState): number {
  let xp = 0
  for (const c of s.cities) {
    xp += XP.cityAdded
    if (c.accommodation.trim()) xp += XP.cityAccommodation
  }
  for (const p of s.places) xp += p.visited ? XP.placeVisited : XP.placeSaved
  xp += s.expenses.length * XP.expenseLogged
  xp += s.journal.length * XP.journalEntry
  xp += s.docs.length * XP.docAdded
  xp += (s.game?.bestStreak ?? 0) * XP.perStreakDay
  return xp
}

/** Trip-readiness meter (0-100) — how prepared you are to go. */
export type ReadinessKey = 'packing' | 'stays' | 'docs' | 'places'

export function computeReadiness(s: AppState): {
  pct: number
  parts: { label: string; pct: number; key: ReadinessKey }[]
} {
  const cityCount = Math.max(1, s.cities.length)

  const packedPct = s.packing.length
    ? (s.packing.filter((p) => p.packed).length / s.packing.length) * 100
    : 0
  const staysPct =
    (s.cities.filter((c) => c.accommodation.trim()).length / cityCount) * 100
  const docsPct = Math.min(100, (s.docs.length / 3) * 100)
  const placesPct = Math.min(100, (s.places.length / (cityCount * 2)) * 100)

  const parts: { label: string; pct: number; key: ReadinessKey }[] = [
    { label: 'Packing', pct: packedPct, key: 'packing' },
    { label: 'Stays booked', pct: staysPct, key: 'stays' },
    { label: 'Documents', pct: docsPct, key: 'docs' },
    { label: 'Places to see', pct: placesPct, key: 'places' },
  ]
  const pct = Math.round(
    parts.reduce((sum, p) => sum + p.pct, 0) / parts.length,
  )
  return { pct, parts }
}

export type AchievementIcon =
  | 'footsteps'
  | 'globe'
  | 'bed'
  | 'backpack'
  | 'compass'
  | 'fork'
  | 'book'
  | 'coins'
  | 'flame'

export interface Achievement {
  id: string
  title: string
  icon: AchievementIcon
  desc: string
  done: boolean
  progress: number // 0..1
}

export function computeAchievements(s: AppState): Achievement[] {
  const visited = s.places.filter((p) => p.visited).length
  const packed = s.packing.filter((p) => p.packed).length
  const stays = s.cities.filter((c) => c.accommodation.trim()).length
  const streak = s.game?.bestStreak ?? 0

  const mk = (
    id: string,
    title: string,
    icon: AchievementIcon,
    desc: string,
    have: number,
    need: number,
  ): Achievement => ({
    id,
    title,
    icon,
    desc,
    done: have >= need,
    progress: Math.min(1, have / need),
  })

  return [
    mk('first-steps', 'First Steps', 'footsteps', 'Add your first city', s.cities.length, 1),
    mk('globetrotter', 'Globetrotter', 'globe', 'Plan 10 cities', s.cities.length, 10),
    mk('homebody', 'All Booked', 'bed', 'Book every stay', stays, Math.max(1, s.cities.length)),
    mk('packed', 'Ready to Roll', 'backpack', 'Pack 15 items', packed, 15),
    mk('explorer', 'Explorer', 'compass', 'Visit 10 places', visited, 10),
    mk('foodie', 'Bon Appétit', 'fork', 'Save 5 food spots', s.places.filter((p) => p.category === 'Food').length, 5),
    mk('scribe', 'Storyteller', 'book', 'Write 5 journal entries', s.journal.length, 5),
    mk('accountant', 'Budget Boss', 'coins', 'Log 15 expenses', s.expenses.length, 15),
    mk('streak7', 'On Fire', 'flame', 'Reach a 7-day streak', streak, 7),
  ]
}

/** Days between two yyyy-mm-dd (b - a) using local dates. */
function dayDiff(a: string, b: string): number {
  const pa = a.split('-').map(Number)
  const pb = b.split('-').map(Number)
  const da = new Date(pa[0], pa[1] - 1, pa[2])
  const db = new Date(pb[0], pb[1] - 1, pb[2])
  return Math.round((db.getTime() - da.getTime()) / 86_400_000)
}

export function todayISO(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

/** Returns updated streak fields for a check-in today, or null if already done today. */
export function applyCheckIn(game: AppState['game']): AppState['game'] | null {
  const today = todayISO()
  if (game.lastCheckIn === today) return null
  let streak = 1
  if (game.lastCheckIn) {
    const gap = dayDiff(game.lastCheckIn, today)
    streak = gap === 1 ? game.streak + 1 : 1
  }
  return {
    streak,
    bestStreak: Math.max(game.bestStreak, streak),
    lastCheckIn: today,
  }
}

/** True if the user has already checked in today. */
export function checkedInToday(game: AppState['game']): boolean {
  return game.lastCheckIn === todayISO()
}
