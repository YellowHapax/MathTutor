import React, { useMemo, useState } from 'react';

/**
 * Wigner semicircle viz: generate a random symmetric matrix with iid entries,
 * diagonalize (power-iteration-free closed form not feasible; use QR from scratch
 * would be heavy), so we sample eigenvalues by computing numerically via
 * the Jacobi rotations for small n.
 *
 * For interactivity we use a moderate n (≤ 60) with a simple (n^3) Jacobi diag.
 */

function randn() {
  const u = 1 - Math.random(); const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function jacobiEigen(A: number[][]): number[] {
  const n = A.length;
  const M = A.map(r => r.slice());
  const maxSweep = 40;
  for (let sweep = 0; sweep < maxSweep; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += M[i][j] * M[i][j];
    if (off < 1e-8) break;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = M[p][q];
        if (Math.abs(apq) < 1e-10) continue;
        const app = M[p][p], aqq = M[q][q];
        const theta = (aqq - app) / (2 * apq);
        const t = Math.sign(theta) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1); const s = t * c;
        M[p][p] = app - t * apq; M[q][q] = aqq + t * apq; M[p][q] = M[q][p] = 0;
        for (let r = 0; r < n; r++) {
          if (r !== p && r !== q) {
            const arp = M[r][p], arq = M[r][q];
            M[r][p] = M[p][r] = c * arp - s * arq;
            M[r][q] = M[q][r] = s * arp + c * arq;
          }
        }
      }
    }
  }
  return M.map((_, i) => M[i][i]).sort((a, b) => a - b);
}

export default function WignerViz() {
  const [n, setN] = useState(40);
  const [seed, setSeed] = useState(1);

  const W = 600, H = 240;
  const sigma = 1;

  const eigs = useMemo(() => {
    // seed-aware PRNG — keep simple, just reseed Math.random via counter unreliably;
    // use a local LCG tied to seed for reproducibility
    let s = seed * 2654435761 >>> 0;
    const rng = () => { s = (1664525 * s + 1013904223) >>> 0; return s / 2 ** 32; };
    const nrn = () => { const u = 1 - rng(); const v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    const A: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) for (let j = i; j < n; j++) {
      const v = nrn() * sigma / Math.sqrt(n);
      A[i][j] = v; A[j][i] = v;
    }
    return jacobiEigen(A);
  }, [n, seed]);

  const bins = 24;
  const lo = -2.3 * sigma, hi = 2.3 * sigma;
  const hist = new Array(bins).fill(0);
  for (const e of eigs) {
    const b = Math.floor(((e - lo) / (hi - lo)) * bins);
    if (b >= 0 && b < bins) hist[b]++;
  }
  const maxH = Math.max(...hist, 1);

  const bx = (b: number) => 30 + (b / bins) * (W - 60);
  const bw = (W - 60) / bins;

  // theoretical semicircle ρ(λ) = (1/(2π σ²)) √(4σ² − λ²)
  const thCurve: string[] = [];
  const pts = 80;
  const scale = maxH / ((1 / (2 * Math.PI * sigma * sigma)) * 2 * sigma) * 1.0;
  for (let i = 0; i <= pts; i++) {
    const lam = lo + (i / pts) * (hi - lo);
    const inside = 4 * sigma * sigma - lam * lam;
    const rho = inside > 0 ? (1 / (2 * Math.PI * sigma * sigma)) * Math.sqrt(inside) : 0;
    const x = 30 + ((lam - lo) / (hi - lo)) * (W - 60);
    const y = H - 30 - (rho * (hi - lo) / bins) * n * (H - 60) / maxH;
    thCurve.push(`${i === 0 ? 'M' : 'L'}${x},${y}`);
  }

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        <line x1={30} y1={H - 30} x2={W - 30} y2={H - 30} stroke="#333" />
        {hist.map((c, b) => (
          <rect key={b}
            x={bx(b)} y={H - 30 - (c / maxH) * (H - 60)}
            width={bw - 1} height={(c / maxH) * (H - 60)}
            fill="#22d3ee" opacity={0.7} />
        ))}
        <path d={thCurve.join(' ')} fill="none" stroke="#d4a847" strokeWidth={2} />
        <text x={W - 40} y={20} fill="#d4a847" fontSize={10} fontFamily="monospace" textAnchor="end">Wigner ρ(λ)</text>
        <text x={W - 40} y={34} fill="#22d3ee" fontSize={10} fontFamily="monospace" textAnchor="end">empirical</text>
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">matrix size n</label>
          <input type="range" min={10} max={60} step={2} value={n}
            onChange={(e) => setN(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{n}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">seed</label>
          <input type="range" min={1} max={50} step={1} value={seed}
            onChange={(e) => setSeed(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{seed}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        Edge of spectrum at ±2σ; density vanishes as √(4σ² − λ²). Resampled via Jacobi diagonalization.
      </div>
    </div>
  );
}
