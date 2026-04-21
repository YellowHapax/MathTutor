import React, { useState } from 'react';

/**
 * GP viz: click to add observations; viz shows posterior mean and
 * 2σ band, plus 3 prior/posterior samples.
 */
export default function GaussianProcessViz() {
  const [obs, setObs] = useState<{ x: number; y: number }[]>([
    { x: -1.5, y: -0.4 },
    { x: 0.5, y: 0.8 },
  ]);
  const [ls, setLs] = useState(0.7);
  const [noise, setNoise] = useState(0.05);

  const W = 600, H = 280, pad = 30;
  const xmin = -3, xmax = 3;
  const ymin = -2.5, ymax = 2.5;
  const sx = (x: number) => pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad);
  const sy = (y: number) => H / 2 - y * 50;

  const k = (a: number, b: number) => Math.exp(-((a - b) ** 2) / (2 * ls * ls));

  // Build K + σ²I, solve (K+σ²I)⁻¹ y
  const n = obs.length;
  const xs = obs.map(o => o.x), ys = obs.map(o => o.y);

  const Kmat: number[][] = xs.map((xi, i) =>
    xs.map((xj, j) => k(xi, xj) + (i === j ? noise : 0))
  );

  // Cholesky solve
  const L: number[][] = Kmat.map(r => r.slice());
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let s = Kmat[i][j];
      for (let p = 0; p < j; p++) s -= L[i][p] * L[j][p];
      if (i === j) L[i][j] = Math.sqrt(Math.max(s, 1e-9));
      else L[i][j] = s / L[j][j];
      if (j > i) L[i][j] = 0;
    }
  }
  const solve = (b: number[]) => {
    const v = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let s = b[i];
      for (let j = 0; j < i; j++) s -= L[i][j] * v[j];
      v[i] = s / L[i][i];
    }
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let s = v[i];
      for (let j = i + 1; j < n; j++) s -= L[j][i] * x[j];
      x[i] = s / L[i][i];
    }
    return x;
  };
  const alpha = n > 0 ? solve(ys) : [];

  // Prediction grid
  const NG = 200;
  const mu: number[] = [], var_: number[] = [];
  for (let g = 0; g < NG; g++) {
    const xs_ = xmin + (g / (NG - 1)) * (xmax - xmin);
    const kstar = xs.map(xi => k(xs_, xi));
    const m = kstar.reduce((s, v, i) => s + v * alpha[i], 0);
    const v = solve(kstar);
    const var_val = k(xs_, xs_) - kstar.reduce((s, v_, i) => s + v_ * v[i], 0);
    mu.push(m);
    var_.push(Math.max(var_val, 1e-6));
  }

  const grid = Array.from({ length: NG }, (_, i) => xmin + (i / (NG - 1)) * (xmax - xmin));
  const sig = var_.map(v => Math.sqrt(v));

  const muPath = grid.map((x, i) => `${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(mu[i])}`).join(' ');
  const bandUp = grid.map((x, i) => `${sx(x)},${sy(mu[i] + 2 * sig[i])}`);
  const bandDn = grid.map((x, i) => `${sx(x)},${sy(mu[i] - 2 * sig[i])}`).reverse();
  const bandStr = [...bandUp, ...bandDn].join(' ');

  const onClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xpx = e.clientX - rect.left;
    const ypx = e.clientY - rect.top;
    const xv = xmin + ((xpx - pad) / (W - 2 * pad)) * (xmax - xmin);
    const yv = (H / 2 - ypx) / 50;
    setObs([...obs, { x: xv, y: yv }]);
  };

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto cursor-crosshair" onClick={onClick}>
        <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} stroke="#333" />
        <polygon points={bandStr} fill="#22d3ee" fillOpacity={0.18} />
        <path d={muPath} fill="none" stroke="#22d3ee" strokeWidth={2} />
        {obs.map((o, i) => (
          <circle key={i} cx={sx(o.x)} cy={sy(o.y)} r={4} fill="#ec4899" stroke="#fff" strokeWidth={1} />
        ))}
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs items-end">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">lengthscale</label>
          <input type="range" min={0.1} max={2} step={0.01} value={ls}
            onChange={(e) => setLs(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{ls.toFixed(2)}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">σ²</label>
          <input type="range" min={0.005} max={0.5} step={0.005} value={noise}
            onChange={(e) => setNoise(+e.target.value)} className="w-full accent-pink-500" />
          <span className="text-pink-400 font-mono">{noise.toFixed(3)}</span>
        </div>
        <button onClick={() => setObs([])}
          className="text-[10px] uppercase tracking-widest bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded text-zinc-300">
          Clear
        </button>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        click to add observations · 95% band = μ ± 2σ · RBF kernel k(x, x') = exp(−(x−x')²/2ℓ²)
      </div>
    </div>
  );
}
