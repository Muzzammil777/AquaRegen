import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { KpiItem } from '../../types';
import { StatusBadge } from './StatusBadge';

interface KpiCardProps {
  data: KpiItem;
  icon: React.ReactNode;
  iconBgColor?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ data, icon, iconBgColor = 'bg-aqua-50 text-aqua-600 dark:bg-aqua-950/40 dark:text-aqua-400' }) => {
  const isPositive = data.trend === 'up' || data.trend === 'improving';
  const isNegative = data.trend === 'down';

  return (
    <div className="group relative bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-4 sm:p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${iconBgColor}`}>
          {icon}
        </div>
        <StatusBadge status={data.status} />
      </div>

      <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{data.label}</p>
      
      <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
          {data.value}
        </h3>
        {data.unit && data.value.indexOf(data.unit) === -1 && (
          <span className="text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-500">{data.unit}</span>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
        <span
          className={`inline-flex items-center font-semibold shrink-0 ${
            isPositive
              ? 'text-emerald-600 dark:text-emerald-400'
              : isNegative
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5" />
          ) : isNegative ? (
            <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5" />
          ) : (
            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5" />
          )}
          {data.change_pct}
        </span>
        <span className="text-slate-400 dark:text-slate-500 truncate">{data.change_label}</span>
      </div>
    </div>
  );
};
