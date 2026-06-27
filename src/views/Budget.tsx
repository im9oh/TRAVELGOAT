import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { useReward } from '../components/toast'
import type { Expense, ExpenseCategory } from '../types'
import {
  Card,
  SectionTitle,
  Button,
  Modal,
  Field,
  Input,
  Select,
  ProgressRing,
  EmptyState,
} from '../components/ui'
import { uid, formatMoney, formatDate } from '../lib/format'

const CATEGORIES: ExpenseCategory[] = [
  'Accommodation',
  'Transport',
  'Food',
  'Activities',
  'Shopping',
  'Fees',
  'Other',
]
const CAT_ICON: Record<ExpenseCategory, string> = {
  Accommodation: '🏨',
  Transport: '🚆',
  Food: '🍽️',
  Activities: '🎟️',
  Shopping: '🛍️',
  Fees: '🧾',
  Other: '✨',
}
const CAT_COLOR: Record<ExpenseCategory, string> = {
  Accommodation: '#1cb0f6',
  Transport: '#58cc02',
  Food: '#ff9600',
  Activities: '#ce82ff',
  Shopping: '#ff4b4b',
  Fees: '#afafaf',
  Other: '#ffc800',
}

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function emptyExpense(): Expense {
  return { id: uid(), date: todayISO(), category: 'Food', description: '', amount: 0, cityId: null }
}

export default function Budget() {
  const { state, setState } = useStore()
  const { reward } = useReward()
  const { expenses, trip, cities } = state
  const cur = trip.homeCurrency
  const [editing, setEditing] = useState<Expense | null>(null)
  const [isNew, setIsNew] = useState(false)

  const spent = expenses.reduce((s, e) => s + e.amount, 0)
  const remaining = trip.totalBudget - spent
  const pct = trip.totalBudget > 0 ? (spent / trip.totalBudget) * 100 : 0

  const byCategory = useMemo(() => {
    const map = new Map<ExpenseCategory, number>()
    for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + e.amount)
    return CATEGORIES.map((c) => ({ category: c, total: map.get(c) ?? 0 }))
      .filter((x) => x.total > 0)
      .sort((a, b) => b.total - a.total)
  }, [expenses])

  const cityName = (id: string | null) => cities.find((c) => c.id === id)?.name ?? null

  function openNew() {
    setEditing(emptyExpense())
    setIsNew(true)
  }
  function openEdit(e: Expense) {
    setEditing({ ...e })
    setIsNew(false)
  }
  function save() {
    if (!editing) return
    const creating = !expenses.some((e) => e.id === editing.id)
    setState((prev) => ({
      ...prev,
      expenses: creating
        ? [...prev.expenses, editing]
        : prev.expenses.map((e) => (e.id === editing.id ? editing : e)),
    }))
    if (creating) reward(5, '💸')
    setEditing(null)
  }
  function remove(id: string) {
    setState((prev) => ({ ...prev, expenses: prev.expenses.filter((e) => e.id !== id) }))
    setEditing(null)
  }

  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date))
  const overBudget = remaining < 0

  return (
    <div>
      <SectionTitle
        title="Budget"
        subtitle="Log spending, keep the goat happy"
        action={<Button size="sm" variant="gold" onClick={openNew}>+ Expense</Button>}
      />

      {/* Hero ring */}
      <Card className="mb-4 flex items-center gap-5 bg-gradient-to-b from-[#fffbe9] to-white">
        <ProgressRing
          value={pct}
          size={124}
          stroke={14}
          color={overBudget ? '#ff4b4b' : '#ffc800'}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#afafaf]">
            spent
          </span>
          <span className="text-xl font-black text-[#3c3c3c]">
            {Math.round(pct)}%
          </span>
        </ProgressRing>
        <div className="flex-1">
          <div className="text-xs font-extrabold uppercase tracking-wide text-[#afafaf]">
            {overBudget ? 'Over budget' : 'Remaining'}
          </div>
          <div className={`text-3xl font-black ${overBudget ? 'text-[#ff4b4b]' : 'text-[#58cc02]'}`}>
            {formatMoney(Math.abs(remaining), cur)}
          </div>
          <div className="mt-1 text-sm font-bold text-[#777]">
            {formatMoney(spent, cur)} of {formatMoney(trip.totalBudget, cur)}
          </div>
        </div>
      </Card>

      {/* Category breakdown */}
      {byCategory.length > 0 && (
        <Card className="mb-4">
          <h3 className="mb-3 font-extrabold text-[#3c3c3c]">By category</h3>
          <div className="space-y-3">
            {byCategory.map((row) => {
              const rowPct = spent > 0 ? (row.total / spent) * 100 : 0
              return (
                <div key={row.category}>
                  <div className="mb-1 flex items-center justify-between text-sm font-extrabold">
                    <span className="text-[#777]">
                      {CAT_ICON[row.category]} {row.category}
                    </span>
                    <span className="text-[#3c3c3c]">{formatMoney(row.total, cur)}</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-[#eee]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${rowPct}%`, background: CAT_COLOR[row.category] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {sorted.length === 0 ? (
        <EmptyState icon="💰" title="No expenses yet" hint="Log spending as you go — each one earns XP!" />
      ) : (
        <div className="space-y-2.5">
          {sorted.map((e) => (
            <Card key={e.id} onClick={() => openEdit(e)} className="!p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                    style={{ background: CAT_COLOR[e.category] + '22' }}
                  >
                    {CAT_ICON[e.category]}
                  </span>
                  <div>
                    <div className="font-extrabold text-[#3c3c3c]">
                      {e.description || e.category}
                    </div>
                    <div className="text-xs font-bold text-[#afafaf]">
                      {formatDate(e.date)}
                      {cityName(e.cityId) && ` · ${cityName(e.cityId)}`}
                    </div>
                  </div>
                </div>
                <div className="text-lg font-black text-[#3c3c3c]">
                  {formatMoney(e.amount, cur)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? 'Add expense' : 'Edit expense'}>
        {editing && (
          <div className="space-y-3">
            <Field label={`Amount (${cur})`}>
              <Input
                type="number"
                inputMode="decimal"
                value={editing.amount || ''}
                onChange={(e) => setEditing({ ...editing, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </Field>
            <Field label="Description">
              <Input
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                placeholder="Dinner, museum ticket…"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <Select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as ExpenseCategory })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Date">
                <Input
                  type="date"
                  value={editing.date}
                  onChange={(e) => setEditing({ ...editing, date: e.target.value })}
                />
              </Field>
            </div>
            <Field label="City (optional)">
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
