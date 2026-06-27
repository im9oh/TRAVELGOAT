import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { AppState } from './types'
import { uid } from './lib/format'

const STORAGE_KEY = 'travelgoat:v1'

// ---- Seed data: a starter 3-month Europe itinerary for 2027 ----
function seed(): AppState {
  const c = (
    name: string,
    country: string,
    arrival: string,
    departure: string,
    mode: AppState['cities'][number]['transportMode'],
  ) => ({
    id: uid(),
    name,
    country,
    arrival,
    departure,
    accommodation: '',
    accommodationNotes: '',
    notes: '',
    transportMode: mode,
    transportDetails: '',
  })

  const cities = [
    c('London', 'United Kingdom', '2027-04-05', '2027-04-12', 'train'),
    c('Paris', 'France', '2027-04-12', '2027-04-20', 'train'),
    c('Amsterdam', 'Netherlands', '2027-04-20', '2027-04-26', 'train'),
    c('Berlin', 'Germany', '2027-04-26', '2027-05-04', 'train'),
    c('Prague', 'Czechia', '2027-05-04', '2027-05-11', 'train'),
    c('Vienna', 'Austria', '2027-05-11', '2027-05-18', 'train'),
    c('Rome', 'Italy', '2027-05-18', '2027-05-28', 'plane'),
    c('Barcelona', 'Spain', '2027-05-28', '2027-06-07', 'plane'),
    c('Lisbon', 'Portugal', '2027-06-07', '2027-06-17', 'plane'),
    c('Athens', 'Greece', '2027-06-17', '2027-07-04', 'other'),
  ]

  return {
    trip: {
      name: 'Europe 2027',
      startDate: '2027-04-05',
      endDate: '2027-07-04',
      homeCurrency: 'USD',
      totalBudget: 15000,
      savingsGoal: 12000,
    },
    cities,
    expenses: [],
    places: [],
    packing: [
      ...['Passport', 'Visa documents', 'Travel insurance card', 'Phone + charger', 'Universal power adapter', 'Credit/debit cards']
        .map((name) => ({ id: uid(), name, category: 'Essentials', packed: false })),
      ...['Lightweight jacket', 'Comfortable walking shoes', 'Underwear & socks (7)', 'T-shirts (5)', 'One nice outfit']
        .map((name) => ({ id: uid(), name, category: 'Clothing', packed: false })),
      ...['Toothbrush & toothpaste', 'Medications', 'Sunscreen', 'Travel towel']
        .map((name) => ({ id: uid(), name, category: 'Toiletries', packed: false })),
    ],
    journal: [],
    docs: [],
    savings: [
      { id: uid(), date: '2026-01-15', amount: 1500, note: 'Kickoff deposit' },
      { id: uid(), date: '2026-03-01', amount: 1200, note: 'Tax refund' },
      { id: uid(), date: '2026-05-01', amount: 900, note: 'Side gig' },
    ],
    game: { streak: 0, bestStreak: 0, lastCheckIn: null },
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      // shallow validation
      if (parsed && parsed.trip && Array.isArray(parsed.cities)) {
        // merge defaults for forward-compatibility with older saves
        return {
          ...seed(),
          ...parsed,
          trip: { ...seed().trip, ...parsed.trip },
          savings: parsed.savings ?? [],
          game: parsed.game ?? { streak: 0, bestStreak: 0, lastCheckIn: null },
        }
      }
    }
  } catch {
    // ignore corrupt storage
  }
  return seed()
}

interface StoreContextValue {
  state: AppState
  setState: (updater: (prev: AppState) => AppState) => void
  resetAll: () => void
  exportData: () => void
  importData: (json: string) => boolean
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<AppState>(load)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage might be full / unavailable
    }
  }, [state])

  const value = useMemo<StoreContextValue>(
    () => ({
      state,
      setState: (updater) => setStateRaw((prev) => updater(prev)),
      resetAll: () => setStateRaw(seed()),
      exportData: () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `travelgoat-${state.trip.name.replace(/\s+/g, '-').toLowerCase()}.json`
        a.click()
        URL.revokeObjectURL(url)
      },
      importData: (json) => {
        try {
          const parsed = JSON.parse(json) as AppState
          if (parsed && parsed.trip && Array.isArray(parsed.cities)) {
            setStateRaw(parsed)
            return true
          }
        } catch {
          // fallthrough
        }
        return false
      },
    }),
    [state],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
