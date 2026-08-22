import React, { useState, useEffect } from 'react';
import {
  Waves,
  Layers,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Radio,
  Zap,
  Activity,
  ArrowRight,
  Database
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { GroundwaterAssessment } from '../types';
import { RecommendationCard } from '../components/common/RecommendationCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const GroundwaterPage: React.FC = () => {
  const { property } = useAuth();

  // Primary calculator state
  const [groundwaterDepth, setGroundwaterDepth] = useState<number>(property?.groundwater_depth_m || 8.45);
  const [soilType, setSoilType] = useState<string>(property?.soil_type || 'sandy_loam');
  const [availableLand, setAvailableLand] = useState<number>(property?.available_land_sqm || 45);
  const [rainfall, setRainfall] = useState<number>(property?.annual_rainfall_mm || 850);
  const [catchmentArea, setCatchmentArea] = useState<number>(property?.roof_area_sqm || 120);

  // NWDP Telemetry State
  const initialDistrict = property?.location ? property.location.split(',')[0].toLowerCase().trim() : 'karur';
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [selectedAgency, setSelectedAgency] = useState<string>('State Ground Water Department');
  const [telemetryData, setTelemetryData] = useState<any>(null);
  const [telemetryLoading, setTelemetryLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const [data, setData] = useState<GroundwaterAssessment | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch NWDP Telemetry
  const fetchTelemetry = async (district: string, agency: string) => {
    setTelemetryLoading(true);
    try {
      const res = await api.getNWDPTelemetry(district, agency);
      setTelemetryData(res);
    } catch (err) {
      console.warn('NWDP telemetry fetch error:', err);
    } finally {
      setTelemetryLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry(selectedDistrict, selectedAgency);
  }, [selectedDistrict, selectedAgency]);

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
    }, 150);
    return () => clearTimeout(timer);
  }, [groundwaterDepth, soilType, availableLand, rainfall, catchmentArea]);

  // Sync official NWDP telemetry depth into the local calculator
  const handleSyncTelemetry = () => {
    if (!telemetryData) return;
    const liveDepth = telemetryData.latest_reading.depth_m_bgl;
    const suggestedSoil = telemetryData.hydrological_recommendation.suggested_soil_type;
    
    setGroundwaterDepth(liveDepth);
    if (suggestedSoil) setSoilType(suggestedSoil);

    setSyncStatus(`Synced ${liveDepth}m bgl from NWDP station (${telemetryData.station_code}) into the Hydro-Geological engine!`);
    setTimeout(() => setSyncStatus(null), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              NWDP / NWIC TELEMETRY LINK ACTIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
            Groundwater Recharge & Telemetry Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time telemetry stream from the National Water Data Portal (NWIC) & CGWB engineering calculator.
          </p>
        </div>

        <a
          href="https://nwdp.nwic.gov.in/dataset_api/api_page?resource_id=6857c02f-c77e-4576-b349-3e45aacc1c21"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-surface-darkcard dark:hover:bg-slate-800 text-xs font-bold text-navy-900 dark:text-white border border-slate-200 dark:border-surface-darkborder transition-colors self-start sm:self-auto"
        >
          <Database className="w-3.5 h-3.5 text-aqua-500" />
          <span>NWDP Official Dataset</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {/* National Water Data Portal (NWIC) Live Telemetry Stream Card */}
      <div className="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white rounded-3xl p-6 sm:p-7 shadow-soft border border-navy-700 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-aqua-500/20 text-aqua-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-aqua-500/30">
                Resource ID: 6857c02f-c77e-4576-b349-3e45aacc1c21
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" /> 6-Hourly Telemetry (2026–2030)
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              National Water Data Portal — Ground Water Level Telemetry
            </h3>
            <p className="text-xs text-slate-300">
              Department of Water Resources, RD & GR, Ministry of Jal Shakti, Government of India
            </p>
          </div>

          {/* District & Agency Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full lg:w-auto">
            <div>
              <label className="text-[10px] font-bold text-aqua-300 uppercase tracking-wider block mb-1">
                Tamil Nadu District
              </label>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                className="w-full lg:w-48 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:border-aqua-400 capitalize"
              >
                {telemetryData?.available_districts?.map((d: any) => (
                  <option key={d.id} value={d.id} className="bg-navy-900 text-white">
                    {d.name} ({d.current_depth}m bgl)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-aqua-300 uppercase tracking-wider block mb-1">
                Monitoring Agency
              </label>
              <select
                value={selectedAgency}
                onChange={e => setSelectedAgency(e.target.value)}
                className="w-full lg:w-56 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:border-aqua-400"
              >
                <option value="State Ground Water Department" className="bg-navy-900 text-white">
                  State Ground Water Dept
                </option>
                <option value="Central Ground Water Board (CGWB)" className="bg-navy-900 text-white">
                  Central Ground Water Board (CGWB)
                </option>
                <option value="All Agencies" className="bg-navy-900 text-white">
                  All Agencies
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Telemetry Station Readings & Mini-Chart */}
        {telemetryLoading || !telemetryData ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Connecting to National Water Data Portal telemetry gateway...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Station Telemetry KPI Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Telemetry Station</span>
                  <p className="text-sm font-extrabold text-white">{telemetryData.station_name}</p>
                  <p className="text-[10px] font-mono text-aqua-400">{telemetryData.station_code} • {telemetryData.aquifer_type}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {telemetryData.aquifer_status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Current Water Level</span>
                  <p className="text-2xl font-black text-white">
                    {telemetryData.latest_reading.depth_m_bgl} <span className="text-xs font-normal text-slate-300">m bgl</span>
                  </p>
                  <p className="text-[9px] text-slate-400">meters below ground level</p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Sensor Health</span>
                  <p className="text-sm font-extrabold text-emerald-400 flex items-center gap-1 mt-1">
                    <Activity className="w-3.5 h-3.5" />
                    {telemetryData.latest_reading.sensor_health}
                  </p>
                  <p className="text-[9px] text-slate-400">DWLR Pressure Transducer</p>
                </div>
              </div>

              {/* 1-Click Sync Button */}
              <button
                onClick={handleSyncTelemetry}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-aqua-500 to-forest-500 hover:opacity-95 text-white text-xs font-extrabold shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>⚡ Sync Live NWDP Depth ({telemetryData.latest_reading.depth_m_bgl}m) to Calculator</span>
              </button>
            </div>

            {/* 6-Hourly Diurnal Telemetry Curve */}
            <div className="lg:col-span-7 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-aqua-400" />
                  6-Hourly Telemetry Stream (Last 48 Hours)
                </span>
                <span className="text-[10px] text-slate-400">
                  {telemetryData.latest_reading.timestamp}
                </span>
              </div>

              <div className="h-40 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetryData.six_hourly_readings} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="nwdpGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2FA36B" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2FA36B" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} domain={['dataMin - 0.2', 'dataMax + 0.2']} reversed />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#05111F',
                        borderRadius: '12px',
                        border: '1px solid #1E334D',
                        color: '#fff',
                        fontSize: '11px'
                      }}
                      formatter={(val: any) => [`${val} m bgl`, 'Water Table Depth']}
                    />
                    <Area type="monotone" dataKey="water_level_m_bgl" stroke="#2FA36B" strokeWidth={2.5} fill="url(#nwdpGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {syncStatus && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-xs text-emerald-200 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Hydro-Geological Inputs & Engineering Outputs */}
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
                step={0.1}
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
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
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
                <label className="text-slate-500 block mb-1">Catchment Area (m²)</label>
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
