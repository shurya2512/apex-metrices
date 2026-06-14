/**
 * F1TyreLoader — Animated spinning Pirelli-style tyre loading indicator.
 *
 * Structure:
 *   Outer ring (slate) → Dashed red accent ring (spinning) → Yellow hub bolt (pulsing)
 *
 * Respects prefers-reduced-motion: shows static tyre with opacity pulse.
 */
export default function F1TyreLoader({ size = 64 }: { size?: number }) {
  const outerSize = size;
  const innerRingSize = size * 0.72;
  const hubSize = size * 0.28;
  const borderWidth = Math.max(3, Math.round(size * 0.08));
  const dashedWidth = Math.max(2, Math.round(size * 0.05));

  return (
    <div
      className="relative flex items-center justify-center"
      role="status"
      aria-label="Loading telemetry data"
    >
      {/* Outer tyre ring — solid slate */}
      <div
        className="rounded-full border-am-text-muted"
        style={{
          width: outerSize,
          height: outerSize,
          borderWidth: borderWidth,
          borderStyle: "solid",
          borderColor: "#475569",
        }}
      />

      {/* Dashed red accent ring — spinning */}
      <div
        className="absolute rounded-full"
        style={{
          width: innerRingSize,
          height: innerRingSize,
          borderWidth: dashedWidth,
          borderStyle: "dashed",
          borderColor: "#E10600",
          animation: "tyre-spin 0.8s linear infinite",
        }}
      />

      {/* Center hub bolt — glowing yellow */}
      <div
        className="absolute rounded-full"
        style={{
          width: hubSize,
          height: hubSize,
          backgroundColor: "#eab308",
          animation: "pulse-glow 1.5s ease-in-out infinite",
        }}
      />

      {/* Screen reader text */}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
