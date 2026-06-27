import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </div>
  )
}

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
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger' | 'subtle'
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const styles: Record<string, string> = {
    primary:
      'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm',
    subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'text-red-600 hover:bg-red-50',
  }
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  )
}

const fieldBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 placeholder:text-slate-400'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldBase} ${props.className ?? ''}`} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} className={`${fieldBase} ${props.className ?? ''}`} />
  )
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${fieldBase} ${props.className ?? ''}`}>
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
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  )
}

export function Badge({
  children,
  color = 'slate',
}: {
  children: ReactNode
  color?: 'slate' | 'teal' | 'amber' | 'red' | 'green' | 'blue' | 'purple'
}) {
  const colors: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-600',
    teal: 'bg-teal-100 text-teal-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${colors[color]}`}
    >
      {children}
    </span>
  )
}

export function EmptyState({
  icon,
  title,
  hint,
}: {
  icon: string
  title: string
  hint?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <div className="text-4xl">{icon}</div>
      <p className="mt-3 font-semibold text-slate-700">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-slate-500">{hint}</p>}
    </div>
  )
}

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function ProgressBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value))
  const color =
    pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-teal-500'
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
