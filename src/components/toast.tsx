import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'

interface Toast {
  id: number
  text: string
  emoji: string
}

interface RewardContextValue {
  /** Show a floating reward pill, e.g. reward(10, '🎒') */
  reward: (xp: number, emoji?: string) => void
  /** Show a custom message pill */
  cheer: (text: string, emoji?: string) => void
  /** Fire a confetti burst */
  celebrate: () => void
}

const RewardContext = createContext<RewardContextValue | null>(null)

const CONFETTI_COLORS = [
  '#58cc02',
  '#1cb0f6',
  '#ffc800',
  '#ff4b4b',
  '#ce82ff',
  '#ff9600',
]

export function RewardProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [confetti, setConfetti] = useState<number[]>([])
  const idRef = useRef(0)

  const push = useCallback((text: string, emoji: string) => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, text, emoji }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 2400)
  }, [])

  const celebrate = useCallback(() => {
    const burst = Array.from({ length: 80 }, (_, i) => i)
    setConfetti(burst)
    setTimeout(() => setConfetti([]), 3200)
  }, [])

  const value: RewardContextValue = {
    reward: (xp, emoji = '⭐') => push(`+${xp} XP`, emoji),
    cheer: (text, emoji = '🎉') => push(text, emoji),
    celebrate,
  }

  return (
    <RewardContext.Provider value={value}>
      {children}

      {/* Floating reward pills */}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-[70] flex flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="tg-toast flex items-center gap-2 rounded-full bg-[#3c3c3c] px-4 py-2 text-base font-extrabold text-white shadow-lg"
          >
            <span className="text-xl">{t.emoji}</span>
            {t.text}
          </div>
        ))}
      </div>

      {/* Confetti */}
      {confetti.map((i) => {
        const left = (i * 37) % 100
        const delay = (i % 10) * 0.08
        const dur = 2 + ((i * 13) % 12) / 10
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
        return (
          <span
            key={i}
            className="tg-confetti"
            style={{
              left: `${left}%`,
              background: color,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              borderRadius: i % 2 ? '50%' : '3px',
            }}
          />
        )
      })}
    </RewardContext.Provider>
  )
}

export function useReward(): RewardContextValue {
  const ctx = useContext(RewardContext)
  if (!ctx) throw new Error('useReward must be used within RewardProvider')
  return ctx
}
