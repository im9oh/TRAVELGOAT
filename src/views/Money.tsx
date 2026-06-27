import { useState } from 'react'
import Savings from './Savings'
import Budget from './Budget'

type Mode = 'savings' | 'spending'

export default function Money({ initial = 'savings' as Mode }: { initial?: Mode }) {
  const [mode, setMode] = useState<Mode>(initial)

  return (
    <div>
      {/* segmented control */}
      <div className="mb-5 flex rounded-2xl border-2 border-[#eee] bg-[#f3f5f7] p-1">
        {(['savings', 'spending'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-xl py-2.5 text-sm font-extrabold uppercase tracking-wide transition ${
              mode === m ? 'bg-white text-[#1cb0f6] shadow-[0_2px_0_#e1e6ea]' : 'text-[#9bb0c2]'
            }`}
          >
            {m === 'savings' ? 'Savings' : 'Spending'}
          </button>
        ))}
      </div>

      {mode === 'savings' ? <Savings /> : <Budget />}
    </div>
  )
}
