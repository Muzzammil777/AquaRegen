import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  MapPin,
  Moon,
  Sun,
  RotateCcw,
  Save,
  CheckCircle2,
  Bell,
  Sliders,
  Database
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export const SettingsPage: React.FC = () => {
  const { user, property, refreshUserData } = useAuth();
  const { theme, setTheme } = useTheme();
  const { success, error } = useToast();

  const [name, setName] = useState<string>(user?.name || '');
  const [location, setLocation] = useState<string>(property?.location || user?.location || '');
  const [roofArea, setRoofArea] = useState<number>(property?.roof_area_sqm || 120);
  const [annualRainfall, setAnnualRainfall] = useState<number>(property?.annual_rainfall_mm || 850);
  const [dailyDemand, setDailyDemand] = useState<number>(property?.daily_demand_litres || 360);
  const [storageCapacity, setStorageCapacity] = useState<number>(property?.storage_capacity_litres || 2000);
  const [unitSystem, setUnitSystem] = useState<string>('metric');
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (user) setName(user.name);
    if (property) {
      setLocation(property.location);
      setRoofArea(property.roof_area_sqm);
      setAnnualRainfall(property.annual_rainfall_mm);
      setDailyDemand(property.daily_demand_litres);
      setStorageCapacity(property.storage_capacity_litres);
    }
  }, [user, property]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({
        name,
        location,
        roof_area_sqm: roofArea,
        annual_rainfall_mm: annualRainfall,
        daily_demand_litres: dailyDemand,
        storage_capacity_litres: storageCapacity,
        unit_system: unitSystem,
        theme_preference: theme,
        email_notifications: emailAlerts,
      });
      await refreshUserData();
      success('Settings saved', 'Your profile and property parameters were updated.');
    } catch (err: any) {
      error('Failed to save settings', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemo = async () => {
    try {
      await api.resetDemo();
      await refreshUserData();
      success('Demo Refreshed', 'Database reset with realistic climate-tech data.');
    } catch (err) {
      error('Reset failed', 'Could not refresh demo dataset.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
          System & Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, baseline property dimensions, preferences, and data states.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile Card */}
        <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-aqua-500" />
            <span>User Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder font-semibold text-navy-900 dark:text-white focus:border-aqua-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'demo@aquaregen.com'}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-surface-dark/50 border border-slate-200 dark:border-surface-darkborder font-semibold text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Property & Hydrology Parameters */}
        <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-forest-500" />
            <span>Property & Baseline Hydrology</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Location & Climate Zone
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder font-semibold text-navy-900 dark:text-white focus:border-aqua-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Annual Rainfall Depth (mm)
              </label>
              <input
                type="number"
                value={annualRainfall}
                onChange={e => setAnnualRainfall(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder font-semibold text-navy-900 dark:text-white focus:border-aqua-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Catchment Roof Area (m²)
              </label>
              <input
                type="number"
                value={roofArea}
                onChange={e => setRoofArea(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder font-semibold text-navy-900 dark:text-white focus:border-aqua-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Storage Capacity (Litres)
              </label>
              <input
                type="number"
                value={storageCapacity}
                onChange={e => setStorageCapacity(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder font-semibold text-navy-900 dark:text-white focus:border-aqua-500"
              />
            </div>
          </div>
        </div>

        {/* Display & Preferences */}
        <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
            <Moon className="w-4 h-4 text-amber-500" />
            <span>Theme & Display Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Interface Appearance
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex-1 py-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                    theme === 'light'
                      ? 'bg-navy-800 text-white border-navy-800 shadow-sm'
                      : 'bg-slate-50 dark:bg-surface-dark border-slate-200 dark:border-surface-darkborder text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light Mode (Default)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex-1 py-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                    theme === 'dark'
                      ? 'bg-aqua-500 text-white border-aqua-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-surface-dark border-slate-200 dark:border-surface-darkborder text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-4 h-4 text-slate-300" />
                  <span>Dark Mode</span>
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Unit System
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`flex-1 py-2.5 rounded-xl border font-bold text-xs transition-all ${
                    unitSystem === 'metric'
                      ? 'bg-navy-800 text-white border-navy-800 dark:bg-aqua-500'
                      : 'bg-slate-50 dark:bg-surface-dark border-slate-200 dark:border-surface-darkborder text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Metric (mm, m², L)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`flex-1 py-2.5 rounded-xl border font-bold text-xs transition-all ${
                    unitSystem === 'imperial'
                      ? 'bg-navy-800 text-white border-navy-800 dark:bg-aqua-500'
                      : 'bg-slate-50 dark:bg-surface-dark border-slate-200 dark:border-surface-darkborder text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Imperial (inches, sqft, gal)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleResetDemo}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-surface-darkborder text-slate-600 dark:text-slate-400 hover:text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed Data</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-navy-800 to-aqua-600 hover:opacity-95 text-white font-bold text-xs shadow-soft flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
