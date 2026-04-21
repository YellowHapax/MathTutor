import React, { useState, useMemo } from 'react';

const f = (x: number) => 0.3 * x * x * x - x + 0.2 * Math.sin(3 * x);
const df = (x: number) => 0.9 * x * x - 1 + 0.6 * Math.cos(3 * x);

export default function TangentLine() {
  const [t, setT] = useState(0.5);
  const [zoom, setZoom] = useState(1);

  const W = 260, H = 220;
  const x0 = t * 4 - 2;
  const y0 = f(x0);
  const slope = df(x0);
  const viewW = 4 / zoom;
  const viewH = (H / W) * viewW * 1.5;

  const toSVG = (x: number, y: number): [number, number] => [
    ((x - x0) / viewW + 0.5) * W,
    (0.5 - (y - y0) / viewH) * H,
  ];

  const curveD = useMemo(() => {
    const pts = Array.from({ length: 201 }, (_, i) => {
      const x = x0 - viewW / 2 + (i / 200) * viewW;
      const [sx, sy] = toSVG(x, f(x));
      return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
    });
    return pts.join(' ');
  }, [x0, viewW, zoom]);

  const tx1 = x0 - viewW / 2, ty1 = y0 + slope * (tx1 - x0);
  const tx2 = x0 + viewW / 2, ty2 = y0 + slope * (tx2 - x0);
  const [ts1x, ts1y] = toSVG(tx1, ty1);
  const [ts2x, ts2y] = toSVG(tx2, ty2);
  const [dotX, dotY] = toSVG(x0, y0);

  return (
    <div className="relative flex flex-col items-center p-8 py-10 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden mt-6">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5" />
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>

      <svg width={W} height={H} className="bg-[#0f0f0f] rounded border border-zinc-800">
        <line x1={0} y1={dotY} x2={W} y2={dotY} stroke="#27272a" strokeWidth="1" />
        <line x1={dotX} y1={0} x2={dotX} y2={H} stroke="#27272a" strokeWidth="1" />
        <path d={curveD} fill="none" stroke="#d4a847" strokeWidth="2" />
        <line x1={ts1x} y1={ts1y} x2={ts2x} y2={ts2y} stroke="#22d3ee" strokeWidth="1.5" />
        <circle cx={dotX} cy={dotY} r="5" fill="#d4a847" />
      </svg>

      <div className="w-full max-w-[260px] mt-5 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>Point x₀</span>
            <span className="text-[#d4a847]">x={x0.toFixed(2)} · slope={slope.toFixed(2)}</span>
          </div>
          <input type="range" min={0} max={1} step={0.004} value={t}
            onChange={e => setT(parseFloat(e.target.value))}
            className="w-full accent-[#d4a847]" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>Zoom — local linearity</span>
            <span className="text-[#22d3ee]">×{zoom.toFixed(1)}</span>
          </div>
          <input type="range" min={1} max={24} step={0.5} value={zoom}
            onChange={e => setZoom(parseFloat(e.target.value))}
            className="w-full accent-[#22d3ee]" />
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        SVG Engine: TangentLine
      </div>
    </div>
  );
}
