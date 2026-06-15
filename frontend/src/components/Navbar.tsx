"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gauge,
  Flag,
  Bookmark,
  Menu,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Command Center", icon: Gauge },
  { href: "/sessions", label: "Sessions", icon: Flag },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <GlassFilter />
      <header
        className="sticky top-0 z-50 w-full overflow-hidden border-b border-white/10"
        style={{
          boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
        }}
        role="banner"
      >
        {/* Glass Layers */}
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{
            backdropFilter: "blur(20px)",
            filter: "url(#glass-distortion)",
            isolation: "isolate",
          }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{ background: "rgba(10, 10, 10, 0.45)" }}
        />
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            boxShadow: "inset 0px -1px 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        />

        <nav className="relative z-30 mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 lg:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 no-underline"
          aria-label="ApexMetrics Home"
        >
          {/* Logo mark — abstract apex/chevron */}
          <div className="relative flex h-8 w-8 items-center justify-center">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              className="h-8 w-8"
              aria-hidden="true"
            >
              {/* Chevron apex shape */}
              <path
                d="M16 4L28 24H22L16 13L10 24H4L16 4Z"
                fill="#E10600"
              />
              {/* Speed lines */}
              <rect x="6" y="27" width="20" height="1.5" rx="0.5" fill="#E10600" opacity="0.6" />
              <rect x="10" y="29.5" width="12" height="1" rx="0.5" fill="#E10600" opacity="0.3" />
            </svg>
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-widest text-am-text uppercase">
              APEX
              <span className="text-am-red">METRICS</span>
            </span>
            <span className="font-data text-[9px] tracking-[0.3em] text-am-text-muted uppercase">
              Telemetry
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`
                relative flex items-center gap-2 px-3 py-2 text-xs font-medium tracking-wide uppercase no-underline
                transition-colors duration-200 cursor-pointer
                ${isActive(href)
                  ? "text-am-text"
                  : "text-am-text-secondary hover:text-am-text"
                }
              `}
            >
              <Icon size={14} strokeWidth={2} aria-hidden="true" />
              {label}

              {/* DRS-zone active indicator — red underline */}
              {isActive(href) && (
                <span
                  className="absolute bottom-0 left-3 right-3 h-[2px] bg-am-red"
                  style={{ animation: "underline-expand 0.3s ease-out forwards", transformOrigin: "left" }}
                  aria-hidden="true"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right section — live indicator + mobile toggle */}
        <div className="flex items-center gap-4">
          {/* LIVE status indicator */}
          <div className="hidden items-center gap-2 sm:flex">
            <span
              className="h-2 w-2 rounded-full bg-am-green"
              style={{ animation: "live-pulse 2s ease-in-out infinite" }}
              aria-hidden="true"
            />
            <span className="font-data text-[10px] tracking-widest text-am-green uppercase">
              Live
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center text-am-text-secondary transition-colors hover:text-am-text md:hidden cursor-pointer"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="relative z-30 border-t border-white/10 md:hidden">
          <div className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 text-sm font-medium no-underline
                  transition-colors duration-200 cursor-pointer
                  ${isActive(href)
                    ? "text-am-text border-l-2 border-am-red bg-white/5"
                    : "text-am-text-secondary hover:text-am-text hover:bg-white/5"
                  }
                `}
              >
                <Icon size={16} strokeWidth={2} aria-hidden="true" />
                {label}
              </Link>
            ))}

            {/* Mobile LIVE indicator */}
            <div className="mt-2 flex items-center gap-2 px-3 py-2">
              <span
                className="h-2 w-2 rounded-full bg-am-green"
                style={{ animation: "live-pulse 2s ease-in-out infinite" }}
                aria-hidden="true"
              />
              <span className="font-data text-[10px] tracking-widest text-am-green uppercase">
                Live Connection
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
}

// SVG Filter Component for Liquid Glass Effect
const GlassFilter: React.FC = () => (
  <svg style={{ display: "none" }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="100"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);
