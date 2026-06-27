import { GlobeIcon } from './icons'

/* Simplified, on-brand flag chips. Clean geometry over national accuracy —
   recognizable at a glance, no emoji. Unknown/complex flags fall back to a
   neutral globe chip. */

type Def =
  | { kind: 'v' | 'h'; bands: [string, number][] } // colored bands (weighted)
  | { kind: 'swiss' }
  | { kind: 'nordic'; field: string; cross: string }
  | { kind: 'czech' }

const W = 24
const H = 18

const FLAGS: Record<string, Def> = {
  france: { kind: 'v', bands: [['#0055A4', 1], ['#ffffff', 1], ['#EF4135', 1]] },
  italy: { kind: 'v', bands: [['#008C45', 1], ['#ffffff', 1], ['#CD212A', 1]] },
  ireland: { kind: 'v', bands: [['#169B62', 1], ['#ffffff', 1], ['#FF883E', 1]] },
  belgium: { kind: 'v', bands: [['#000000', 1], ['#FDDA24', 1], ['#EF3340', 1]] },
  portugal: { kind: 'v', bands: [['#006600', 2], ['#FF0000', 3]] },
  romania: { kind: 'v', bands: [['#002B7F', 1], ['#FCD116', 1], ['#CE1126', 1]] },
  netherlands: { kind: 'h', bands: [['#AE1C28', 1], ['#ffffff', 1], ['#21468B', 1]] },
  germany: { kind: 'h', bands: [['#000000', 1], ['#DD0000', 1], ['#FFCE00', 1]] },
  austria: { kind: 'h', bands: [['#ED2939', 1], ['#ffffff', 1], ['#ED2939', 1]] },
  spain: { kind: 'h', bands: [['#AA151B', 1], ['#F1BF00', 2], ['#AA151B', 1]] },
  hungary: { kind: 'h', bands: [['#CD2A3E', 1], ['#ffffff', 1], ['#436F4D', 1]] },
  poland: { kind: 'h', bands: [['#ffffff', 1], ['#DC143C', 1]] },
  bulgaria: { kind: 'h', bands: [['#ffffff', 1], ['#00966E', 1], ['#D62612', 1]] },
  switzerland: { kind: 'swiss' },
  denmark: { kind: 'nordic', field: '#C8102E', cross: '#ffffff' },
  sweden: { kind: 'nordic', field: '#006AA7', cross: '#FECC00' },
  norway: { kind: 'nordic', field: '#BA0C2F', cross: '#ffffff' },
  finland: { kind: 'nordic', field: '#ffffff', cross: '#003580' },
  czechia: { kind: 'czech' },
  'czech republic': { kind: 'czech' },
}

const ALIAS: Record<string, string> = {
  uk: 'united kingdom',
  england: 'united kingdom',
  'great britain': 'united kingdom',
  holland: 'netherlands',
}

function Bands({ def }: { def: Extract<Def, { kind: 'v' | 'h' }> }) {
  const total = def.bands.reduce((s, [, w]) => s + w, 0)
  const span = def.kind === 'v' ? W : H
  let pos = 0
  return (
    <>
      {def.bands.map(([color, w], i) => {
        const size = (w / total) * span
        const rect =
          def.kind === 'v' ? (
            <rect key={i} x={pos} y={0} width={size + 0.5} height={H} fill={color} />
          ) : (
            <rect key={i} x={0} y={pos} width={W} height={size + 0.5} fill={color} />
          )
        pos += size
        return rect
      })}
    </>
  )
}

export function Flag({
  country,
  size = 22,
  className = '',
}: {
  country: string
  size?: number
  className?: string
}) {
  const key = country.trim().toLowerCase()
  const def = FLAGS[ALIAS[key] ?? key]

  if (!def) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-[5px] bg-[#eef3f7] text-[#9bb0c2] ${className}`}
        style={{ width: size, height: (size * H) / W }}
      >
        <GlobeIcon size={size * 0.62} strokeWidth={2.6} />
      </span>
    )
  }

  return (
    <svg
      width={size}
      height={(size * H) / W}
      viewBox={`0 0 ${W} ${H}`}
      className={`overflow-hidden rounded-[4px] ring-1 ring-black/10 ${className}`}
      style={{ display: 'inline-block' }}
    >
      {(def.kind === 'v' || def.kind === 'h') && <Bands def={def} />}

      {def.kind === 'swiss' && (
        <>
          <rect width={W} height={H} fill="#D52B1E" />
          <rect x={10.5} y={4} width={3} height={10} fill="#fff" />
          <rect x={7} y={7.5} width={10} height={3} fill="#fff" />
        </>
      )}

      {def.kind === 'nordic' && (
        <>
          <rect width={W} height={H} fill={def.field} />
          <rect x={7} y={0} width={3} height={H} fill={def.cross} />
          <rect x={0} y={7.5} width={W} height={3} fill={def.cross} />
        </>
      )}

      {def.kind === 'czech' && (
        <>
          <rect width={W} height={H / 2} fill="#fff" />
          <rect y={H / 2} width={W} height={H / 2} fill="#D7141A" />
          <path d={`M0 0 L${W * 0.45} ${H / 2} L0 ${H} Z`} fill="#11457E" />
        </>
      )}
    </svg>
  )
}
