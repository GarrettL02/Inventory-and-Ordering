export interface KebabIconProps {
  onClick: () => void;
}

export function KebabIcon({ onClick }: KebabIconProps) {
  return (
    <div onClick={onClick}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="5" r="2" fill="#ffffffff" />
        <circle cx="12" cy="12" r="2" fill="#ffffffff" />
        <circle cx="12" cy="19" r="2" fill="#ffffffff" />
      </svg>
    </div>
  );
}
