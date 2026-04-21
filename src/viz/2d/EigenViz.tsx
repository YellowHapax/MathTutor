import React, { useState, useEffect } from 'react';
import React, { useState, useMemo } from 'react';

const PRESETS = [
  { name: 'Stretch',  a: 2.5, b: 0,   c: 0,   d: 0.5 },
  { name: 'Shear',    a: 1,   b: 1.5, c: 0,   d: 1   },
  { name: 'Compress', a: 0.5, b: 0,   c: 0,   d: 2   },
  { name: 'Saddle',   a: 2,   b: 1,   c: 1,   d: 2   },
];

function eigendecomp(a: number, b: number, c: number, d: number) {
  const tr = a + d;
  const disc = (tr / 2) * (tr / 2) - (a * d - b * c);
  if (disc < 0) return null;
  const l1 = tr / 2 + Math.sqrt(disc);
  const l2 = tr / 2 - Math.sqrt(disc);
  const eigvec = (l: number): [number, number] => {
    if (Math.abs(b) > 0.001) { const len = Math.hypot(b, l - a); return [b / len, (l - a) / len]; }
    if (Math.abs(c) > 0.001) { const len = Math.hypot(l - d, c); return [(l - d) / len, c / len]; }
    return l === a ? [1, 0] : [0, 1];
  };
  return { l1, l2, v1: eigvec(l1), v2: eigvec(l2) };
}

function transformedCircle(a: number, b: number, c: number, d: number, n = 72): [number, number][] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = (i / n) * 2 * Math.PI;
    return [a * Math.cos(t) + b * Math.sin(t), c * Math.cos(t) + d * Math.sin(t)];
  });
}

export default function EigenViz() {
  const [presetIdx, setPresetIdx] = useState(0);
  const { a, b, c, d } = PRESETS[presetIdx];

  const W = 260, H = 260, scale = 55;
  const toSVG = (x: number, y: number): [number, number] => [W / 2 + x * scale, H / 2 - y * scale];

  const ellipsePoints = useMemo(() => transformedCircle(a, b, c, d), [a, b, c, d]);
  const eigs = useMemo(() => eigendecomp(a, b, c, d), [a, b, c, d]);

  const ellipseD = ellipsePoints.map(([x, y], i) => {
    const [sx, sy] = toSVG(x, y);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ') + 'Z';

  return (
    <div className="relative flex flex-col items-center p-8 py-10 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden mt-6">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5" />
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>

      <svg width={W} height={H} className="bg-[#0f0f0f] rounded border border-zinc-800">
        <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="#27272a" strokeWidth="1" />
        <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#27272a" strokeWidth="1" />
        <circle cx={W / 2} cy={H / 2} r={scale} stroke="#3f3f46" strokeWidth="1" fill="none" strokeDasharray="4 4" />
        <path d={ellipseD} fill="rgba(212,168,71,0.12)" stroke="#d4a847" strokeWidth="1.5" />
        {eigs ? [
          { v: eigs.v1, l: eigs.l1, color: '#22d3ee' },
          { v: eigs.v2, l: eigs.l2, color: '#f472b6' },
        ].map(({ v, l, color }, i) => {
          const stretch = Math.abs(l);
          const [ex, ey] = toSVG(v[0] * stretch, v[1] * stretch);
          const [ex2, ey2] = toSVG(-v[0] * stretch, -v[1] * stretch);
          return (
            <g key={i}>
              <line x1={ex2} y1={ey2} x2={ex} y2={ey} stroke={color} strokeWidth="2" />
              <circle cx={ex} cy={ey} r="4" fill={color} />
              <text x={ex + 6} y={ey + 4} fill={color} fontSize="10" fontFamily="monospace">λ={l.toFixed(2)}</text>
            </g>
          );
        }) : (
          <text x={W / 2} y={18} fill="#f472b6" fontSize="11" textAnchor="middle" fontFamily="monospace">complex eigenvalues</text>
        )}
      </svg>

      <div className="flex gap-2 mt-5 flex-wrap justify-center">
        {PRESETS.map((p, i) => (
          <button key={p.name} onClick={() => setPresetIdx(i)}
            className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest rounded border transition-colors ${
              i === presetIdx ? 'border-[#d4a847] text-[#d4a847] bg-[#d4a847]/10' : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'
            }`}>
            {p.name}
          </button>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        SVG Engine: EigenViz
      </div>
    </div>
  );
}
