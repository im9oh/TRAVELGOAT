import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { useReward } from '../components/toast'
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
  ProgressRing,
  EmptyState,
} from '../components/ui'
import {
  LandmarkIcon,
  ForkKnifeIcon,
  TicketIcon,
  TreeIcon,
  PinIcon,
  CompassIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  ChevronRightIcon,
  type IconProps,
} from '../components/icons'
import { uid } from '../lib/format'

const CATEGORIES: PlaceCategory[] = ['Sight', 'Food', 'Activity', 'Nature', 'Other']
const CAT_ICON: Record<PlaceCategory, (p: IconProps) => JSX.Element> = {
  Sight: LandmarkIcon,
  Food: ForkKnifeIcon,
  Activity: TicketIcon,
  Nature: TreeIcon,
  Other: PinIcon,
}
const PRIORITIES: Priority[] = ['high', 'medium', 'low']
const PRIO_COLOR: Record<Priority, 'red' | 'amber' | 'slate'> = {
  high: 'red',
  medium: 'amber',
  low: 'slate',
}

function emptyPlace(cityId: string | null): Place {
  return { id: uid(), name: '', cityId, category: 'Sight', priority: 'medium', visited: false, notes: '', url: '' }
}

export default function Places() {
  const { state, setState } = useStore()
  const { reward, celebrate } = useReward()
  const { places, cities } = state
  const [editing, setEditing] = useState<Place | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [filterCity, setFilterCity] = useState<string>('all')

  const cityName = (id: string | null) => cities.find((c) => c.id === id)?.name ?? 'Unassigned'

  const filtered = useMemo(() => {
    const list = filterCity === 'all' ? places : places.filter((p) => (p.cityId ?? 'none') === filterCity)
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
    const creating = !places.some((p) => p.id === editing.id)
    setState((prev) => ({
      ...prev,
      places: creating ? [...prev.places, editing] : prev.places.map((p) => (p.id === editing.id ? editing : p)),
    }))
    if (creating) reward(5, <PinIcon size={18} />)
    setEditing(null)
  }
  function remove(id: string) {
    setState((prev) => ({ ...prev, places: prev.places.filter((p) => p.id !== id) }))
    setEditing(null)
  }
  function toggleVisited(p: Place) {
    const nowVisited = !p.visited
    setState((prev) => ({
      ...prev,
      places: prev.places.map((x) => (x.id === p.id ? { ...x, visited: nowVisited } : x)),
    }))
    if (nowVisited) {
      reward(25, <CheckIcon size={18} />)
      celebrate()
    }
  }

  const visitedCount = places.filter((p) => p.visited).length
  const pct = places.length ? (visitedCount / places.length) * 100 : 0

  return (
    <div>
      <SectionTitle
        title="Places"
        subtitle="Your bucket list"
        action={
          <Button size="sm" variant="purple" onClick={openNew}>
            <PlusIcon size={16} /> Place
          </Button>
        }
      />

      {places.length > 0 && (
        <Card className="mb-4 flex items-center gap-5 bg-gradient-to-b from-[#faf3ff] to-white">
          <ProgressRing value={pct} size={108} stroke={13} color="#ce82ff">
            <span className="text-xl font-black text-[#3c3c3c]">{visitedCount}</span>
            <span className="text-[10px] font-extrabold uppercase text-[#afafaf]">visited</span>
          </ProgressRing>
          <div className="flex-1">
            <div className="text-lg font-extrabold text-[#3c3c3c]">{places.length - visitedCount} to explore</div>
            <p className="text-sm font-bold text-[#afafaf]">Tick places off as you go — each is worth 25 XP!</p>
          </div>
        </Card>
      )}

      {places.length > 0 && (
        <div className="mb-4">
          <Select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className="max-w-xs">
            <option value="all">All cities</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            <option value="none">Unassigned</option>
          </Select>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<CompassIcon size={48} strokeWidth={2} />}
          title="No places yet"
          hint="Save sights, food, and activities you don't want to miss."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((p) => {
            const Icon = CAT_ICON[p.category]
            return (
              <Card key={p.id} className={`!p-3 ${p.visited ? 'opacity-70' : ''}`}>
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleVisited(p)}
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
                      p.visited
                        ? 'bg-[#58cc02] text-white shadow-[0_2px_0_#58a700]'
                        : 'border-2 border-[#e5e5e5] text-transparent'
                    }`}
                    aria-label="Toggle visited"
                  >
                    <CheckIcon size={16} strokeWidth={3.4} />
                  </button>
                  <div className="min-w-0 flex-1" onClick={() => openEdit(p)}>
                    <div className={`flex items-center gap-1.5 font-extrabold text-[#3c3c3c] ${p.visited ? 'line-through' : ''}`}>
                      <Icon size={18} strokeWidth={2.4} className="shrink-0 text-[#a568cc]" />
                      {p.name || 'Untitled'}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Badge color="blue">{cityName(p.cityId)}</Badge>
                      <Badge color={PRIO_COLOR[p.priority]}>{p.priority}</Badge>
                    </div>
                    {p.notes && <p className="mt-1.5 text-sm font-bold text-[#afafaf]">{p.notes}</p>}
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 inline-flex items-center gap-0.5 text-sm font-extrabold text-[#1cb0f6]"
                      >
                        Open link <ChevronRightIcon size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? 'Add place' : 'Edit place'}>
        {editing && (
          <div className="space-y-3">
            <Field label="Name">
              <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Eiffel Tower" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City">
                <Select value={editing.cityId ?? ''} onChange={(e) => setEditing({ ...editing, cityId: e.target.value || null })}>
                  <option value="">— Unassigned —</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Category">
                <Select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as PlaceCategory })}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Priority">
              <Select value={editing.priority} onChange={(e) => setEditing({ ...editing, priority: e.target.value as Priority })}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Select>
            </Field>
            <Field label="Link (optional)">
              <Input value={editing.url} onChange={(e) => setEditing({ ...editing, url: e.target.value })} placeholder="https://…" />
            </Field>
            <Field label="Notes">
              <Textarea rows={3} value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
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
                <Button variant="purple" onClick={save}>Save</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
