import React, { useState, useEffect } from 'react';
import {
  CloudRain,
  Calendar,
  MapPin,
  Layers,
  Droplets,
  TrendingUp,
  Info,
  ArrowRight,
  Zap,
  Thermometer,
  Wind,
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
  const [selectedLocation, setSelectedLocation] = useState<string>('bengaluru');
  const [roofArea, setRoofArea] = useState<number>(property?.roof_area_sqm || 120);
  const [surfaceType, setSurfaceType] = useState<string>(property?.surface_type || 'concrete');
  const [customSearchQuery, setCustomSearchQuery] = useState<string>('');
  const [searchStatus, setSearchStatus] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRainfall = async () => {
    setLoading(true);
    try {
      const res = await api.getRainfallAnalysis(selectedLocation, roofArea, surfaceType);
      setData(res);
    } catch (err) {
      console.warn('Rainfall analysis fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRainfall();
  }, [selectedLocation, roofArea, surfaceType]);

  const handleCustomLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSearchQuery.trim()) return;
    setSearchStatus('Geocoding in real-time...');
    try {
      const json = await api.searchLocation(customSearchQuery);
      if (json.found && json.location) {
        setSearchStatus(`Found: ${json.location.name.slice(0, 45)}...`);
        // Fetch live weather for coordinates
        const liveJson = await api.getLiveWeather(json.location.latitude, json.location.longitude);
        if (data) {
          setData({
            ...data,
            location: json.location.name.split(',')[0],
            annual_rainfall_mm: liveJson.annual_rainfall_mm,
            live_weather: liveJson
          });
        }
      } else {
        setSearchStatus('Location not found in satellite database.');
      }
    } catch (err) {
      setSearchStatus('Live lookup unavailable.');
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
            Live atmospheric precipitation feeds, 7-day storm forecasts, and rooftop runoff modeling.
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
            className="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-900 text-white text-xs font-bold transition-all"
          >
            Locate
          </button>
        </form>
      </div>

      {searchStatus && (
        <div className="p-2.5 rounded-xl bg-aqua-50 dark:bg-aqua-950/60 border border-aqua-200 dark:border-aqua-800 text-xs text-aqua-700 dark:text-aqua-300 font-medium">
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
              <Wind className="w-3.5 h-3.5 text-aqua-400" />
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
            value={selectedLocation}
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

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <>
          {/* 7-Day Live Precipitation Forecast Chart */}
          {data?.live_weather?.forecast_7_days?.length > 0 && (
            <ChartCard
              title="7-Day Live Meteorological Rain Forecast"
              subtitle="Direct satellite precipitation model from Open-Meteo"
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.live_weather.forecast_7_days}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(11, 53, 88, 0.06)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} unit=" mm" />
                    <Tooltip
                      formatter={(val: any) => [`${val} mm`, 'Forecast Rain']}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="precipitation_mm" fill="#159BD7" radius={[6, 6, 0, 0]} name="Expected Rain (mm)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          )}

          {/* Monthly Distribution Chart */}
          <ChartCard
            title={`Monthly Precipitation & Harvest Yield — ${data?.location}`}
            subtitle={`Annual Baseline: ${data?.annual_rainfall_mm} mm • Peak Month: ${data?.peak_month}`}
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.monthly_trend}>
                  <defs>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#159BD7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#159BD7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(11, 53, 88, 0.06)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} unit=" mm" />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} unit=" L" />
                  <Tooltip
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="rainfall_mm"
                    stroke="#159BD7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#rainGrad)"
                    name="Rainfall (mm)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* 5-Year Historical Comparison */}
          <ChartCard
            title="5-Year Climate Precipitation Comparison"
            subtitle="Annual rainfall variance and climate trend analysis"
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {data?.historical_comparison?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-surface-dark border border-slate-100 dark:border-surface-darkborder text-center space-y-1"
                >
                  <p className="text-xs font-bold text-slate-400">{item.year}</p>
                  <p className="text-lg font-black text-navy-900 dark:text-white">
                    {item.rainfall_mm} <span className="text-xs font-normal">mm</span>
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      item.deviation.startsWith('+')
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {item.deviation}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </>
      )}
    </div>
  );
};
