import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplets,
  CloudRain,
  Home,
  Waves,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Trees,
  Sliders,
  Sparkles,
  Calculator,
  Compass,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  Zap,
  Activity,
  Layers,
  Database,
  Award,
  HelpCircle,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { quickDemoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Quick estimator state right on hero
  const [quickRoofArea, setQuickRoofArea] = useState<number>(150);
  const [quickRainfall, setQuickRainfall] = useState<number>(850);
  const [quickSurface, setQuickSurface] = useState<string>('concrete');

  // Interactive Scenario Comparison state on Home
  const [activeScenarioTab, setActiveScenarioTab] = useState<'a' | 'b' | 'c'>('c');

  // Interactive AI sample question state
  const [activeAiQuestion, setActiveAiQuestion] = useState<number>(0);

  // Calculation: P * A * C
  const runoffCoeff = quickSurface === 'metal' ? 0.90 : quickSurface === 'concrete' ? 0.85 : quickSurface === 'tile' ? 0.75 : 0.60;
  const estimatedGrossHarvestL = Math.round(quickRainfall * quickRoofArea * runoffCoeff);
  const estimatedNetHarvestL = Math.round(estimatedGrossHarvestL * 0.90);
  const estimatedRechargeL = Math.round(estimatedNetHarvestL * 0.52);
  const estimatedTankSizeL = Math.min(10000, Math.max(1500, Math.round((quickRoofArea * 15) / 500) * 500));
  const waterSufficiencyPct = Math.min(100, Math.round((estimatedNetHarvestL / (360 * 365)) * 100));

  const waterCycleSteps = [
    {
      step: '01',
      title: 'Atmospheric Rain',
      subtitle: 'Regional Precipitation',
      icon: <CloudRain className="w-6 h-6 text-aqua-400" />,
      desc: 'Monsoon storms and seasonal showers deliver untreated precipitation across your geographical basin.',
      badge: 'Basin Intake'
    },
    {
      step: '02',
      title: 'Rooftop Catchment',
      subtitle: 'Runoff Interception',
      icon: <Home className="w-6 h-6 text-navy-400 dark:text-aqua-300" />,
      desc: 'Clean impervious roof materials collect high-velocity storm runoff with minimal surface absorption.',
      badge: `${Math.round(runoffCoeff * 100)}% Runoff Yield`
    },
    {
      step: '03',
      title: 'First-Flush & Filter',
      subtitle: 'Sediment Separation',
      icon: <Sliders className="w-6 h-6 text-forest-400" />,
      desc: 'Initial 1.5mm wash containing atmospheric particulate matter is automatically diverted via silt traps.',
      badge: '90% Filtration Pack'
    },
    {
      step: '04',
      title: 'Modular Storage',
      subtitle: 'Domestic Water Reserve',
      icon: <Droplets className="w-6 h-6 text-aqua-500" />,
      desc: 'Filtered rainwater is stored in sized cisterns supplying flushing, washing, and domestic autonomy.',
      badge: `${estimatedTankSizeL.toLocaleString()} L Optimal Buffer`
    },
    {
      step: '05',
      title: 'Aquifer Recharge',
      subtitle: 'Subsurface Replenishment',
      icon: <Waves className="w-6 h-6 text-emerald-400" />,
      desc: 'Surplus overflow is routed into recharge pits and injection wells to revive falling groundwater tables.',
      badge: `${estimatedRechargeL.toLocaleString()} L/yr Injected`
    },
  ];

  const targetPersonas = [
    {
      id: 'house',
      icon: <Home className="w-6 h-6 text-aqua-500" />,
      title: "Individual Households",
      subtitle: "Residential Terraces & Villas",
      highlight: "Save $450+/year on water tankers",
      desc: "Accurately size rooftop storage tanks, install compact recharge soakaways, and achieve up to 80% independent water security.",
      stats: ["120-250 m² Roofs", "2,000-5,000 L Storage", "Recharge Pit Setup"]
    },
    {
      id: 'apartments',
      icon: <Building2 className="w-6 h-6 text-navy-600 dark:text-aqua-400" />,
      title: "Apartment Communities",
      subtitle: "Multi-Tower Housing Societies",
      highlight: "60% reduction in groundwater drawdown",
      desc: "Simulate interconnected multi-block catchment drainage, central dual-chamber filtration batteries, and multi-well injection.",
      stats: ["1,000-5,000 m² Catchment", "25k-100k L Cisterns", "Dual Recharge Trenches"]
    },
    {
      id: 'campuses',
      icon: <GraduationCap className="w-6 h-6 text-forest-500" />,
      title: "Schools & Universities",
      subtitle: "Institutional Campuses",
      highlight: "Positive Net-Zero Water demonstration",
      desc: "Transform expansive institutional roofs, sports fields, and quadrangles into sustainable water-harvesting living laboratories.",
      stats: ["2,500+ m² Footprint", "Percolation Basins", "CGWB Compliance"]
    },
    {
      id: 'farmers',
      icon: <Trees className="w-6 h-6 text-emerald-500" />,
      title: "Farmers & Watersheds",
      subtitle: "Agricultural Land & Farms",
      highlight: "Revive dried summer borewells",
      desc: "Plan farm ponds, boulder check dams, and recharge shafts to capture seasonal monsoon torrents and replenish unconfined aquifers.",
      stats: ["Open Acreage Capture", "Percolation Ponds", "Borewell Recharge"]
    }
  ];

  const sampleAiQuestions = [
    {
      q: "How much water can my 150 m² roof collect?",
      a: "Based on 850 mm annual rainfall, a 150 m² concrete roof yields approximately 108,375 L/year of gross runoff. After first-flush diversion and filtration, you can utilize ~97,500 L/year for domestic autonomy."
    },
    {
      q: "Should I build a recharge pit or a recharge well?",
      a: "For shallow water tables (<10m depth) and residential catchments, a compact Recharge Pit (1.5m × 1.5m × 2m) with graded gravel packs is most cost-effective. If your aquifer is deep (>15m) beneath dense clay, a Recharge Shaft / Well is recommended."
    },
    {
      q: "How does AquaRegen reduce groundwater dependency?",
      a: "By directly utilizing harvested tank storage during rainy spells and injecting surplus overflow to recharge your localized water table, your reliance on external supply or deep pumping is reduced by 40% to 65%."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5FAFC] dark:bg-[#071322] text-slate-800 dark:text-slate-100 flex flex-col selection:bg-aqua-500 selection:text-white transition-colors duration-300">
      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-aqua-500/15 via-forest-500/10 to-navy-600/20 blur-[120px] rounded-full" />
        <div className="absolute top-[60%] -left-40 w-[600px] h-[600px] bg-aqua-500/10 blur-[140px] rounded-full" />
        <div className="absolute top-[75%] -right-40 w-[600px] h-[600px] bg-forest-500/10 blur-[140px] rounded-full" />
      </div>

      {/* Sticky Glass Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#071322]/85 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/80 px-4 sm:px-8 lg:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0B3558] via-[#159BD7] to-[#2FA36B] flex items-center justify-center text-white shadow-md shadow-aqua-500/20 group-hover:scale-105 transition-transform duration-300">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-[#072038] dark:text-white tracking-tight">AquaRegen</span>
                <span className="px-1.5 py-0.2 rounded bg-aqua-50 dark:bg-aqua-950 text-aqua-600 dark:text-aqua-400 text-[10px] font-bold border border-aqua-200 dark:border-aqua-800">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-aqua-600 dark:text-aqua-400">
                Climate-Tech Water Security
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#water-cycle" className="hover:text-aqua-600 dark:hover:text-aqua-400 transition-colors">Water Cycle</a>
            <a href="#calculator" className="hover:text-aqua-600 dark:hover:text-aqua-400 transition-colors">Interactive Estimator</a>
            <a href="#scenarios" className="hover:text-aqua-600 dark:hover:text-aqua-400 transition-colors">What-If Scenarios</a>
            <a href="#sectors" className="hover:text-aqua-600 dark:hover:text-aqua-400 transition-colors">Target Sectors</a>
            <a href="#ai-assistant" className="hover:text-aqua-600 dark:hover:text-aqua-400 transition-colors">Aqua AI</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              onClick={() => quickDemoLogin().then(() => navigate('/dashboard'))}
              className="hidden sm:inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Demo</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="px-3.5 py-2 text-xs font-bold text-[#0B3558] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#0B3558] to-[#159BD7] hover:opacity-95 rounded-xl shadow-md shadow-aqua-500/25 transition-all hover:scale-[1.02]"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 pb-20 px-4 sm:px-8 lg:px-12 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aqua-50 dark:bg-aqua-950/70 border border-aqua-200 dark:border-aqua-800/80 text-aqua-700 dark:text-aqua-300 text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-aqua-500 animate-ping" />
              Decision-Support Platform for Rainwater Harvesting & Groundwater Recharge
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#072038] dark:text-white tracking-tight leading-[1.12]">
              Turn Rainfall Into <br />
              <span className="bg-gradient-to-r from-[#0B3558] via-[#159BD7] to-[#2FA36B] bg-clip-text text-transparent">
                Water Security.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Analyze local rainfall patterns, estimate rooftop harvesting potential, design geological groundwater recharge structures, and simulate how every drop improves your water availability.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#0B3558] via-[#159BD7] to-[#2FA36B] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-aqua-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
              >
                <span>Start Water Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => quickDemoLogin().then(() => navigate('/dashboard'))}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[#072038] dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Activity className="w-4 h-4 text-aqua-500" />
                <span>Explore Live Dashboard</span>
              </button>
            </div>

            {/* Credibility Counter Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800 text-center lg:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#072038] dark:text-white">100%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Physical Hydrology Model</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-aqua-600 dark:text-aqua-400">40-65%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Groundwater Reduction</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-forest-600 dark:text-forest-400">+2.4m</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Aquifer Table Recovery</p>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Interactive Rooftop Simulator Widget */}
          <div className="lg:col-span-5" id="calculator">
            <div className="bg-white dark:bg-[#122033] border border-slate-200/80 dark:border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-900/5 relative overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-aqua-50 dark:bg-aqua-950 text-aqua-600 dark:text-aqua-400 flex items-center justify-center font-bold">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#072038] dark:text-white text-sm">Instant Catchment Estimator</h3>
                    <p className="text-[10px] text-slate-400">Scientific Yield Engine ($P \times A \times C$)</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-aqua-600 dark:text-aqua-400 bg-aqua-50 dark:bg-aqua-950/70 border border-aqua-200 dark:border-aqua-800 px-2 py-0.5 rounded-full">
                  Live Calculator
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Catchment Slider */}
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-600 dark:text-slate-300">Rooftop Catchment Area</span>
                    <span className="text-[#072038] dark:text-white font-extrabold text-sm">{quickRoofArea} m²</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={800}
                    step={10}
                    value={quickRoofArea}
                    onChange={e => setQuickRoofArea(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg accent-aqua-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>50 m²</span>
                    <span>800 m²</span>
                  </div>
                </div>

                {/* Rainfall Slider */}
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-600 dark:text-slate-300">Annual Rainfall Depth</span>
                    <span className="text-[#072038] dark:text-white font-extrabold text-sm">{quickRainfall} mm</span>
                  </div>
                  <input
                    type="range"
                    min={400}
                    max={2200}
                    step={50}
                    value={quickRainfall}
                    onChange={e => setQuickRainfall(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg accent-aqua-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>400 mm (Semi-Arid)</span>
                    <span>2,200 mm (Monsoon)</span>
                  </div>
                </div>

                {/* Surface Material Chips */}
                <div>
                  <label className="font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                    Roof Surface Material
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'concrete', label: 'Concrete', coeff: '0.85' },
                      { id: 'metal', label: 'Metal', coeff: '0.90' },
                      { id: 'tile', label: 'Tile', coeff: '0.75' },
                      { id: 'paved', label: 'Pavers', coeff: '0.60' },
                    ].map(mat => (
                      <button
                        key={mat.id}
                        onClick={() => setQuickSurface(mat.id)}
                        className={`py-1.5 rounded-xl font-bold border transition-all text-[11px] ${
                          quickSurface === mat.id
                            ? 'bg-[#0B3558] text-white border-[#0B3558] dark:bg-aqua-500 dark:border-aqua-500 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {mat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-time Calculation Result Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B3558] via-[#072038] to-[#041424] text-white space-y-2.5 mt-4 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-aqua-300 text-xs font-semibold">Net Harvestable Water:</span>
                    <span className="text-xl font-black text-white">{estimatedNetHarvestL.toLocaleString()} L/yr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1.5 border-t border-white/10 text-slate-300">
                    <span className="text-emerald-300">Aquifer Recharge Inflow:</span>
                    <span className="font-bold text-emerald-300">{estimatedRechargeL.toLocaleString()} L/yr</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-white/10 text-slate-300">
                    <span>Recommended Tank:</span>
                    <span className="font-bold text-aqua-200">{estimatedTankSizeL.toLocaleString()} Litres</span>
                  </div>
                  <p className="text-[10px] text-slate-400 italic pt-1 font-mono">
                    {quickRainfall} mm × {quickRoofArea} m² × {runoffCoeff} = {estimatedGrossHarvestL.toLocaleString()} L gross
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/harvesting?area=${quickRoofArea}&rain=${quickRainfall}&surface=${quickSurface}`)}
                  className="w-full py-3 rounded-xl bg-aqua-500 hover:bg-aqua-600 text-white font-bold text-xs shadow-md shadow-aqua-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Full Harvesting Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Water Cycle Architecture */}
      <section id="water-cycle" className="py-20 px-4 sm:px-8 lg:px-12 bg-white dark:bg-[#0c1b2c] border-y border-slate-200/80 dark:border-slate-800 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-wider text-aqua-600 dark:text-aqua-400">
              End-to-End Closed Loop Flow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#072038] dark:text-white mt-1">
              From Atmospheric Cloud to Groundwater Aquifer
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Understand the complete transformation path that turns intermittent heavy rainstorms into continuous year-round water security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {waterCycleSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative bg-[#F5FAFC] dark:bg-[#071322] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between group hover:border-aqua-400 hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                    <span className="text-xs font-black text-slate-400 dark:text-slate-500">
                      Step {step.step}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-[#072038] dark:text-white text-base leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-aqua-600 dark:text-aqua-400 mt-0.5 mb-2">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {step.badge}
                  </span>
                </div>

                {idx < 4 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 z-10 pointer-events-none">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive What-If Scenario Matrix Section */}
      <section id="scenarios" className="py-20 px-4 sm:px-8 lg:px-12 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-forest-600 dark:text-forest-400">
              Comparative Impact Modeling
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#072038] dark:text-white mt-1">
              What-If Scenario Comparison
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              See the exact numerical difference across baseline dependency, tank harvesting, and full aquifer recharge.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scenario A Card */}
            <div className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
              activeScenarioTab === 'a'
                ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-400 ring-2 ring-rose-400/20 shadow-lg'
                : 'bg-white dark:bg-[#122033] border-slate-200 dark:border-slate-800 shadow-soft'
            }`}
            onClick={() => setActiveScenarioTab('a')}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Scenario A
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    100% Depletion
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#072038] dark:text-white mb-2">
                  Without Rainwater Harvesting
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Complete reliance on external municipal tankers or intensive groundwater extraction. Stormwater is 100% lost to surface drain runoff.
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Groundwater Drawn:</span>
                    <span className="font-extrabold text-rose-600">131,400 L/year</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Rainwater Utilized:</span>
                    <span className="font-bold text-slate-400">0 L</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Water Sufficiency:</span>
                    <span className="font-extrabold text-rose-600">0%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                <span className="text-xs font-bold text-rose-600">Net Aquifer Balance: -131,400 L/yr ⚠️</span>
              </div>
            </div>

            {/* Scenario B Card */}
            <div className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
              activeScenarioTab === 'b'
                ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-400 ring-2 ring-amber-400/20 shadow-lg'
                : 'bg-white dark:bg-[#122033] border-slate-200 dark:border-slate-800 shadow-soft'
            }`}
            onClick={() => setActiveScenarioTab('b')}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Scenario B
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Moderate Autonomy
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#072038] dark:text-white mb-2">
                  With Rainwater Harvesting Only
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Filtered roof runoff is stored in a domestic cistern. Peak monsoon surplus overflows into storm sewers unmanaged.
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Groundwater Drawn:</span>
                    <span className="font-extrabold text-amber-600">54,800 L/year</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Rainwater Utilized:</span>
                    <span className="font-bold text-aqua-600 dark:text-aqua-400">76,600 L</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Water Sufficiency:</span>
                    <span className="font-extrabold text-amber-600">58%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                <span className="text-xs font-bold text-amber-600">Net Aquifer Balance: -54,800 L/yr 🟡</span>
              </div>
            </div>

            {/* Scenario C Card (Optimal) */}
            <div className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
              activeScenarioTab === 'c'
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl'
                : 'bg-white dark:bg-[#122033] border-slate-200 dark:border-slate-800 shadow-soft'
            }`}
            onClick={() => setActiveScenarioTab('c')}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Scenario C (Recommended)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Optimal Security
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-[#072038] dark:text-white mb-2">
                  With RWH + Groundwater Recharge
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  Direct cistern storage handles household consumption while all surplus overflow is directed into a Recharge Pit/Well to replenish the aquifer!
                </p>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Groundwater Drawn:</span>
                    <span className="font-extrabold text-emerald-600">22,400 L/year</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Aquifer Recharged:</span>
                    <span className="font-extrabold text-forest-600 dark:text-forest-400">+56,200 L</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500">Water Sufficiency:</span>
                    <span className="font-extrabold text-emerald-600">88% – 95%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Net Positive Water Impact: +33,800 L 🌱</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Sectors Solutions Section */}
      <section id="sectors" className="py-20 px-4 sm:px-8 lg:px-12 bg-white dark:bg-[#0c1b2c] border-y border-slate-200/80 dark:border-slate-800 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-wider text-aqua-600 dark:text-aqua-400">
              Engineered Across Every Scale
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#072038] dark:text-white mt-1">
              Who Benefits From AquaRegen?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              From compact residential terraces to massive agricultural watersheds and municipal planning sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {targetPersonas.map((persona) => (
              <div
                key={persona.id}
                className="bg-[#F5FAFC] dark:bg-[#071322] border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    {persona.icon}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-aqua-600 dark:text-aqua-400">
                    {persona.subtitle}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#072038] dark:text-white mt-0.5 mb-2">
                    {persona.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {persona.desc}
                  </p>
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 mb-4">
                    ✓ {persona.highlight}
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
                  {persona.stats.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-aqua-500" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Aqua AI Teaser Section */}
      <section id="ai-assistant" className="py-20 px-4 sm:px-8 lg:px-12 z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#0B3558] via-[#072038] to-[#041424] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-aqua-500 to-forest-500 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Aqua AI Assistant</h3>
                  <p className="text-xs text-aqua-200">Context-Grounded Hydrological Intelligence</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/ai')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-aqua-500 to-forest-500 hover:opacity-95 text-white text-xs font-extrabold shadow-md transition-all self-start sm:self-auto flex items-center gap-2"
              >
                <span>Launch Full Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive Query Chips */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Click a sample query to preview real-time AI reasoning:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleAiQuestions.map((qa, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveAiQuestion(i)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeAiQuestion === i
                        ? 'bg-aqua-500 text-white shadow-md'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {qa.q}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Response Card Preview */}
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm text-slate-100 leading-relaxed space-y-2">
              <div className="flex items-center gap-2 text-aqua-300 font-bold text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Aqua AI Response Preview:</span>
              </div>
              <p className="whitespace-pre-line">{sampleAiQuestions[activeAiQuestion].a}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Global Bottom CTA Section */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 text-center z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#072038] dark:text-white tracking-tight">
            Ready to secure your property's water future?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Join households, institutions, and communities using AquaRegen to turn seasonal rainfall into permanent water security.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0B3558] via-[#159BD7] to-[#2FA36B] hover:opacity-95 text-white font-black text-sm shadow-xl shadow-aqua-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => quickDemoLogin().then(() => navigate('/dashboard'))}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#072038] dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all"
            >
              <span>Launch Demo Mode</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#041424] text-white py-12 px-4 sm:px-8 lg:px-12 border-t border-slate-800 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-aqua-500 to-forest-500 flex items-center justify-center text-white font-bold shadow-sm">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-base text-white tracking-tight">AquaRegen</span>
              <p className="text-[11px] text-slate-400">Turn Rainfall Into Water Security.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#water-cycle" className="hover:text-white transition-colors">Water Cycle</a>
            <a href="#calculator" className="hover:text-white transition-colors">Estimator</a>
            <a href="#scenarios" className="hover:text-white transition-colors">What-If Scenarios</a>
            <a href="#sectors" className="hover:text-white transition-colors">Sectors</a>
            <a href="#ai-assistant" className="hover:text-white transition-colors">Aqua AI</a>
          </div>

          <p className="text-[11px] text-slate-500">
            © 2026 AquaRegen Platform. Climate-Tech Decision Support.
          </p>
        </div>
      </footer>
    </div>
  );
};
