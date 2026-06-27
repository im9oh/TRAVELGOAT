import { useMemo, useState } from 'react'
import { useStore } from '../store'
import type { PackingItem } from '../types'
import {
  SectionTitle,
  Button,
  Input,
  ProgressBar,
  EmptyState,
} from '../components/ui'
import { uid } from '../lib/format'

export default function Packing() {
  const { state, setState } = useStore()
  const { packing } = state
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Essentials')

  const grouped = useMemo(() => {
    const map = new Map<string, PackingItem[]>()
    for (const item of packing) {
      const arr = map.get(item.category) ?? []
      arr.push(item)
      map.set(item.category, arr)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [packing])

  const categories = useMemo(
    () => [...new Set(packing.map((p) => p.category))].sort(),
    [packing],
  )

  const packed = packing.filter((p) => p.packed).length
  const pct = packing.length > 0 ? (packed / packing.length) * 100 : 0

  function add() {
    const trimmed = name.trim()
    if (!trimmed) return
    setState((prev) => ({
      ...prev,
      packing: [
        ...prev.packing,
        { id: uid(), name: trimmed, category: category.trim() || 'Other', packed: false },
      ],
    }))
    setName('')
  }
  function toggle(id: string) {
    setState((prev) => ({
      ...prev,
      packing: prev.packing.map((p) =>
        p.id === id ? { ...p, packed: !p.packed } : p,
      ),
    }))
  }
  function remove(id: string) {
    setState((prev) => ({
      ...prev,
      packing: prev.packing.filter((p) => p.id !== id),
    }))
  }
  function clearPacked() {
    setState((prev) => ({
      ...prev,
      packing: prev.packing.map((p) => ({ ...p, packed: false })),
    }))
  }

  return (
    <div>
      <SectionTitle
        title="Packing"
        subtitle={`${packed}/${packing.length} packed`}
        action={
          packed > 0 ? (
            <Button variant="subtle" onClick={clearPacked}>
              Reset
            </Button>
          ) : undefined
        }
      />

      {packing.length > 0 && (
        <div className="mb-4">
          <ProgressBar value={pct} />
        </div>
      )}

      {/* Add row */}
      <div className="mb-5 flex flex-col gap-2 sm:flex-row">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add an item…"
          list="packing-categories"
        />
        <div className="flex gap-2">
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && add()}
            placeholder="Category"
            className="sm:w-40"
            list="packing-categories"
          />
          <Button onClick={add}>Add</Button>
        </div>
        <datalist id="packing-categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      {packing.length === 0 ? (
        <EmptyState
          icon="🎒"
          title="Packing list is empty"
          hint="Add what you need to bring, grouped by category."
        />
      ) : (
        <div className="space-y-5">
          {grouped.map(([cat, items]) => {
            const catPacked = items.filter((i) => i.packed).length
            return (
              <div key={cat}>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                    {cat}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {catPacked}/{items.length}
                  </span>
                </div>
                <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="group flex items-center gap-3 px-3 py-2.5"
                    >
                      <button
                        onClick={() => toggle(item.id)}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-xs ${
                          item.packed
                            ? 'border-teal-600 bg-teal-600 text-white'
                            : 'border-slate-300'
                        }`}
                        aria-label="Toggle packed"
                      >
                        {item.packed && '✓'}
                      </button>
                      <span
                        className={`flex-1 text-sm ${
                          item.packed
                            ? 'text-slate-400 line-through'
                            : 'text-slate-800'
                        }`}
                      >
                        {item.name}
                      </span>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-slate-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
