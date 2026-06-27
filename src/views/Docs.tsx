import { useState } from 'react'
import { useStore } from '../store'
import { useReward } from '../components/toast'
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

const TYPES: DocType[] = ['Passport', 'Visa', 'Booking', 'Insurance', 'Ticket', 'Other']
const TYPE_ICON: Record<DocType, string> = {
  Passport: '🛂',
  Visa: '📑',
  Booking: '🏨',
  Insurance: '🛡️',
  Ticket: '🎫',
  Other: '📄',
}

function emptyDoc(): TravelDoc {
  return { id: uid(), title: '', type: 'Booking', reference: '', date: '', notes: '' }
}

export default function Docs() {
  const { state, setState } = useStore()
  const { reward } = useReward()
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
    const creating = !docs.some((d) => d.id === editing.id)
    setState((prev) => ({
      ...prev,
      docs: creating
        ? [...prev.docs, editing]
        : prev.docs.map((d) => (d.id === editing.id ? editing : d)),
    }))
    if (creating) reward(15, '📄')
    setEditing(null)
  }
  function remove(id: string) {
    setState((prev) => ({ ...prev, docs: prev.docs.filter((d) => d.id !== id) }))
    setEditing(null)
  }

  return (
    <div>
      <SectionTitle
        title="Docs & logistics"
        subtitle="Bookings, refs & key dates"
        action={<Button size="sm" variant="blue" onClick={openNew}>+ Doc</Button>}
      />

      <div className="mb-4 rounded-2xl bg-[#fff4d6] px-4 py-3 text-sm font-bold text-[#a07400]">
        🔒 Stored only in this browser. Don't save full passport numbers or
        secrets here.
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon="📄" title="No documents yet" hint="Track confirmation numbers, expiry dates, and key references." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sorted.map((d) => {
            const until = d.date ? daysUntil(d.date) : null
            const expSoon = d.type === 'Passport' && until !== null && until < 180
            return (
              <Card key={d.id} onClick={() => openEdit(d)} className="!p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-[#3c3c3c]">
                    {TYPE_ICON[d.type]} {d.title || 'Untitled'}
                  </h3>
                  <Badge color="purple">{d.type}</Badge>
                </div>
                {d.reference && (
                  <div className="mt-1.5 rounded-lg bg-[#f5f5f5] px-2 py-1 font-mono text-sm font-bold text-[#3c3c3c]">
                    {d.reference}
                  </div>
                )}
                {d.date && (
                  <div className="mt-1.5 text-sm font-bold text-[#afafaf]">
                    {formatDate(d.date)}
                    {expSoon && <span className="ml-2 font-extrabold text-[#ff4b4b]">⚠ check validity</span>}
                  </div>
                )}
                {d.notes && <p className="mt-1 text-sm font-bold text-[#afafaf]">{d.notes}</p>}
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? 'Add document' : 'Edit document'}>
        {editing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title">
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Flight to London"
                />
              </Field>
              <Field label="Type">
                <Select
                  value={editing.type}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value as DocType })}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{TYPE_ICON[t]} {t}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Reference / confirmation">
              <Input
                value={editing.reference}
                onChange={(e) => setEditing({ ...editing, reference: e.target.value })}
                placeholder="ABC123"
              />
            </Field>
            <Field label="Date (expiry, booking, departure…)">
              <Input
                type="date"
                value={editing.date}
                onChange={(e) => setEditing({ ...editing, date: e.target.value })}
              />
            </Field>
            <Field label="Notes">
              <Textarea
                rows={3}
                value={editing.notes}
                onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
              />
            </Field>
            <div className="flex items-center justify-between pt-1">
              {!isNew ? (
                <Button variant="ghost" onClick={() => remove(editing.id)}>🗑 Delete</Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button variant="white" onClick={() => setEditing(null)}>Cancel</Button>
                <Button variant="blue" onClick={save}>Save</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
