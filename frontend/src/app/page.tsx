import { TheInfiniteGrid } from "@/components/ui/the-infinite-grid";
import Link from "next/link";
import { Navigation } from "lucide-react";

export const metadata = {
  title: "ApexMetrics | F1 Telemetry Intelligence",
  description: "Advanced Formula 1 telemetry and race analysis platform.",
};

export default function LandingPage() {
  return (
    <main className="flex-1 w-full bg-am-bg">
      <TheInfiniteGrid>
        <div className="flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto space-y-8 min-h-screen pointer-events-none">
          <div className="flex items-center gap-4 mb-2 justify-center">
            <div className="h-[2px] w-12 bg-am-red" aria-hidden="true" />
            <span className="font-data text-xs tracking-[0.5em] text-am-red uppercase">
              OpenF1 Interface
            </span>
            <div className="h-[2px] w-12 bg-am-red" aria-hidden="true" />
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl lg:text-[120px] font-bold tracking-tighter text-am-text uppercase leading-[0.85] select-none mix-blend-difference drop-shadow-sm">
              Apex<span className="text-am-red">Metrics</span>
            </h1>
            <p className="text-lg md:text-xl text-am-text-secondary font-medium leading-relaxed max-w-2xl mx-auto">
              Unleash the power of real-time Formula 1 telemetry. <br/>
              Move your cursor to analyze the active grid layer.
            </p>
          </div>
          
          <div className="flex pointer-events-auto mt-12">
            <Link
              href="/sessions"
              passHref
              className="
                group relative flex flex-col items-center justify-center px-10 py-5
                bg-slate-900 border border-red-600/40 text-red-500
                font-mono tracking-widest uppercase
                shadow-[0_0_15px_rgba(220,38,38,0.15)]
                transition-all duration-200 transform hover:scale-[1.03] active:scale-[0.98]
                hover:bg-red-600 hover:text-slate-950 hover:border-red-500
                overflow-hidden
              "
            >
              {/* Grid Scan Line */}
              <div className="absolute h-[1px] w-full bg-white/40 left-0 top-0 -translate-y-full transition-transform duration-[400ms] ease-in-out group-hover:translate-y-[100px]" aria-hidden="true" />
              
              {/* Corner Flares */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500 group-hover:border-slate-950 transition-colors duration-200" aria-hidden="true" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500 group-hover:border-slate-950 transition-colors duration-200" aria-hidden="true" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500 group-hover:border-slate-950 transition-colors duration-200" aria-hidden="true" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500 group-hover:border-slate-950 transition-colors duration-200" aria-hidden="true" />

              <div className="flex flex-col items-center gap-1.5 z-10 relative">
                <span className="text-sm md:text-base font-bold">[ ⚡ ] INITIALIZE TELEMETRY CONSOLE</span>
                <span className="text-[10px] md:text-xs opacity-80 font-semibold tracking-[0.2em]">SYSTEM STATUS: READY // ERR: 0</span>
              </div>
            </Link>
          </div>
        </div>
      </TheInfiniteGrid>
    </main>
  );
}
