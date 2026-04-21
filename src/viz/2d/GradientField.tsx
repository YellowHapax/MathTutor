import React, { useState } from 'react';

const f = (x: number, y: number) => x * x + 2 * y * y;
const grad = (x: number, y: number): [number, number] => [2 * x, 4 * y];

function steepestAscent(x0: number, y0: number, steps = 40): [number, number][] {
  const path: [number, number][] = [[x0, y0]];
  let x = x0, y = y0;
  for (let i = 0; i < steps; i++) {
    const [gx, gy] = grad(x, y);
    const len = Math.hypot(gx, gy) || 1;
    x += (gx / len) * 0.06;
    y += (gy / len) * 0.06;
    path.push([x, y]);
    if (Math.hypot(x, y) > 1.8) break;
  }
  return path;
}

export default function GradientField() {
  const [start, setStart] = useState<[number, number]>([0.35, 0.15]);

  const W = 260, H = 260, scale = 95;
  const toSVG = (x: number, y: number): [number, number] => [W / 2 + x * scale, H / 2 - y * scale];

  const arrows: React.ReactNode[] = [];
  const n = 7;
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      const x = (i / n) * 2.6 - 1.3;
      const y = (j / n) * 2.6 - 1.3;
      const [gx, gy] = grad(x, y);
      const len = Math.hypot(gx, gy) || 1;
      const s = 0.13;
      const [sx, sy] = toSVG(x, y);
      const [ex, ey] = toSVG(x + (gx / len) * s, y + (gy / len) * s);
      const brightness = Math.min(0.9, f(x, y) / 3 + 0.2);
      arrows.push(
        <g key={`${i}-${j}`}>
          <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={`rgba(212,168,71,${brightness})`} strokeWidth="1.2" />
          <circle cx={ex} cy={ey} r="1.5" fill={`rgba(212,168,71,${brightness})`} />
        </g>
      );
    }
  }

  const contours = [0.1, 0.3, 0.7, 1.2, 1.9].map(k => (
    <ellipse key={k} cx={W / 2} cy={H / 2}
      rx={Math.sqrt(k) * scale} ry={Math.sqrt(k / 2) * scale}
      fill="none" stroke="#27272a" strokeWidth="1" />
  ));

  const path = steepestAscent(start[0], start[1]);
  const pathD = path.map(([x, y], i) => { const [sx, sy] = toSVG(x, y); return `${i === 0 ? 'M' : 'L'}${sx},${sy}`; }).join(' ');
  const [dotX, dotY] = toSVG(start[0], start[1]);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setStart([(((e.clientX - rect.left) / rect.width) * W - W / 2) / scale, -((((e.clientY - rect.top) / rect.height) * H - H / 2)) / scale]);
  };

  return (
    <div className="relative flex flex-col items-center p-8 py-10 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden mt-6">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5" />
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>

      <svg width={W} height={H} className="bg-[#0f0f0f] rounded border border-zinc-800 cursor-crosshair" onClick={handleClick}>
        {contours}
        {arrows}
        <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
        <circle cx={dotX} cy={dotY} r="6" fill="#22d3ee" opacity="0.9" />
        <circle cx={W / 2} cy={H / 2} r="5" fill="#d4a847" />
      </svg>

      <p className="text-[10px] text-zinc-600 mt-3 font-mono uppercase tracking-widest">
        f(x,y) = x² + 2y²  — click canvas to move start
      </p>

      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        SVG Engine: GradientField
      </div>
    </div>
  );
}
