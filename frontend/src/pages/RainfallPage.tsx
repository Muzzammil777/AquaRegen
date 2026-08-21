import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  MapPin,
  Layers,
  Droplets,
  Thermometer,
  Search,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChartCard } from '../components/common/ChartCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const RainfallPage: React.FC = () => {
  const { property } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<string>(
    property?.location ? property.location.split(',')[0].toLowerCase() : 'bengaluru'
  );
  const [roofArea, setRoofArea] = useState<number>(property?.roof_area_sqm || 120);
  const [surfaceType, setSurfaceType] = useState<string>(property?.surface_type || 'concrete');
  const [customSearchQuery, setCustomSearchQuery] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize with property location if present
  useEffect(() => {
    if (property?.location) {
      const locKey = property.location.split(',')[0].toLowerCase().trim();
      setSelectedLocation(locKey);
    }
  }, [property]);

  const fetchRainfall = async (locToFetch?: string) => {
    setLoading(true);
    try {
      const loc = locToFetch || selectedLocation;
      const res = await api.getRainfallAnalysis(loc, roofArea, surfaceType);
      setData(res);
    } catch (err) {
      console.warn('Rainfall analysis fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRainfall(selectedLocation);
  }, [selectedLocation, roofArea, surfaceType]);

  const handleCustomLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearchQuery.trim()) return;
    const query = customSearchQuery.trim();
    setSearchStatus(`Connecting to satellite feeds for "${query}"...`);
    
    try {
      setSelectedLocation(query);
      const res = await api.getRainfallAnalysis(query, roofArea, surfaceType);
      setData(res);
      setSearchStatus(`✅ Loaded live meteorological data for ${res.location} (${res.annual_rainfall_mm} mm/year)`);
      setTimeout(() => setSearchStatus(null), 5000);
    } catch (err) {
      setSearchStatus('Failed to retrieve satellite feed. Using baseline.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Live Sensor Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              REAL-TIME SATELLITE & WEATHER API ACTIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
            Rainfall & Real-Time Meteorological Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Live atmospheric precipitation feeds, 7-day storm forecasts, and rooftop runoff modeling for {data?.location || 'your area'}.
          </p>
        </div>

        {/* Real-time Location Search */}
        <form onSubmit={handleCustomLocationSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search any global city/GPS..."
              value={customSearchQuery}
              onChange={e => setCustomSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-surface-darkcard border border-slate-200 dark:border-surface-darkborder text-xs text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500 w-52 sm:w-64"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Locate
          </button>
        </form>
      </div>

      {searchStatus && (
        <div className="p-3 rounded-xl bg-aqua-50 dark:bg-aqua-950/60 border border-aqua-200 dark:border-aqua-800 text-xs text-aqua-700 dark:text-aqua-300 font-medium">
          {searchStatus}
        </div>
      )}

      {/* Live Atmospheric Telemetry Banner */}
      {data?.live_weather && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-aqua-950 text-white shadow-soft">
          <div className="space-y-1">
            <span className="text-[11px] text-aqua-300 font-semibold flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              Live Temperature
            </span>
            <p className="text-xl font-black">{data.live_weather.current_temp_c}°C</p>
            <p className="text-[10px] text-slate-400">Atmospheric sensor feed</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-aqua-300 font-semibold flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-aqua-400" />
              Live Humidity
            </span>
            <p className="text-xl font-black">{data.live_weather.current_humidity_pct}%</p>
            <p className="text-[10px] text-slate-400">Relative humidity index</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-aqua-300 font-semibold flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-aqua-400" />
              Today's Precipitation
            </span>
            <p className="text-xl font-black text-aqua-300">{data.live_weather.current_rain_mm} mm</p>
            <p className="text-[10px] text-slate-400">24-hour accumulation</p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] text-aqua-300 font-semibold flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              Past 90-Days Sum
            </span>
            <p className="text-xl font-black text-emerald-300">{data.live_weather.past_90_days_sum_mm} mm</p>
            <p className="text-[10px] text-slate-400">Cumulative seasonal volume</p>
          </div>
        </div>
      )}

      {/* Filter and Configuration Controls */}
      <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-6 shadow-soft grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-aqua-500" />
            Regional Climate Zone
          </label>
          <select
            value={data?.selected_id || selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-xs font-semibold text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500"
          >
            {data?.regional_options?.map((opt: any) => (
              <option key={opt.id} value={opt.id}>
                {opt.name} ({opt.annual_mm} mm/yr)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-navy-500" />
            Catchment Roof Area (m²)
          </label>
          <input
            type="number"
            value={roofArea}
            onChange={e => setRoofArea(Number(e.target.value))}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-xs font-semibold text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-forest-500" />
            Catchment Surface Material
          </label>
          <select
            value={surfaceType}
            onChange={e => setSurfaceType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-surface-darkborder text-xs font-semibold text-navy-900 dark:text-white focus:outline-none focus:border-aqua-500 capitalize"
          >
            <option value="concrete">Concrete Terrace (C = 0.85)</option>
            <option value="metal">Metal / Corrugated (C = 0.90)</option>
            <option value="tile">Clay / Ceramic Tile (C = 0.75)</option>
            <option value="paved">Interlocking Pavers (C = 0.60)</option>
          </select>
        </div>
      </div>

      {/* Main Charts: Monthly Distribution & 7-Day Forecast */}
      {loading || !data ? (
        <LoadingSkeleton type="chart" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Rainfall & Harvest Potential */}
          <div className="lg:col-span-8">
            <ChartCard
              title={`Monthly Precipitation & Harvest Volume — ${data.location}`}
              subtitle={`Annual Total: ${data.annual_rainfall_mm} mm • Modeled rooftop yield: ${data.calculated_annual_harvest_litres.toLocaleString()} L/year`}
            >
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.monthly_trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rainfallGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#159BD7" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#159BD7" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0B3558',
                        borderRadius: '12px',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '12px',
                      }}
                      formatter={(val: any, name?: any) => [
                        name === 'rainfall_mm' ? `${val} mm` : `${Number(val).toLocaleString()} L`,
                        name === 'rainfall_mm' ? 'Rainfall' : 'Harvested Water',
                      ]}
                    />
                    <Area type="monotone" dataKey="rainfall_mm" stroke="#159BD7" strokeWidth={2.5} fill="url(#rainfallGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* 7-Day Live Precipitation Forecast */}
          <div className="lg:col-span-4 flex flex-col">
            <ChartCard
              title="7-Day Live Rain Forecast"
              subtitle="Open-Meteo storm radar prediction"
            >
              <div className="h-72 w-full pt-2">
                {data.live_weather?.forecast_7days ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.live_weather.forecast_7days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0B3558',
                          borderRadius: '12px',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '12px',
                        }}
                        formatter={(val: any) => [`${val} mm`, 'Expected Rain']}
                      />
                      <Bar dataKey="rain_mm" fill="#2FA36B" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    Live forecast loading...
                  </div>
                )}
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {/* Historical Comparison & Calculation Formula Box */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-6 shadow-soft space-y-4">
            <h3 className="text-base font-extrabold text-navy-900 dark:text-white">
              5-Year Climate Precipitation Trends ({data.location})
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center pt-2">
              {data.historical_comparison?.map((h: any) => (
                <div key={h.year} className="p-3 rounded-xl bg-slate-50 dark:bg-surface-dark border border-slate-100 dark:border-surface-darkborder">
                  <span className="text-[11px] font-bold text-slate-400 block">{h.year}</span>
                  <span className="text-sm font-black text-navy-900 dark:text-white block mt-1">{h.rainfall_mm} mm</span>
                  <span className={`text-[10px] font-bold ${h.deviation.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {h.deviation}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-6 shadow-soft space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-aqua-400">
                Hydrological Math Engine
              </span>
              <h4 className="text-sm font-extrabold text-white mt-1">
                Net Harvestable Yield Formula
              </h4>
              <p className="text-xs text-slate-300 font-mono mt-2 bg-white/10 p-2.5 rounded-xl">
                {data.formula_preview}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
              <span className="text-slate-300">Annual Harvest Potential:</span>
              <span className="text-base font-black text-aqua-300">
                {data.calculated_annual_harvest_litres?.toLocaleString()} Litres
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
