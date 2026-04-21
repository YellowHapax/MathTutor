import React, { useState } from 'react';

/**
 * KL divergence viz: two Gaussians, compute KL(p‖q) and KL(q‖p) to show
 * asymmetry. Also draws the "path" of linear interpolation vs. geodesic.
 */
export default function KLViz() {
  const [mu2, setMu2] = useState(1.5);
  const [logs2, setLogs2] = useState(0.3);

  const mu1 = 0, s1 = 1;
  const s2 = Math.exp(logs2);

  const W = 600, H = 260, pad = 30;
  const xmin = -5, xmax = 6;
  const sx = (x: number) => pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - y * 200;

  const gauss = (x: number, mu: number, s: number) =>
    (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mu) ** 2) / (2 * s * s));

  const pPath = Array.from({ length: 200 }, (_, i) => {
    const x = xmin + (i / 199) * (xmax - xmin);
    return `${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(gauss(x, mu1, s1))}`;
  }).join(' ');
  const qPath = Array.from({ length: 200 }, (_, i) => {
    const x = xmin + (i / 199) * (xmax - xmin);
    return `${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(gauss(x, mu2, s2))}`;
  }).join(' ');

  // KL(N(μ1,σ1²)||N(μ2,σ2²)) = log(σ2/σ1) + (σ1² + (μ1-μ2)²)/(2σ2²) - 1/2
  const klPQ = Math.log(s2 / s1) + (s1 * s1 + (mu1 - mu2) ** 2) / (2 * s2 * s2) - 0.5;
  const klQP = Math.log(s1 / s2) + (s2 * s2 + (mu2 - mu1) ** 2) / (2 * s1 * s1) - 0.5;

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#333" />
        <path d={pPath} fill="#d4a847" fillOpacity={0.2} stroke="#d4a847" strokeWidth={2} />
        <path d={qPath} fill="#22d3ee" fillOpacity={0.2} stroke="#22d3ee" strokeWidth={2} />
      </svg>
      <div className="mt-2 grid grid-cols-2 gap-6 text-sm">
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">KL(p ‖ q)</div>
          <div className="text-xl text-amber-400 font-mono">{klPQ.toFixed(3)}</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">KL(q ‖ p)</div>
          <div className="text-xl text-cyan-400 font-mono">{klQP.toFixed(3)}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">μ₂</label>
          <input type="range" min={-3} max={4} step={0.05} value={mu2}
            onChange={(e) => setMu2(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{mu2.toFixed(2)}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">log σ₂</label>
          <input type="range" min={-1} max={1} step={0.01} value={logs2}
            onChange={(e) => setLogs2(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{logs2.toFixed(2)}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        asymmetric: KL(p‖q) penalizes p-support-outside-q (forward) · KL(q‖p) penalizes q-support-outside-p (reverse)
      </div>
    </div>
  );
}
