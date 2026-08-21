import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudRain,
  Droplets,
  Waves,
  Percent,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Sliders,
  Layers,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { DashboardData } from '../types';
import { KpiCard } from '../components/common/KpiCard';
import { WaterGauge } from '../components/common/WaterGauge';
import { ChartCard } from '../components/common/ChartCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [period, setPeriod] = useState<string>('daily');
  const [loading, setLoading] = useState<boolean>(true);
  const { property } = useAuth();
  const navigate = useNavigate();

  const fetchDashboard = async (selectedPeriod: string) => {
    try {
      setLoading(true);
      const res = await api.getDashboardData(selectedPeriod);
      setData(res);
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(period);
  }, [period]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl w-1/3 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="chart" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
            {data.greeting.headline}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {data.greeting.subheadline}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/harvesting')}
            className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs shadow-soft flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Droplets className="w-3.5 h-3.5 text-aqua-400" />
            <span>Harvesting Planner</span>
          </button>

          <button
            onClick={() => navigate('/simulator')}
            className="px-4 py-2.5 rounded-xl bg-aqua-500 hover:bg-aqua-600 text-white font-bold text-xs shadow-soft flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Water Simulator</span>
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          data={data.kpis.rainfall}
          icon={<CloudRain className="w-6 h-6" />}
          iconBgColor="bg-aqua-50 text-aqua-600 dark:bg-aqua-950/50 dark:text-aqua-300"
        />
        <KpiCard
          data={data.kpis.harvestable_water}
          icon={<Droplets className="w-6 h-6" />}
          iconBgColor="bg-navy-50 text-navy-700 dark:bg-navy-900/60 dark:text-aqua-300"
        />
        <KpiCard
          data={data.kpis.groundwater_level}
          icon={<Waves className="w-6 h-6" />}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
        />
        <KpiCard
          data={data.kpis.water_availability}
          icon={<Percent className="w-6 h-6" />}
          iconBgColor="bg-forest-50 text-forest-600 dark:bg-forest-950/50 dark:text-forest-300"
        />
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rainfall Trend Chart */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Rainfall & Catchment Inflow"
            subtitle="Precipitation depth vs harvestable yield over time"
            selectedPeriod={period}
            onPeriodChange={(p) => setPeriod(p)}
          >
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.rainfall_trend.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop stopColor="#159BD7" stopOpacity={0.4} />
                      <stop stopColor="#159BD7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
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
                      name === 'rainfall_mm' ? 'Rainfall Depth' : 'Harvested Water',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="rainfall_mm"
                    name="Rainfall Depth"
                    stroke="#159BD7"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#rainGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-surface-darkborder">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-aqua-500" />
                  <span>Rainfall (mm)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-navy-800 dark:bg-slate-300" />
                  <span>Harvest Volume (L)</span>
                </span>
              </div>
              <span className="font-semibold text-navy-900 dark:text-slate-300">
                Formula: P(mm) × A({property?.roof_area_sqm || 120} m²) × Runoff
              </span>
            </div>
          </ChartCard>
        </div>

        {/* Water Availability Radial Gauge */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-2xl p-6 shadow-soft flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-navy-900 dark:text-white tracking-tight">Water Availability</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Modeled supply sufficiency</p>
            </div>

            <WaterGauge
              percentage={data.water_availability_gauge.percentage}
              statusLabel={data.water_availability_gauge.status_label}
              daysOfAutonomy={data.water_availability_gauge.days_of_autonomy}
            />

            <button
              onClick={() => navigate('/simulator')}
              className="w-full py-2.5 rounded-xl bg-slate-50 dark:bg-surface-dark hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-surface-darkborder font-bold text-xs flex items-center justify-center gap-1.5 transition-colors mt-2"
            >
              <span>Test Dry-Spell Scenarios</span>
              <ArrowRight className="w-3.5 h-3.5 text-aqua-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Harvest vs Demand & Groundwater Depth Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Harvest vs Demand Bar Chart */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Annual Water Balance (Harvest vs Demand)"
            subtitle="Comparing rooftop capture, consumption, and aquifer injection"
          >
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.harvest_vs_demand} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${Math.round(val / 1000)}k L`} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={110} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B3558',
                      borderRadius: '12px',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${Number(val).toLocaleString()} Litres`, 'Volume']}
                  />
                  <Bar dataKey="volume" radius={[0, 8, 8, 0]}>
                    {data.harvest_vs_demand.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Groundwater Depth History & Health */}
        <div className="lg:col-span-6">
          <ChartCard
            title="Groundwater Table Trend (2022–2026)"
            subtitle="Historical aquifer depth progression in meters below ground level"
          >
            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.groundwater_trend.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[6, 11]} reversed tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B3558',
                      borderRadius: '12px',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} m depth (Reversed scale)`, 'Water Table Depth']}
                  />
                  <Line
                    type="monotone"
                    dataKey="depth_m"
                    stroke="#2FA36B"
                    strokeWidth={3}
                    dot={{ fill: '#2FA36B', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl mt-3 flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
                {data.groundwater_trend.interpretation}
              </p>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
