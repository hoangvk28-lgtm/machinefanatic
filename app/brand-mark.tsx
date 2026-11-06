// Shared MachineFanatic gear mark for icon / apple-icon / opengraph-image (ImageResponse JSX).
export function GearMark({ size, ink = "#16191D" }: { size: number; ink?: string }) {
  const teeth = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg width={size} height={size} viewBox="-18 -18 36 36" xmlns="http://www.w3.org/2000/svg">
      {teeth.map((d) => (
        <rect key={d} x="-3" y="-17.5" width="6" height="7" rx="1.2" fill="#E8590C" transform={`rotate(${d})`} />
      ))}
      <circle r="12.5" fill="#E8590C" />
      <circle r="8.5" fill="#FFFFFF" />
      <path d="M0 0 L5.5 -4.5" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
      <circle r="2" fill={ink} />
    </svg>
  );
}
