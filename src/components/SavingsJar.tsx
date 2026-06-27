import { useEffect, useRef, useState } from 'react'

/* A big animated savings jar that fills with gold as you save.
   Continuous waves + bubbles + glass shine make it alive; a coin drops
   in whenever `dropKey` changes (i.e. on a new deposit). */

function Coin({ size = 26, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #ffe9a3 0%, #ffcf3f 45%, #f4a800 100%)',
        boxShadow: 'inset 0 -2px 3px rgba(180,120,0,0.5), inset 0 2px 2px rgba(255,255,255,0.6)',
        border: '2px solid #e8a200',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#b5760a',
        fontWeight: 900,
        fontSize: size * 0.5,
      }}
    >
      $
    </div>
  )
}

const WAVE_PATH =
  'M0 12 Q 25 2 50 12 T 100 12 T 150 12 T 200 12 V40 H0 Z'

export function SavingsJar({
  pct,
  size = 250,
  dropKey = 0,
}: {
  pct: number
  size?: number
  dropKey?: number
}) {
  const clamped = Math.min(100, Math.max(0, pct))
  const width = Math.round(size * 0.78)
  const glassTop = Math.round(size * 0.16) // below the lid/neck
  const glassH = size - glassTop
  const fillH = (clamped / 100) * glassH
  const landPx = Math.max(6, glassH - fillH - 16)

  const [drop, setDrop] = useState<number | null>(null)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setDrop(dropKey)
    const t = setTimeout(() => setDrop(null), 1000)
    return () => clearTimeout(t)
  }, [dropKey])

  return (
    <div style={{ width, height: size, position: 'relative' }}>
      {/* lid */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: width * 0.72,
          height: glassTop * 0.7,
          borderRadius: 12,
          background: 'linear-gradient(#cfd8df,#aab6bf)',
          boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.12)',
          zIndex: 4,
        }}
      />
      {/* neck band */}
      <div
        style={{
          position: 'absolute',
          top: glassTop * 0.62,
          left: '50%',
          transform: 'translateX(-50%)',
          width: width * 0.92,
          height: glassTop * 0.5,
          borderRadius: 8,
          background: 'linear-gradient(#e9eef1,#d2dbe1)',
          zIndex: 3,
        }}
      />

      {/* glass interior (clips the fill) */}
      <div
        style={{
          position: 'absolute',
          top: glassTop,
          left: 0,
          width: '100%',
          height: glassH,
          borderRadius: '14px 14px 46px 46px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(225,240,250,0.55), rgba(210,232,245,0.35))',
        }}
      >
        {/* fill */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: `${clamped}%`,
            background: 'linear-gradient(180deg,#ffd757 0%,#ffc12e 55%,#ffa600 100%)',
            transition: 'height 0.9s cubic-bezier(0.34,1.4,0.5,1)',
          }}
        >
          {/* waves on the surface */}
          {clamped > 1 && clamped < 99.5 && (
            <>
              <svg
                className="jar-wave-a"
                viewBox="0 0 200 40"
                preserveAspectRatio="none"
                style={{ position: 'absolute', top: -11, left: 0, width: '200%', height: 22, opacity: 0.55 }}
              >
                <path d={WAVE_PATH} fill="#ffe27a" />
              </svg>
              <svg
                className="jar-wave-b"
                viewBox="0 0 200 40"
                preserveAspectRatio="none"
                style={{ position: 'absolute', top: -8, left: 0, width: '200%', height: 22 }}
              >
                <path d={WAVE_PATH} fill="#ffd757" />
              </svg>
            </>
          )}

          {/* bubbles */}
          {[12, 30, 50, 68, 85].map((leftPct, i) => (
            <span
              key={i}
              className="jar-bubble"
              style={{
                position: 'absolute',
                bottom: 6,
                left: `${leftPct}%`,
                width: 6 + (i % 3) * 3,
                height: 6 + (i % 3) * 3,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.6)',
                ['--dur' as string]: `${3 + (i % 4) * 0.7}s`,
                ['--delay' as string]: `${i * 0.6}s`,
              }}
            />
          ))}

          {/* resting coins */}
          <div style={{ position: 'absolute', bottom: 8, left: 0, width: '100%', display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Coin size={width * 0.16} />
            <Coin size={width * 0.2} />
            <Coin size={width * 0.16} />
          </div>
          <span
            className="coin-glint"
            style={{ position: 'absolute', top: '18%', left: '22%', width: 10, height: 10, borderRadius: '50%', background: '#fff' }}
          />
        </div>

        {/* glass shine sweep */}
        <div
          className="jar-shine"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '35%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* glass outline */}
      <div
        style={{
          position: 'absolute',
          top: glassTop,
          left: 0,
          width: '100%',
          height: glassH,
          borderRadius: '14px 14px 46px 46px',
          border: '3px solid rgba(150,180,200,0.5)',
          borderTop: '3px solid rgba(150,180,200,0.35)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />
      {/* left highlight */}
      <div
        style={{
          position: 'absolute',
          top: glassTop + 12,
          left: 12,
          width: 8,
          height: glassH * 0.55,
          borderRadius: 8,
          background: 'rgba(255,255,255,0.45)',
          pointerEvents: 'none',
          zIndex: 6,
        }}
      />

      {/* dropping coin */}
      {drop !== null && (
        <div
          key={drop}
          className="coin-fall"
          style={{ position: 'absolute', top: glassTop, left: '50%', zIndex: 7, ['--land' as string]: `${landPx}px` }}
        >
          <Coin size={width * 0.2} />
        </div>
      )}
    </div>
  )
}
