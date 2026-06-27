import { useRef, useState } from 'react'
import { useStore } from '../store'
import { useReward } from '../components/toast'
import type { SavingsDeposit } from '../types'
import { Card, Button, Modal, Field, Input, SpeechBubble, EmptyState } from '../components/ui'
import { Goat } from '../components/Goat'
import { SavingsJar } from '../components/SavingsJar'
import { CoinsIcon, PlusIcon, TrashIcon, CheckIcon } from '../components/icons'
import { uid, formatMoney, formatDate, daysUntil } from '../lib/format'
import { savedTotal } from '../lib/game'

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function Savings() {
  const { state, setState } = useStore()
  const { reward, cheer, celebrate } = useReward()
  const { savings, trip } = state
  const cur = trip.homeCurrency
  const goal = trip.savingsGoal || 1
  const saved = savedTotal(state)
  const pct = Math.min(100, (saved / goal) * 100)
  const remaining = Math.max(0, goal - saved)

  const [adding, setAdding] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const prevPct = useRef(pct)

  const days = daysUntil(trip.startDate)
  const weeks = Math.max(1, Math.ceil(days / 7))
  const perWeek = remaining / weeks

  function addDeposit() {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) return
    const dep: SavingsDeposit = { id: uid(), date: todayISO(), amount: amt, note: note.trim() }
    const newPct = Math.min(100, ((saved + amt) / goal) * 100)
    setState((prev) => ({ ...prev, savings: [...prev.savings, dep] }))
    reward(20, <CoinsIcon size={18} />)

    // milestone crossings
    const crossed = [25, 50, 75, 100].filter((m) => prevPct.current < m && newPct >= m)
    if (crossed.length) {
      celebrate()
      cheer(newPct >= 100 ? 'Goal reached! 🎉' : `${crossed[crossed.length - 1]}% saved!`, <CoinsIcon size={18} />)
    }
    prevPct.current = newPct
    setAmount('')
    setNote('')
    setAdding(false)
  }

  function remove(id: string) {
    setState((prev) => ({ ...prev, savings: prev.savings.filter((d) => d.id !== id) }))
  }

  const sorted = [...savings].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      {/* Hero jar */}
      <Card className="mb-4 overflow-hidden bg-gradient-to-b from-[#eaf6ff] to-white">
        <div className="flex flex-col items-center">
          <div className="mb-1 text-xs font-extrabold uppercase tracking-wide text-[#9bb0c2]">
            Saved so far
          </div>
          <div className="text-4xl font-black text-[#1c8a3c]">{formatMoney(saved, cur)}</div>
          <div className="text-sm font-bold text-[#9bb0c2]">
            of {formatMoney(goal, cur)} goal · {Math.round(pct)}%
          </div>

          <div className="my-3">
            <SavingsJar pct={pct} size={250} dropKey={savings.length} />
          </div>

          {/* milestones */}
          <div className="flex w-full justify-between px-2">
            {[25, 50, 75, 100].map((m) => {
              const hit = pct >= m
              return (
                <div key={m} className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${
                      hit ? 'bg-[#ffc800] text-white shadow-[0_2px_0_#e6a700]' : 'bg-[#eef1f4] text-[#bcc7d1]'
                    }`}
                  >
                    {hit ? <CheckIcon size={15} strokeWidth={3.4} /> : m}
                  </div>
                  <span className="text-[10px] font-extrabold text-[#bcc7d1]">{m}%</span>
                </div>
              )
            })}
          </div>

          <Button variant="green" block className="mt-4" onClick={() => setAdding(true)}>
            <PlusIcon size={18} /> Add to jar
          </Button>
        </div>
      </Card>

      {/* coach line */}
      <div className="mb-4 flex items-start gap-2">
        <Goat size={44} />
        <div className="flex-1">
          <SpeechBubble>
            {remaining <= 0
              ? `You're fully funded — incredible! The jar's overflowing.`
              : `${formatMoney(remaining, cur)} to go. Save about ${formatMoney(Math.ceil(perWeek), cur)}/week and you'll hit your goal before takeoff.`}
          </SpeechBubble>
        </div>
      </div>

      {/* history */}
      {sorted.length === 0 ? (
        <EmptyState
          icon={<CoinsIcon size={48} strokeWidth={2} />}
          title="No deposits yet"
          hint="Every dollar you set aside drops into the jar."
        />
      ) : (
        <div className="space-y-2.5">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#afafaf]">Deposits</h3>
          {sorted.map((d) => (
            <div key={d.id} className="tg-card group flex items-center justify-between !rounded-2xl px-3 py-2.5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff4d6] text-[#e6a700]">
                  <CoinsIcon size={20} />
                </span>
                <div>
                  <div className="font-extrabold text-[#3c3c3c]">{d.note || 'Deposit'}</div>
                  <div className="text-xs font-bold text-[#afafaf]">{formatDate(d.date)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-[#1c8a3c]">+{formatMoney(d.amount, cur)}</span>
                <button
                  onClick={() => remove(d.id)}
                  className="text-[#d5d5d5] opacity-0 transition hover:text-[#ff4b4b] group-hover:opacity-100"
                  aria-label="Remove"
                >
                  <TrashIcon size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Add to the jar">
        <div className="space-y-3">
          <Field label={`Amount (${cur})`}>
            <Input
              type="number"
              inputMode="decimal"
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addDeposit()}
              placeholder="0.00"
            />
          </Field>
          <Field label="Note (optional)">
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Paycheck, sold my bike…" />
          </Field>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="white" onClick={() => setAdding(false)}>Cancel</Button>
            <Button variant="green" onClick={addDeposit}>Drop it in</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
