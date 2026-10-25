import React from 'react';
import {
  Cpu,
  Sliders,
  Radio,
  RotateCw,
  Volume2,
  ExternalLink,
  Play,
  Sparkles,
  ArrowRight,
  Info,
  Layers,
  Activity,
  CheckCircle2,
  Workflow
} from 'lucide-react';

export const HardwareDemoSection: React.FC = () => {
  const videoUrl = (import.meta.env.VITE_AQUAREGEN_HARDWARE_VIDEO_URL || '').trim();
  const wokwiUrl = (import.meta.env.VITE_AQUAREGEN_WOKWI_URL || '').trim();

  // Helper to determine if video URL is a YouTube/Vimeo embed or standard video file
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    }
    if (url.includes('watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  const workflowSteps = [
    {
      num: '01',
      title: 'Rainfall Input',
      device: 'Potentiometer',
      role: 'Simulates 0–100 mm/hr storm intensity',
      icon: <Sliders className="w-5 h-5 text-aqua-400" />,
      tag: 'Analog ADC'
    },
    {
      num: '02',
      title: 'ESP32 Controller',
      device: 'NodeMCU ESP32',
      role: 'Dual-core MCU running 100ms state loop',
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      tag: 'Core Logic'
    },
    {
      num: '03',
      title: 'Tank Measurement',
      device: 'HC-SR04 Ultrasonic',
      role: 'ECHO/TRIG distance sounding to water surface',
      icon: <Radio className="w-5 h-5 text-aqua-300" />,
      tag: 'Level Sonar'
    },
    {
      num: '04',
      title: 'Decision Logic',
      device: 'State Machine',
      role: 'Selects IDLE, STORAGE, or RECHARGE',
      icon: <Workflow className="w-5 h-5 text-forest-400" />,
      tag: 'Algorithmic'
    },
    {
      num: '05',
      title: 'Servo Valve',
      device: 'SG90 Micro Servo',
      role: 'Rotates diverter gate (0° Tank / 90° Aquifer)',
      icon: <RotateCw className="w-5 h-5 text-amber-400" />,
      tag: 'Actuator'
    },
    {
      num: '06',
      title: 'LED & Buzzer',
      device: 'Telemetry Signals',
      role: 'Visual status indication & overflow chime',
      icon: <Volume2 className="w-5 h-5 text-rose-400" />,
      tag: 'Audio/Visual'
    }
  ];

  return (
    <section
      id="hardware-demo"
      className="py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-slate-50/70 dark:bg-[#071728]/70 border-y border-slate-200/80 dark:border-slate-800 z-10 w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aqua-50 dark:bg-aqua-950/80 border border-aqua-200 dark:border-aqua-800 text-aqua-700 dark:text-aqua-300 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-aqua-500 animate-pulse" />
            <span>Interactive IoT Simulation</span>
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-aqua-600 dark:text-aqua-400 block mb-1">
              HARDWARE PROTOTYPE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#072038] dark:text-white tracking-tight">
              See AquaRegen in Action
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Explore our ESP32-based hardware prototype, built in Wokwi to demonstrate rainfall input, tank-level monitoring, and automatic storage-versus-recharge control.
          </p>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Left Card: Hardware Demonstration Video */}
          <div className="bg-white dark:bg-[#0c1f33] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-soft flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 mb-1.5">
                    Recorded Hardware Simulation
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-[#072038] dark:text-white">
                    How Our Hardware Prototype Works
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Watch how the simulated sensors, ESP32 controller, and servo-operated diverter work together to demonstrate automated rainwater management.
              </p>

              {/* 16:9 Responsive Video Frame or Placeholder */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner flex items-center justify-center">
                {videoUrl ? (
                  isYouTube || isVimeo ? (
                    <iframe
                      src={getEmbedUrl(videoUrl)}
                      title="AquaRegen Hardware Prototype Demonstration"
                      className="w-full h-full border-0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support HTML5 video playback.
                    </video>
                  )
                ) : (
                  /* Elegant Hardware Video Placeholder */
                  <div className="absolute inset-0 bg-gradient-to-br from-[#061524] via-[#092238] to-[#040e18] p-6 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-aqua-500/10 border border-aqua-500/30 flex items-center justify-center text-aqua-400 shadow-lg shadow-aqua-500/10">
                        <Play className="w-6 h-6 ml-0.5 text-aqua-400" />
                      </div>
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-aqua-400 animate-ping" />
                    </div>

                    <div className="space-y-1 max-w-sm">
                      <p className="text-sm font-black text-white">
                        Hardware demonstration video coming soon.
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Recorded walkthrough showing ESP32 pinout, HC-SR04 sonar calculations, and automatic servo diverter gate actuation in Wokwi.
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-aqua-300">
                      Configure: VITE_AQUAREGEN_HARDWARE_VIDEO_URL
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Topics Covered Pill List */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
                Demonstrated Hardware Elements:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">1. ESP32 Controller</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">2. Potentiometer Rain Input</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">3. HC-SR04 Ultrasonic Sonar</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">4. Tank-Fill % Logic</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">5. IDLE / STORAGE / RECHARGE</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">6. SG90 Servo & Buzzer</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700">7. Wokwi Simulation Tests</span>
              </div>
            </div>
          </div>

          {/* Right Card: Interactive Wokwi Simulation */}
          <div className="bg-white dark:bg-[#0c1f33] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-soft flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 mb-1.5">
                    Interactive Simulation · Not a Physical Installation
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-[#072038] dark:text-white">
                    Try the Interactive Circuit
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Open the Wokwi simulation and experiment with the rainfall input and tank-level sensor to observe how the programmed controller responds.
              </p>

              {/* Technical Circuit Illustration & Component Labels */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#061423] via-[#092238] to-[#040e18] border border-slate-800 p-4 sm:p-5 flex flex-col justify-between">
                {/* Circuit Grid Top Header */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-white font-bold">Wokwi ESP32 Circuit</span>
                  </div>
                  <span className="text-[10px] text-aqua-400 font-bold uppercase tracking-wider">
                    Simulated Breadboard
                  </span>
                </div>

                {/* Simulated Circuit Component Blueprint */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-auto py-2">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">ESP32 MCU</p>
                      <p className="text-[10px] text-slate-400 truncate">GPIO 32, 33, 26</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-aqua-500/20 text-aqua-300 flex items-center justify-center shrink-0">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">Rain Dial</p>
                      <p className="text-[10px] text-slate-400 truncate">ADC Potentiometer</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">HC-SR04</p>
                      <p className="text-[10px] text-slate-400 truncate">Echo / Trig Sonar</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                      <RotateCw className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">Servo Divert</p>
                      <p className="text-[10px] text-slate-400 truncate">0° Tank | 90° Recharge</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">LED & Buzzer</p>
                      <p className="text-[10px] text-slate-400 truncate">Full-Tank Alert</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                      <Workflow className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">FSM Loop</p>
                      <p className="text-[10px] text-slate-400 truncate">Auto Decision</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
                  <span className="font-mono">Wiring: VCC 5V • GND • 3.3V Logic</span>
                  <span className="text-emerald-400 font-semibold">Ready for Test Run</span>
                </div>
              </div>
            </div>

            {/* Launch Simulation CTA Button */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              {wokwiUrl ? (
                <a
                  href={wokwiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-forest-600 to-aqua-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.01]"
                >
                  <span>Open Wokwi Simulation ↗</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <div className="space-y-1.5">
                  <button
                    disabled
                    className="w-full py-3.5 px-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 font-bold text-xs sm:text-sm border border-slate-200/80 dark:border-slate-700 flex items-center justify-center gap-2 cursor-not-allowed"
                    title="Configure VITE_AQUAREGEN_WOKWI_URL to activate live link"
                  >
                    <span>Open Wokwi Simulation ↗</span>
                    <ExternalLink className="w-4 h-4 opacity-50" />
                  </button>
                  <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
                    Wokwi link pending configuration via <code className="font-mono text-aqua-600 dark:text-aqua-400">VITE_AQUAREGEN_WOKWI_URL</code>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Hardware Workflow */}
        <div className="bg-white dark:bg-[#0c1f33] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-aqua-600 dark:text-aqua-400">
              SEQUENTIAL HARDWARE FLOW
            </span>
            <h3 className="text-xl font-extrabold text-[#072038] dark:text-white mt-0.5">
              Automated Microcontroller Decision Pipeline
            </h3>
          </div>

          {/* Workflow Sequence */}
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <div className="flex items-center min-w-[720px] gap-2 lg:gap-3">
              {workflowSteps.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex-1 bg-slate-50/80 dark:bg-[#071322] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 hover:border-aqua-400/80 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{step.num}</span>
                      <span className="px-1.5 py-0.2 rounded bg-aqua-50 dark:bg-aqua-950/60 text-aqua-600 dark:text-aqua-300 text-[9px] font-bold border border-aqua-200/60 dark:border-aqua-800/60">
                        {step.tag}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center mb-2 shadow-2xs">
                      {step.icon}
                    </div>

                    <h4 className="text-xs font-black text-[#072038] dark:text-white leading-tight">
                      {step.title}
                    </h4>
                    <p className="text-[10px] font-semibold text-aqua-600 dark:text-aqua-400 mt-0.5 mb-1 truncate">
                      {step.device}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                      {step.role}
                    </p>
                  </div>

                  {idx < workflowSteps.length - 1 && (
                    <div className="shrink-0 text-slate-300 dark:text-slate-600">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Workflow Explanation Paragraph */}
          <div className="p-4 rounded-2xl bg-aqua-50/60 dark:bg-aqua-950/30 border border-aqua-200/70 dark:border-aqua-800/50">
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              The controller evaluates the simulated rainfall input and estimated tank-fill percentage. It selects IDLE when rainfall is below the configured threshold, STORAGE when rainfall is sufficient and tank fill is below 90%, and RECHARGE when rainfall is sufficient and tank fill reaches at least 90%.
            </p>
          </div>
        </div>

        {/* Small Technical Note */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/90 dark:bg-[#071322] border border-slate-200 dark:border-slate-800 flex items-start gap-3">
          <Info className="w-5 h-5 text-aqua-500 dark:text-aqua-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-navy-900 dark:text-slate-200">Prototype Note:</strong> The rainfall input is simulated using a potentiometer in Wokwi. The ultrasonic sensor measures distance to the water surface, which is converted to an estimated tank-fill percentage. The servo demonstrates the programmed valve position; actual water diversion and groundwater recharge require a suitable physical installation.
          </p>
        </div>
      </div>
    </section>
  );
};
