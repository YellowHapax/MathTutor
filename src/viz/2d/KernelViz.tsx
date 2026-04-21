import React, { useState } from 'react';

/**
 * Kernel viz: picks a kernel (RBF / polynomial / Laplacian) and shows
 * both k(x, y) as a heatmap and the induced RKHS samples.
 */
export default function KernelViz() {
  const [kernel, setKernel] = useState<'rbf' | 'poly' | 'lap'>('rbf');
  const [param, setParam] = useState(0.5);

  const W = 500, H = 260;
  const N = 48;

  const k = (x: number, y: number) => {
    if (kernel === 'rbf') return Math.exp(-((x - y) ** 2) / (2 * param * param));
    if (kernel === 'poly') return (1 + x * y) ** Math.max(1, Math.floor(param * 6));
    return Math.exp(-Math.abs(x - y) / Math.max(0.05, param));
  };

  const xs = Array.from({ length: N }, (_, i) => -2 + (i / (N - 1)) * 4);
  // Build kernel matrix
  const K: number[][] = xs.map(x => xs.map(y => k(x, y)));
  let kmax = 0;
  K.forEach(row => row.forEach(v => { if (Math.abs(v) > kmax) kmax = Math.abs(v); }));
  const cw = W / N, ch = H / N;

  // Draw a sample "function" in RKHS: f(x) = Σ α_i k(x_i, x)
  const alpha = [1.2, -0.8, 0.5, -0.3, 1.0];
  const anchors = [-1.5, -0.7, 0, 0.6, 1.3];
  const f = (x: number) => alpha.reduce((s, a, i) => s + a * k(anchors[i], x), 0);
  const fxs = Array.from({ length: 200 }, (_, i) => -2 + (i / 199) * 4);
  const fys = fxs.map(f);
  const fymin = Math.min(...fys), fymax = Math.max(...fys);

  const sx = (x: number) => ((x + 2) / 4) * W;
  const sy = (y: number) => H / 2 + 100 - ((y - fymin) / (fymax - fymin + 1e-9)) * 100;

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {K.map((row, i) =>
          row.map((v, j) => {
            const intensity = v / kmax;
            const color = intensity >= 0
              ? `rgba(212, 168, 71, ${Math.abs(intensity) * 0.9})`
              : `rgba(34, 211, 238, ${Math.abs(intensity) * 0.9})`;
            return <rect key={`${i}-${j}`} x={j * cw} y={i * ch} width={cw} height={ch} fill={color} />;
          })
        )}
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <button onClick={() => setKernel('rbf')}
          className={`px-3 py-1 rounded uppercase tracking-widest text-[10px] ${kernel === 'rbf' ? 'bg-amber-600/30 text-amber-300' : 'bg-zinc-800 text-zinc-400'}`}>
          RBF
        </button>
        <button onClick={() => setKernel('poly')}
          className={`px-3 py-1 rounded uppercase tracking-widest text-[10px] ${kernel === 'poly' ? 'bg-amber-600/30 text-amber-300' : 'bg-zinc-800 text-zinc-400'}`}>
          Polynomial
        </button>
        <button onClick={() => setKernel('lap')}
          className={`px-3 py-1 rounded uppercase tracking-widest text-[10px] ${kernel === 'lap' ? 'bg-amber-600/30 text-amber-300' : 'bg-zinc-800 text-zinc-400'}`}>
          Laplacian
        </button>
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs">
        <label className="text-zinc-500 uppercase tracking-widest">
          {kernel === 'rbf' ? 'bandwidth σ' : kernel === 'poly' ? 'degree' : 'scale'}
        </label>
        <input type="range" min={0.05} max={1.5} step={0.01} value={param}
          onChange={(e) => setParam(+e.target.value)} className="flex-1 accent-amber-500" />
        <span className="text-amber-400 font-mono">{param.toFixed(2)}</span>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        heatmap: K[i,j] = k(xᵢ, xⱼ) · attention QKᵀ without softmax is exactly this
      </div>
    </div>
  );
}
