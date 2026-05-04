"use client";
import { motion } from "framer-motion";

export function TelemetryGraph({ health }: { health: number }) {
  // Generate a somewhat random path but anchored at the end by the current health
  // Using 20 points for the history
  const points = Array.from({ length: 20 }, (_, i) => {
    const x = i * 5.26; // Spaced out to fill 100% width roughly (100 / 19)
    let y;
    if (i === 19) {
      // Current health (inverted because SVG Y increases downwards)
      y = 40 - (health * 0.4); 
    } else {
      // Historical random jitter around a stable baseline
      // When health is low, historical points also drop to simulate a crash
      const baseline = health < 20 ? 35 : 15;
      y = baseline + Math.random() * 5;
    }
    return { x, y };
  });
  
  const pathData = `M 0 20 ${points.map(p => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ")}`;

  return (
    <div className="relative h-48 w-full rounded-xl border border-zinc-200 bg-white/50 p-6 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/50">
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] tracking-tight text-zinc-500">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${health < 20 ? "bg-red-500 animate-pulse" : "bg-emerald-500"}`} />
          <span>TELEMETRY_SYNC // NODE_04</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="opacity-50">HEALTH:</span>
          <span className={`font-bold ${health < 20 ? "text-red-500" : "text-emerald-500"}`}>
            {health.toFixed(1)}%
          </span>
        </div>
      </div>
      
      <div className="relative h-24 w-full">
        <svg 
          viewBox="0 0 100 40" 
          className="h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Background Grid Lines */}
          <line x1="0" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="0.1" className="text-zinc-200 dark:text-zinc-800" />
          <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="0.1" className="text-zinc-200 dark:text-zinc-800" />
          <line x1="0" y1="30" x2="100" y2="30" stroke="currentColor" strokeWidth="0.1" className="text-zinc-200 dark:text-zinc-800" />
          
          <motion.path
            d={pathData}
            fill="none"
            stroke={health < 20 ? "#ef4444" : "#10b981"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ d: pathData }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          
          {/* Glow effect */}
          <motion.path
            d={pathData}
            fill="none"
            stroke={health < 20 ? "#ef4444" : "#10b981"}
            strokeWidth="3"
            strokeOpacity="0.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ d: pathData }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="mt-4 flex justify-between border-t border-zinc-100 pt-3 font-mono text-[8px] text-zinc-400 dark:border-zinc-800/50">
        <span>0ms</span>
        <span>500ms</span>
        <span>1000ms</span>
        <span>1500ms</span>
        <span>LIVE</span>
      </div>
    </div>
  );
}
