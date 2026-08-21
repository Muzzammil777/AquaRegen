import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  periods?: Array<{ id: string; label: string }>;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  selectedPeriod,
  onPeriodChange,
  periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ],
  headerAction,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-6 shadow-soft ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-navy-900 dark:text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onPeriodChange && (
            <div className="inline-flex p-1 bg-slate-100 dark:bg-surface-dark rounded-xl border border-slate-200/60 dark:border-surface-darkborder">
              {periods.map(p => (
                <button
                  key={p.id}
                  onClick={() => onPeriodChange(p.id)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    selectedPeriod === p.id
                      ? 'bg-white dark:bg-surface-darkcard text-navy-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          {headerAction}
        </div>
      </div>

      <div className="w-full">{children}</div>
    </div>
  );
};
