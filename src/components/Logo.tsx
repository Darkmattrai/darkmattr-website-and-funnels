export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <circle cx="16" cy="16" r="5" fill="currentColor" />
      <ellipse cx="16" cy="16" rx="14.5" ry="6" stroke="currentColor" strokeWidth="1.4" transform="rotate(-28 16 16)" />
      <circle cx="28.4" cy="9.6" r="1.8" fill="#ff5b2e" />
    </svg>
  );
}
