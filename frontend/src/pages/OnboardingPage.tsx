import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Home,
  Building2,
  GraduationCap,
  Trees,
  Layers,
  Droplets,
  Users,
  Database,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Navigation
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { detectCurrentLocation } from '../utils/geolocation';

export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [location, setLocation] = useState<string>('Bengaluru Urban, KA');
  const [propertyType, setPropertyType] = useState<string>('House');
  const [roofArea, setRoofArea] = useState<number>(120);
  const [surfaceType, setSurfaceType] = useState<string>('concrete');
  const [annualRainfall, setAnnualRainfall] = useState<number>(850);
  const [occupants, setOccupants] = useState<number>(4);
  const [dailyDemand, setDailyDemand] = useState<number>(360);
  const [storageCapacity, setStorageCapacity] = useState<number>(2000);
  const [soilType, setSoilType] = useState<string>('sandy_loam');
  const [groundwaterDepth, setGroundwaterDepth] = useState<number>(7.4);
  const [availableLand, setAvailableLand] = useState<number>(45);
  const [detectingGps, setDetectingGps] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { refreshUserData } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleDetectGps = async () => {
    setDetectingGps(true);
    try {
      const res = await detectCurrentLocation();
      setLocation(res.location);
      setAnnualRainfall(res.annualRainfall);
      success('Location & Live Rainfall Synced!', `${res.location} (${res.annualRainfall} mm/year)`);
    } catch (err: any) {
      error('GPS Location', err.message || 'Could not retrieve GPS location.');
    } finally {
      setDetectingGps(false);
    }
  };

  const propertyTypes = [
    { id: 'House', label: 'Single House', icon: <Home className="w-5 h-5" /> },
    { id: 'Apartment', label: 'Apartment Community', icon: <Building2 className="w-5 h-5" /> },
    { id: 'School', label: 'School / College', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'Commercial', label: 'Office / Commercial', icon: <Building2 className="w-5 h-5" /> },
    { id: 'Farm', label: 'Farm / Agricultural', icon: <Trees className="w-5 h-5" /> },
    { id: 'Community', label: 'Community Space', icon: <Users className="w-5 h-5" /> },
  ];

  const surfaceTypes = [
    { id: 'concrete', label: 'Reinforced Concrete (RCC)', coeff: '0.85' },
    { id: 'metal', label: 'Corrugated Metal Sheet', coeff: '0.90' },
    { id: 'tile', label: 'Clay / Mangalore Tile', coeff: '0.75' },
    { id: 'asphalt', label: 'Asphalt Shingle', coeff: '0.70' },
    { id: 'paved', label: 'Interlocking Pavers', coeff: '0.60' },
  ];

  const soilTypes = [
    { id: 'sandy_loam', label: 'Sandy Loam (Good Drainage)', score: 'High' },
    { id: 'gravel_sand', label: 'Coarse Sand & Gravel', score: 'Very High' },
    { id: 'silt_loam', label: 'Silt Loam (Moderate)', score: 'Moderate' },
    { id: 'clay_loam', label: 'Clay Loam (Slow)', score: 'Low' },
    { id: 'clay', label: 'Dense Clay / Hardpan', score: 'Poor' },
  ];

  const handleFinish = async () => {
    setLoading(true);
    try {
      await api.completeOnboarding({
        location,
        property_type: propertyType,
        roof_area_sqm: roofArea,
        surface_type: surfaceType,
        annual_rainfall_mm: annualRainfall,
        daily_demand_litres: dailyDemand,
        occupants,
        storage_capacity_litres: storageCapacity,
        soil_type: soilType,
        groundwater_depth_m: groundwaterDepth,
        available_land_sqm: availableLand,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      success('Water Profile Generated!', 'Welcome to your tailored climate-tech command center.');
      await refreshUserData();
      navigate('/dashboard');
    } catch (err: any) {
      error('Onboarding update failed', err.message || 'Could not save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-base dark:bg-surface-dark flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-2xl bg-white dark:bg-surface-darkcard border border-slate-200/80 dark:border-surface-darkborder rounded-3xl p-6 sm:p-10 shadow-soft-lg">
        {/* Step Progress Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-surface-darkborder">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-aqua-600 dark:text-aqua-400">
              Step {step} of 5
            </span>
            <h2 className="text-xl font-extrabold text-navy-900 dark:text-white mt-0.5">
              {step === 1 && "Select Property Location"}
              {step === 2 && "Choose Property Type"}
              {step === 3 && "Catchment Area & Roof Material"}
              {step === 4 && "Daily Water Consumption"}
              {step === 5 && "Storage & Hydro-geology"}
            </h2>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(s => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-6 bg-aqua-500'
                    : s < step
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your location dictates average annual rainfall and local precipitation intensity.
            </p>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  City / Climate Zone
                </label>
                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={detectingGps}
                  className="text-[11px] font-bold text-aqua-600 dark:text-aqua-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Navigation className={`w-3 h-3 ${detectingGps ? 'animate-spin' : ''}`} />
                  <span>{detectingGps ? 'Detecting GPS...' : 'Auto-Detect My Location'}</span>
                </button>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-aqua-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru Urban, KA"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-sm text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Estimated Annual Rainfall (mm)
              </label>
              <input
                type="number"
                value={annualRainfall}
                onChange={e => setAnnualRainfall(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-sm text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500 font-medium"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard long-term precipitation baseline for this zone is ~{annualRainfall} mm/year.
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Property Type */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select the building typology to tailor storage sizing and recharge structures.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {propertyTypes.map(pt => (
                <button
                  key={pt.id}
                  onClick={() => setPropertyType(pt.id)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    propertyType === pt.id
                      ? 'border-aqua-500 bg-aqua-50/50 dark:bg-aqua-950/40 text-navy-900 dark:text-white shadow-sm ring-2 ring-aqua-500/20'
                      : 'border-slate-200 dark:border-surface-darkborder bg-slate-50 dark:bg-surface-dark text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="text-aqua-600 dark:text-aqua-400 mb-2">{pt.icon}</div>
                  <span className="font-bold text-xs">{pt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Catchment Area & Surface */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Rooftop Catchment Area</span>
                <span className="text-aqua-600 dark:text-aqua-400">{roofArea} m²</span>
              </div>
              <input
                type="range"
                min={30}
                max={2500}
                step={10}
                value={roofArea}
                onChange={e => setRoofArea(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg accent-aqua-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>30 m² (Small)</span>
                <span>2,500 m² (Large Campus)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Surface Catchment Material
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {surfaceTypes.map(st => (
                  <button
                    key={st.id}
                    onClick={() => setSurfaceType(st.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      surfaceType === st.id
                        ? 'border-navy-800 bg-navy-800 text-white dark:border-aqua-500 dark:bg-aqua-500'
                        : 'border-slate-200 dark:border-surface-darkborder bg-slate-50 dark:bg-surface-dark text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-semibold">{st.label}</span>
                    <span className="text-[10px] font-bold opacity-80">c = {st.coeff}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Demand & Occupants */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Number of Occupants / Daily Users
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 4, 8, 16, 50].map(n => (
                  <button
                    key={n}
                    onClick={() => {
                      setOccupants(n);
                      setDailyDemand(n * 90);
                    }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      occupants === n
                        ? 'bg-aqua-500 text-white border-aqua-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-surface-dark border-slate-200 dark:border-surface-darkborder text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <span>Estimated Daily Water Demand</span>
                <span className="text-aqua-600 dark:text-aqua-400">{dailyDemand} L/day</span>
              </div>
              <input
                type="range"
                min={50}
                max={5000}
                step={25}
                value={dailyDemand}
                onChange={e => setDailyDemand(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg accent-aqua-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Annual demand = {Math.round(dailyDemand * 365).toLocaleString()} L/year
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Storage & Soil */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Existing / Planned Storage Tank (L)
                </label>
                <input
                  type="number"
                  value={storageCapacity}
                  onChange={e => setStorageCapacity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-sm text-navy-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Water Table Depth (meters)
                </label>
                <input
                  type="number"
                  step={0.1}
                  value={groundwaterDepth}
                  onChange={e => setGroundwaterDepth(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-sm text-navy-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Surrounding Soil Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {soilTypes.map(st => (
                  <button
                    key={st.id}
                    onClick={() => setSoilType(st.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      soilType === st.id
                        ? 'border-forest-600 bg-forest-600 text-white'
                        : 'border-slate-200 dark:border-surface-darkborder bg-slate-50 dark:bg-surface-dark text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-semibold">{st.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100 dark:border-surface-darkborder">
          {step > 1 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-surface-darkborder text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-darkcard font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="px-6 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-forest-600 to-emerald-500 hover:opacity-95 text-white font-bold text-xs shadow-soft flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>{loading ? 'Generating Profile...' : 'Generate My Water Profile'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
