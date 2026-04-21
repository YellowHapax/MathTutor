import React, { useState } from 'react';

/**
 * Softmax geometry viz: three logits (z1, z2, z3) → probability simplex.
 * User adjusts logits and temperature β; shows the point on the 2-simplex
 * and the resulting bar chart. Temperature → ∞ gives uniform, → 0 gives argmax.
 */
export default function SoftmaxViz() {
  const [z1, setZ1] = useState(1.0);
  const [z2, setZ2] = useState(0.3);
  const [z3, setZ3] = useState(-0.5);
  const [beta, setBeta] = useState(1.0);

  const logits = [z1, z2, z3];
  const maxZ = Math.max(...logits);
  const e = logits.map(z => Math.exp(beta * (z - maxZ)));
  const Z = e.reduce((a, b) => a + b, 0);
  const p = e.map(v => v / Z);

  const W = 600, H = 260;

  // Barycentric coords on simplex
  const triA = [W * 0.3, 30];
  const triB = [W * 0.5, H - 30];
  const triC = [W * 0.1, H - 30];
  const pt = [
    p[0] * triA[0] + p[1] * triB[0] + p[2] * triC[0],
    p[0] * triA[1] + p[1] * triB[1] + p[2] * triC[1],
  ];

  // Bar chart region
  const barX = W * 0.55, barW = (W - W * 0.55 - 30) / 3 - 10;
  const barBase = H - 30, barTop = 30;

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {/* Simplex */}
        <polygon points={`${triA[0]},${triA[1]} ${triB[0]},${triB[1]} ${triC[0]},${triC[1]}`}
          fill="#d4a847" opacity={0.08} stroke="#d4a847" strokeWidth={1} />
        <text x={triA[0]} y={triA[1] - 6} fill="#ec4899" fontSize={11} fontFamily="monospace" textAnchor="middle">p₁</text>
        <text x={triB[0] + 10} y={triB[1] + 4} fill="#22d3ee" fontSize={11} fontFamily="monospace">p₂</text>
        <text x={triC[0] - 10} y={triC[1] + 4} fill="#a78bfa" fontSize={11} fontFamily="monospace" textAnchor="end">p₃</text>
        <circle cx={pt[0]} cy={pt[1]} r={6} fill="#d4a847" stroke="#fff" strokeWidth={1.5} />

        {/* Bars */}
        {p.map((pi, i) => (
          <g key={i}>
            <rect x={barX + i * (barW + 10)} y={barBase - pi * (barBase - barTop)}
              width={barW} height={pi * (barBase - barTop)}
              fill={['#ec4899', '#22d3ee', '#a78bfa'][i]} opacity={0.8} />
            <text x={barX + i * (barW + 10) + barW / 2} y={barBase + 14}
              fill="#666" fontSize={10} fontFamily="monospace" textAnchor="middle">
              {pi.toFixed(3)}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">z₁</label>
          <input type="range" min={-3} max={3} step={0.01} value={z1}
            onChange={(e) => setZ1(+e.target.value)} className="w-full accent-pink-500" />
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">z₂</label>
          <input type="range" min={-3} max={3} step={0.01} value={z2}
            onChange={(e) => setZ2(+e.target.value)} className="w-full accent-cyan-500" />
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">z₃</label>
          <input type="range" min={-3} max={3} step={0.01} value={z3}
            onChange={(e) => setZ3(+e.target.value)} className="w-full accent-violet-500" />
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">β (inv. temp)</label>
          <input type="range" min={0.05} max={10} step={0.05} value={beta}
            onChange={(e) => setBeta(+e.target.value)} className="w-full accent-yellow-500" />
          <span className="text-yellow-400 font-mono">{beta.toFixed(2)}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        pᵢ = exp(β zᵢ) / Σ exp(β zⱼ). β → 0: uniform (center). β → ∞: argmax (vertex).
      </div>
    </div>
  );
}
