import { useMemo, useState } from 'react'
import { useStore } from '../store'
import type { Place, PlaceCategory, Priority } from '../types'
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
import { uid } from '../lib/format'

const CATEGORIES: PlaceCategory[] = [
  'Sight',
  'Food',
  'Activity',
  'Nature',
  'Other',
]
const CAT_ICON: Record<PlaceCategory, string> = {
  Sight: '🏛️',
  Food: '🍴',
  Activity: '🎢',
  Nature: '🌳',
  Other: '📌',
}
const PRIORITIES: Priority[] = ['high', 'medium', 'low']
const PRIO_COLOR: Record<Priority, 'red' | 'amber' | 'slate'> = {
  high: 'red',
  medium: 'amber',
  low: 'slate',
}

function emptyPlace(cityId: string | null): Place {
  return {
    id: uid(),
    name: '',
    cityId,
    category: 'Sight',
    priority: 'medium',
    visited: false,
    notes: '',
    url: '',
  }
}

export default function Places() {
  const { state, setState } = useStore()
  const { places, cities } = state
  const [editing, setEditing] = useState<Place | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [filterCity, setFilterCity] = useState<string>('all')

  const cityName = (id: string | null) =>
    cities.find((c) => c.id === id)?.name ?? 'Unassigned'

  const filtered = useMemo(() => {
    const list =
      filterCity === 'all'
        ? places
        : places.filter((p) => (p.cityId ?? 'none') === filterCity)
    const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
    return [...list].sort((a, b) => {
      if (a.visited !== b.visited) return a.visited ? 1 : -1
      return order[a.priority] - order[b.priority]
    })
  }, [places, filterCity])

  function openNew() {
    const preset = filterCity !== 'all' && filterCity !== 'none' ? filterCity : null
    setEditing(emptyPlace(preset))
    setIsNew(true)
  }
  function openEdit(p: Place) {
    setEditing({ ...p })
    setIsNew(false)
  }
  function save() {
    if (!editing) return
    setState((prev) => {
      const exists = prev.places.some((p) => p.id === editing.id)
      return {
        ...prev,
        places: exists
          ? prev.places.map((p) => (p.id === editing.id ? editing : p))
          : [...prev.places, editing],
      }
    })
    setEditing(null)
  }
  function remove(id: string) {
    setState((prev) => ({
      ...prev,
      places: prev.places.filter((p) => p.id !== id),
    }))
    setEditing(null)
  }
  function toggleVisited(p: Place) {
    setState((prev) => ({
      ...prev,
      places: prev.places.map((x) =>
        x.id === p.id ? { ...x, visited: !x.visited } : x,
      ),
    }))
  }

  const visitedCount = places.filter((p) => p.visited).length

  return (
    <div>
      <SectionTitle
        title="Places"
        subtitle={`${visitedCount}/${places.length} visited`}
        action={<Button onClick={openNew}>+ Place</Button>}
      />

      {places.length > 0 && (
        <div className="mb-4">
          <Select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="max-w-xs"
          >
            <option value="all">All cities</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value="none">Unassigned</option>
          </Select>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon="📍"
          title="No places yet"
          hint="Save sights, restaurants, and activities you don't want to miss."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((p) => (
            <Card key={p.id} className={p.visited ? 'opacity-60' : ''}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => toggleVisited(p)}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                      p.visited
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-slate-300'
                    }`}
                    aria-label="Toggle visited"
                  >
                    {p.visited && '✓'}
                  </button>
                  <div>
                    <div
                      className={`font-semibold text-slate-900 ${
                        p.visited ? 'line-through' : ''
                      }`}
                    >
                      {CAT_ICON[p.category]} {p.name || 'Untitled'}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge color="blue">{cityName(p.cityId)}</Badge>
                      <Badge color={PRIO_COLOR[p.priority]}>
                        {p.priority}
                      </Badge>
                    </div>
                    {p.notes && (
                      <p className="mt-1.5 text-sm text-slate-500">{p.notes}</p>
                    )}
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-sm font-medium text-teal-600 hover:underline"
                      >
                        Open link ↗
                      </a>
                    )}
                  </div>
                </div>
                <Button variant="ghost" onClick={() => openEdit(p)}>
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? 'Add place' : 'Edit place'}
      >
        {editing && (
          <div className="space-y-3">
            <Field label="Name">
              <Input
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                placeholder="Eiffel Tower"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City">
                <Select
                  value={editing.cityId ?? ''}
                  onChange={(e) =>
                    setEditing({ ...editing, cityId: e.target.value || null })
                  }
                >
                  <option value="">— Unassigned —</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Category">
                <Select
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      category: e.target.value as PlaceCategory,
                    })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CAT_ICON[c]} {c}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Priority">
              <Select
                value={editing.priority}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    priority: e.target.value as Priority,
                  })
                }
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Link (optional)">
              <Input
                value={editing.url}
                onChange={(e) =>
                  setEditing({ ...editing, url: e.target.value })
                }
                placeholder="https://…"
              />
            </Field>
            <Field label="Notes">
              <Textarea
                rows={3}
                value={editing.notes}
                onChange={(e) =>
                  setEditing({ ...editing, notes: e.target.value })
                }
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
