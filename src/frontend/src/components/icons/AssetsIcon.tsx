export function AssetsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Control board */}
      <rect x="3" y="4" width="18" height="16" rx="2" />

      {/* Mounting holes */}
      <circle cx="6" cy="7" r=".7" />
      <circle cx="18" cy="17" r=".7" />

      {/* Central processor */}
      <rect x="8" y="8" width="8" height="8" rx="1" />

      {/* Chip pins */}
      <path
        d="
        M10 6v2 M14 6v2
        M10 16v2 M14 16v2
        M6 10h2 M6 14h2
        M16 10h2 M16 14h2
      "
      />

      {/* Circuit traces */}
      <path d="M4 11h2 M18 11h2" />
    </svg>
  );
}
