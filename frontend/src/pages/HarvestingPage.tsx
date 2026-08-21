import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Droplets,
  Layers,
  CloudRain,
  ShieldCheck,
  ArrowRight,
  Info,
  CheckCircle2,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { HarvestingCalculationResult } from '../types';
import { RecommendationCard } from '../components/common/RecommendationCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const HarvestingPage: React.FC = () => {
  const { property } = useAuth();

  const [roofArea, setRoofArea] = useState<number>(property?.roof_area_sqm || 120);
  const [rainfall, setRainfall] = useState<number>(property?.annual_rainfall_mm || 850);
  const [surfaceType, setSurfaceType] = useState<string>(property?.surface_type || 'concrete');
  const [dailyDemand, setDailyDemand] = useState<number>(property?.daily_demand_litres || 360);
  const [existingStorage, setExistingStorage] = useState<number>(property?.storage_capacity_litres || 2000);

  const [result, setResult] = useState<HarvestingCalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const runCalculation = async () => {
    try {
      setLoading(true);
      const res = await api.calculateHarvesting({
        roof_area_sqm: roofArea,
        annual_rainfall_mm: rainfall,
        surface_type: surfaceType,
        daily_demand_litres: dailyDemand,
        existing_storage_litres: existingStorage,
      });
      setResult(res);
    } catch (err) {
      console.warn('Harvest calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runCalculation();
    }, 200);
    return () => clearTimeout(timer);
  }, [roofArea, rainfall, surfaceType, dailyDemand, existingStorage]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
          Rainwater Harvesting Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Calculate precise harvest potential, inspect physical conversion steps, and size storage tanks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-6 shadow-soft space-y-5">
            <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-aqua-500" />
              <span>Catchment Parameters</span>
            </h3>

            {/* Roof Area Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">Rooftop Catchment Area</span>
                <span className="text-aqua-600 dark:text-aqua-400 font-extrabold">{roofArea} m²</span>
              </div>
              <input
                type="range"
                min={30}
                max={1500}
                step={10}
                value={roofArea}
                onChange={e => setRoofArea(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg accent-aqua-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>30 m²</span>
                <span>1,500 m²</span>
              </div>
            </div>

            {/* Annual Rainfall Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">Annual Rainfall Depth</span>
                <span className="text-aqua-600 dark:text-aqua-400 font-extrabold">{rainfall} mm</span>
              </div>
              <input
                type="range"
                min={300}
                max={2500}
                step={25}
                value={rainfall}
                onChange={e => setRainfall(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg accent-aqua-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>300 mm (Arid)</span>
                <span>2,500 mm (Monsoon Belt)</span>
              </div>
            </div>

            {/* Surface Type Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Surface Catchment Material
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'concrete', label: 'Reinforced Concrete', coeff: '0.85' },
                  { id: 'metal', label: 'Corrugated Metal', coeff: '0.90' },
                  { id: 'tile', label: 'Clay / Mangalore Tile', coeff: '0.75' },
                  { id: 'asphalt', label: 'Asphalt Shingle', coeff: '0.70' },
                ].map(mat => (
                  <button
                    key={mat.id}
                    onClick={() => setSurfaceType(mat.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      surfaceType === mat.id
                        ? 'border-navy-800 bg-navy-800 text-white dark:border-aqua-500 dark:bg-aqua-500'
                        : 'border-slate-200 dark:border-surface-darkborder bg-slate-50 dark:bg-surface-dark text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-bold">{mat.label}</span>
                    <span className="text-[10px] opacity-80 mt-1">Runoff Coeff: {mat.coeff}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Demand */}
            <div className="pt-2 border-t border-slate-100 dark:border-surface-darkborder">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">Daily Domestic Demand</span>
                <span className="text-navy-900 dark:text-white font-extrabold">{dailyDemand} L/day</span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={25}
                value={dailyDemand}
                onChange={e => setDailyDemand(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg accent-navy-800 dark:accent-aqua-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Transparent Calculation Display Box */}
          {result && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-soft border border-slate-800">
              <span className="text-xs font-bold text-aqua-400 uppercase tracking-wider block mb-3">
                Transparent Physical Conversion
              </span>
              <div className="font-mono text-sm sm:text-base space-y-1 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                <p className="text-slate-300">{rainfall} mm (Annual Precipitation)</p>
                <p className="text-slate-400">×</p>
                <p className="text-slate-300">{roofArea} m² (Catchment Area)</p>
                <p className="text-slate-400">×</p>
                <p className="text-slate-300">{result.harvest_metrics.runoff_coefficient.toFixed(2)} ({surfaceType.toUpperCase()} Runoff Coefficient)</p>
                <div className="border-t border-slate-700 my-2 pt-2">
                  <p className="text-xl sm:text-2xl font-black text-aqua-400">
                    ≈ {Math.round(result.harvest_metrics.gross_potential_litres).toLocaleString()} L/year
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    Net Filtered Yield: <strong className="text-white">{Math.round(result.harvest_metrics.net_harvestable_litres).toLocaleString()} L/year</strong> (after 10% first-flush diversion)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output & Recommendations */}
        <div className="lg:col-span-6 space-y-6">
          {loading || !result ? (
            <div className="space-y-4">
              <LoadingSkeleton type="card" />
              <LoadingSkeleton type="table" />
            </div>
          ) : (
            <>
              {/* Primary Recommendation Card */}
              <RecommendationCard
                title="Recommended Harvesting Setup"
                subtitle="Optimized for rooftop catchment and local monsoon spells"
                structureName={result.recommendation.system_type}
                estimatedVolume={`${result.recommendation.estimated_annual_collection_litres.toLocaleString()} L/year Collection`}
                suitabilityPct={result.recommendation.water_sufficiency_pct}
                dimensions={`Storage Tank: ${result.recommendation.recommended_storage_litres.toLocaleString()} L | Overflow: ${result.recommendation.estimated_recharge_litres_per_year.toLocaleString()} L/yr`}
                filterMedia="Dual-chamber SS wire mesh pre-filter + 1.5mm First Flush Diverter"
                reasons={result.recommendation.why_text}
                disclaimer="Hydrological estimation modeled on historical precipitation frequencies. Sizing prevents water stagnation while optimizing dry-period buffer."
              />

              {/* Step-by-Step Breakdown Cards */}
              <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-6 shadow-soft space-y-4">
                <h4 className="text-sm font-bold text-navy-900 dark:text-white">
                  Step-by-Step Calculation Breakdown
                </h4>

                <div className="space-y-3">
                  {result.calculation_steps.map((s) => (
                    <div key={s.step} className="p-3.5 rounded-xl bg-surface-base dark:bg-surface-dark border border-slate-200/60 dark:border-surface-darkborder text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-navy-900 dark:text-white">
                          Step {s.step}: {s.title}
                        </span>
                        <span className="font-bold text-aqua-600 dark:text-aqua-400 bg-white dark:bg-surface-darkcard px-2 py-0.5 rounded border border-slate-200 dark:border-surface-darkborder">
                          {s.result}
                        </span>
                      </div>
                      <p className="font-mono text-slate-500 dark:text-slate-400">{s.formula}</p>
                      <p className="text-[11px] text-slate-400 mt-1 italic">{s.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
