import React, { useMemo, useState } from 'react';

/**
 * NTK kernel regression viz: two-layer ReLU network NTK in 1D.
 *
 * For two-layer ReLU with input x ∈ S^1 (angle θ) and inputs in 1D mapped to
 * (x, 1)/√(x²+1), the arc-cosine NTK (Cho & Saul, 2009; Jacot et al., 2018):
 *
 *   Θ(x, y) = (1/π)[ sin ψ + (π − ψ) cos ψ ] · ‖x‖·‖y‖
 *   where cos ψ = (x·y) / (‖x‖·‖y‖)
 *
 * We show the kernel response + NTK posterior mean on a handful of
 * training points.
 */
export default function NTKViz() {
  const [width, setWidth] = useState(256);  // cosmetic; NTK is width-independent in limit
  const [noise, setNoise] = useState(0.1);

  const W = 600, H = 240;

  // Training data — a rough sinusoid
  const trainX = [-2.5, -1.7, -0.8, 0.2, 1.1, 2.0];
  const trainY = trainX.map(x => Math.sin(1.5 * x));

  // 1D NTK via arc-cosine kernel (normalize inputs to unit vectors in 2D)
  const k = (x: number, y: number) => {
    const xv = [x, 1], yv = [y, 1];
    const nx = Math.hypot(xv[0], xv[1]);
    const ny = Math.hypot(yv[0], yv[1]);
    const dot = xv[0] * yv[0] + xv[1] * yv[1];
    const cosPsi = Math.max(-1, Math.min(1, dot / (nx * ny)));
    const psi = Math.acos(cosPsi);
    const arc = (1 / Math.PI) * (Math.sin(psi) + (Math.PI - psi) * cosPsi);
    return arc * nx * ny;
  };

  const posterior = useMemo(() => {
    const n = trainX.length;
    const K = trainX.map(xi => trainX.map(xj => k(xi, xj)));
    // Add noise
    for (let i = 0; i < n; i++) K[i][i] += noise * noise;
    // Solve K α = y via Gaussian elimination
    const M = K.map((r, i) => [...r, trainY[i]]);
    for (let i = 0; i < n; i++) {
      let pivot = i;
      for (let j = i + 1; j < n; j++) if (Math.abs(M[j][i]) > Math.abs(M[pivot][i])) pivot = j;
      [M[i], M[pivot]] = [M[pivot], M[i]];
      const d = M[i][i];
      for (let j = i; j <= n; j++) M[i][j] /= d;
      for (let j = 0; j < n; j++) if (j !== i) {
        const f = M[j][i];
        for (let c = i; c <= n; c++) M[j][c] -= f * M[i][c];
      }
    }
    const alpha = M.map(r => r[n]);
    return (x: number) => {
      let s = 0;
      for (let i = 0; i < n; i++) s += alpha[i] * k(x, trainX[i]);
      return s;
    };
  }, [noise]);

  const xMin = -3.5, xMax = 3.5;
  const yMin = -1.3, yMax = 1.3;
  const sx = (x: number) => 30 + ((x - xMin) / (xMax - xMin)) * (W - 60);
  const sy = (y: number) => H - 30 - ((y - yMin) / (yMax - yMin)) * (H - 60);

  const pts = 120;
  const curve: string[] = [];
  for (let i = 0; i <= pts; i++) {
    const x = xMin + (i / pts) * (xMax - xMin);
    const y = posterior(x);
    curve.push(`${i === 0 ? 'M' : 'L'}${sx(x)},${sy(Math.max(yMin, Math.min(yMax, y)))}`);
  }

  const target: string[] = [];
  for (let i = 0; i <= pts; i++) {
    const x = xMin + (i / pts) * (xMax - xMin);
    target.push(`${i === 0 ? 'M' : 'L'}${sx(x)},${sy(Math.sin(1.5 * x))}`);
  }

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        <line x1={30} y1={sy(0)} x2={W - 30} y2={sy(0)} stroke="#333" strokeDasharray="2,4" />
        <path d={target.join(' ')} fill="none" stroke="#22d3ee" strokeWidth={1} opacity={0.6} strokeDasharray="4,3" />
        <path d={curve.join(' ')} fill="none" stroke="#d4a847" strokeWidth={2} />
        {trainX.map((x, i) => (
          <circle key={i} cx={sx(x)} cy={sy(trainY[i])} r={4} fill="#ec4899" />
        ))}
        <text x={W - 40} y={22} fill="#d4a847" fontSize={10} fontFamily="monospace" textAnchor="end">NTK posterior</text>
        <text x={W - 40} y={36} fill="#22d3ee" fontSize={10} fontFamily="monospace" textAnchor="end">true sin(1.5x)</text>
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">width (conceptual)</label>
          <input type="range" min={16} max={4096} step={16} value={width}
            onChange={(e) => setWidth(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{width}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">obs. noise σ</label>
          <input type="range" min={0.001} max={0.5} step={0.001} value={noise}
            onChange={(e) => setNoise(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{noise.toFixed(3)}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        Arc-cosine NTK of a 2-layer ReLU net. Width-independent in the limit; here used as kernel regression.
      </div>
    </div>
  );
}
