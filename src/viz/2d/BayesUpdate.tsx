import React, { useState, useMemo } from 'react';

const HYPS = ['H₁', 'H₂', 'H₃', 'H₄'];

function normalize(arr: number[]): number[] {
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum > 0 ? arr.map(x => x / sum) : arr.map(() => 1 / arr.length);
}

export default function BayesUpdate() {
  const [priorW, setPriorW] = useState([3, 1, 2, 1]);
  const [likeW, setLikeW] = useState([1, 3, 2, 1]);

  const prior = useMemo(() => normalize(priorW), [priorW]);
  const likelihood = useMemo(() => normalize(likeW), [likeW]);
  const posterior = useMemo(() => normalize(prior.map((p, i) => p * likelihood[i])), [prior, likelihood]);

  const W = 260, barH = 90, pad = 20;
  const bw = (W - pad * 2) / 4;

  const Bars = ({ data, label, color }: { data: number[]; label: string; color: string }) => (
    <svg width={W} height={barH + 22} className="bg-[#0f0f0f] rounded border border-zinc-800">
      {data.map((p, i) => {
        const x = pad + i * bw;
        const h = p * (barH - 8) * 0.95;
        return (
          <g key={i}>
            <rect x={x + 3} y={barH - h} width={bw - 6} height={h}
              fill={`${color}33`} stroke={color} strokeWidth="1"
              style={{ transition: 'all 150ms ease-in-out' }} />
            <text x={x + bw / 2} y={barH + 14} textAnchor="middle" fontSize="10" fill="#71717a" fontFamily="monospace">{HYPS[i]}</text>
          </g>
        );
      })}
      <line x1={pad} y1={barH} x2={W - pad} y2={barH} stroke="#27272a" />
      <text x={W / 2} y={12} textAnchor="middle" fontSize="10" fill="#52525b" fontFamily="monospace">{label}</text>
    </svg>
  );

  return (
    <div className="relative flex flex-col items-center p-8 py-10 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden mt-6 space-y-3">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5" />
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>

      <Bars data={prior} label="Prior  P(H)" color="#71717a" />
      <div className="text-zinc-600 text-sm font-mono">× evidence</div>
      <Bars data={likelihood} label="Likelihood  P(E|H)" color="#22d3ee" />
      <div className="text-zinc-600 text-sm font-mono">= normalized</div>
      <Bars data={posterior} label="Posterior  P(H|E)" color="#d4a847" />

      <div className="w-full max-w-[260px] space-y-3 pt-2">
        <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-mono">Adjust prior weights</p>
        {HYPS.map((lbl, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[9px] text-zinc-500 w-5 font-mono shrink-0">{lbl}</span>
            <input type="range" min={0.1} max={5} step={0.1} value={priorW[i]}
              onChange={e => setPriorW(w => w.map((v, j) => j === i ? parseFloat(e.target.value) : v))}
              className="flex-1 accent-[#71717a]" />
          </div>
        ))}
        <p className="text-[9px] text-zinc-600 uppercase tracking-widest font-mono pt-1">Adjust likelihood</p>
        {HYPS.map((lbl, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-[9px] text-zinc-500 w-5 font-mono shrink-0">{lbl}</span>
            <input type="range" min={0.1} max={5} step={0.1} value={likeW[i]}
              onChange={e => setLikeW(w => w.map((v, j) => j === i ? parseFloat(e.target.value) : v))}
              className="flex-1 accent-[#22d3ee]" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        SVG Engine: BayesUpdate
      </div>
    </div>
  );
}
