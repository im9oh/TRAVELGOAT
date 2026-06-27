import { useState } from 'react'
import { useStore } from '../store'
import type { City, TransportMode } from '../types'
import {
  Button,
  Modal,
  Field,
  Input,
  Textarea,
  Select,
  Mascot,
  SpeechBubble,
} from '../components/ui'
import { uid, formatDate, nightsBetween } from '../lib/format'
import { todayISO } from '../lib/game'

const MODE_ICON: Record<TransportMode, string> = {
  train: '🚆',
  plane: '✈️',
  bus: '🚌',
  car: '🚗',
  ferry: '⛴️',
  walk: '🚶',
  other: '➡️',
}
const MODES: TransportMode[] = ['train', 'plane', 'bus', 'car', 'ferry', 'walk', 'other']

const FLAGS: Record<string, string> = {
  'united kingdom': '🇬🇧',
  uk: '🇬🇧',
  england: '🇬🇧',
  france: '🇫🇷',
  netherlands: '🇳🇱',
  germany: '🇩🇪',
  czechia: '🇨🇿',
  'czech republic': '🇨🇿',
  austria: '🇦🇹',
  italy: '🇮🇹',
  spain: '🇪🇸',
  portugal: '🇵🇹',
  greece: '🇬🇷',
  switzerland: '🇨🇭',
  belgium: '🇧🇪',
  poland: '🇵🇱',
  hungary: '🇭🇺',
  croatia: '🇭🇷',
  ireland: '🇮🇪',
  norway: '🇳🇴',
  sweden: '🇸🇪',
  denmark: '🇩🇰',
}
const flagFor = (country: string) => FLAGS[country.trim().toLowerCase()] ?? '📍'

function emptyCity(): City {
  return {
    id: uid(),
    name: '',
    country: '',
    arrival: '',
    departure: '',
    accommodation: '',
    accommodationNotes: '',
    notes: '',
    transportMode: 'train',
    transportDetails: '',
  }
}

type Status = 'done' | 'current' | 'future'

export default function Itinerary() {
  const { state, setState } = useStore()
  const [editing, setEditing] = useState<City | null>(null)
  const [isNew, setIsNew] = useState(false)

  const sorted = [...state.cities].sort((a, b) =>
    a.arrival.localeCompare(b.arrival),
  )
  const today = todayISO()
  const firstUpcoming = sorted.findIndex((c) => c.departure >= today)

  const statusOf = (i: number, c: City): Status => {
    if (c.departure && c.departure < today) return 'done'
    if (i === firstUpcoming || (firstUpcoming === -1 && i === sorted.length - 1))
      return 'current'
    return 'future'
  }

  function openNew() {
    setEditing(emptyCity())
    setIsNew(true)
  }
  function openEdit(c: City) {
    setEditing({ ...c })
    setIsNew(false)
  }
  function save() {
    if (!editing) return
    setState((prev) => {
      const exists = prev.cities.some((c) => c.id === editing.id)
      return {
        ...prev,
        cities: exists
          ? prev.cities.map((c) => (c.id === editing.id ? editing : c))
          : [...prev.cities, editing],
      }
    })
    setEditing(null)
  }
  function remove(id: string) {
    setState((prev) => ({
      ...prev,
      cities: prev.cities.filter((c) => c.id !== id),
    }))
    setEditing(null)
  }

  const totalNights = sorted.reduce(
    (s, c) => s + nightsBetween(c.arrival, c.departure),
    0,
  )

  return (
    <div>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#3c3c3c]">Your Journey</h2>
          <p className="text-sm font-bold text-[#afafaf]">
            {sorted.length} stops · {totalNights} nights
          </p>
        </div>
        <Button size="sm" variant="green" onClick={openNew}>
          + Stop
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <Mascot size={90} bob />
          <p className="text-lg font-extrabold text-[#4b4b4b]">
            Let's plot your route!
          </p>
          <Button variant="green" onClick={openNew}>
            Add your first stop
          </Button>
        </div>
      ) : (
        <div className="relative flex flex-col items-center gap-1 pb-6">
          {sorted.map((city, i) => {
            const status = statusOf(i, city)
            // winding offset
            const offset = Math.round(Math.sin(i * 0.9) * 88)
            const nodeClass =
              status === 'done'
                ? 'tg-node--done'
                : status === 'current'
                  ? 'tg-node--current'
                  : 'tg-node--future'
            return (
              <div key={city.id} className="flex w-full flex-col items-center">
                {/* transport from previous stop */}
                {i > 0 && (
                  <div className="py-1 text-xl opacity-70">
                    {MODE_ICON[sorted[i - 1].transportMode]}
                  </div>
                )}

                <div
                  className="relative flex items-center"
                  style={{ transform: `translateX(${offset}px)` }}
                >
                  {/* mascot beside the current node */}
                  {status === 'current' && (
                    <div className="absolute right-full mr-2 hidden sm:block">
                      <Mascot size={56} bob />
                    </div>
                  )}

                  <button
                    onClick={() => openEdit(city)}
                    className={`tg-node ${nodeClass} ${status === 'current' ? 'tg-bob' : ''}`}
                    aria-label={city.name}
                  >
                    {status === 'done' ? '✓' : flagFor(city.country)}
                    {status === 'current' && (
                      <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#58cc02] shadow-[0_2px_0_#e5e5e5]">
                        {i === 0 ? 'Start' : 'Next'}
                      </span>
                    )}
                  </button>
                </div>

                {/* label */}
                <div
                  className="mt-1.5 flex flex-col items-center"
                  style={{ transform: `translateX(${offset}px)` }}
                >
                  <span className="text-sm font-extrabold text-[#3c3c3c]">
                    {city.name || 'Untitled'}
                  </span>
                  <span className="text-[11px] font-bold text-[#afafaf]">
                    {formatDate(city.arrival, { month: 'short', day: 'numeric' })}
                    {' · '}
                    {nightsBetween(city.arrival, city.departure)}n
                  </span>
                </div>
              </div>
            )
          })}

          {/* finish line */}
          <div className="mt-3 flex flex-col items-center">
            <div className="text-3xl">🏁</div>
            <span className="text-xs font-extrabold uppercase tracking-wide text-[#afafaf]">
              Trip complete
            </span>
          </div>
        </div>
      )}

      {/* tip */}
      {sorted.length > 0 && (
        <div className="mt-2 flex items-start gap-2">
          <Mascot size={44} />
          <div className="flex-1">
            <SpeechBubble>
              Tap any stop to add your hotel, transport, and notes. Filling these
              in raises your readiness! 🎒
            </SpeechBubble>
          </div>
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? 'Add stop' : editing?.name || 'Edit stop'}
      >
        {editing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="City">
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Paris"
                />
              </Field>
              <Field label="Country">
                <Input
                  value={editing.country}
                  onChange={(e) =>
                    setEditing({ ...editing, country: e.target.value })
                  }
                  placeholder="France"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Arrival">
                <Input
                  type="date"
                  value={editing.arrival}
                  onChange={(e) =>
                    setEditing({ ...editing, arrival: e.target.value })
                  }
                />
              </Field>
              <Field label="Departure">
                <Input
                  type="date"
                  value={editing.departure}
                  onChange={(e) =>
                    setEditing({ ...editing, departure: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Accommodation">
              <Input
                value={editing.accommodation}
                onChange={(e) =>
                  setEditing({ ...editing, accommodation: e.target.value })
                }
                placeholder="Hotel name / Airbnb"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Transport to next">
                <Select
                  value={editing.transportMode}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      transportMode: e.target.value as TransportMode,
                    })
                  }
                >
                  {MODES.map((m) => (
                    <option key={m} value={m}>
                      {MODE_ICON[m]} {m}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Transport details">
                <Input
                  value={editing.transportDetails}
                  onChange={(e) =>
                    setEditing({ ...editing, transportDetails: e.target.value })
                  }
                  placeholder="09:30, ref ABC"
                />
              </Field>
            </div>
            <Field label="Notes">
              <Textarea
                rows={3}
                value={editing.notes}
                onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                placeholder="Anything to remember"
              />
            </Field>

            <div className="flex items-center justify-between pt-1">
              {!isNew ? (
                <Button variant="ghost" onClick={() => remove(editing.id)}>
                  🗑 Delete
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button variant="white" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button variant="green" onClick={save}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
