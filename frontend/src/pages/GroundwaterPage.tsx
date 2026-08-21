import React, { useState, useEffect } from 'react';
import {
  Waves,
  Layers,
  MapPin,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { GroundwaterAssessment } from '../types';
import { RecommendationCard } from '../components/common/RecommendationCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const GroundwaterPage: React.FC = () => {
  const { property } = useAuth();

  const [groundwaterDepth, setGroundwaterDepth] = useState<number>(property?.groundwater_depth_m || 7.4);
  const [soilType, setSoilType] = useState<string>(property?.soil_type || 'sandy_loam');
  const [availableLand, setAvailableLand] = useState<number>(property?.available_land_sqm || 45);
  const [rainfall, setRainfall] = useState<number>(property?.annual_rainfall_mm || 850);
  const [catchmentArea, setCatchmentArea] = useState<number>(property?.roof_area_sqm || 120);

  const [data, setData] = useState<GroundwaterAssessment | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const [resAssessment, resOverview] = await Promise.all([
        api.recommendGroundwater({
          groundwater_depth_m: groundwaterDepth,
          soil_type: soilType,
          available_land_sqm: availableLand,
          annual_rainfall_mm: rainfall,
          catchment_area_sqm: catchmentArea,
          surface_type: 'concrete',
        }),
        api.getGroundwaterOverview()
      ]);
      setData(resAssessment);
      setOverview(resOverview);
    } catch (err) {
      console.warn('Groundwater assessment error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssessment();
    }, 200);
    return () => clearTimeout(timer);
  }, [groundwaterDepth, soilType, availableLand, rainfall, catchmentArea]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
          Groundwater Recharge Planner
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Evaluate geological permeability, calculate recharge suitability scores, and select optimal injection structures.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-6 shadow-soft space-y-5">
            <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-aqua-500" />
              <span>Hydro-Geological Inputs</span>
            </h3>

            {/* Depth to Water Table */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">Depth to Water Table</span>
                <span className="text-forest-600 dark:text-forest-400 font-extrabold">{groundwaterDepth} meters</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={50.0}
                step={0.5}
                value={groundwaterDepth}
                onChange={e => setGroundwaterDepth(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg accent-forest-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>2 m (Shallow)</span>
                <span>50 m (Deep Aquifer)</span>
              </div>
            </div>

            {/* Soil Type Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Upper Strata Soil Typology
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'sandy_loam', name: 'Sandy Loam', rate: '25 mm/hr' },
                  { id: 'gravel_sand', name: 'Coarse Sand & Gravel', rate: '50 mm/hr' },
                  { id: 'silt_loam', name: 'Silt Loam', rate: '12 mm/hr' },
                  { id: 'clay_loam', name: 'Clay Loam', rate: '5 mm/hr' },
                  { id: 'clay', name: 'Dense Clay / Hardpan', rate: '1.5 mm/hr' },
                  { id: 'rocky', name: 'Fissured Rock', rate: '10 mm/hr' },
                ].map(soil => (
                  <button
                    key={soil.id}
                    onClick={() => setSoilType(soil.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      soilType === soil.id
                        ? 'border-forest-600 bg-forest-600 text-white dark:border-forest-500 dark:bg-forest-500'
                        : 'border-slate-200 dark:border-surface-darkborder bg-slate-50 dark:bg-surface-dark text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="font-bold">{soil.name}</span>
                    <span className="text-[10px] opacity-80 mt-0.5">Rate: {soil.rate}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Available Unpaved Land Area */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-700 dark:text-slate-300">Available Open / Yard Area</span>
                <span className="text-navy-900 dark:text-white font-extrabold">{availableLand} m²</span>
              </div>
              <input
                type="range"
                min={5}
                max={600}
                step={5}
                value={availableLand}
                onChange={e => setAvailableLand(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg accent-navy-800 dark:accent-aqua-500 cursor-pointer"
              />
            </div>

            {/* Catchment Roof Area & Rainfall */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-surface-darkborder text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Catchment Area</label>
                <input
                  type="number"
                  value={catchmentArea}
                  onChange={e => setCatchmentArea(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder font-bold text-navy-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Annual Rainfall (mm)</label>
                <input
                  type="number"
                  value={rainfall}
                  onChange={e => setRainfall(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder font-bold text-navy-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output & Suitability Score */}
        <div className="lg:col-span-6 space-y-6">
          {loading || !data ? (
            <div className="space-y-4">
              <LoadingSkeleton type="card" />
              <LoadingSkeleton type="card" />
            </div>
          ) : (
            <>
              {/* Recharge Suitability Score Visual Meter */}
              <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Recharge Suitability Score
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {data.assessment.potential_category}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-black text-navy-900 dark:text-white">
                    {data.assessment.suitability_score}%
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Infiltration Suitability</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-aqua-500 to-forest-500 transition-all duration-500"
                    style={{ width: `${data.assessment.suitability_score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Water Table Status: <strong>{data.assessment.depth_assessment}</strong>
                </p>
              </div>

              {/* Recommended Structure Card */}
              <RecommendationCard
                title="Groundwater Structure Recommendation"
                subtitle="Calculated for optimal hydraulic recharge head and soil infiltration rate"
                structureName={data.assessment.recommended_structure}
                estimatedVolume={data.assessment.estimated_recharge_range}
                suitabilityPct={data.assessment.suitability_score}
                dimensions={data.assessment.structure_dimensions}
                filterMedia={data.assessment.filtration_media}
                reasons={data.assessment.reasons}
                disclaimer={data.assessment.disclaimer}
              />
            </>
          )}
        </div>
      </div>

      {/* Recharge Structure Catalog Table */}
      {overview && (
        <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-bold text-navy-900 dark:text-white tracking-tight mb-1">
            Artificial Recharge Structure Engineering Catalog
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Comparison of standard Central Ground Water Board (CGWB) artificial recharge interventions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {overview.structures_catalog.map((st: any) => (
              <div
                key={st.type}
                className="p-4 rounded-xl bg-surface-base dark:bg-surface-dark border border-slate-200/80 dark:border-surface-darkborder flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-navy-900 dark:text-white text-sm mb-1">{st.type}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{st.ideal_for}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px] flex justify-between font-semibold">
                  <span className="text-slate-400">Depth: {st.depth_range}</span>
                  <span className="text-aqua-600 dark:text-aqua-400">{st.cost_estimate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
