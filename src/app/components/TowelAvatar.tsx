interface TowelAvatarProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TowelAvatar({ color, size = 'md' }: TowelAvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl shadow-sm flex items-center justify-center`}
      style={{ backgroundColor: color }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-2/3 h-2/3"
        stroke="white"
        strokeWidth="1.5"
      >
        <rect x="6" y="4" width="12" height="16" rx="2" />
        <path d="M6 8h12" />
        <path d="M6 12h12" />
      </svg>
    </div>
  );
}
