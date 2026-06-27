import { useRef, useState } from 'react'
import { useStore } from '../store'
import { Card, SectionTitle, Button, Field, Input, Select } from '../components/ui'
import { CURRENCIES } from '../lib/format'
import { computeXp, levelFromXp } from '../lib/game'

export default function Settings() {
  const { state, setState, resetAll, exportData, importData } = useStore()
  const { trip, game } = state
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const xp = computeXp(state)
  const lvl = levelFromXp(xp)

  function patchTrip(patch: Partial<typeof trip>) {
    setState((prev) => ({ ...prev, trip: { ...prev.trip, ...patch } }))
  }
  function onImportFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const ok = importData(String(reader.result))
      setMsg(ok ? 'Data imported ✓' : 'Import failed — invalid file.')
      setTimeout(() => setMsg(null), 3000)
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-5">
      <SectionTitle title="Settings" subtitle="Trip details & your data" />

      {/* Player stats */}
      <Card className="bg-gradient-to-b from-[#eef9ff] to-white">
        <div className="grid grid-cols-3 divide-x-2 divide-[#eee] text-center">
          <div>
            <div className="text-2xl font-black text-[#1cb0f6]">{lvl.level}</div>
            <div className="text-[10px] font-extrabold uppercase text-[#afafaf]">Level</div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#ffc800]">{xp}</div>
            <div className="text-[10px] font-extrabold uppercase text-[#afafaf]">XP</div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#ff9600]">{game.bestStreak}</div>
            <div className="text-[10px] font-extrabold uppercase text-[#afafaf]">Best streak</div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-extrabold text-[#3c3c3c]">Trip</h3>
        <div className="space-y-3">
          <Field label="Trip name">
            <Input value={trip.name} onChange={(e) => patchTrip({ name: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <Input type="date" value={trip.startDate} onChange={(e) => patchTrip({ startDate: e.target.value })} />
            </Field>
            <Field label="End date">
              <Input type="date" value={trip.endDate} onChange={(e) => patchTrip({ endDate: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Home currency">
              <Select value={trip.homeCurrency} onChange={(e) => patchTrip({ homeCurrency: e.target.value })}>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Total budget">
              <Input
                type="number"
                inputMode="decimal"
                value={trip.totalBudget || ''}
                onChange={(e) => patchTrip({ totalBudget: parseFloat(e.target.value) || 0 })}
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-1 font-extrabold text-[#3c3c3c]">Your data</h3>
        <p className="mb-3 text-sm font-bold text-[#afafaf]">
          Everything lives in this browser only. Export a backup or move it to another device.
        </p>
        {msg && (
          <div className="mb-3 rounded-xl bg-[#d7ffb8] px-3 py-2 text-sm font-extrabold text-[#58a700]">
            {msg}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button variant="white" onClick={exportData}>⬇ Export</Button>
          <Button variant="white" onClick={() => fileRef.current?.click()}>⬆ Import</Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onImportFile(f)
              e.target.value = ''
            }}
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-1 font-extrabold text-[#ff4b4b]">Danger zone</h3>
        <p className="mb-3 text-sm font-bold text-[#afafaf]">
          Reset wipes all your data and restores the sample trip.
        </p>
        <Button
          variant="red"
          onClick={() => {
            if (confirm('Reset all data? This cannot be undone (export a backup first).')) {
              resetAll()
              setMsg('Data reset to sample trip.')
              setTimeout(() => setMsg(null), 3000)
            }
          }}
        >
          Reset all data
        </Button>
      </Card>

      <p className="pb-4 text-center text-xs font-bold text-[#cfcfcf]">
        TravelGoat 🐐 · made for {trip.name}
      </p>
    </div>
  )
}
