interface CompatibilityBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export const CompatibilityBadge = ({ score, size = "md" }: CompatibilityBadgeProps) => {
  const dims = { sm: "h-10 w-10 text-xs", md: "h-14 w-14 text-sm", lg: "h-20 w-20 text-lg" };
  const radius = { sm: 16, md: 22, lg: 32 };
  const stroke = { sm: 3, md: 4, lg: 5 };
  const r = radius[size];
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${dims[size]}`}>
      <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${(r + stroke[size]) * 2} ${(r + stroke[size]) * 2}`}>
        <circle
          cx={r + stroke[size]}
          cy={r + stroke[size]}
          r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={stroke[size]}
        />
        <circle
          cx={r + stroke[size]}
          cy={r + stroke[size]}
          r={r}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={stroke[size]}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className="font-bold text-foreground">{score}%</span>
    </div>
  );
};
