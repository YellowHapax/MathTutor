import React, { useState, useEffect, useRef } from 'react';

/**
 * Filtration viz: a random walk X_t with a slider revealing only
 * ℱ_s for s ≤ slider. Future values are grayed out.
 */
export default function FiltrationViz() {
  const [t, setT] = useState(30);
  const pathRef = useRef<number[]>([]);

  useEffect(() => {
    // Deterministic pseudo-random walk so resets are reproducible
    let rng = 42;
    const path: number[] = [0];
    for (let i = 1; i < 100; i++) {
      rng = (rng * 1664525 + 1013904223) % 2 ** 32;
      const step = ((rng / 2 ** 32) - 0.5) * 2;
      path.push(path[i - 1] + step);
    }
    pathRef.current = path;
  }, []);

  const W = 600, H = 260;
  const pad = 30;
  const N = 100;
  const path = pathRef.current;
  if (path.length === 0) return null;
  const ymin = Math.min(...path), ymax = Math.max(...path);
  const sx = (i: number) => pad + (i / (N - 1)) * (W - 2 * pad);
  const sy = (v: number) => H - pad - ((v - ymin) / (ymax - ymin + 1e-9)) * (H - 2 * pad);

  const visible = path.slice(0, t + 1);
  const hidden = path.slice(t);

  const pathStr = (arr: number[], off = 0) =>
    arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i + off)} ${sy(v)}`).join(' ');

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {/* axes */}
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#333" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#333" />
        {/* future (hidden) */}
        <path d={pathStr(hidden, t)} fill="none" stroke="#2a2a2a" strokeWidth={1.5} strokeDasharray="3,3" />
        {/* observed */}
        <path d={pathStr(visible)} fill="none" stroke="#d4a847" strokeWidth={2} />
        {/* frontier */}
        <line x1={sx(t)} y1={pad} x2={sx(t)} y2={H - pad} stroke="#22d3ee" strokeDasharray="2,4" />
        <circle cx={sx(t)} cy={sy(path[t])} r={4} fill="#22d3ee" />
        <text x={sx(t) + 6} y={pad + 12} fill="#22d3ee" fontSize={10} fontFamily="monospace">
          ℱ_t frontier
        </text>
      </svg>
      <div className="mt-3 flex items-center gap-3">
        <label className="text-xs text-zinc-500 uppercase tracking-widest">t</label>
        <input
          type="range"
          min={0}
          max={N - 1}
          value={t}
          onChange={(e) => setT(+e.target.value)}
          className="flex-1 accent-cyan-500"
        />
        <span className="text-xs text-cyan-400 font-mono w-10 text-right">{t}</span>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        ℱ_t = σ(X_s : s ≤ t) — only the solid trajectory is measurable at time t.
      </div>
    </div>
  );
}
