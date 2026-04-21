import React, { useState, useEffect } from 'react';

/**
 * Sinkhorn iteration viz: two histograms on [0,1], cost C_ij = |x_i - x_j|²,
 * user adjusts ε; shows the transport plan matrix converging via alternate
 * row/col normalization.
 */
export default function SinkhornViz() {
  const [eps, setEps] = useState(0.05);
  const [iter, setIter] = useState(0);

  const n = 8;
  const xs = Array.from({ length: n }, (_, i) => i / (n - 1));
  const mu = [0.05, 0.1, 0.2, 0.25, 0.2, 0.1, 0.06, 0.04]; // source
  const nu = [0.04, 0.06, 0.1, 0.15, 0.2, 0.2, 0.15, 0.1]; // target

  // Build K = exp(-C / ε)
  const K: number[][] = xs.map((xi, i) => xs.map((xj, j) => Math.exp(-((xi - xj) ** 2) / eps)));

  // Sinkhorn iterations up to `iter`
  const { P } = React.useMemo(() => {
    let u = new Array(n).fill(1);
    let v = new Array(n).fill(1);
    for (let it = 0; it < iter; it++) {
      // v = nu ./ (Kᵀ u)
      v = nu.map((nv, j) => {
        let s = 0;
        for (let i = 0; i < n; i++) s += K[i][j] * u[i];
        return s > 0 ? nv / s : 0;
      });
      // u = mu ./ (K v)
      u = mu.map((mv, i) => {
        let s = 0;
        for (let j = 0; j < n; j++) s += K[i][j] * v[j];
        return s > 0 ? mv / s : 0;
      });
    }
    const P: number[][] = xs.map((_, i) => xs.map((_, j) => u[i] * K[i][j] * v[j]));
    return { P };
  }, [iter, eps]);

  useEffect(() => {
    if (iter >= 30) return;
    const id = setTimeout(() => setIter(iter + 1), 120);
    return () => clearTimeout(id);
  }, [iter]);

  const reset = () => setIter(0);

  const W = 500, H = 260;
  const cw = W / n, ch = H / n;
  const pmax = Math.max(...P.flat(), 0.001);

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {P.map((row, i) =>
          row.map((v, j) => (
            <rect key={`${i}-${j}`} x={j * cw} y={i * ch} width={cw - 1} height={ch - 1}
              fill="#d4a847" opacity={v / pmax} />
          ))
        )}
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-zinc-500 uppercase tracking-widest">iteration</span>
        <span className="text-amber-400 font-mono">{iter} / 30</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs items-end">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">ε (regularization)</label>
          <input type="range" min={0.005} max={0.3} step={0.005} value={eps}
            onChange={(e) => { setEps(+e.target.value); setIter(0); }}
            className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{eps.toFixed(3)}</span>
        </div>
        <button onClick={reset}
          className="text-[10px] uppercase tracking-widest bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-zinc-300">
          Restart
        </button>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        small ε → concentrated transport (near-permutation); large ε → diffuse (near-uniform)
      </div>
    </div>
  );
}
