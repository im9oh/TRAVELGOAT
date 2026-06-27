import { useState } from 'react'
import { useStore } from '../store'
import type { City, TransportMode } from '../types'
import {
  Card,
  SectionTitle,
  Button,
  Modal,
  Field,
  Input,
  Textarea,
  Select,
  Badge,
  EmptyState,
} from '../components/ui'
import { uid, formatDate, nightsBetween, daysUntil } from '../lib/format'

const MODE_ICON: Record<TransportMode, string> = {
  train: '🚆',
  plane: '✈️',
  bus: '🚌',
  car: '🚗',
  ferry: '⛴️',
  walk: '🚶',
  other: '➡️',
}

const MODES: TransportMode[] = [
  'train',
  'plane',
  'bus',
  'car',
  'ferry',
  'walk',
  'other',
]

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

export default function Itinerary() {
  const { state, setState } = useStore()
  const [editing, setEditing] = useState<City | null>(null)
  const [isNew, setIsNew] = useState(false)

  const sorted = [...state.cities].sort((a, b) =>
    a.arrival.localeCompare(b.arrival),
  )

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
      <SectionTitle
        title="Itinerary"
        subtitle={`${sorted.length} stops · ${totalNights} nights`}
        action={<Button onClick={openNew}>+ Add stop</Button>}
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon="🗺️"
          title="No stops yet"
          hint="Add your first city to start building the route."
        />
      ) : (
        <ol className="relative space-y-3">
          {sorted.map((city, i) => {
            const next = sorted[i + 1]
            const d = daysUntil(city.arrival)
            return (
              <li key={city.id}>
                <Card>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                        {i + 1}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {city.name || 'Untitled'}
                          </h3>
                          <span className="text-sm text-slate-500">
                            {city.country}
                          </span>
                          {d > 0 && d <= 30 && (
                            <Badge color="teal">in {d}d</Badge>
                          )}
                        </div>
                        <div className="mt-0.5 text-sm text-slate-600">
                          {formatDate(city.arrival)} →{' '}
                          {formatDate(city.departure)}
                          <span className="ml-2 font-medium text-slate-500">
                            {nightsBetween(city.arrival, city.departure)} nights
                          </span>
                        </div>
                        {city.accommodation && (
                          <div className="mt-1 text-sm text-slate-600">
                            🏨 {city.accommodation}
                          </div>
                        )}
                        {city.notes && (
                          <p className="mt-1 text-sm text-slate-500">
                            {city.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" onClick={() => openEdit(city)}>
                      Edit
                    </Button>
                  </div>
                </Card>

                {next && (
                  <div className="flex items-center gap-2 py-2 pl-7 text-sm text-slate-500">
                    <span className="text-base">
                      {MODE_ICON[city.transportMode]}
                    </span>
                    <span className="capitalize">{city.transportMode}</span>
                    <span className="text-slate-300">to {next.name}</span>
                    {city.transportDetails && (
                      <span className="text-slate-400">
                        · {city.transportDetails}
                      </span>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? 'Add stop' : 'Edit stop'}
      >
        {editing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="City">
                <Input
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
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
              <Field label="Transport to next stop">
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
                    setEditing({
                      ...editing,
                      transportDetails: e.target.value,
                    })
                  }
                  placeholder="09:30, ref ABC123"
                />
              </Field>
            </div>
            <Field label="Notes">
              <Textarea
                rows={3}
                value={editing.notes}
                onChange={(e) =>
                  setEditing({ ...editing, notes: e.target.value })
                }
                placeholder="Anything to remember about this stop"
              />
            </Field>

            <div className="flex items-center justify-between pt-2">
              {!isNew ? (
                <Button variant="danger" onClick={() => remove(editing.id)}>
                  Delete
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button variant="subtle" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button onClick={save}>Save</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
