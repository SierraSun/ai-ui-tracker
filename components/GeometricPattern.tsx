"use client";

type PatternType = "dots" | "lines" | "circles" | "grid" | "waves" | "hexagon";

export function GeometricPattern({
  type,
  color = "#ffffff",
  opacity = 0.15,
  className = "",
}: {
  type: PatternType;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  const id = `pattern-${type}-${Math.random().toString(36).slice(2, 7)}`;

  const patterns: Record<PatternType, React.ReactNode> = {
    dots: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill={color} opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    ),
    lines: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <pattern id={id} x="0" y="0" width="1" height="12" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke={color} strokeWidth="0.5" opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    ),
    circles: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <pattern id={id} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="10" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
            <circle cx="30" cy="30" r="20" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity * 0.6} />
            <circle cx="30" cy="30" r="28" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity * 0.3} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    ),
    grid: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <pattern id={id} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={color} strokeWidth="0.4" opacity={opacity} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    ),
    waves: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <pattern id={id} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M0 30 Q15 10 30 30 Q45 50 60 30" fill="none" stroke={color} strokeWidth="0.6" opacity={opacity} />
            <path d="M0 10 Q15 -10 30 10 Q45 30 60 10" fill="none" stroke={color} strokeWidth="0.6" opacity={opacity * 0.5} />
            <path d="M0 50 Q15 30 30 50 Q45 70 60 50" fill="none" stroke={color} strokeWidth="0.6" opacity={opacity * 0.5} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    ),
    hexagon: (
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
        <defs>
          <pattern id={id} x="0" y="0" width="40" height="46" patternUnits="userSpaceOnUse">
            <polygon
              points="20,2 38,12 38,34 20,44 2,34 2,12"
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              opacity={opacity}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    ),
  };

  return <div className="absolute inset-0 overflow-hidden">{patterns[type]}</div>;
}
