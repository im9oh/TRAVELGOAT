// ---- Core data model for TravelGoat ----

export type TransportMode =
  | 'train'
  | 'plane'
  | 'bus'
  | 'car'
  | 'ferry'
  | 'walk'
  | 'other'

export interface Trip {
  name: string
  startDate: string // ISO yyyy-mm-dd
  endDate: string
  homeCurrency: string // e.g. "USD"
  totalBudget: number // in home currency
}

export interface City {
  id: string
  name: string
  country: string
  arrival: string // yyyy-mm-dd
  departure: string // yyyy-mm-dd
  accommodation: string
  accommodationNotes: string
  notes: string
  // how you travel TO the next stop
  transportMode: TransportMode
  transportDetails: string // booking ref, time, etc.
}

export type ExpenseCategory =
  | 'Accommodation'
  | 'Transport'
  | 'Food'
  | 'Activities'
  | 'Shopping'
  | 'Fees'
  | 'Other'

export interface Expense {
  id: string
  date: string
  category: ExpenseCategory
  description: string
  amount: number // in home currency
  cityId: string | null
}

export type PlaceCategory = 'Sight' | 'Food' | 'Activity' | 'Nature' | 'Other'
export type Priority = 'high' | 'medium' | 'low'

export interface Place {
  id: string
  name: string
  cityId: string | null
  category: PlaceCategory
  priority: Priority
  visited: boolean
  notes: string
  url: string
}

export interface PackingItem {
  id: string
  name: string
  category: string
  packed: boolean
}

export interface JournalEntry {
  id: string
  date: string
  title: string
  body: string
  cityId: string | null
}

export type DocType =
  | 'Passport'
  | 'Visa'
  | 'Booking'
  | 'Insurance'
  | 'Ticket'
  | 'Other'

export interface TravelDoc {
  id: string
  title: string
  type: DocType
  reference: string
  date: string // relevant date (expiry, booking date, etc.)
  notes: string
}

export interface GameState {
  streak: number
  bestStreak: number
  lastCheckIn: string | null // yyyy-mm-dd
}

export interface AppState {
  trip: Trip
  cities: City[]
  expenses: Expense[]
  places: Place[]
  packing: PackingItem[]
  journal: JournalEntry[]
  docs: TravelDoc[]
  game: GameState
}
