import Link from "next/link";
import { Zap, Activity, Navigation } from "lucide-react";

export const metadata = {
  title: "ApexMetrics | F1 Telemetry Intelligence",
  description: "Advanced Formula 1 telemetry and race analysis platform.",
};

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col relative overflow-hidden bg-am-bg">
      {/* Background Graphic Layers */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 telemetry-grid opacity-30" />
        {/* Large abstract red geometric shape */}
        <div 
          className="absolute top-1/2 left-3/4 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-[0.03] rotate-45 pointer-events-none"
          style={{ background: "radial-gradient(circle, #E10600 0%, transparent 60%)" }}
        />
        <div 
          className="absolute -top-[20%] -left-[10%] w-[1000px] h-[1000px] opacity-[0.02] border border-am-red pointer-events-none"
          style={{ transform: "rotate(-15deg)" }}
        />
      </div>

      {/* Main Content (Asymmetric Brutalism Layout) */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-[1600px] w-full mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col md:flex-row gap-16 md:gap-8 items-start md:items-center h-full">
          
          {/* LEFT: Huge Typography */}
          <div className="w-full md:w-[65%] flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] w-12 bg-am-red" aria-hidden="true" />
              <span className="font-data text-xs tracking-[0.5em] text-am-red uppercase">
                OpenF1 Interface
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[140px] font-bold tracking-tighter text-am-text uppercase leading-[0.85] mb-6 select-none mix-blend-difference">
              Apex
              <br />
              <span className="text-am-red">Metrics</span>
            </h1>

            <p className="max-w-xl text-am-text-secondary text-lg md:text-xl font-medium leading-relaxed mb-12">
              Unleash the power of real-time Formula 1 telemetry. 
              Millisecond-accurate data parsing, driver comparisons, 
              and dynamic circuit mapping built for race engineers.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/sessions"
                className="
                  group relative inline-flex items-center gap-3 px-8 py-5
                  bg-am-red text-white text-sm font-bold tracking-widest uppercase
                  rounded-[2px] overflow-hidden transition-transform duration-300
                  hover:-translate-y-1
                "
              >
                {/* Glitch overlay on hover */}
                <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <span className="relative z-10">Enter Command Center</span>
                <Navigation size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Data / Decorative Pillar */}
          <div className="w-full md:w-[35%] flex flex-col gap-8 md:pl-16 md:border-l border-am-border">
            
            <div className="flex flex-col gap-2">
              <span className="font-data text-[10px] text-am-text-muted tracking-widest uppercase">
                System Status
              </span>
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-am-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-am-green"></span>
                </div>
                <span className="text-am-text font-semibold">Telemetry Feed Active</span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-am-border" />

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold font-data text-am-text">64hz</span>
                <span className="text-xs text-am-text-secondary tracking-widest uppercase">Data Resolution</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold font-data text-am-text">&lt;100ms</span>
                <span className="text-xs text-am-text-secondary tracking-widest uppercase">Ingestion Latency</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold font-data text-am-text">OpenF1</span>
                <span className="text-xs text-am-text-secondary tracking-widest uppercase">Primary Data Source</span>
              </div>
            </div>

            <div className="h-[1px] w-full bg-am-border" />

            <div className="flex items-center gap-4">
               <Activity className="text-am-red" size={24} />
               <Zap className="text-am-yellow" size={24} />
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
