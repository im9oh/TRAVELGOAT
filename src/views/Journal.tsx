import { useState } from 'react'
import { useStore } from '../store'
import { useReward } from '../components/toast'
import type { JournalEntry } from '../types'
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
  Mascot,
  SpeechBubble,
  EmptyState,
} from '../components/ui'
import { uid, formatDate } from '../lib/format'

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function emptyEntry(): JournalEntry {
  return { id: uid(), date: todayISO(), title: '', body: '', cityId: null }
}

export default function Journal() {
  const { state, setState } = useStore()
  const { reward } = useReward()
  const { journal, cities } = state
  const [editing, setEditing] = useState<JournalEntry | null>(null)
  const [isNew, setIsNew] = useState(false)

  const cityName = (id: string | null) => cities.find((c) => c.id === id)?.name ?? null
  const sorted = [...journal].sort((a, b) => b.date.localeCompare(a.date))

  function openNew() {
    setEditing(emptyEntry())
    setIsNew(true)
  }
  function openEdit(e: JournalEntry) {
    setEditing({ ...e })
    setIsNew(false)
  }
  function save() {
    if (!editing) return
    const creating = !journal.some((j) => j.id === editing.id)
    setState((prev) => ({
      ...prev,
      journal: creating
        ? [...prev.journal, editing]
        : prev.journal.map((j) => (j.id === editing.id ? editing : j)),
    }))
    if (creating) reward(40, '📔')
    setEditing(null)
  }
  function remove(id: string) {
    setState((prev) => ({ ...prev, journal: prev.journal.filter((j) => j.id !== id) }))
    setEditing(null)
  }

  return (
    <div>
      <SectionTitle
        title="Journal"
        subtitle={`${journal.length} ${journal.length === 1 ? 'entry' : 'entries'}`}
        action={<Button size="sm" variant="gold" onClick={openNew}>+ Entry</Button>}
      />

      {sorted.length === 0 ? (
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <Mascot size={48} bob />
            <div className="flex-1">
              <SpeechBubble>
                Write your first memory — entries are worth 40 XP each! ✍️
              </SpeechBubble>
            </div>
          </div>
          <EmptyState icon="📔" title="No entries yet" hint="Capture moments, meals, and memories as you travel." />
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((e) => (
            <Card key={e.id} onClick={() => openEdit(e)}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-extrabold text-[#afafaf]">{formatDate(e.date)}</span>
                {cityName(e.cityId) && <Badge color="blue">{cityName(e.cityId)}</Badge>}
              </div>
              <h3 className="mt-0.5 text-lg font-extrabold text-[#3c3c3c]">{e.title || 'Untitled'}</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm font-bold text-[#777]">{e.body}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? 'New entry' : 'Edit entry'}>
        {editing && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date">
                <Input
                  type="date"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                />
              </Field>
              <Field label="City">
                <Select
                  value={editing.cityId ?? ''}
                  onChange={(e) => setEditing({ ...editing, cityId: e.target.value || null })}
                >
                  <option value="">— None —</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Title">
              <Input
                value={editing.title}
                onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                placeholder="A day in…"
              />
            </Field>
            <Field label="Entry">
              <Textarea
                rows={8}
                value={editing.body}
                onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                placeholder="What happened today?"
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
                <Button variant="gold" onClick={save}>Save</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
