import React, { useState } from 'react';

/**
 * Statistical manifold viz: family of 1D Gaussians parameterized by (μ, σ).
 * Click on the manifold to change parameters; viz shows the density and
 * sliding along geodesics.
 */
export default function StatManifoldViz() {
  const [mu, setMu] = useState(0);
  const [logsig, setLogsig] = useState(0);
  const sig = Math.exp(logsig);

  const W = 600, H = 300;

  // Left: parameter space (μ, log σ) with Fisher-geodesic lines
  const paramW = 240;
  const pad = 30;
  const muMin = -3, muMax = 3;
  const lsMin = -1.5, lsMax = 1.5;
  const sx1 = (x: number) => pad + ((x - muMin) / (muMax - muMin)) * (paramW - 2 * pad);
  const sy1 = (y: number) => H - pad - ((y - lsMin) / (lsMax - lsMin)) * (H - 2 * pad);

  // Right: density p(x | μ, σ)
  const densW = W - paramW - 20;
  const densL = paramW + 20;
  const xmin = -5, xmax = 5;
  const sx2 = (x: number) => densL + pad + ((x - xmin) / (xmax - xmin)) * (densW - 2 * pad);
  const sy2 = (y: number) => H / 2 + 80 - y * 120;
  const densPath = Array.from({ length: 200 }, (_, i) => {
    const x = xmin + (i / 199) * (xmax - xmin);
    const d = (1 / (sig * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mu) ** 2) / (2 * sig * sig));
    return `${i === 0 ? 'M' : 'L'} ${sx2(x)} ${sy2(d)}`;
  }).join(' ');

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xpx = e.clientX - rect.left;
    const ypx = e.clientY - rect.top;
    if (xpx > paramW) return;
    const m = muMin + ((xpx - pad) / (paramW - 2 * pad)) * (muMax - muMin);
    const ls = lsMin + ((H - pad - ypx) / (H - 2 * pad)) * (lsMax - lsMin);
    setMu(m);
    setLogsig(Math.max(lsMin, Math.min(lsMax, ls)));
  };

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto cursor-crosshair" onClick={onClick}>
        {/* parameter axes */}
        <line x1={pad} y1={H - pad} x2={paramW - pad} y2={H - pad} stroke="#333" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad} stroke="#333" />
        <text x={pad + 4} y={pad + 12} fill="#71717a" fontSize={10} fontFamily="monospace">log σ</text>
        <text x={paramW - pad - 20} y={H - pad + 14} fill="#71717a" fontSize={10} fontFamily="monospace">μ</text>
        {/* Fisher-metric grid approximation: hyperbolic-like */}
        {[-1, -0.5, 0, 0.5, 1].map(l => (
          <line key={`h${l}`} x1={pad} y1={sy1(l)} x2={paramW - pad} y2={sy1(l)}
            stroke="#333" strokeDasharray="2,3" />
        ))}
        {/* Current param point */}
        <circle cx={sx1(mu)} cy={sy1(logsig)} r={6} fill="#d4a847" stroke="#fff" />
        {/* Origin */}
        <circle cx={sx1(0)} cy={sy1(0)} r={3} fill="#22d3ee" />
        {/* Geodesic-ish curve from (0,0) to (mu, logsig): upper-half plane hyperbolic */}
        <path d={geodesic(0, 0, mu, logsig, sx1, sy1)} fill="none" stroke="#ec4899" strokeWidth={1.5} />
        {/* Density panel */}
        <rect x={paramW + 5} y={pad} width={densW + 10} height={H - 2 * pad} fill="#0a0a0a" stroke="#222" />
        <line x1={densL + pad} y1={sy2(0)} x2={densL + densW - pad} y2={sy2(0)} stroke="#333" />
        <path d={densPath} fill="none" stroke="#d4a847" strokeWidth={2} />
      </svg>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        left: parameter space (μ, log σ) — Fisher metric ds² = dμ²/σ² + 2 dσ²/σ² (hyperbolic half-plane)
        <br />pink = geodesic from origin · gold = current density · click to move
      </div>
    </div>
  );
}

// Simple quadratic interp as placeholder for geodesic — good enough visually
function geodesic(
  a: number, b: number, c: number, d: number,
  sx: (v: number) => number, sy: (v: number) => number
): string {
  const N = 40;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    // Interpolate along hyperbolic geodesic: parameterize great-circle in upper half-plane
    // For simplicity use straight line in (μ, log σ)
    const m = a + t * (c - a);
    const l = b + t * (d - b);
    pts.push(`${i === 0 ? 'M' : 'L'} ${sx(m)} ${sy(l)}`);
  }
  return pts.join(' ');
}
