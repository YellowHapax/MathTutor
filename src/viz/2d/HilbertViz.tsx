import React, { useState } from 'react';

/**
 * Projection onto the span of two Fourier basis functions (sin x, sin 2x).
 * User picks target function via 3 coefficients; viz shows projection residual.
 */
export default function HilbertViz() {
  const [c1, setC1] = useState(1.0);
  const [c2, setC2] = useState(0.0);
  const [c3, setC3] = useState(0.0);

  const W = 600, H = 240, pad = 30;
  const N = 200;
  const xmin = 0, xmax = 2 * Math.PI;

  // Target f = c1 sin x + c2 sin 2x + c3 sin 3x
  const f = (x: number) => c1 * Math.sin(x) + c2 * Math.sin(2 * x) + c3 * Math.sin(3 * x);
  // Projection onto span{sin x, sin 2x}: just drop c3 term
  const proj = (x: number) => c1 * Math.sin(x) + c2 * Math.sin(2 * x);

  // Residual ||f - proj||² (Plancherel): for orthonormal basis,  = c3² · π  (on [0, 2π])
  const residual = Math.abs(c3) * Math.sqrt(Math.PI);

  const sx = (x: number) => pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad);
  const sy = (y: number) => H / 2 - y * 40;

  const fpath = Array.from({ length: N }, (_, i) => {
    const x = xmin + (i / (N - 1)) * (xmax - xmin);
    return `${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(f(x))}`;
  }).join(' ');
  const ppath = Array.from({ length: N }, (_, i) => {
    const x = xmin + (i / (N - 1)) * (xmax - xmin);
    return `${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(proj(x))}`;
  }).join(' ');

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} stroke="#333" />
        <path d={fpath} fill="none" stroke="#d4a847" strokeWidth={2} />
        <path d={ppath} fill="none" stroke="#22d3ee" strokeWidth={1.8} strokeDasharray="5,3" />
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">c₁ (sin x)</label>
          <input type="range" min={-1.5} max={1.5} step={0.05} value={c1}
            onChange={(e) => setC1(+e.target.value)} className="w-full accent-amber-500" />
          <span className="text-amber-400 font-mono">{c1.toFixed(2)}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">c₂ (sin 2x)</label>
          <input type="range" min={-1.5} max={1.5} step={0.05} value={c2}
            onChange={(e) => setC2(+e.target.value)} className="w-full accent-amber-500" />
          <span className="text-amber-400 font-mono">{c2.toFixed(2)}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">c₃ (sin 3x, off-span)</label>
          <input type="range" min={-1.5} max={1.5} step={0.05} value={c3}
            onChange={(e) => setC3(+e.target.value)} className="w-full accent-pink-500" />
          <span className="text-pink-400 font-mono">{c3.toFixed(2)}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        gold = f · cyan = P_V f (projection on span{'{'}sin x, sin 2x{'}'}) · ‖f − P_V f‖ = {residual.toFixed(3)}
      </div>
    </div>
  );
}
