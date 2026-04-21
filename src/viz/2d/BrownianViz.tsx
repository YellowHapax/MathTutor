import React, { useEffect, useState } from 'react';

/**
 * Brownian motion viz: multiple sample paths, showing that quadratic
 * variation Σ(ΔB)² → t while linear variation Σ|ΔB| → ∞ as dt → 0.
 */
export default function BrownianViz() {
  const [dt, setDt] = useState(0.01);
  const [seed, setSeed] = useState(1);

  const W = 600, H = 260, pad = 30;
  const T = 1;

  const paths = React.useMemo(() => {
    const N = Math.max(10, Math.floor(T / dt));
    const out: number[][] = [];
    let rng = seed;
    const rand = () => { rng = (rng * 1103515245 + 12345) % 2 ** 31; return rng / 2 ** 31; };
    const gauss = () => {
      const u = rand() || 1e-9, v = rand();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    for (let k = 0; k < 5; k++) {
      const p: number[] = [0];
      for (let i = 1; i < N; i++) p.push(p[i - 1] + gauss() * Math.sqrt(dt));
      out.push(p);
    }
    return out;
  }, [dt, seed]);

  const N = paths[0]?.length ?? 1;
  const flat = paths.flat();
  const ymin = Math.min(-1, ...flat), ymax = Math.max(1, ...flat);
  const sx = (i: number) => pad + (i / (N - 1)) * (W - 2 * pad);
  const sy = (v: number) => H - pad - ((v - ymin) / (ymax - ymin)) * (H - 2 * pad);
  const pstr = (p: number[]) => p.map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i)} ${sy(v)}`).join(' ');

  // quadratic variation of path 0
  const QV = paths[0]
    ? paths[0].slice(1).reduce((s, v, i) => s + (v - paths[0][i]) ** 2, 0)
    : 0;

  const colors = ['#d4a847', '#22d3ee', '#ec4899', '#84cc16', '#a78bfa'];

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="#333" />
        {paths.map((p, k) => (
          <path key={k} d={pstr(p)} fill="none" stroke={colors[k]} strokeWidth={1.2} opacity={0.8} />
        ))}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">Δt</label>
          <input type="range" min={0.0005} max={0.05} step={0.0005} value={dt}
            onChange={(e) => setDt(+e.target.value)}
            className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{dt.toFixed(4)}</span>
        </div>
        <div className="flex items-end">
          <button onClick={() => setSeed(seed + 1)}
            className="text-[10px] uppercase tracking-widest bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-zinc-300">
            Reseed
          </button>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        Quadratic variation of yellow path ≈ <span className="text-cyan-400">{QV.toFixed(3)}</span> → T = 1 as Δt → 0
      </div>
    </div>
  );
}
