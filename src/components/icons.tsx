import type { ReactNode, SVGProps } from 'react'

/* ------------------------------------------------------------------
   TravelGoat icon set — hand-built, single visual language.
   Stroke-based, 24px grid, round caps/joins, currentColor.
   ------------------------------------------------------------------ */

export type IconProps = {
  size?: number
  className?: string
  strokeWidth?: number
} & Omit<SVGProps<SVGSVGElement>, 'width' | 'height'>

function S({
  size = 24,
  strokeWidth = 2.4,
  className,
  children,
  ...rest
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  )
}

/* ---- Navigation ---- */
export const HomeIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M3.5 11.5 12 4l8.5 7.5" />
    <path d="M5.5 10v9.5h13V10" />
    <path d="M9.7 19.5v-5.2h4.6v5.2" />
  </S>
)

export const RouteIcon = (p: IconProps) => (
  <S {...p}>
    <circle cx="6" cy="6" r="2.4" />
    <circle cx="18" cy="18" r="2.4" />
    <path d="M6 8.4v3.1a4 4 0 0 0 4 4h1.5" strokeDasharray="0.1 3.4" />
    <path d="M18 15.6v-3.1a4 4 0 0 0-4-4h-1.5" strokeDasharray="0.1 3.4" />
  </S>
)

export const CoinsIcon = (p: IconProps) => (
  <S {...p}>
    <ellipse cx="12" cy="7" rx="6.5" ry="3" />
    <path d="M5.5 7v4c0 1.66 2.91 3 6.5 3s6.5-1.34 6.5-3V7" />
    <path d="M5.5 11v4c0 1.66 2.91 3 6.5 3s6.5-1.34 6.5-3v-4" />
  </S>
)

export const CompassIcon = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m15 9-1.7 4.3L9 15l1.7-4.3z" />
  </S>
)

export const BackpackIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M6 10a6 6 0 0 1 12 0v8.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.5z" />
    <path d="M9.2 8a2.8 2.8 0 0 1 5.6 0" />
    <path d="M9 13h6v3.5H9z" />
  </S>
)

export const BookIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M12 6.5C10.5 5 8 4.5 4.5 5v12c3.5-.5 6 0 7.5 1.5" />
    <path d="M12 6.5C13.5 5 16 4.5 19.5 5v12c-3.5-.5-6 0-7.5 1.5z" />
  </S>
)

export const DocIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M6 3.5h7l5 5v12H6z" />
    <path d="M13 3.5V9h5" />
    <path d="M9 13h6M9 16.5h6" />
  </S>
)

export const SlidersIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M5 8h9M18 8h1M5 16h1M10 16h9" />
    <circle cx="16" cy="8" r="2.3" />
    <circle cx="8" cy="16" r="2.3" />
  </S>
)

/* ---- Stats ---- */
export const FlameIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M12 3.5c1.2 2.4.3 4-1 5.5C9.5 10.7 8 12 8 14.5a4 4 0 0 0 8 0c0-1.7-.8-3.2-1.6-4.2-.4 1-1 1.5-1.8 1.8.8-2.3.2-5.6-0.6-8.6z" />
  </S>
)

export const GemIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M6 4h12l3 4.5-9 11-9-11z" />
    <path d="M3 8.5h18M9 4 7.5 8.5 12 19.5l4.5-11L15 4" />
  </S>
)

export const CalendarIcon = (p: IconProps) => (
  <S {...p}>
    <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
    <path d="M4 9.5h16M8.5 3.5v3M15.5 3.5v3" />
  </S>
)

/* ---- Actions ---- */
export const CheckIcon = (p: IconProps) => (
  <S {...p} strokeWidth={p.strokeWidth ?? 3}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </S>
)

export const PlusIcon = (p: IconProps) => (
  <S {...p} strokeWidth={p.strokeWidth ?? 3}>
    <path d="M12 5v14M5 12h14" />
  </S>
)

export const CloseIcon = (p: IconProps) => (
  <S {...p} strokeWidth={p.strokeWidth ?? 3}>
    <path d="M6 6l12 12M18 6 6 18" />
  </S>
)

export const TrashIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M5 7h14M9 7V5h6v2M7.5 7l.8 12.5h7.4L16.5 7" />
  </S>
)

export const ChevronRightIcon = (p: IconProps) => (
  <S {...p} strokeWidth={p.strokeWidth ?? 3}>
    <path d="m9 5 7 7-7 7" />
  </S>
)

export const LockIcon = (p: IconProps) => (
  <S {...p}>
    <rect x="5.5" y="10.5" width="13" height="9" rx="2.2" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </S>
)

export const StarIcon = (p: IconProps) => (
  <S {...p} fill="currentColor" stroke="none">
    <path d="m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.7l5.9-.9z" />
  </S>
)

export const TrophyIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M7 4.5h10v4a5 5 0 0 1-10 0z" />
    <path d="M7 6H4.5v1.5A3 3 0 0 0 7 10.4M17 6h2.5v1.5A3 3 0 0 1 17 10.4" />
    <path d="M12 13.5V17M9 20h6M9.5 20l.5-3h4l.5 3" />
  </S>
)

export const FlagIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M6 21V4" />
    <path d="M6 5h10l-1.5 3L16 11H6" fill="currentColor" stroke="none" />
    <path d="M6 5h10l-1.5 3L16 11H6" />
  </S>
)

export const GlobeIcon = (p: IconProps) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.3 2.4 14.7 0 17M12 3.5c-2.4 2.3-2.4 14.7 0 17" />
  </S>
)

export const SparkleIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M12 4c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5z" fill="currentColor" stroke="none" />
  </S>
)

export const HeartIcon = (p: IconProps) => (
  <S {...p} fill="currentColor" stroke="none">
    <path d="M12 20s-7-4.4-7-9.3A3.7 3.7 0 0 1 12 7.6 3.7 3.7 0 0 1 19 10.7C19 15.6 12 20 12 20z" />
  </S>
)

/* ---- Budget categories ---- */
export const BedIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M3.5 8v11M3.5 12h17v7M20.5 16v3" />
    <path d="M6.5 12v-2.5h5V12" />
  </S>
)

export const TrainIcon = (p: IconProps) => (
  <S {...p}>
    <rect x="6" y="4" width="12" height="13" rx="3" />
    <path d="M6 11h12M9.5 14.2h.01M14.5 14.2h.01M8 17l-2 3M16 17l2 3" />
  </S>
)

export const PlaneIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M11 3.5c.8 0 1.3.9 1.3 2.2v3.1l7 4v2l-7-2v3.6l2 1.4v1.7L11 19l-3.3.5v-1.7l2-1.4v-3.6l-7 2v-2l7-4V5.7c0-1.3.5-2.2 1.3-2.2z" fill="currentColor" stroke="none" />
  </S>
)

export const BusIcon = (p: IconProps) => (
  <S {...p}>
    <rect x="5" y="4.5" width="14" height="13" rx="2.5" />
    <path d="M5 12h14M8 17v2.5M16 17v2.5M9 14.5h.01M15 14.5h.01" />
  </S>
)

export const CarIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M4 14.5 5.5 10A2.5 2.5 0 0 1 8 8.2h8a2.5 2.5 0 0 1 2.5 1.8L20 14.5v3.5h-2.5v-2H6.5v2H4z" />
    <path d="M7 17.5h.01M17 17.5h.01" />
  </S>
)

export const FerryIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M4 15l1.5-4.5h13L20 15" />
    <path d="M3.5 15c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4-0.6" />
    <path d="M12 4v3M9 10.5V8h6v2.5" />
  </S>
)

export const WalkIcon = (p: IconProps) => (
  <S {...p}>
    <circle cx="13" cy="5" r="1.8" />
    <path d="M13 8.5 10.5 12l2.5 2 1 5.5M13 14l-3.5 5.5M13 10l3.5 1.5" />
  </S>
)

export const ArrowIcon = (p: IconProps) => (
  <S {...p} strokeWidth={p.strokeWidth ?? 3}>
    <path d="M4 12h15M14 7l5 5-5 5" />
  </S>
)

export const ForkKnifeIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M8 4v16M6 4v4a2 2 0 0 0 4 0V4M16 4c-1.5 0-2.5 2-2.5 4.5S15 13 16 13v7" />
  </S>
)

export const TicketIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M4 7.5h16v3a1.5 1.5 0 0 0 0 3v3H4v-3a1.5 1.5 0 0 0 0-3z" />
    <path d="M14 7.5v9" strokeDasharray="0.1 3" />
  </S>
)

export const BagIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M6 8h12l-1 11.5H7z" />
    <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
  </S>
)

export const ReceiptIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M6 3.5v17l2-1.3 2 1.3 2-1.3 2 1.3 2-1.3 2 1.3v-17z" />
    <path d="M9 8h6M9 11.5h6" />
  </S>
)

/* ---- Places categories ---- */
export const LandmarkIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M4 9.5 12 5l8 4.5M5 9.5h14M6.5 9.5v8M10 9.5v8M14 9.5v8M17.5 9.5v8M4 20h16" />
  </S>
)

export const TreeIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M12 3.5 7 11h2.5L6 16h5v4h2v-4h5l-3.5-5H17z" />
  </S>
)

export const PinIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M12 21s6-5.3 6-10a6 6 0 0 0-12 0c0 4.7 6 10 6 10z" />
    <circle cx="12" cy="11" r="2.3" />
  </S>
)

/* ---- Docs categories ---- */
export const PassportIcon = (p: IconProps) => (
  <S {...p}>
    <rect x="5" y="3.5" width="14" height="17" rx="2.2" />
    <circle cx="12" cy="10" r="3" />
    <path d="M9.5 17h5" />
  </S>
)

export const ShieldIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M12 3.5 6 6v5c0 4 2.6 7 6 9.5 3.4-2.5 6-5.5 6-9.5V6z" />
    <path d="m9.5 11.5 1.8 1.8 3.2-3.6" />
  </S>
)

/* generic small icon used as fallback chip */
export const MapIcon = (p: IconProps) => (
  <S {...p}>
    <path d="M9 4.5 4 6.5v13l5-2 6 2 5-2v-13l-5 2-6-2z" />
    <path d="M9 4.5v13M15 6.5v13" />
  </S>
)
