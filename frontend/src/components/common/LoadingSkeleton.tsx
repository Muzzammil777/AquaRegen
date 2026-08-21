import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const LoadingSkeleton: React.FC<{ type?: 'card' | 'chart' | 'table' | 'hero'; rows?: number }> = ({ type = 'card' }) => {
  if (type === 'chart') {
    return (
      <div className="w-full h-80 bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-6 shadow-soft animate-pulse flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-1/3"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-24"></div>
        </div>
        <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-14"></div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="w-full bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-6 shadow-soft animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-1/4 mb-4"></div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/5"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-6 shadow-soft animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        <div className="w-16 h-5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-surface-darkcard border border-dashed border-slate-200 dark:border-surface-darkborder rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-aqua-50 dark:bg-aqua-950/40 text-aqua-600 dark:text-aqua-400 flex items-center justify-center mb-4">
        {icon || <AlertCircle className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-aqua-500 hover:bg-aqua-600 text-white font-medium shadow-sm transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
};
