import React, { useState } from 'react';

/**
 * Spectral graph viz: Erdős–Rényi graph with adjustable edge probability,
 * shown alongside its Laplacian eigenvalue distribution.
 */
export default function SpectralGraphViz() {
  const [p, setP] = useState(0.25);
  const [n] = useState(18);
  const [seed, setSeed] = useState(3);

  const W = 600, H = 280;

  // Build graph
  const { nodes, edges, eigs } = React.useMemo(() => {
    let rng = seed;
    const rand = () => { rng = (rng * 1103515245 + 12345) % 2 ** 31; return rng / 2 ** 31; };
    const nodes: { x: number; y: number }[] = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 2 * Math.PI;
      nodes.push({ x: 120 + 80 * Math.cos(a), y: 140 + 80 * Math.sin(a) });
    }
    const edges: [number, number][] = [];
    const A: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (rand() < p) {
          edges.push([i, j]);
          A[i][j] = 1;
          A[j][i] = 1;
        }
      }
    }
    // Laplacian L = D - A
    const L: number[][] = A.map((row, i) => {
      const d = row.reduce((s, v) => s + v, 0);
      return row.map((v, j) => (i === j ? d : -v));
    });
    // Eigenvalues via power iteration-style deflation (small n; use QR-ish Jacobi)
    const eigs = jacobiEig(L);
    eigs.sort((a, b) => a - b);
    return { nodes, edges, eigs };
  }, [p, n, seed]);

  const fiedler = eigs[1] ?? 0;
  const emax = Math.max(...eigs, 1);

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {/* Edges */}
        {edges.map(([i, j], k) => (
          <line key={k} x1={nodes[i].x} y1={nodes[i].y} x2={nodes[j].x} y2={nodes[j].y}
            stroke="#555" strokeWidth={1} />
        ))}
        {/* Nodes */}
        {nodes.map((v, i) => (
          <circle key={i} cx={v.x} cy={v.y} r={5} fill="#d4a847" />
        ))}
        {/* Spectrum */}
        <line x1={260} y1={H - 50} x2={W - 20} y2={H - 50} stroke="#333" />
        {eigs.map((lam, i) => {
          const x = 260 + (lam / emax) * (W - 280);
          return <line key={i} x1={x} y1={H - 60} x2={x} y2={H - 40}
            stroke={i === 1 ? '#ec4899' : '#22d3ee'} strokeWidth={i === 1 ? 2 : 1.2} />;
        })}
        <text x={260} y={H - 20} fill="#71717a" fontSize={10} fontFamily="monospace">
          λ₀ = 0    λ₁ (Fiedler) = <tspan fill="#ec4899">{fiedler.toFixed(2)}</tspan>    λ_max = {emax.toFixed(2)}
        </text>
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">edge prob p</label>
          <input type="range" min={0.05} max={0.8} step={0.01} value={p}
            onChange={(e) => setP(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{p.toFixed(2)}</span>
        </div>
        <button onClick={() => setSeed(seed + 1)}
          className="text-[10px] uppercase tracking-widest bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-zinc-300">
          Reseed
        </button>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        Fiedler value λ₁ &gt; 0 iff graph is connected · larger = better connected
      </div>
    </div>
  );
}

// Jacobi eigenvalue decomposition for small symmetric matrices
function jacobiEig(A: number[][]): number[] {
  const n = A.length;
  const M = A.map(r => r.slice());
  for (let iter = 0; iter < 200; iter++) {
    let p = 0, q = 1, mx = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(M[i][j]) > mx) { mx = Math.abs(M[i][j]); p = i; q = j; }
      }
    }
    if (mx < 1e-9) break;
    const theta = (M[q][q] - M[p][p]) / (2 * M[p][q]);
    const t = Math.sign(theta) / (Math.abs(theta) + Math.sqrt(1 + theta * theta));
    const c = 1 / Math.sqrt(1 + t * t);
    const s = t * c;
    for (let i = 0; i < n; i++) {
      const mip = M[i][p], miq = M[i][q];
      M[i][p] = c * mip - s * miq;
      M[i][q] = s * mip + c * miq;
    }
    for (let j = 0; j < n; j++) {
      const mpj = M[p][j], mqj = M[q][j];
      M[p][j] = c * mpj - s * mqj;
      M[q][j] = s * mpj + c * mqj;
    }
  }
  return M.map((_, i) => M[i][i]);
}
