import React, { useState } from 'react';

/**
 * 1D Wasserstein-2 viz: two sorted point clouds and the optimal transport
 * plan (quantile-to-quantile matching). Shows both W₂ cost and the paths.
 */
export default function WassersteinViz() {
  const [shift, setShift] = useState(1.2);
  const [spread, setSpread] = useState(0.8);

  const W = 600, H = 220;
  const N = 12;
  const src = Array.from({ length: N }, (_, i) => (i - N / 2) * 0.25);
  const tgt = src.map(v => v * spread + shift);

  const xmin = -3, xmax = 4;
  const sx = (x: number) => 30 + ((x - xmin) / (xmax - xmin)) * (W - 60);

  // Optimal transport in 1D is sort-sort matching (already sorted here)
  const cost = src.reduce((s, v, i) => s + (v - tgt[i]) ** 2, 0) / N;
  const W2 = Math.sqrt(cost);

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        <line x1={30} y1={H * 0.3} x2={W - 30} y2={H * 0.3} stroke="#333" />
        <line x1={30} y1={H * 0.75} x2={W - 30} y2={H * 0.75} stroke="#333" />
        <text x={30} y={H * 0.3 - 8} fill="#d4a847" fontSize={11} fontFamily="monospace">source μ</text>
        <text x={30} y={H * 0.75 + 18} fill="#22d3ee" fontSize={11} fontFamily="monospace">target ν</text>
        {src.map((v, i) => (
          <g key={i}>
            <line x1={sx(v)} y1={H * 0.3} x2={sx(tgt[i])} y2={H * 0.75}
              stroke="#ec4899" strokeOpacity={0.5} strokeWidth={1} />
            <circle cx={sx(v)} cy={H * 0.3} r={4} fill="#d4a847" />
            <circle cx={sx(tgt[i])} cy={H * 0.75} r={4} fill="#22d3ee" />
          </g>
        ))}
      </svg>
      <div className="mt-2 text-center">
        <span className="text-xs text-zinc-500 uppercase tracking-widest mr-2">W₂(μ, ν) =</span>
        <span className="text-lg text-pink-400 font-mono">{W2.toFixed(3)}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">shift</label>
          <input type="range" min={-2} max={3} step={0.05} value={shift}
            onChange={(e) => setShift(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{shift.toFixed(2)}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">scale</label>
          <input type="range" min={0.3} max={2} step={0.01} value={spread}
            onChange={(e) => setSpread(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{spread.toFixed(2)}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        1D OT is quantile-matching: sort sources and targets, pair in order
      </div>
    </div>
  );
}
