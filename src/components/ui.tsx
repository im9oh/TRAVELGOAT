import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { Goat } from './Goat'
import { CloseIcon, ChevronRightIcon } from './icons'

/* ---------------- Button ---------------- */
type Variant =
  | 'green'
  | 'blue'
  | 'gold'
  | 'red'
  | 'purple'
  | 'white'
  | 'ghost'
  // legacy aliases
  | 'primary'
  | 'subtle'
  | 'danger'

const VARIANT_CLASS: Record<Variant, string> = {
  green: 'tg-btn--green',
  blue: 'tg-btn--blue',
  gold: 'tg-btn--gold',
  red: 'tg-btn--red',
  purple: 'tg-btn--purple',
  white: 'tg-btn--white',
  ghost: 'tg-btn--ghost',
  primary: 'tg-btn--green',
  subtle: 'tg-btn--white',
  danger: 'tg-btn--red',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
}

export function Button({
  variant = 'green',
  size = 'md',
  block = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`tg-btn ${VARIANT_CLASS[variant]} ${
        size === 'sm' ? 'tg-btn--sm' : size === 'lg' ? 'tg-btn--lg' : ''
      } ${block ? 'tg-btn--block' : ''} ${className}`}
      {...props}
    />
  )
}

/* ---------------- Card ---------------- */
export function Card({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`tg-card p-4 sm:p-5 ${onClick ? 'cursor-pointer active:translate-y-0.5 transition' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

/* ---------------- Unit banner (Duolingo section header) ---------------- */
type BannerColor = 'green' | 'blue' | 'gold' | 'purple' | 'red'
const BANNER: Record<BannerColor, [string, string]> = {
  green: ['#58cc02', '#46a302'],
  blue: ['#1cb0f6', '#1899d6'],
  gold: ['#ffc800', '#e6a700'],
  purple: ['#ce82ff', '#a568cc'],
  red: ['#ff4b4b', '#e63946'],
}

export function UnitBanner({
  eyebrow,
  title,
  color = 'green',
  action,
}: {
  eyebrow?: string
  title: string
  color?: BannerColor
  action?: ReactNode
}) {
  const [bg, edge] = BANNER[color]
  return (
    <div
      className="flex items-center justify-between rounded-2xl px-4 py-3 text-white"
      style={{ background: bg, boxShadow: `0 4px 0 ${edge}` }}
    >
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/80">
            {eyebrow}
          </div>
        )}
        <div className="truncate text-lg font-extrabold leading-tight">{title}</div>
      </div>
      {action}
    </div>
  )
}

/* ---------------- List row ---------------- */
export function ListRow({
  icon,
  iconBg = '#eef1f4',
  iconFg = '#8a97a3',
  title,
  subtitle,
  right,
  onClick,
}: {
  icon: ReactNode
  iconBg?: string
  iconFg?: string
  title: string
  subtitle?: string
  right?: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border-2 border-[#eee] border-b-[3px] bg-white px-3 py-3 text-left transition active:translate-y-0.5"
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: iconBg, color: iconFg }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-extrabold text-[#3c3c3c]">{title}</div>
        {subtitle && <div className="truncate text-xs font-bold text-[#afafaf]">{subtitle}</div>}
      </div>
      {right ?? <ChevronRightIcon size={18} className="text-[#cbd3da]" />}
    </button>
  )
}

/* ---------------- Section title ---------------- */
export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-extrabold text-[#3c3c3c]">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-sm font-bold text-[#afafaf]">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}

/* ---------------- Form fields ---------------- */
export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`tg-input ${props.className ?? ''}`} />
}
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`tg-input ${props.className ?? ''}`} />
}
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`tg-input ${props.className ?? ''}`}>
      {props.children}
    </select>
  )
}
export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-[#afafaf]">
        {label}
      </span>
      {children}
    </label>
  )
}

/* ---------------- Badge ---------------- */
type BadgeColor = 'slate' | 'teal' | 'amber' | 'red' | 'green' | 'blue' | 'purple' | 'gold'
export function Badge({
  children,
  color = 'slate',
}: {
  children: ReactNode
  color?: BadgeColor
}) {
  const colors: Record<BadgeColor, string> = {
    slate: 'bg-[#f0f0f0] text-[#777]',
    teal: 'bg-[#ddf4ff] text-[#1899d6]',
    blue: 'bg-[#ddf4ff] text-[#1899d6]',
    green: 'bg-[#d7ffb8] text-[#58a700]',
    amber: 'bg-[#fff4d6] text-[#e6a700]',
    gold: 'bg-[#fff4d6] text-[#e6a700]',
    red: 'bg-[#ffdfe0] text-[#e63946]',
    purple: 'bg-[#f3e6ff] text-[#a568cc]',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide ${colors[color]}`}
    >
      {children}
    </span>
  )
}

/* ---------------- Progress bar ---------------- */
export function ProgressBar({
  value,
  color = 'green',
  className = '',
}: {
  value: number
  color?: 'green' | 'blue' | 'gold' | 'red'
  className?: string
}) {
  const pct = Math.min(100, Math.max(0, value))
  const bar: Record<string, string> = {
    green: 'bg-[#58cc02]',
    blue: 'bg-[#1cb0f6]',
    gold: 'bg-[#ffc800]',
    red: 'bg-[#ff4b4b]',
  }
  return (
    <div
      className={`h-4 w-full overflow-hidden rounded-full bg-[#e5e5e5] ${className}`}
    >
      <div
        className={`relative h-full rounded-full transition-all duration-500 ${bar[color]}`}
        style={{ width: `${pct}%` }}
      >
        {pct > 8 && (
          <span className="absolute inset-x-1 top-[3px] h-[3px] rounded-full bg-white/40" />
        )}
      </div>
    </div>
  )
}

/* ---------------- Progress ring ---------------- */
export function ProgressRing({
  value,
  size = 120,
  stroke = 12,
  color = '#58cc02',
  track = '#e5e5e5',
  children,
}: {
  value: number
  size?: number
  stroke?: number
  color?: string
  track?: string
  children?: ReactNode
}) {
  const pct = Math.min(100, Math.max(0, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={track}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  )
}

/* ---------------- Stat pill (top bar) ---------------- */
export function StatPill({
  icon,
  value,
  color = '#ff9600',
}: {
  icon: string
  value: ReactNode
  color?: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-lg font-extrabold" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

/* ---------------- Mascot + speech bubble ---------------- */
export function Mascot({
  size = 72,
  bob = false,
  className = '',
}: {
  size?: number
  bob?: boolean
  className?: string
}) {
  return (
    <div className={`shrink-0 ${bob ? 'tg-bob' : ''} ${className}`}>
      <Goat size={size} />
    </div>
  )
}

export function SpeechBubble({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-2xl border-2 border-[#e5e5e5] bg-white px-4 py-3 text-[15px] font-bold leading-snug text-[#4b4b4b]">
      <span className="absolute -left-2 top-5 h-4 w-4 rotate-45 border-b-2 border-l-2 border-[#e5e5e5] bg-white" />
      {children}
    </div>
  )
}

/* ---------------- Empty state ---------------- */
export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: ReactNode
  title: string
  hint?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#e5e5e5] bg-white px-6 py-12 text-center">
      <div className="text-[#cdd5dc]">{icon}</div>
      <p className="mt-3 text-lg font-extrabold text-[#4b4b4b]">{title}</p>
      {hint && (
        <p className="mt-1 max-w-xs text-sm font-bold text-[#afafaf]">{hint}</p>
      )}
    </div>
  )
}

/* ---------------- Modal (bottom sheet on mobile) ---------------- */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#3c3c3c]/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="tg-rise max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-[#3c3c3c]">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#afafaf] hover:bg-[#f0f0f0]"
            aria-label="Close"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
