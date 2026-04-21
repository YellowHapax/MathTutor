import React, { useEffect, useState, useRef } from 'react';

/**
 * Reverse-time diffusion viz: start with points drawn from N(0, I), step
 * through the reverse ODE dx = (-½β(t)x - β(t) s(x,t)) dt toward a
 * 2D target (two donuts).
 */
export default function DiffusionViz() {
  const [t, setT] = useState(1.0); // diffusion time; 1 = noise, 0 = data
  const [auto, setAuto] = useState(true);
  const pointsRef = useRef<[number, number][]>([]);
  const [, setFrame] = useState(0);
  const rafRef = useRef<number>(0);

  const W = 480, H = 320;
  const xmin = -2, xmax = 2, ymin = -2, ymax = 2;
  const sx = (x: number) => ((x - xmin) / (xmax - xmin)) * W;
  const sy = (y: number) => H - ((y - ymin) / (ymax - ymin)) * H;

  // Target p_0: two rings
  const logp0 = (x: number, y: number) => {
    const r = Math.sqrt(x * x + y * y);
    const left = Math.exp(-((x + 0.7) ** 2 + y * y) * 1.2);
    const right = Math.exp(-((x - 0.7) ** 2 + y * y) * 1.2);
    const ring = Math.exp(-((r - 1.5) ** 2) * 5);
    return Math.log(left + right + 0.5 * ring + 1e-9);
  };
  // At time t: p_t ~ convolution with N(0, σ_t²). σ_t² = 1−e^{-t} (VP schedule approx).
  const sigma2 = (tt: number) => 1 - Math.exp(-2 * tt);
  const logpt = (x: number, y: number, tt: number) => {
    const s2 = sigma2(tt) + 0.02;
    // Sample integral approximated by a coarse mixture at ring+modes centers
    const modes = [
      { x: -0.7, y: 0, w: 1 },
      { x: 0.7, y: 0, w: 1 },
      { x: 0, y: 1.5, w: 0.5 },
      { x: 0, y: -1.5, w: 0.5 },
      { x: 1.5, y: 0, w: 0.5 },
      { x: -1.5, y: 0, w: 0.5 },
    ];
    let s = 0;
    for (const m of modes) {
      s += m.w * Math.exp(-((x - m.x * Math.exp(-tt)) ** 2 + (y - m.y * Math.exp(-tt)) ** 2) / (2 * s2));
    }
    return Math.log(s + 1e-9);
  };
  const score = (x: number, y: number, tt: number) => {
    const h = 0.02;
    return [
      (logpt(x + h, y, tt) - logpt(x - h, y, tt)) / (2 * h),
      (logpt(x, y + h, tt) - logpt(x, y - h, tt)) / (2 * h),
    ];
  };

  // Init points at t=1 from standard normal
  useEffect(() => {
    const pts: [number, number][] = [];
    for (let i = 0; i < 300; i++) {
      const u = Math.random() || 1e-9, v = Math.random();
      const g1 = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      const g2 = Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v);
      pts.push([g1, g2]);
    }
    pointsRef.current = pts;
  }, []);

  useEffect(() => {
    if (!auto) return;
    const dt = 0.01;
    const step = () => {
      const newT = Math.max(0, t - dt);
      const beta = 1 + 10 * newT;
      pointsRef.current = pointsRef.current.map(([x, y]) => {
        const [sxv, syv] = score(x, y, newT);
        // Reverse ODE (probability flow): dx = [-½β x - β s] · (-dt)
        const dx = -(-0.5 * beta * x - beta * sxv) * dt;
        const dy = -(-0.5 * beta * y - beta * syv) * dt;
        return [x + dx, y + dy];
      });
      setT(newT);
      setFrame(f => f + 1);
      if (newT > 0.001) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [auto, t]);

  const reset = () => {
    const pts: [number, number][] = [];
    for (let i = 0; i < 300; i++) {
      const u = Math.random() || 1e-9, v = Math.random();
      const g1 = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      const g2 = Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v);
      pts.push([g1, g2]);
    }
    pointsRef.current = pts;
    setT(1.0);
    setAuto(true);
    setFrame(f => f + 1);
  };

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto bg-black/50 rounded">
        {pointsRef.current.map(([x, y], i) => (
          <circle key={i} cx={sx(x)} cy={sy(y)} r={1.5}
            fill={t > 0.5 ? '#22d3ee' : '#d4a847'} opacity={0.7} />
        ))}
      </svg>
      <div className="mt-3 flex items-center gap-3 text-xs">
        <span className="text-zinc-500 uppercase tracking-widest">t</span>
        <span className="text-cyan-400 font-mono w-12">{t.toFixed(2)}</span>
        <div className="flex-1 h-1 bg-zinc-800 rounded">
          <div className="h-full bg-cyan-500 rounded" style={{ width: `${t * 100}%` }} />
        </div>
        <button onClick={reset}
          className="text-[10px] uppercase tracking-widest bg-zinc-800 hover:bg-zinc-700 px-3 py-1 rounded text-zinc-300">
          Resample Noise
        </button>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        reverse ODE: dx = [½β x + β ∇ log p_t] dt · noise (cyan) → data (gold)
      </div>
    </div>
  );
}
