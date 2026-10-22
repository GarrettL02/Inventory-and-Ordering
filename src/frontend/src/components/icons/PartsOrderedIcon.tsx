export function PartsOrderedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {/* box outline */}
      <path d="M12 3 L19 7 L19 14 L12 18 L5 14 L5 7 Z" />

      {/* inner fold lines */}
      <path d="M5 7 L12 11 L19 7" />
      <path d="M12 11 L12 18" />

      {/* checkmark badge */}
      <circle cx="18" cy="20" r="5" />
      <path d="M15.5 19 L17.3 20.8 L20.5 16.8" />
    </svg>
  );
}
