/* TravelGoat mascot — a friendly vector goat in an explorer cap.
   Pure SVG so it stays crisp at any size; idle blink via CSS. */

export function Goat({
  size = 96,
  className = '',
  blink = true,
}: {
  size?: number
  className?: string
  blink?: boolean
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-label="TravelGoat mascot"
      role="img"
    >
      {/* ears */}
      <g fill="#EADBC2">
        <ellipse cx="20" cy="52" rx="9" ry="6" transform="rotate(-25 20 52)" />
        <ellipse cx="80" cy="52" rx="9" ry="6" transform="rotate(25 80 52)" />
      </g>
      <g fill="#F6EFE2">
        <ellipse cx="22" cy="51" rx="6" ry="3.6" transform="rotate(-25 22 51)" />
        <ellipse cx="78" cy="51" rx="6" ry="3.6" transform="rotate(25 78 51)" />
      </g>

      {/* horns */}
      <g stroke="#C9A87C" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M37 33C31 26 30 21 31 16" />
        <path d="M63 33C69 26 70 21 69 16" />
      </g>
      <g stroke="#E0C49A" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M36 31C31 25 30.5 21 31.5 17.5" />
        <path d="M64 31C69 25 69.5 21 68.5 17.5" />
      </g>

      {/* head */}
      <ellipse cx="50" cy="57" rx="30" ry="28" fill="#F6EFE2" />
      <ellipse cx="50" cy="59" rx="30" ry="26" fill="#F6EFE2" />

      {/* muzzle */}
      <ellipse cx="50" cy="69" rx="15" ry="11" fill="#FBF7F0" />

      {/* cheeks */}
      <ellipse cx="33" cy="65" rx="5" ry="3.4" fill="#FFC2B0" opacity="0.85" />
      <ellipse cx="67" cy="65" rx="5" ry="3.4" fill="#FFC2B0" opacity="0.85" />

      {/* nose + mouth */}
      <ellipse cx="50" cy="65" rx="4.4" ry="3.2" fill="#7A6450" />
      <path
        d="M50 68.5v3.5M50 72c-2.6 0-4-1.4-4.6-2.6M50 72c2.6 0 4-1.4 4.6-2.6"
        stroke="#9A8772"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* eyes */}
      <g>
        <ellipse cx="40" cy="54" rx="5" ry="6" fill="#4B4B4B" />
        <ellipse cx="60" cy="54" rx="5" ry="6" fill="#4B4B4B" />
        <circle cx="41.6" cy="51.6" r="1.7" fill="#fff" />
        <circle cx="61.6" cy="51.6" r="1.7" fill="#fff" />
        {/* eyelids (blink) */}
        {blink && (
          <g className="goat-blink" fill="#F6EFE2">
            <rect x="34.6" y="46.5" width="11" height="8" rx="4" />
            <rect x="54.6" y="46.5" width="11" height="8" rx="4" />
          </g>
        )}
      </g>

      {/* goatee */}
      <path d="M50 79c-2 3-1 6 0 8 1-2 2-5 0-8z" fill="#EADBC2" />

      {/* explorer cap */}
      <g>
        {/* brim */}
        <ellipse cx="50" cy="34" rx="34" ry="7.5" fill="#46A302" />
        <ellipse cx="50" cy="32.5" rx="34" ry="7.5" fill="#58CC02" />
        {/* dome */}
        <path d="M27 33C28 18 38 11 50 11s22 7 23 22z" fill="#58CC02" />
        <path d="M27 33C28 18 38 11 50 11s22 7 23 22z" fill="#58CC02" />
        {/* band */}
        <path d="M28 30.5c6 2.5 38 2.5 44 0l-1 4c-6 2.3-36 2.3-42 0z" fill="#46A302" />
        {/* button */}
        <circle cx="50" cy="13.5" r="2.4" fill="#46A302" />
      </g>
    </svg>
  )
}
