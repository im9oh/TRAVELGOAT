import { useMemo, useState } from 'react'
import { useStore } from '../store'
import type { Expense, ExpenseCategory } from '../types'
import {
  Card,
  SectionTitle,
  Button,
  Modal,
  Field,
  Input,
  Select,
  ProgressBar,
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
  Other: '•',
}

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

function emptyExpense(): Expense {
  return {
    id: uid(),
    date: todayISO(),
    category: 'Food',
    description: '',
    amount: 0,
    cityId: null,
  }
}

export default function Budget() {
  const { state, setState } = useStore()
  const { expenses, trip, cities } = state
  const cur = trip.homeCurrency
  const [editing, setEditing] = useState<Expense | null>(null)
  const [isNew, setIsNew] = useState(false)

  const spent = expenses.reduce((s, e) => s + e.amount, 0)
  const remaining = trip.totalBudget - spent
  const pct = trip.totalBudget > 0 ? (spent / trip.totalBudget) * 100 : 0

  const byCategory = useMemo(() => {
    const map = new Map<ExpenseCategory, number>()
    for (const e of expenses)
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount)
    return CATEGORIES.map((c) => ({ category: c, total: map.get(c) ?? 0 }))
      .filter((x) => x.total > 0)
      .sort((a, b) => b.total - a.total)
  }, [expenses])

  const cityName = (id: string | null) =>
    cities.find((c) => c.id === id)?.name ?? null

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
    setState((prev) => {
      const exists = prev.expenses.some((e) => e.id === editing.id)
      return {
        ...prev,
        expenses: exists
          ? prev.expenses.map((e) => (e.id === editing.id ? editing : e))
          : [...prev.expenses, editing],
      }
    })
    setEditing(null)
  }
  function remove(id: string) {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }))
    setEditing(null)
  }

  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <SectionTitle
        title="Budget"
        subtitle={`${formatMoney(spent, cur)} of ${formatMoney(
          trip.totalBudget,
          cur,
        )}`}
        action={<Button onClick={openNew}>+ Expense</Button>}
      />

      <Card className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">
            {Math.round(pct)}% used
          </span>
          <span
            className={`text-sm font-bold ${
              remaining < 0 ? 'text-red-600' : 'text-teal-700'
            }`}
          >
            {formatMoney(remaining, cur)} {remaining < 0 ? 'over' : 'left'}
          </span>
        </div>
        <ProgressBar value={pct} />

        {byCategory.length > 0 && (
          <div className="mt-4 space-y-2">
            {byCategory.map((row) => {
              const rowPct = spent > 0 ? (row.total / spent) * 100 : 0
              return (
                <div key={row.category}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">
                      {CAT_ICON[row.category]} {row.category}
                    </span>
                    <span className="font-medium text-slate-700">
                      {formatMoney(row.total, cur)}
                      <span className="ml-1 text-xs text-slate-400">
                        {Math.round(rowPct)}%
                      </span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-teal-400"
                      style={{ width: `${rowPct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {sorted.length === 0 ? (
        <EmptyState
          icon="💶"
          title="No expenses yet"
          hint="Log spending as you go to keep an eye on the budget."
        />
      ) : (
        <div className="space-y-2">
          {sorted.map((e) => (
            <button
              key={e.id}
              onClick={() => openEdit(e)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-teal-300"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{CAT_ICON[e.category]}</span>
                <div>
                  <div className="font-semibold text-slate-800">
                    {e.description || e.category}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(e.date)}
                    {cityName(e.cityId) && ` · ${cityName(e.cityId)}`}
                  </div>
                </div>
              </div>
              <div className="font-bold text-slate-900">
                {formatMoney(e.amount, cur)}
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? 'Add expense' : 'Edit expense'}
      >
        {editing && (
          <div className="space-y-3">
            <Field label={`Amount (${cur})`}>
              <Input
                type="number"
                inputMode="decimal"
                value={editing.amount || ''}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
              />
            </Field>
            <Field label="Description">
              <Input
                value={editing.description}
                onChange={(e) =>
                  setEditing({ ...editing, description: e.target.value })
                }
                placeholder="Dinner, museum ticket…"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <Select
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      category: e.target.value as ExpenseCategory,
                    })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Date">
                <Input
                  type="date"
                  value={editing.date}
                  onChange={(e) =>
                    setEditing({ ...editing, date: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="City (optional)">
              <Select
                value={editing.cityId ?? ''}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    cityId: e.target.value || null,
                  })
                }
              >
                <option value="">— None —</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
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
