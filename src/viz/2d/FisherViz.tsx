import React, { useState } from 'react';

/**
 * Fisher information viz: parameter space with Fisher-induced ellipsoids
 * showing "infinitesimal KL ball" — the unit ball in local Fisher norm.
 */
export default function FisherViz() {
  const [family, setFamily] = useState<'gaussian' | 'bernoulli'>('gaussian');

  const W = 500, H = 300, pad = 40;

  // Draw Fisher ellipsoid at several anchor points
  const anchors: { x: number; y: number; label: string }[] =
    family === 'gaussian'
      ? [
          { x: 0, y: 0, label: 'μ=0, log σ=0' },
          { x: 1.5, y: 0.5, label: 'μ=1.5, log σ=.5' },
          { x: -1, y: -0.8, label: 'μ=-1, log σ=-.8' },
          { x: 0, y: 1, label: 'μ=0, log σ=1' },
          { x: 0, y: -1, label: 'μ=0, log σ=-1' },
        ]
      : [
          { x: 0.1, y: 0, label: 'p=0.1' },
          { x: 0.3, y: 0, label: 'p=0.3' },
          { x: 0.5, y: 0, label: 'p=0.5' },
          { x: 0.7, y: 0, label: 'p=0.7' },
          { x: 0.9, y: 0, label: 'p=0.9' },
        ];

  const xmin = family === 'gaussian' ? -3 : 0, xmax = family === 'gaussian' ? 3 : 1;
  const ymin = family === 'gaussian' ? -1.5 : -0.5, ymax = family === 'gaussian' ? 1.5 : 0.5;
  const sx = (x: number) => pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - ymin) / (ymax - ymin)) * (H - 2 * pad);

  // Fisher info at each anchor
  const fisher = (a: { x: number; y: number }): [[number, number], [number, number]] => {
    if (family === 'gaussian') {
      const sig2 = Math.exp(2 * a.y);
      return [[1 / sig2, 0], [0, 2]];
    }
    // Bernoulli: I(p) = 1/(p(1-p)) — 1D
    const p = a.x;
    const i = 1 / (p * (1 - p));
    return [[i, 0], [0, 0.0001]];
  };

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="#333" />
        <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="#333" />
        {anchors.map((a, i) => {
          const F = fisher(a);
          // Unit Fisher ball: {v : v^T F v ≤ 1}, i.e., ellipse with semi-axes 1/√eigval
          const lam1 = F[0][0], lam2 = F[1][1];
          const r1 = 0.4 / Math.sqrt(lam1);
          const r2 = 0.4 / Math.sqrt(Math.max(lam2, 1e-3));
          return (
            <g key={i}>
              <ellipse cx={sx(a.x)} cy={sy(a.y)}
                rx={Math.abs(sx(a.x + r1) - sx(a.x))}
                ry={Math.abs(sy(a.y + r2) - sy(a.y))}
                fill="none" stroke="#d4a847" strokeWidth={1.5} opacity={0.8} />
              <circle cx={sx(a.x)} cy={sy(a.y)} r={2.5} fill="#22d3ee" />
            </g>
          );
        })}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <button onClick={() => setFamily('gaussian')}
          className={`px-3 py-1 rounded uppercase tracking-widest text-[10px] ${family === 'gaussian' ? 'bg-amber-600/30 text-amber-300' : 'bg-zinc-800 text-zinc-400'}`}>
          Gaussian (μ, log σ)
        </button>
        <button onClick={() => setFamily('bernoulli')}
          className={`px-3 py-1 rounded uppercase tracking-widest text-[10px] ${family === 'bernoulli' ? 'bg-amber-600/30 text-amber-300' : 'bg-zinc-800 text-zinc-400'}`}>
          Bernoulli (p)
        </button>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        gold ellipses = unit balls in Fisher metric · distributions that are one "KL bit" apart
        <br />near endpoints of Bernoulli, the metric explodes — last bits are expensive
      </div>
    </div>
  );
}
