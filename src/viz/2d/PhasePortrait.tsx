import React, { useState, useMemo } from 'react';

const SCALE = 80;
const W = 260, H = 260;

const toSVG = (x: number, y: number): [number, number] => [W / 2 + x * SCALE, H / 2 - y * SCALE];

function integrate(x0: number, y0: number, mu: number): [number, number][] {
  const pts: [number, number][] = [[x0, y0]];
  let x = x0, y = y0;
  for (let i = 0; i < 350; i++) {
    const nx = x + (mu * x - y) * 0.025;
    const ny = y + (x + mu * y) * 0.025;
    x = nx; y = ny;
    pts.push([x, y]);
    if (Math.hypot(x, y) > 2.5 || Math.hypot(x, y) < 0.005) break;
  }
  return pts;
}

export default function PhasePortrait() {
  const [mu, setMu] = useState(0);
  const [seeds, setSeeds] = useState<[number, number][]>([[0.8, 0.1], [-0.8, -0.1], [0.1, 0.8]]);

  const arrows = useMemo(() => {
    const result: React.ReactNode[] = [];
    const n = 9;
    for (let i = 0; i <= n; i++) {
      for (let j = 0; j <= n; j++) {
        const x = (i / n) * 3.2 - 1.6;
        const y = (j / n) * 3.2 - 1.6;
        const vx = mu * x - y, vy = x + mu * y;
        const len = Math.hypot(vx, vy) || 1;
        const s = 0.14;
        const [sx, sy] = toSVG(x, y);
        const [ex, ey] = toSVG(x + (vx / len) * s, y + (vy / len) * s);
        const op = Math.min(0.85, 0.2 + Math.min(len, 3) * 0.2);
        result.push(
          <g key={`${i}-${j}`}>
            <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={`rgba(212,168,71,${op})`} strokeWidth="1" />
            <circle cx={ex} cy={ey} r="1.3" fill={`rgba(212,168,71,${op})`} />
          </g>
        );
      }
    }
    return result;
  }, [mu]);

  const trajectories = useMemo(() =>
    seeds.map(([x0, y0]) => {
      const pts = integrate(x0, y0, mu);
      return pts.map(([x, y], i) => { const [sx, sy] = toSVG(x, y); return `${i === 0 ? 'M' : 'L'}${sx},${sy}`; }).join(' ');
    }), [seeds, mu]);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (((e.clientX - rect.left) / rect.width) * W - W / 2) / SCALE;
    const y = -((((e.clientY - rect.top) / rect.height) * H - H / 2)) / SCALE;
    setSeeds(s => [...s.slice(-4), [x, y]]);
  };

  return (
    <div className="relative flex flex-col items-center p-8 py-10 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden mt-6">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5" />
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>

      <svg width={W} height={H} className="bg-[#0f0f0f] rounded border border-zinc-800 cursor-crosshair" onClick={handleClick}>
        <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="#27272a" strokeWidth="1" />
        <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#27272a" strokeWidth="1" />
        {arrows}
        {trajectories.map((d, i) => <path key={i} d={d} fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.85" />)}
        {seeds.map(([x0, y0], i) => { const [sx, sy] = toSVG(x0, y0); return <circle key={i} cx={sx} cy={sy} r="4" fill="#22d3ee" />; })}
        <circle cx={W / 2} cy={H / 2} r="4" fill="#d4a847" />
      </svg>

      <div className="w-full max-w-[260px] mt-5 space-y-2">
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          <span>μ = {mu.toFixed(2)}</span>
          <span className="text-[#d4a847]">{mu < -0.04 ? 'Spiral In' : mu > 0.04 ? 'Spiral Out' : 'Center (circles)'}</span>
        </div>
        <input type="range" min={-0.3} max={0.3} step={0.01} value={mu}
          onChange={e => setMu(parseFloat(e.target.value))}
          className="w-full accent-[#d4a847]" />
        <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">click canvas to seed a trajectory</p>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        SVG Engine: PhasePortrait
      </div>
    </div>
  );
}
