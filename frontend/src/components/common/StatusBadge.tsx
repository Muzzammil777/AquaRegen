import React from 'react';

interface StatusBadgeProps {
  status: 'healthy' | 'moderate' | 'critical' | 'active' | 'estimated' | string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'sm' }) => {
  const normStatus = status.toLowerCase();

  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  let dotColor = 'bg-slate-400';
  let displayLabel = label || status;

  if (normStatus.includes('healthy') || normStatus.includes('high') || normStatus.includes('optimal') || normStatus.includes('improving')) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
    dotColor = 'bg-emerald-500';
    if (!label) displayLabel = 'Healthy';
  } else if (normStatus.includes('moderate') || normStatus.includes('warning')) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
    dotColor = 'bg-amber-500';
    if (!label) displayLabel = 'Moderate';
  } else if (normStatus.includes('critical') || normStatus.includes('low') || normStatus.includes('declining') || normStatus.includes('severe')) {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
    dotColor = 'bg-rose-500';
    if (!label) displayLabel = 'Critical';
  } else if (normStatus.includes('water') || normStatus.includes('active') || normStatus.includes('recharge')) {
    colorClasses = 'bg-aqua-50 text-aqua-700 border-aqua-200/80 dark:bg-aqua-950/40 dark:text-aqua-300 dark:border-aqua-800/60';
    dotColor = 'bg-aqua-500';
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${colorClasses} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      {displayLabel}
    </span>
  );
};
