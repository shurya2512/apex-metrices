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
        relative overflow-hidden flex items-center justify-between text-left h-16 px-4 rounded-[2px] transition-all duration-200 shrink-0
        border ${isSelected ? 'border-am-red ring-1 ring-am-red/50' : 'border-am-border hover:border-am-border-hover'}
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
        
        {/* TOP BAR: Search & Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
          
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-am-text-muted group-focus-within:text-am-red transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search races, countries, or session types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                w-full bg-am-surface border border-am-border rounded-[2px] 
                py-4 pl-12 pr-4 text-sm text-am-text placeholder-am-text-muted
                focus:outline-none focus:border-am-red focus:ring-1 focus:ring-am-red/50
                transition-all duration-200
              "
            />
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="
              flex items-center justify-center gap-2 px-6 py-4
              bg-am-surface border border-am-border rounded-[2px]
              text-sm font-semibold tracking-wide text-am-text hover:text-white
              hover:border-am-red transition-all duration-200 shrink-0
            "
          >
            <SlidersHorizontal size={18} />
            <span className="uppercase tracking-widest font-data text-[11px]">
              {selectedCircuit ? "Track Selected" : "Filter Tracks"}
            </span>
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
          fixed top-0 right-0 h-full w-full sm:w-[400px] bg-am-bg border-l border-am-border z-50
          transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          flex flex-col shadow-2xl
          ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-am-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-4 w-[2px] bg-am-red" aria-hidden="true" />
            <h2 className="text-lg font-bold tracking-tight text-am-text uppercase">
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
              text-left px-4 py-3 text-sm font-semibold rounded-[2px] transition-all duration-200 border
              ${selectedCircuit === null 
                ? 'bg-am-red/10 border-am-red text-am-red' 
                : 'bg-am-surface border-am-border text-am-text hover:bg-am-border'}
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
        
        <div className="p-6 border-t border-am-border shrink-0">
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="w-full bg-am-red text-white py-3 rounded-[2px] font-data text-xs tracking-widest uppercase hover:bg-red-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
