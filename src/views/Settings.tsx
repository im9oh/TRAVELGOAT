import { useRef, useState } from 'react'
import { useStore } from '../store'
import {
  Card,
  SectionTitle,
  Button,
  Field,
  Input,
  Select,
} from '../components/ui'
import { CURRENCIES } from '../lib/format'

export default function Settings() {
  const { state, setState, resetAll, exportData, importData } = useStore()
  const { trip } = state
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)

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

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Trip</h3>
        <div className="space-y-3">
          <Field label="Trip name">
            <Input
              value={trip.name}
              onChange={(e) => patchTrip({ name: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <Input
                type="date"
                value={trip.startDate}
                onChange={(e) => patchTrip({ startDate: e.target.value })}
              />
            </Field>
            <Field label="End date">
              <Input
                type="date"
                value={trip.endDate}
                onChange={(e) => patchTrip({ endDate: e.target.value })}
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Home currency">
              <Select
                value={trip.homeCurrency}
                onChange={(e) => patchTrip({ homeCurrency: e.target.value })}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Total budget">
              <Input
                type="number"
                inputMode="decimal"
                value={trip.totalBudget || ''}
                onChange={(e) =>
                  patchTrip({ totalBudget: parseFloat(e.target.value) || 0 })
                }
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-1 font-bold text-slate-900">Your data</h3>
        <p className="mb-3 text-sm text-slate-500">
          Everything lives in this browser only. Export a backup, or move it to
          another device.
        </p>
        {msg && (
          <div className="mb-3 rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700">
            {msg}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <Button variant="subtle" onClick={exportData}>
            ⬇ Export backup
          </Button>
          <Button variant="subtle" onClick={() => fileRef.current?.click()}>
            ⬆ Import backup
          </Button>
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
        <h3 className="mb-1 font-bold text-red-600">Danger zone</h3>
        <p className="mb-3 text-sm text-slate-500">
          Reset wipes all your data and restores the sample itinerary.
        </p>
        <Button
          variant="danger"
          onClick={() => {
            if (
              confirm(
                'Reset all data? This cannot be undone (export a backup first).',
              )
            ) {
              resetAll()
              setMsg('Data reset to sample trip.')
              setTimeout(() => setMsg(null), 3000)
            }
          }}
        >
          Reset all data
        </Button>
      </Card>

      <p className="pb-4 text-center text-xs text-slate-400">
        TravelGoat 🐐 · made for {trip.name}
      </p>
    </div>
  )
}
