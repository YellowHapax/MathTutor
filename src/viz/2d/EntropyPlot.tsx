import React, { useState, useMemo } from 'react';

const N = 6;
const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

function makeProbs(alpha: number): number[] {
  const raw = Array.from({ length: N }, (_, i) => Math.exp(-alpha * Math.abs(i - (N - 1) / 2)));
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map(p => p / sum);
}

function entropy(probs: number[]): number {
  return -probs.reduce((h, p) => h + (p > 1e-9 ? p * Math.log2(p) : 0), 0);
}

export default function EntropyPlot() {
  const [alpha, setAlpha] = useState(0);
  const probs = useMemo(() => makeProbs(alpha), [alpha]);
  const H = useMemo(() => entropy(probs), [probs]);
  const maxH = Math.log2(N);

  const W = 260, barH = 150, padding = 20;
  const barW = (W - padding * 2) / N;

  return (
    <div className="relative flex flex-col items-center p-8 py-10 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden mt-6">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5" />
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>

      <svg width={W} height={barH + 28} className="bg-[#0f0f0f] rounded border border-zinc-800">
        {probs.map((p, i) => {
          const x = padding + i * barW;
          const bh = p * (barH - 10) * 0.95;
          const y = barH - bh;
          return (
            <g key={i}>
              <rect x={x + 2} y={y} width={barW - 4} height={bh}
                fill={`rgba(212,168,71,${0.3 + p * 1.8})`} stroke="#d4a847" strokeWidth="0.5"
                style={{ transition: 'all 120ms ease-in-out' }}
              />
              <text x={x + barW / 2} y={barH + 16} textAnchor="middle" fontSize="10" fill="#71717a" fontFamily="monospace">{LABELS[i]}</text>
              <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="8" fill="#d4a847" fontFamily="monospace">{(p * 100).toFixed(0)}%</text>
            </g>
          );
        })}
        <line x1={padding} y1={barH} x2={W - padding} y2={barH} stroke="#27272a" strokeWidth="1" />
      </svg>

      <div className="w-full max-w-[260px] mt-5 space-y-2">
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
          <span className="text-zinc-500">Entropy H</span>
          <span className="text-[#d4a847]">{H.toFixed(3)} bits</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#d4a847] rounded-full" style={{ width: `${(H / maxH) * 100}%`, transition: 'width 120ms ease-in-out' }} />
        </div>
        <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
          <span>0 — certain</span>
          <span>{maxH.toFixed(2)} — uniform</span>
        </div>
      </div>

      <div className="w-full max-w-[260px] mt-5 space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
          <span>uniform</span>
          <span>concentrated</span>
        </div>
        <input type="range" min={0} max={4} step={0.05} value={alpha}
          onChange={e => setAlpha(parseFloat(e.target.value))}
          className="w-full accent-[#d4a847]" />
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        SVG Engine: EntropyPlot
      </div>
    </div>
  );
}
