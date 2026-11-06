interface LogoProps {
  className?: string;
  /** Use on dark backgrounds (header, footer). */
  inverse?: boolean;
  showWordmark?: boolean;
}

/**
 * MachineFanatic mark: a gear with a tachometer needle, plus a two-tone
 * "Machine" / "Fanatic" wordmark. Pure SVG.
 */
export function Logo({ className, inverse = false, showWordmark = true }: LogoProps) {
  const ink = inverse ? "#F4F4F1" : "#16191D";
  const orange = "#E8590C";
  const teeth = Array.from({ length: 8 }, (_, i) => i * 45);

  return (
    <svg
      viewBox={showWordmark ? "0 0 212 36" : "0 0 36 36"}
      className={className}
      role="img"
      aria-label="MachineFanatic"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(18 18)">
        {teeth.map((deg) => (
          <rect key={deg} x="-3" y="-17" width="6" height="6" rx="1.2" fill={orange} transform={`rotate(${deg})`} />
        ))}
        <circle r="12.5" fill={orange} />
        <circle r="8.5" fill={inverse ? "#16191D" : "#FFFFFF"} />
        <path d="M0 0 L5.5 -4.5" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
        <circle r="2" fill={ink} />
      </g>
      {showWordmark && (
        <text x="44" y="25" fontFamily="Space Grotesk, system-ui, sans-serif" fontWeight="700" fontSize="20" letterSpacing="-0.02em">
          <tspan fill={ink}>Machine</tspan>
          <tspan fill={orange}>Fanatic</tspan>
        </text>
      )}
    </svg>
  );
}
