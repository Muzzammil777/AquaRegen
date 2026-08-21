import React from 'react';
import { Droplet, ShieldCheck } from 'lucide-react';

interface WaterGaugeProps {
  percentage: number;
  label?: string;
  statusLabel?: string;
  daysOfAutonomy?: number;
  size?: number;
}

export const WaterGauge: React.FC<WaterGaugeProps> = ({
  percentage,
  label = "Water Availability",
  statusLabel = "Optimal Security",
  daysOfAutonomy = 142,
  size = 220
}) => {
  const radius = 80;
  const strokeWidth = 14;
  const normalizedPct = Math.min(100, Math.max(0, percentage));
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedPct / 100) * circumference;

  // Arc color based on sufficiency
  let strokeColor = "#159BD7"; // Aqua
  let glowColor = "rgba(21, 155, 215, 0.4)";
  if (normalizedPct >= 80) {
    strokeColor = "#2FA36B"; // Forest Green
    glowColor = "rgba(47, 163, 107, 0.4)";
  } else if (normalizedPct < 50) {
    strokeColor = "#F59E0B"; // Amber
    glowColor = "rgba(245, 158, 11, 0.4)";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="text-slate-100 dark:text-slate-800"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
          />
          {/* Active progress arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: `drop-shadow(0px 0px 8px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-black text-navy-900 dark:text-white tracking-tight">
              {Math.round(percentage)}
            </span>
            <span className="text-xl font-bold text-aqua-500 ml-0.5">%</span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
            {label}
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          {statusLabel}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Provides ~<span className="font-bold text-navy-800 dark:text-slate-200">{Math.round(daysOfAutonomy)} days</span> of independent supply
        </p>
      </div>
    </div>
  );
};
