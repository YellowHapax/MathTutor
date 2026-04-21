import React, { useEffect, useState, useRef } from 'react';

/**
 * Langevin sampler on a 1D double-well potential U(x) = (x²-1)².
 * Particles evolve dx = -∇U dt + √(2/β) dW.
 */
export default function LangevinViz() {
  const [beta, setBeta] = useState(2);
  const [running, setRunning] = useState(true);
  const particlesRef = useRef<number[]>([]);
  const histRef = useRef<number[]>(new Array(60).fill(0));
  const [, setFrame] = useState(0);
  const rafRef = useRef<number>(0);

  const W = 600, H = 260, pad = 30;
  const xmin = -2.2, xmax = 2.2;

  const U = (x: number) => (x * x - 1) ** 2;
  const dU = (x: number) => 4 * x * (x * x - 1);

  useEffect(() => {
    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: 200 }, () => (Math.random() - 0.5) * 0.4);
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    const dt = 0.01;
    const step = () => {
      const sigma = Math.sqrt(2 / beta);
      particlesRef.current = particlesRef.current.map(x => {
        const gauss = Math.sqrt(-2 * Math.log(Math.random() || 1e-9)) * Math.cos(2 * Math.PI * Math.random());
        return x - dU(x) * dt + sigma * gauss * Math.sqrt(dt);
      });
      // Histogram
      const h = new Array(60).fill(0);
      for (const x of particlesRef.current) {
        const i = Math.floor(((x - xmin) / (xmax - xmin)) * 60);
        if (i >= 0 && i < 60) h[i] += 1;
      }
      histRef.current = h.map((v, i) => 0.9 * histRef.current[i] + 0.1 * v);
      setFrame(f => f + 1);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, beta]);

  const sx = (x: number) => pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad);
  const sy = (u: number) => H - pad - Math.min(1, u / 2) * (H - 2 * pad);
  const hmax = Math.max(1, ...histRef.current);

  const potentialPath = Array.from({ length: 200 }, (_, i) => {
    const x = xmin + (i / 199) * (xmax - xmin);
    return `${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(U(x))}`;
  }).join(' ');

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {/* Potential */}
        <path d={potentialPath} fill="none" stroke="#555" strokeWidth={1.5} />
        {/* Histogram bars */}
        {histRef.current.map((v, i) => {
          const x = pad + (i / 60) * (W - 2 * pad);
          const bw = (W - 2 * pad) / 60;
          const bh = (v / hmax) * (H - 2 * pad) * 0.5;
          return <rect key={i} x={x} y={H - pad - bh} width={bw - 1} height={bh} fill="#22d3ee" opacity={0.4} />;
        })}
        {/* Particles (sampled) */}
        {particlesRef.current.slice(0, 80).map((x, i) => (
          <circle key={i} cx={sx(x)} cy={sy(U(x)) - 4} r={2} fill="#d4a847" opacity={0.7} />
        ))}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs items-end">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">β (inv. temp.)</label>
          <input type="range" min={0.2} max={10} step={0.1} value={beta}
            onChange={(e) => setBeta(+e.target.value)}
            className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{beta.toFixed(1)}</span>
        </div>
        <button onClick={() => setRunning(r => !r)}
          className="text-[10px] uppercase tracking-widest bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-zinc-300">
          {running ? 'Pause' : 'Resume'}
        </button>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        U(x) = (x²−1)² · stationary: p(x) ∝ e^(−βU(x)) · β → ∞ ⇒ argmin concentration
      </div>
    </div>
  );
}
