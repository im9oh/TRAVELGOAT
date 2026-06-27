import { useState } from 'react'
import { useStore } from '../store'
import type { TravelDoc, DocType } from '../types'
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
import { uid, formatDate, daysUntil } from '../lib/format'

const TYPES: DocType[] = [
  'Passport',
  'Visa',
  'Booking',
  'Insurance',
  'Ticket',
  'Other',
]
const TYPE_ICON: Record<DocType, string> = {
  Passport: '🛂',
  Visa: '📑',
  Booking: '🏨',
  Insurance: '🛡️',
  Ticket: '🎫',
  Other: '📄',
}

function emptyDoc(): TravelDoc {
  return {
    id: uid(),
    title: '',
    type: 'Booking',
    reference: '',
    date: '',
    notes: '',
  }
}

export default function Docs() {
  const { state, setState } = useStore()
  const { docs } = state
  const [editing, setEditing] = useState<TravelDoc | null>(null)
  const [isNew, setIsNew] = useState(false)

  const sorted = [...docs].sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return a.date.localeCompare(b.date)
  })

  function openNew() {
    setEditing(emptyDoc())
    setIsNew(true)
  }
  function openEdit(d: TravelDoc) {
    setEditing({ ...d })
    setIsNew(false)
  }
  function save() {
    if (!editing) return
    setState((prev) => {
      const exists = prev.docs.some((d) => d.id === editing.id)
      return {
        ...prev,
        docs: exists
          ? prev.docs.map((d) => (d.id === editing.id ? editing : d))
          : [...prev.docs, editing],
      }
    })
    setEditing(null)
  }
  function remove(id: string) {
    setState((prev) => ({
      ...prev,
      docs: prev.docs.filter((d) => d.id !== id),
    }))
    setEditing(null)
  }

  return (
    <div>
      <SectionTitle
        title="Docs & logistics"
        subtitle="Bookings, references, and important dates"
        action={<Button onClick={openNew}>+ Doc</Button>}
      />

      <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
        🔒 Stored only in this browser. Avoid saving full passport numbers or
        sensitive secrets here.
      </p>

      {sorted.length === 0 ? (
        <EmptyState
          icon="📄"
          title="No documents yet"
          hint="Track confirmation numbers, expiry dates, and key references."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sorted.map((d) => {
            const until = d.date ? daysUntil(d.date) : null
            const expSoon =
              d.type === 'Passport' && until !== null && until < 180
            return (
              <Card key={d.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">
                        {TYPE_ICON[d.type]} {d.title || 'Untitled'}
                      </h3>
                      <Badge color="purple">{d.type}</Badge>
                    </div>
                    {d.reference && (
                      <div className="mt-1 font-mono text-sm text-slate-700">
                        {d.reference}
                      </div>
                    )}
                    {d.date && (
                      <div className="mt-1 text-sm text-slate-500">
                        {formatDate(d.date)}
                        {expSoon && (
                          <span className="ml-2 font-semibold text-red-600">
                            ⚠ check validity
                          </span>
                        )}
                      </div>
                    )}
                    {d.notes && (
                      <p className="mt-1 text-sm text-slate-500">{d.notes}</p>
                    )}
                  </div>
                  <Button variant="ghost" onClick={() => openEdit(d)}>
                    Edit
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? 'Add document' : 'Edit document'}
      >
        {editing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title">
                <Input
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  placeholder="Flight to London"
                />
              </Field>
              <Field label="Type">
                <Select
                  value={editing.type}
                  onChange={(e) =>
                    setEditing({ ...editing, type: e.target.value as DocType })
                  }
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_ICON[t]} {t}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Reference / confirmation">
              <Input
                value={editing.reference}
                onChange={(e) =>
                  setEditing({ ...editing, reference: e.target.value })
                }
                placeholder="ABC123"
              />
            </Field>
            <Field label="Date (expiry, booking, departure…)">
              <Input
                type="date"
                value={editing.date}
                onChange={(e) =>
                  setEditing({ ...editing, date: e.target.value })
                }
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
