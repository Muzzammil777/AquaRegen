import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-base dark:bg-surface-dark flex items-center justify-center p-4 text-center">
      <div className="max-w-md bg-white dark:bg-surface-darkcard border border-slate-200/80 dark:border-surface-darkborder rounded-3xl p-8 shadow-soft-lg space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-aqua-50 dark:bg-aqua-950 text-aqua-600 dark:text-aqua-400 mx-auto flex items-center justify-center">
          <Droplets className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-navy-900 dark:text-white">404</h1>
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200">
          Water Resource Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The hydrological route or page you are looking for has evaporated or does not exist.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-surface-darkborder text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
