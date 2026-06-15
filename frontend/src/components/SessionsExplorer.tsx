"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import type { Session } from "@/lib/api";
import SessionCard from "@/components/SessionCard";

interface Props {
  initialSessions: Session[];
}

// Fallback backgrounds if real photos aren't found
const TRACK_BACKGROUNDS = [
  "/tracks/night.png",
  "/tracks/day.png",
  "/tracks/abstract.png",
];

// Helper to convert "Albert Park Circuit" to "albert-park-circuit"
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function TrackFilterButton({
  circuit,
  isSelected,
  onClick,
  idx,
}: {
  circuit: string;
  isSelected: boolean;
  onClick: () => void;
  idx: number;
}) {
  const fallbackBg = TRACK_BACKGROUNDS[idx % TRACK_BACKGROUNDS.length];
  // Expect user to upload photos as .jpg or .png matching the slugified circuit name
  const expectedPhotoUrl = `/tracks/${slugify(circuit)}.jpg`;
  const [bgSrc, setBgSrc] = useState(expectedPhotoUrl);

  // Expect user to upload layout images as transparent PNGs or SVGs
  const layoutUrl = `/tracks/layouts/${slugify(circuit)}.png`;
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden flex items-center justify-between text-left h-16 px-4 rounded-[4px] transition-all duration-200 shrink-0
        border ${isSelected ? 'border-am-red ring-1 ring-am-red/50 shadow-[0_0_15px_rgba(225,6,0,0.2)]' : 'border-white/10 hover:border-white/30'}
        group
      `}
    >
      {/* Hidden img tag just to detect background load errors and trigger fallback */}
      <img 
        src={expectedPhotoUrl} 
        alt={circuit} 
        style={{ display: 'none' }} 
        onError={() => setBgSrc(fallbackBg)} 
      />

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity group-hover:opacity-60 transition-opacity duration-300 group-hover:scale-105 transform"
        style={{ backgroundImage: `url(${bgSrc})` }}
      />
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-am-bg via-am-bg/80 to-transparent" />

      {/* Content (Left) */}
      <div className="relative z-10 flex flex-col justify-center max-w-[70%]">
        <span className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-am-text group-hover:text-white'}`}>
          {circuit}
        </span>
        <span className="font-data text-[9px] text-am-red uppercase tracking-widest flex items-center gap-1 mt-0.5">
          <MapPin size={8} className={isSelected ? "text-am-red" : ""} /> Select Track
        </span>
      </div>

      {/* Circuit Layout Icon (Right) */}
      {!imgError && (
        <div className="relative z-10 h-10 w-16 opacity-30 group-hover:opacity-100 transition-opacity duration-300 flex justify-end items-center shrink-0">
          <img 
            src={layoutUrl} 
            alt={`${circuit} layout`}
            className="max-h-full max-w-full object-contain" 
            style={{ filter: "brightness(0) invert(1)" }} // Converts black/colored lines to pure white
            onError={() => setImgError(true)}
          />
        </div>
      )}
    </button>
  );
}

export default function SessionsExplorer({ initialSessions }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCircuit, setSelectedCircuit] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Extract unique circuits from sessions
  const circuits = useMemo(() => {
    const unique = new Set<string>();
    initialSessions.forEach((s) => {
      if (s.circuit_name) unique.add(s.circuit_name);
    });
    return Array.from(unique).sort();
  }, [initialSessions]);

  // Filter sessions based on search and selected circuit
  const filteredSessions = useMemo(() => {
    return initialSessions.filter((s) => {
      const matchesSearch =
        searchQuery === "" ||
        s.circuit_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.session_type?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCircuit =
        selectedCircuit === null || s.circuit_name === selectedCircuit;

      return matchesSearch && matchesCircuit;
    });
  }, [initialSessions, searchQuery, selectedCircuit]);

  return (
    <>
      <div className="flex flex-col w-full max-w-[1600px] mx-auto px-4 py-8 lg:px-6 lg:py-10">
        
        {/* TOP Bar: Search & Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
          
          <div className="relative group flex-1 rounded-[4px] overflow-hidden" style={{ boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)" }}>
            {/* Glass Layers */}
            <div className="absolute inset-0 z-0 overflow-hidden" style={{ backdropFilter: "blur(12px)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
            <div className="absolute inset-0 z-10 transition-colors duration-[400ms]" style={{ background: "rgba(15, 15, 15, 0.35)" }} />
            <div className="absolute inset-0 z-20 pointer-events-none" style={{ boxShadow: "inset 0px 1px 1px 0 rgba(255, 255, 255, 0.15), inset 0px -1px 1px 0 rgba(255, 255, 255, 0.05)" }} />
            
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-30">
              <Search size={18} className="text-am-text-muted group-focus-within:text-am-red transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search races, countries, or session types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                relative z-30 w-full bg-transparent border border-transparent rounded-[4px] 
                py-4 pl-12 pr-4 text-sm text-white placeholder-am-text-muted
                focus:outline-none focus:border-am-red focus:ring-1 focus:ring-am-red/50
                transition-all duration-200
              "
            />
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="
              relative overflow-hidden flex items-center justify-center gap-2 px-6 py-4
              rounded-[4px] cursor-pointer
              text-sm font-semibold tracking-wide text-white
              transition-all duration-[400ms] shrink-0
              hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(225,6,0,0.15)]
              group
            "
            style={{ boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)" }}
          >
            {/* Glass Layers */}
            <div className="absolute inset-0 z-0 overflow-hidden" style={{ backdropFilter: "blur(12px)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
            <div className="absolute inset-0 z-10 transition-colors duration-[400ms]" style={{ background: "rgba(15, 15, 15, 0.35)" }} />
            <div className="absolute inset-0 z-20 pointer-events-none group-hover:bg-[#e10600]/5 transition-colors duration-[400ms]" style={{ boxShadow: "inset 0px 1px 1px 0 rgba(255, 255, 255, 0.15), inset 0px -1px 1px 0 rgba(255, 255, 255, 0.05)" }} />

            <div className="relative z-30 flex items-center gap-2 group-hover:text-white transition-colors duration-200">
              <SlidersHorizontal size={18} className="group-hover:text-am-red transition-colors duration-200" />
              <span className="uppercase tracking-widest font-data text-[11px]">
                {selectedCircuit ? "Track Selected" : "Filter Tracks"}
              </span>
            </div>
          </button>
        </div>

        {/* MAIN AREA: 100% Width Grid */}
        <main className="w-full flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-am-red" aria-hidden="true" />
              <h1 className="text-xl font-bold tracking-tight text-am-text uppercase">
                {selectedCircuit ? `${selectedCircuit} Sessions` : 'All Sessions'}
              </h1>
            </div>
            <span className="font-data text-[10px] tracking-widest text-am-text-muted uppercase">
              {filteredSessions.length} Results
            </span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-32 border border-dashed border-am-border rounded-[2px]">
              <span className="font-data text-xs tracking-widest text-am-text-muted uppercase">
                No sessions found
              </span>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCircuit(null); }}
                className="text-am-red text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSessions.map((session) => (
                <SessionCard key={session.session_id} session={session} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* DRAWER PANEL: Slide-out from right */}
      
      {/* Backdrop */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sliding Panel */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[400px] border-l border-white/10 z-50
          transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          flex flex-col shadow-2xl overflow-hidden
          ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Glass Layers */}
        <div className="absolute inset-0 z-0 overflow-hidden" style={{ backdropFilter: "blur(20px)", filter: "url(#glass-distortion)", isolation: "isolate" }} />
        <div className="absolute inset-0 z-10" style={{ background: "rgba(10, 10, 10, 0.45)" }} />
        <div className="absolute inset-0 z-20 pointer-events-none" style={{ boxShadow: "inset 1px 0px 1px 0 rgba(255, 255, 255, 0.1)" }} />
        
        {/* Content wrapper */}
        <div className="relative z-30 flex flex-col h-full w-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-4 w-[2px] bg-am-red" aria-hidden="true" />
              <h2 className="text-lg font-bold tracking-tight text-white uppercase">
                Filter by Track
              </h2>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="text-am-text-muted hover:text-white transition-colors p-2"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3 custom-scrollbar">
            <button
              onClick={() => setSelectedCircuit(null)}
              className={`
                text-left px-4 py-3 text-sm font-semibold rounded-[4px] transition-all duration-200 border
                ${selectedCircuit === null 
                  ? 'bg-am-red/10 border-am-red text-am-red shadow-[0_0_15px_rgba(225,6,0,0.2)]' 
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}
              `}
            >
              All Circuits
            </button>
            
            {circuits.map((circuit, idx) => (
              <TrackFilterButton 
                key={circuit}
                circuit={circuit}
                idx={idx}
                isSelected={selectedCircuit === circuit}
                onClick={() => setSelectedCircuit(circuit)}
              />
            ))}
          </div>
          
          <div className="p-6 border-t border-white/10 shrink-0">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-full bg-am-red text-white py-3 rounded-[4px] font-data text-xs tracking-widest uppercase hover:bg-red-700 transition-colors shadow-[0_0_15px_rgba(225,6,0,0.3)]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
