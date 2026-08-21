import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Droplets,
  Waves,
  Trees,
  DollarSign,
  Award,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  Info
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
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { ImpactAnalyticsData } from '../types';
import { KpiCard } from '../components/common/KpiCard';
import { ChartCard } from '../components/common/ChartCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const AnalyticsPage: React.FC = () => {
  const { user, property } = useAuth();
  const [data, setData] = useState<ImpactAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.getImpactAnalytics();
      setData(res);
    } catch (err) {
      console.warn('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
            Impact & Sustainability Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Modeled long-term aquifer contributions, extraction savings, and ecological sustainability offsets.
          </p>
        </div>

        <button
          onClick={handleCelebrate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-forest-600 to-emerald-500 hover:opacity-95 text-white font-bold text-xs shadow-soft transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Celebrate Impact</span>
        </button>
      </div>

      {loading || !data ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </div>
          <LoadingSkeleton type="chart" />
        </div>
      ) : (
        <>
          {/* Positive Impact Headline Banner */}
          <div className="bg-gradient-to-br from-emerald-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-soft-lg border border-emerald-800/40 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <span>{data.sustainability_summary.badge}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {data.sustainability_summary.headline}
              </h2>
              <p className="text-xs text-slate-300">
                Modeled for <strong className="text-white">{property?.name || 'Your Property'}</strong> with {property?.roof_area_sqm || 120} m² catchment in {property?.location || 'Bengaluru'}.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Pumping Carbon Offset</span>
                  <span className="text-lg font-black text-emerald-300">
                    {data.sustainability_summary.carbon_offset_kg} kg CO₂e
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Equivalent Trees Planted</span>
                  <span className="text-lg font-black text-forest-300">
                    ~{data.sustainability_summary.tree_equivalent} Trees
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Modeled Cost Savings</span>
                  <span className="text-lg font-black text-aqua-300">
                    ${data.sustainability_summary.estimated_cost_savings_usd}/yr
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Cumulative KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <KpiCard
              data={data.kpis.water_harvested}
              icon={<Droplets className="w-6 h-6" />}
              iconBgColor="bg-aqua-50 text-aqua-600 dark:bg-aqua-950/50 dark:text-aqua-300"
            />
            <KpiCard
              data={data.kpis.groundwater_saved}
              icon={<Waves className="w-6 h-6" />}
              iconBgColor="bg-navy-50 text-navy-700 dark:bg-navy-900/60 dark:text-aqua-300"
            />
            <KpiCard
              data={data.kpis.recharge_achieved}
              icon={<Award className="w-6 h-6" />}
              iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
            />
            <KpiCard
              data={data.kpis.dependency_reduction}
              icon={<Trees className="w-6 h-6" />}
              iconBgColor="bg-forest-50 text-forest-600 dark:bg-forest-950/50 dark:text-forest-300"
            />
          </div>

          {/* Cumulative Impact Growth Chart */}
          <ChartCard
            title="Cumulative 12-Month Environmental Contribution"
            subtitle="Accumulated water volume harvested, recharged, and prevented from aquifer extraction"
          >
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.cumulative_trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rechargeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop stopColor="#2FA36B" stopOpacity={0.4} />
                      <stop stopColor="#2FA36B" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="harvestGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop stopColor="#159BD7" stopOpacity={0.4} />
                      <stop stopColor="#159BD7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `${Math.round(v/1000)}k L`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B3558',
                      borderRadius: '12px',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                    formatter={(val: any, name?: any) => [
                      `${Number(val).toLocaleString()} L`,
                      name === 'harvested_cumulative' ? 'Cumulative Harvest' : name === 'recharge_cumulative' ? 'Cumulative Aquifer Recharge' : 'Groundwater Saved',
                    ]}
                  />
                  <Area type="monotone" dataKey="harvested_cumulative" name="harvested_cumulative" stroke="#159BD7" strokeWidth={3} fill="url(#harvestGrad2)" />
                  <Area type="monotone" dataKey="recharge_cumulative" name="recharge_cumulative" stroke="#2FA36B" strokeWidth={3} fill="url(#rechargeGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Distinction / Disclaimer Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-surface-darkcard border border-slate-200/80 dark:border-surface-darkborder flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-aqua-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{data.measurement_disclaimer}</p>
          </div>
        </>
      )}
    </div>
  );
};
