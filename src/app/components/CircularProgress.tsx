interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export function CircularProgress({ percentage, size = 120, strokeWidth = 8, showLabel = false }: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (percent: number) => {
    if (percent >= 70) return '#7FBF9F';
    if (percent >= 40) return '#F2D99C';
    return '#F2B894';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E8F5F1"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-medium text-[#4A4A4A] ${size > 100 ? 'text-2xl' : 'text-lg'}`}>
          {percentage}%
        </span>
        {showLabel && (
          <span className={`text-[#8B8B8B] ${size > 100 ? 'text-xs' : 'text-[10px]'} mt-0.5`}>
            Hygiene
          </span>
        )}
      </div>
    </div>
  );
}
