export function AccountIcon({ size = 24 }: { size?: number } = {}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />

      <circle cx="12" cy="9" r="3" />

      <path d="M6.5 19c.8-3 2.8-4.5 5.5-4.5s4.7 1.5 5.5 4.5" />
    </svg>
  );
}
