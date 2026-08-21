import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Moon,
  Sun,
  MapPin,
  Sparkles,
  User,
  LogOut,
  Sliders,
  Droplet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const { user, property, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200/80 dark:border-surface-darkborder px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Hamburger & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-darkcard"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-medium text-navy-900 dark:text-slate-200 bg-slate-100 dark:bg-surface-darkcard px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-surface-darkborder">
              <MapPin className="w-3.5 h-3.5 text-aqua-500" />
              {property?.location || user?.location || 'Bengaluru Urban, KA'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {property?.annual_rainfall_mm || 850} mm / year rainfall zone
            </span>
          </div>
        </div>

        {/* Right Side: Demo Mode, Actions, Theme Toggle, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Demo Mode Badge */}
          <div className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Active Platform
          </div>

          {/* Quick Simulator CTA */}
          <button
            onClick={() => navigate('/simulator')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-aqua-500/10 hover:bg-aqua-500/20 text-aqua-600 dark:text-aqua-400 border border-aqua-500/20 text-xs font-semibold transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulator</span>
          </button>

          {/* Aqua AI CTA */}
          <button
            onClick={() => navigate('/ai')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-navy-800 to-aqua-600 hover:opacity-95 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-aqua-300" />
            <span>Aqua AI</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-darkcard transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* User Profile / Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-surface-darkborder">
            <div
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-surface-darkcard transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-navy-800 to-aqua-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-navy-900 dark:text-white leading-tight truncate max-w-[100px]">
                  {user?.name || 'User'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 capitalize leading-tight">
                  {user?.property_type || 'Residential'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
