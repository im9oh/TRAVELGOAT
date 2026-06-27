import { useState } from 'react'
import { useStore } from '../store'
import type { City, TransportMode } from '../types'
import { Button, Modal, Field, Input, Textarea, Select, SpeechBubble } from '../components/ui'
import { Goat } from '../components/Goat'
import { Flag } from '../components/Flag'
import {
  TrainIcon,
  PlaneIcon,
  BusIcon,
  CarIcon,
  FerryIcon,
  WalkIcon,
  ArrowIcon,
  CheckIcon,
  FlagIcon,
  PlusIcon,
  BedIcon,
  TrashIcon,
  type IconProps,
} from '../components/icons'
import { uid, formatDate, nightsBetween } from '../lib/format'
import { todayISO } from '../lib/game'

const MODE_ICON: Record<TransportMode, (p: IconProps) => JSX.Element> = {
  train: TrainIcon,
  plane: PlaneIcon,
  bus: BusIcon,
  car: CarIcon,
  ferry: FerryIcon,
  walk: WalkIcon,
  other: ArrowIcon,
}
const MODES: TransportMode[] = ['train', 'plane', 'bus', 'car', 'ferry', 'walk', 'other']

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

  const sorted = [...state.cities].sort((a, b) => a.arrival.localeCompare(b.arrival))
  const today = todayISO()
  const firstUpcoming = sorted.findIndex((c) => c.departure >= today)

  const statusOf = (i: number, c: City): Status => {
    if (c.departure && c.departure < today) return 'done'
    if (i === firstUpcoming || (firstUpcoming === -1 && i === sorted.length - 1)) return 'current'
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
    setState((prev) => ({ ...prev, cities: prev.cities.filter((c) => c.id !== id) }))
    setEditing(null)
  }

  const totalNights = sorted.reduce((s, c) => s + nightsBetween(c.arrival, c.departure), 0)

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
          <PlusIcon size={16} /> Stop
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <Goat size={96} className="tg-bob" />
          <p className="text-lg font-extrabold text-[#4b4b4b]">Let's plot your route!</p>
          <Button variant="green" onClick={openNew}>
            <PlusIcon size={16} /> Add your first stop
          </Button>
        </div>
      ) : (
        <div className="relative flex flex-col items-center gap-1 pb-6">
          {sorted.map((city, i) => {
            const status = statusOf(i, city)
            const offset = Math.round(Math.sin(i * 0.9) * 86)
            const PrevMode = i > 0 ? MODE_ICON[sorted[i - 1].transportMode] : null
            const nodeClass =
              status === 'done'
                ? 'tg-node--done'
                : status === 'current'
                  ? 'tg-node--current'
                  : 'tg-node--future'
            return (
              <div key={city.id} className="flex w-full flex-col items-center">
                {PrevMode && (
                  <div className="py-1.5 text-[#c8c8c8]">
                    <PrevMode size={22} strokeWidth={2.4} />
                  </div>
                )}

                <div className="relative flex items-center" style={{ transform: `translateX(${offset}px)` }}>
                  {status === 'current' && (
                    <div className="absolute right-full mr-1 hidden sm:block">
                      <Goat size={54} className="tg-bob" />
                    </div>
                  )}

                  {/* pulse ring for current */}
                  {status === 'current' && (
                    <span className="pointer-events-none absolute inset-0 rounded-full">
                      <span className="tg-pulse-ring absolute inset-0 rounded-full bg-[#58cc02]/40" />
                    </span>
                  )}

                  <button
                    onClick={() => openEdit(city)}
                    className={`tg-node ${nodeClass} relative text-white`}
                    aria-label={city.name}
                  >
                    {status === 'done' ? (
                      <CheckIcon size={30} strokeWidth={3.4} />
                    ) : (
                      <span className={`text-2xl font-black ${status === 'future' ? 'text-white/90' : ''}`}>
                        {i + 1}
                      </span>
                    )}
                    {status === 'current' && (
                      <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#58cc02] shadow-[0_2px_0_#e5e5e5]">
                        {i === 0 ? 'Start' : 'Next'}
                      </span>
                    )}
                  </button>
                </div>

                {/* label */}
                <div
                  className="mt-2 flex flex-col items-center"
                  style={{ transform: `translateX(${offset}px)` }}
                >
                  <span className="text-sm font-extrabold text-[#3c3c3c]">
                    {city.name || 'Untitled'}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold text-[#afafaf]">
                    <Flag country={city.country} size={18} />
                    {formatDate(city.arrival, { month: 'short', day: 'numeric' })} ·{' '}
                    {nightsBetween(city.arrival, city.departure)}n
                  </span>
                </div>
              </div>
            )
          })}

          {/* finish */}
          <div className="mt-4 flex flex-col items-center text-[#cbb66b]">
            <FlagIcon size={30} className="text-[#ffc800]" />
            <span className="mt-0.5 text-xs font-extrabold uppercase tracking-wide text-[#afafaf]">
              Trip complete
            </span>
          </div>
        </div>
      )}

      {sorted.length > 0 && (
        <div className="mt-2 flex items-start gap-2">
          <Goat size={44} />
          <div className="flex-1">
            <SpeechBubble>
              Tap any stop to add your hotel, transport, and notes. Filling these in raises your
              readiness!
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
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Paris" />
              </Field>
              <Field label="Country">
                <Input value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} placeholder="France" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Arrival">
                <Input type="date" value={editing.arrival} onChange={(e) => setEditing({ ...editing, arrival: e.target.value })} />
              </Field>
              <Field label="Departure">
                <Input type="date" value={editing.departure} onChange={(e) => setEditing({ ...editing, departure: e.target.value })} />
              </Field>
            </div>
            <Field label="Accommodation">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#bcbcbc]">
                  <BedIcon size={18} />
                </span>
                <Input
                  className="!pl-10"
                  value={editing.accommodation}
                  onChange={(e) => setEditing({ ...editing, accommodation: e.target.value })}
                  placeholder="Hotel name / Airbnb"
                />
              </div>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Transport to next">
                <Select
                  value={editing.transportMode}
                  onChange={(e) => setEditing({ ...editing, transportMode: e.target.value as TransportMode })}
                >
                  {MODES.map((m) => (
                    <option key={m} value={m}>
                      {m[0].toUpperCase() + m.slice(1)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Transport details">
                <Input value={editing.transportDetails} onChange={(e) => setEditing({ ...editing, transportDetails: e.target.value })} placeholder="09:30, ref ABC" />
              </Field>
            </div>
            <Field label="Notes">
              <Textarea rows={3} value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} placeholder="Anything to remember" />
            </Field>

            <div className="flex items-center justify-between pt-1">
              {!isNew ? (
                <Button variant="ghost" onClick={() => remove(editing.id)}>
                  <TrashIcon size={18} /> Delete
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button variant="white" onClick={() => setEditing(null)}>Cancel</Button>
                <Button variant="green" onClick={save}>Save</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
