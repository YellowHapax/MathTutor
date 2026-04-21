import React, { useMemo, useState } from 'react';

/**
 * Logistic-map Lyapunov viz:
 *   x_{t+1} = r x_t (1 − x_t)
 *   λ(r) = lim (1/N) Σ log|f'(x_t)| = lim (1/N) Σ log|r (1 − 2 x_t)|
 *
 * Sweep r ∈ [2.5, 4]; shade regions where λ > 0 (chaos).
 */
export default function LyapunovViz() {
  const [highlightR, setHighlightR] = useState(3.8);
  const W = 600, H = 240;

  const rMin = 2.5, rMax = 4.0;
  const steps = 300;
  const burn = 400;
  const iters = 1200;

  const data = useMemo(() => {
    const out: { r: number; lam: number }[] = [];
    for (let i = 0; i < steps; i++) {
      const r = rMin + (i / (steps - 1)) * (rMax - rMin);
      let x = 0.5;
      for (let t = 0; t < burn; t++) x = r * x * (1 - x);
      let sum = 0;
      for (let t = 0; t < iters; t++) {
        x = r * x * (1 - x);
        const deriv = Math.abs(r * (1 - 2 * x));
        if (deriv > 0) sum += Math.log(deriv);
      }
      out.push({ r, lam: sum / iters });
    }
    return out;
  }, []);

  const lamMin = -3, lamMax = 1.2;
  const sx = (r: number) => 30 + ((r - rMin) / (rMax - rMin)) * (W - 60);
  const sy = (y: number) => H - 30 - ((y - lamMin) / (lamMax - lamMin)) * (H - 60);

  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(d.r)},${sy(d.lam)}`).join(' ');

  const lamAtR = (() => {
    let x = 0.5;
    for (let t = 0; t < burn; t++) x = highlightR * x * (1 - x);
    let s = 0;
    for (let t = 0; t < iters; t++) {
      x = highlightR * x * (1 - x);
      const d = Math.abs(highlightR * (1 - 2 * x));
      if (d > 0) s += Math.log(d);
    }
    return s / iters;
  })();

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {/* Chaos shading */}
        <rect x={30} y={sy(lamMax)} width={W - 60} height={sy(0) - sy(lamMax)} fill="#ec4899" opacity={0.05} />
        <rect x={30} y={sy(0)} width={W - 60} height={sy(lamMin) - sy(0)} fill="#22d3ee" opacity={0.05} />

        {/* Axes */}
        <line x1={30} y1={sy(0)} x2={W - 30} y2={sy(0)} stroke="#666" strokeDasharray="3,3" />
        <line x1={30} y1={30} x2={30} y2={H - 30} stroke="#333" />
        <line x1={30} y1={H - 30} x2={W - 30} y2={H - 30} stroke="#333" />

        <path d={path} fill="none" stroke="#d4a847" strokeWidth={1.5} />
        {/* highlight */}
        <line x1={sx(highlightR)} y1={30} x2={sx(highlightR)} y2={H - 30} stroke="#22d3ee" strokeWidth={1} />
        <circle cx={sx(highlightR)} cy={sy(lamAtR)} r={4} fill="#22d3ee" />

        <text x={W - 40} y={sy(0) - 5} fill="#666" fontSize={10} fontFamily="monospace" textAnchor="end">λ = 0</text>
        <text x={32} y={38} fill="#ec4899" fontSize={10} fontFamily="monospace">chaos</text>
        <text x={32} y={H - 34} fill="#22d3ee" fontSize={10} fontFamily="monospace">periodic</text>
      </svg>
      <div className="mt-2 text-center text-xs font-mono">
        <span className="text-zinc-500 uppercase tracking-widest mr-2">λ(r = {highlightR.toFixed(2)}) =</span>
        <span style={{ color: lamAtR > 0 ? '#ec4899' : '#22d3ee' }}>{lamAtR.toFixed(3)}</span>
      </div>
      <div className="mt-3 text-xs">
        <label className="text-zinc-500 uppercase tracking-widest">growth r</label>
        <input type="range" min={rMin} max={rMax} step={0.005} value={highlightR}
          onChange={(e) => setHighlightR(+e.target.value)} className="w-full accent-cyan-500" />
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        Logistic map x → r·x(1−x). Period-doubling cascade then λ crosses zero at Feigenbaum accumulation ≈ 3.5699.
      </div>
    </div>
  );
}
