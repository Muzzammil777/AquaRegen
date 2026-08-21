import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplets, User, Mail, Lock, MapPin, ArrowRight, Navigation, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { detectCurrentLocation, type LocationDetectionResult } from '../utils/geolocation';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [location, setLocation] = useState<string>('Bengaluru Urban, KA');
  const [geoData, setGeoData] = useState<LocationDetectionResult | null>(null);
  const [detectingGps, setDetectingGps] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleDetectLocation = async () => {
    setDetectingGps(true);
    try {
      const res = await detectCurrentLocation();
      setLocation(res.location);
      setGeoData(res);
      success('Location Detected!', `Set to ${res.location} (${res.annualRainfall} mm annual rain)`);
    } catch (err: any) {
      error('GPS Detection', err.message || 'Could not access GPS. Please type your city.');
    } finally {
      setDetectingGps(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        name,
        email,
        password,
        location,
        latitude: geoData?.latitude || 12.9716,
        longitude: geoData?.longitude || 77.5946,
        annual_rainfall_mm: geoData?.annualRainfall || 850,
        property_type: 'House',
        property_area: 120,
      });
      navigate('/onboarding');
    } catch (err) {
      // Handled by Toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base dark:bg-surface-dark flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-surface-darkcard border border-slate-200/80 dark:border-surface-darkborder rounded-3xl p-8 shadow-soft-lg">
        <div className="text-center mb-8">
          <div
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-800 to-aqua-600 text-white mb-4 shadow-soft cursor-pointer hover:scale-105 transition-transform"
          >
            <Droplets className="w-8 h-8 text-aqua-200" />
          </div>
          <h2 className="text-2xl font-black text-navy-900 dark:text-white tracking-tight">
            Join AquaRegen
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Start your journey toward complete water security & groundwater replenishment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Dr. Sarah Jenkins"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-sm text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500 transition-colors font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-sm text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500 transition-colors font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-sm text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500 transition-colors font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Property Location
              </label>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingGps}
                className="text-[11px] font-bold text-aqua-600 dark:text-aqua-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Navigation className={`w-3 h-3 ${detectingGps ? 'animate-spin' : ''}`} />
                <span>{detectingGps ? 'Locating...' : 'Use My Current Location'}</span>
              </button>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-aqua-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru Urban, KA or London, UK"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-sm text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500 transition-colors font-medium"
              />
            </div>
            {geoData && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>GPS synced: {geoData.annualRainfall} mm live rainfall model</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-navy-800 to-aqua-600 hover:opacity-95 text-white font-bold text-sm shadow-soft flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Continue to Assessment'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-aqua-600 dark:text-aqua-400 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
