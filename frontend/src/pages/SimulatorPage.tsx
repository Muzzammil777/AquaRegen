import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Waves,
  Droplets,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { SimulationResult, ScenarioComparison } from '../types';
import { ChartCard } from '../components/common/ChartCard';
import { Slider } from '../components/common/CalculatorInput';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const SimulatorPage: React.FC = () => {
  const { property } = useAuth();

  // Interactive Live Sliders State
  const [rainfall, setRainfall] = useState<number>(property?.annual_rainfall_mm || 850);
  const [roofArea, setRoofArea] = useState<number>(property?.roof_area_sqm || 120);
  const [storageCapacity, setStorageCapacity] = useState<number>(property?.storage_capacity_litres || 2000);
  const [dailyDemand, setDailyDemand] = useState<number>(property?.daily_demand_litres || 360);
  const [rechargeCapacity, setRechargeCapacity] = useState<number>(50000);

  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioComparison | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const runSimulation = async () => {
    try {
      setLoading(true);
      const [resSim, resScenarios] = await Promise.all([
        api.simulateWater({
          annual_rainfall_mm: rainfall,
          roof_area_sqm: roofArea,
          storage_capacity_litres: storageCapacity,
          daily_demand_litres: dailyDemand,
        }),
        api.compareScenarios({
          annual_rainfall_mm: rainfall,
          roof_area_sqm: roofArea,
          storage_capacity_litres: storageCapacity,
          daily_demand_litres: dailyDemand,
        }),
      ]);
      setSimResult(resSim);
      setScenarios(resScenarios);
    } catch (err) {
      console.warn('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation();
    }, 150);
    return () => clearTimeout(timer);
  }, [rainfall, roofArea, storageCapacity, dailyDemand, rechargeCapacity]);

  const handleReset = () => {
    setRainfall(property?.annual_rainfall_mm || 850);
    setRoofArea(property?.roof_area_sqm || 120);
    setStorageCapacity(property?.storage_capacity_litres || 2000);
    setDailyDemand(property?.daily_demand_litres || 360);
  };

  // Prepare Comparative Chart Data
  const comparativeChartData = scenarios ? [
    {
      name: 'Groundwater Drawn',
      'Without RWH': scenarios.scenario_a.groundwater_dependency_litres,
      'With RWH Only': scenarios.scenario_b.groundwater_dependency_litres,
      'With RWH + Recharge': scenarios.scenario_c.groundwater_dependency_litres,
    },
    {
      name: 'Rainwater Utilized',
      'Without RWH': scenarios.scenario_a.rainwater_utilized_litres,
      'With RWH Only': scenarios.scenario_b.rainwater_utilized_litres,
      'With RWH + Recharge': scenarios.scenario_c.rainwater_utilized_litres,
    },
    {
      name: 'Aquifer Injected',
      'Without RWH': scenarios.scenario_a.recharge_achieved_litres,
      'With RWH Only': scenarios.scenario_b.recharge_achieved_litres,
      'With RWH + Recharge': scenarios.scenario_c.recharge_achieved_litres,
    },
  ] : [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Reset Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 dark:text-white tracking-tight">
            Water Availability & What-If Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dynamic live water balance engine: model changing climate conditions, storage sizing, and scenario comparisons.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-surface-darkcard border border-slate-200 dark:border-surface-darkborder text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-dark shadow-sm transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Main Simulator Grid: Controls + Live Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sliders Panel */}
        <div className="lg:col-span-6 bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-3xl p-6 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4 text-aqua-500" />
            <span>Dynamic System Levers</span>
          </h3>

          <Slider
            label="Annual Rainfall"
            value={rainfall}
            min={300}
            max={2500}
            step={25}
            unit="mm"
            onChange={setRainfall}
            description="Precipitation Depth"
          />

          <Slider
            label="Catchment Roof Area"
            value={roofArea}
            min={40}
            max={1000}
            step={10}
            unit="m²"
            onChange={setRoofArea}
            description="Harvesting Footprint"
          />

          <Slider
            label="Storage Tank Capacity"
            value={storageCapacity}
            min={500}
            max={20000}
            step={500}
            unit="L"
            onChange={setStorageCapacity}
            description="Buffer Reservoir"
          />

          <Slider
            label="Daily Domestic Demand"
            value={dailyDemand}
            min={100}
            max={2000}
            step={25}
            unit="L/day"
            onChange={setDailyDemand}
            description="Consumption Rate"
          />

          <Slider
            label="Recharge Structure Capacity"
            value={rechargeCapacity}
            min={10000}
            max={150000}
            step={5000}
            unit="L/yr"
            onChange={setRechargeCapacity}
            description="Subsurface Intake"
          />
        </div>

        {/* Live Simulation Outcomes */}
        <div className="lg:col-span-6 space-y-6">
          {loading || !simResult ? (
            <div className="space-y-4">
              <LoadingSkeleton type="card" />
              <LoadingSkeleton type="chart" />
            </div>
          ) : (
            <>
              {/* 4 Live Outcome Tiles */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-navy-900 to-navy-800 text-white p-5 rounded-2xl shadow-soft border border-navy-700">
                  <span className="text-[11px] font-semibold text-aqua-300 uppercase tracking-wider block mb-1">
                    Potential Harvest
                  </span>
                  <p className="text-2xl font-black text-white">
                    {Math.round(simResult.potential_harvest_litres).toLocaleString()} L
                  </p>
                  <p className="text-[11px] text-slate-300 mt-1">Available Rooftop Yield</p>
                </div>

                <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder p-5 rounded-2xl shadow-soft">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Annual Demand
                  </span>
                  <p className="text-2xl font-black text-navy-900 dark:text-white">
                    {Math.round(simResult.annual_demand_litres).toLocaleString()} L
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{dailyDemand} L/day modeled</p>
                </div>

                <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder p-5 rounded-2xl shadow-soft">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Groundwater Dependency
                  </span>
                  <p className="text-2xl font-black text-amber-500">
                    {simResult.groundwater_dependency_pct}%
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">External pumping needed</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-900/90 to-emerald-800 text-white p-5 rounded-2xl shadow-soft border border-emerald-700">
                  <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider block mb-1">
                    Water Sufficiency
                  </span>
                  <p className="text-2xl font-black text-white">
                    {simResult.water_sufficiency_pct}%
                  </p>
                  <p className="text-[11px] text-emerald-200 mt-1">Self-reliance index</p>
                </div>
              </div>

              {/* Monthly Water Balance Simulation Curve */}
              <ChartCard
                title="12-Month Dynamic Mass Balance"
                subtitle="Monthly precipitation inflow vs tank reserve vs groundwater drawdown"
              >
                <div className="h-56 w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={simResult.monthly_breakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="harvestGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop stopColor="#159BD7" stopOpacity={0.4} />
                          <stop stopColor="#159BD7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                          name === 'harvest_inflow_litres' ? 'Harvest Inflow' : name === 'tank_level_litres' ? 'Tank Reserve' : 'Deficit Drawn',
                        ]}
                      />
                      <Area type="monotone" dataKey="harvest_inflow_litres" name="harvest_inflow_litres" stroke="#159BD7" strokeWidth={2} fill="url(#harvestGrad)" />
                      <Area type="monotone" dataKey="tank_level_litres" name="tank_level_litres" stroke="#2FA36B" strokeWidth={2} fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </>
          )}
        </div>
      </div>

      {/* What-If Scenario Matrix Section */}
      {scenarios && (
        <div className="bg-white dark:bg-surface-darkcard border border-slate-100 dark:border-surface-darkborder rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-surface-darkborder">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-forest-600 dark:text-forest-400">
                Decision Support Comparison
              </span>
              <h3 className="text-xl font-extrabold text-navy-900 dark:text-white mt-0.5">
                What-If Scenario Matrix
              </h3>
            </div>
            <div className="p-2.5 rounded-xl bg-forest-50 dark:bg-forest-950/60 border border-forest-200/80 dark:border-forest-800 text-xs text-forest-900 dark:text-forest-200 font-bold">
              {scenarios.insights.summary_text}
            </div>
          </div>

          {/* Side-by-side Comparative Visual Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativeChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${Math.round(v/1000)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0B3558',
                    borderRadius: '12px',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${Number(val).toLocaleString()} L`, '']}
                />
                <Legend />
                <Bar dataKey="Without RWH" fill="#EF4444" radius={[6, 6, 0, 0]} />
                <Bar dataKey="With RWH Only" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="With RWH + Recharge" fill="#2FA36B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparative Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-surface-darkborder text-slate-400 uppercase font-bold">
                  <th className="py-3.5 px-4">Performance Indicator</th>
                  <th className="py-3.5 px-4 text-rose-600 dark:text-rose-400">Scenario A (Without RWH)</th>
                  <th className="py-3.5 px-4 text-amber-600 dark:text-amber-400">Scenario B (With RWH Only)</th>
                  <th className="py-3.5 px-4 text-emerald-600 dark:text-emerald-400">Scenario C (With RWH + Recharge)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {scenarios.comparison_table.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-surface-dark/40">
                    <td className="py-3.5 px-4 font-bold text-navy-900 dark:text-white">{row.metric}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{row.scenario_a}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">{row.scenario_b}</td>
                    <td className="py-3.5 px-4 font-extrabold text-forest-600 dark:text-forest-400 bg-emerald-50/40 dark:bg-emerald-950/20">
                      {row.scenario_c}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
