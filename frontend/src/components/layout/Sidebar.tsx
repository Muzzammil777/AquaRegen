import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CloudRain,
  Calculator,
  Waves,
  MapPin,
  Sliders,
  BarChart3,
  Bot,
  Settings,
  Sparkles,
  ChevronRight,
  Droplets
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { property } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, badge: null },
    { to: '/rainfall', label: 'Rainfall Analysis', icon: <CloudRain className="w-5 h-5" />, badge: null },
    { to: '/harvesting', label: 'Harvesting Planner', icon: <Calculator className="w-5 h-5" />, badge: null },
    { to: '/groundwater', label: 'Groundwater Recharge', icon: <Waves className="w-5 h-5" />, badge: null },
    { to: '/map', label: 'Water Map', icon: <MapPin className="w-5 h-5" />, badge: 'GIS' },
    { to: '/simulator', label: 'Water Simulator', icon: <Sliders className="w-5 h-5" />, badge: 'Live' },
    { to: '/analytics', label: 'Impact & Analytics', icon: <BarChart3 className="w-5 h-5" />, badge: null },
    { to: '/ai', label: 'Aqua AI Assistant', icon: <Bot className="w-5 h-5" />, badge: 'AI' },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, badge: null },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-surface-dark border-r border-slate-200/80 dark:border-surface-darkborder flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo */}
        <div className="p-5 border-b border-slate-100 dark:border-surface-darkborder flex items-center justify-between">
          <div
            onClick={() => {
              navigate('/dashboard');
              onClose();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-800 to-aqua-600 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <Droplets className="w-6 h-6 text-aqua-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-navy-900 dark:text-white tracking-tight">AquaRegen</span>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-aqua-600 dark:text-aqua-400">
                Climate-Tech Platform
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
            Navigation
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-navy-800 text-white shadow-sm dark:bg-aqua-500/20 dark:text-aqua-300 dark:border dark:border-aqua-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-darkcard hover:text-navy-900 dark:hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-inherit">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-aqua-100 text-aqua-700 dark:bg-aqua-950 dark:text-aqua-300">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Active Property Card */}
        {property && (
          <div className="p-4 m-3 rounded-xl bg-surface-base dark:bg-surface-darkcard border border-slate-200/80 dark:border-surface-darkborder text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-navy-900 dark:text-slate-200 truncate">{property.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                Active
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 truncate mb-2">{property.location}</p>
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-800 pt-2">
              <span>Roof: <strong>{property.roof_area_sqm} m²</strong></span>
              <span>Rain: <strong>{property.annual_rainfall_mm} mm</strong></span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
