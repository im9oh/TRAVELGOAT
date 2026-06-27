import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { useReward } from '../components/toast'
import type { PackingItem } from '../types'
import { Card, SectionTitle, Button, Input, ProgressRing, EmptyState } from '../components/ui'
import { BackpackIcon, CheckIcon, CloseIcon, PlusIcon } from '../components/icons'
import { uid } from '../lib/format'

export default function Packing() {
  const { state, setState } = useStore()
  const { reward, cheer, celebrate } = useReward()
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

  const categories = useMemo(() => [...new Set(packing.map((p) => p.category))].sort(), [packing])

  const packed = packing.filter((p) => p.packed).length
  const pct = packing.length > 0 ? (packed / packing.length) * 100 : 0

  function add() {
    const trimmed = name.trim()
    if (!trimmed) return
    setState((prev) => ({
      ...prev,
      packing: [...prev.packing, { id: uid(), name: trimmed, category: category.trim() || 'Other', packed: false }],
    }))
    setName('')
  }
  function toggle(item: PackingItem) {
    const willPack = !item.packed
    const willAllBePacked = willPack && packed + 1 === packing.length
    setState((prev) => ({
      ...prev,
      packing: prev.packing.map((p) => (p.id === item.id ? { ...p, packed: willPack } : p)),
    }))
    if (willPack) reward(10, <BackpackIcon size={18} />)
    if (willAllBePacked) {
      cheer('All packed! Bon voyage!', <BackpackIcon size={18} />)
      celebrate()
    }
  }
  function remove(id: string) {
    setState((prev) => ({ ...prev, packing: prev.packing.filter((p) => p.id !== id) }))
  }
  function clearPacked() {
    setState((prev) => ({ ...prev, packing: prev.packing.map((p) => ({ ...p, packed: false })) }))
  }

  return (
    <div>
      <SectionTitle
        title="Packing"
        subtitle="Check it off, earn XP"
        action={packed > 0 ? <Button size="sm" variant="white" onClick={clearPacked}>Reset</Button> : undefined}
      />

      {packing.length > 0 && (
        <Card className="mb-5 flex items-center gap-5 bg-gradient-to-b from-[#f3fff0] to-white">
          <ProgressRing value={pct} size={108} stroke={13} color="#58cc02">
            <span className="text-xl font-black text-[#3c3c3c]">{packed}/{packing.length}</span>
            <span className="text-[10px] font-extrabold uppercase text-[#afafaf]">packed</span>
          </ProgressRing>
          <div className="flex-1">
            <div className="text-lg font-extrabold text-[#3c3c3c]">
              {pct >= 100 ? 'Ready to go!' : `${packing.length - packed} to pack`}
            </div>
            <p className="text-sm font-bold text-[#afafaf]">Every item is 10 XP.</p>
          </div>
        </Card>
      )}

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
          <Button variant="green" onClick={add}>
            <PlusIcon size={16} /> Add
          </Button>
        </div>
        <datalist id="packing-categories">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      {packing.length === 0 ? (
        <EmptyState
          icon={<BackpackIcon size={48} strokeWidth={2} />}
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
                  <h3 className="text-sm font-extrabold uppercase tracking-wide text-[#afafaf]">{cat}</h3>
                  <span className="text-xs font-extrabold text-[#cfcfcf]">{catPacked}/{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="tg-card group flex items-center gap-3 !rounded-2xl px-3 py-2.5">
                      <button
                        onClick={() => toggle(item)}
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${
                          item.packed
                            ? 'bg-[#58cc02] text-white shadow-[0_2px_0_#58a700]'
                            : 'border-2 border-[#e5e5e5] text-transparent'
                        }`}
                        aria-label="Toggle packed"
                      >
                        <CheckIcon size={16} strokeWidth={3.4} />
                      </button>
                      <span className={`flex-1 font-bold ${item.packed ? 'text-[#cfcfcf] line-through' : 'text-[#3c3c3c]'}`}>
                        {item.name}
                      </span>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-[#d5d5d5] opacity-0 transition hover:text-[#ff4b4b] group-hover:opacity-100"
                        aria-label="Remove"
                      >
                        <CloseIcon size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
