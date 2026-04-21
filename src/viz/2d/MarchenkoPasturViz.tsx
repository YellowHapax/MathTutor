import React, { useState } from 'react';

/**
 * Marchenko–Pastur density viz:
 *   ρ_MP(λ) = √((λ₊ − λ)(λ − λ₋)) / (2π σ² q λ),  λ ∈ [λ₋, λ₊]
 *   λ± = σ² (1 ± √q)²,  q = p/n.
 *
 * User sweeps q ∈ (0, 1]. Analytical curve; no sampling needed.
 */
export default function MarchenkoPasturViz() {
  const [q, setQ] = useState(0.3);
  const sigma = 1;

  const W = 600, H = 240;
  const lamMinus = sigma * sigma * (1 - Math.sqrt(q)) ** 2;
  const lamPlus = sigma * sigma * (1 + Math.sqrt(q)) ** 2;

  const xMin = 0, xMax = Math.max(4.2, lamPlus + 0.3);
  const sx = (x: number) => 30 + ((x - xMin) / (xMax - xMin)) * (W - 60);
  const maxRho = (() => {
    let m = 0;
    const pts = 200;
    for (let i = 0; i <= pts; i++) {
      const lam = lamMinus + (i / pts) * (lamPlus - lamMinus);
      const inner = (lamPlus - lam) * (lam - lamMinus);
      if (inner <= 0 || lam <= 0) continue;
      const rho = Math.sqrt(inner) / (2 * Math.PI * sigma * sigma * q * lam);
      if (rho > m) m = rho;
    }
    return m;
  })();
  const sy = (y: number) => H - 30 - (y / maxRho) * (H - 60);

  const path: string[] = [];
  const pts = 220;
  let started = false;
  for (let i = 0; i <= pts; i++) {
    const lam = lamMinus + (i / pts) * (lamPlus - lamMinus);
    const inner = (lamPlus - lam) * (lam - lamMinus);
    if (inner < 0 || lam <= 0) continue;
    const rho = Math.sqrt(inner) / (2 * Math.PI * sigma * sigma * q * lam);
    path.push(`${started ? 'L' : 'M'}${sx(lam)},${sy(rho)}`);
    started = true;
  }

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        <line x1={30} y1={H - 30} x2={W - 30} y2={H - 30} stroke="#333" />
        {/* Shade the bulk */}
        <rect x={sx(lamMinus)} y={30} width={sx(lamPlus) - sx(lamMinus)} height={H - 60}
          fill="#d4a847" opacity={0.06} />
        <path d={path.join(' ')} fill="none" stroke="#d4a847" strokeWidth={2.5} />
        {/* Edge markers */}
        <line x1={sx(lamMinus)} y1={H - 30} x2={sx(lamMinus)} y2={30} stroke="#ec4899" strokeDasharray="3,3" />
        <line x1={sx(lamPlus)} y1={H - 30} x2={sx(lamPlus)} y2={30} stroke="#ec4899" strokeDasharray="3,3" />
        <text x={sx(lamMinus)} y={22} fill="#ec4899" fontSize={10} fontFamily="monospace" textAnchor="middle">λ₋</text>
        <text x={sx(lamPlus)} y={22} fill="#ec4899" fontSize={10} fontFamily="monospace" textAnchor="middle">λ₊</text>
        <text x={W - 40} y={H - 35} fill="#666" fontSize={10} fontFamily="monospace" textAnchor="end">λ</text>
      </svg>
      <div className="mt-2 text-center text-xs font-mono text-zinc-400">
        <span className="text-cyan-400">λ₋ = {lamMinus.toFixed(3)}</span>
        <span className="mx-3 text-zinc-600">|</span>
        <span className="text-cyan-400">λ₊ = {lamPlus.toFixed(3)}</span>
      </div>
      <div className="mt-3 text-xs">
        <label className="text-zinc-500 uppercase tracking-widest">aspect q = p/n</label>
        <input type="range" min={0.05} max={1} step={0.01} value={q}
          onChange={(e) => setQ(+e.target.value)} className="w-full accent-cyan-500" />
        <span className="text-cyan-400 font-mono">{q.toFixed(2)}</span>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        q → 0 collapses to δ(λ − σ²). q = 1 pushes λ₋ → 0: bulk touches origin.
      </div>
    </div>
  );
}
