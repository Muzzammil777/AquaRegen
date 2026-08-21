import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (val: number) => void;
  description?: string;
  icon?: React.ReactNode;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  description,
  icon,
}) => {
  return (
    <div className="space-y-2 p-4 bg-slate-50 dark:bg-surface-dark/60 rounded-xl border border-slate-100 dark:border-surface-darkborder/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-aqua-500">{icon}</div>}
          <label className="text-sm font-semibold text-navy-900 dark:text-white">{label}</label>
        </div>
        <div className="flex items-center gap-1 bg-white dark:bg-surface-darkcard px-2.5 py-1 rounded-lg border border-slate-200 dark:border-surface-darkborder text-sm font-bold text-navy-900 dark:text-aqua-400">
          <span>{value.toLocaleString()}</span>
          <span className="text-xs text-slate-400 font-normal">{unit}</span>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-aqua-500 focus:outline-none"
      />

      <div className="flex justify-between text-[11px] text-slate-400">
        <span>{min.toLocaleString()} {unit}</span>
        {description && <span>{description}</span>}
        <span>{max.toLocaleString()} {unit}</span>
      </div>
    </div>
  );
};

interface RecommendationCardProps {
  title: string;
  subtitle?: string;
  structureName: string;
  estimatedVolume: string;
  suitabilityPct?: number;
  reasons: string[];
  dimensions?: string;
  filterMedia?: string;
  disclaimer?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  title,
  subtitle,
  structureName,
  estimatedVolume,
  suitabilityPct,
  reasons,
  dimensions,
  filterMedia,
  disclaimer,
}) => {
  return (
    <div className="bg-gradient-to-br from-navy-900 to-navy-800 text-white rounded-2xl p-6 shadow-soft-lg border border-navy-700 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-aqua-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-forest-500/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-aqua-300">{title}</span>
            {subtitle && <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>}
          </div>
          {suitabilityPct !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-bold">
              <span>{suitabilityPct}% Suitability</span>
            </div>
          )}
        </div>

        <div className="mb-5">
          <h4 className="text-2xl font-black text-white tracking-tight">{structureName}</h4>
          <p className="text-sm text-aqua-200 mt-1 font-medium">
            Estimated Infiltration / Yield: <span className="text-white font-bold">{estimatedVolume}</span>
          </p>
        </div>

        {dimensions && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-slate-400 block mb-0.5">Recommended Dimensions</span>
              <span className="font-semibold text-slate-100">{dimensions}</span>
            </div>
            {filterMedia && (
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block mb-0.5">Filtration Pack</span>
                <span className="font-semibold text-slate-100">{filterMedia}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2 mb-4">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Engineering Rationale:</span>
          <ul className="space-y-1.5">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                <span className="text-forest-400 mt-0.5">✓</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {disclaimer && (
          <p className="text-[11px] text-slate-400 italic pt-3 border-t border-white/10">
            {disclaimer}
          </p>
        )}
      </div>
    </div>
  );
};
