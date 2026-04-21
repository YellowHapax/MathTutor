import React, { useState } from 'react';

/**
 * Attention-as-kernel viz: 1D tokens on a line, a draggable query,
 * softmax-weighted kernel over keys. Shows the attention weights and
 * the resulting output as a convex combination of value vectors.
 */
export default function AttentionViz() {
  const [qx, setQx] = useState(2.3);
  const [temp, setTemp] = useState(1.0);

  const W = 600, H = 240;
  const keys = [-2.5, -1.5, -0.3, 0.6, 1.5, 2.2, 3.0, 3.8];
  const values = keys.map(k => Math.sin(0.9 * k) + 0.3 * Math.cos(2 * k));

  // Dot-product similarity
  const scores = keys.map(k => -((qx - k) ** 2));  // Gaussian kernel (log scale)
  const maxS = Math.max(...scores);
  const expS = scores.map(s => Math.exp((s - maxS) / temp));
  const Z = expS.reduce((a, b) => a + b, 0);
  const weights = expS.map(e => e / Z);

  const output = weights.reduce((s, w, i) => s + w * values[i], 0);

  const xMin = -3.2, xMax = 4.2;
  const sx = (x: number) => 30 + ((x - xMin) / (xMax - xMin)) * (W - 60);

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {/* Track */}
        <line x1={30} y1={H * 0.55} x2={W - 30} y2={H * 0.55} stroke="#333" />
        {/* Attention weight bars above each key */}
        {keys.map((k, i) => {
          const barH = weights[i] * 80;
          return (
            <rect key={`b${i}`} x={sx(k) - 6} y={H * 0.55 - barH}
              width={12} height={barH} fill="#d4a847" opacity={0.85} />
          );
        })}
        {/* Keys */}
        {keys.map((k, i) => (
          <g key={`k${i}`}>
            <circle cx={sx(k)} cy={H * 0.55} r={5} fill="#22d3ee" />
            <text x={sx(k)} y={H * 0.55 + 18} fill="#666" fontSize={10} fontFamily="monospace" textAnchor="middle">
              v={values[i].toFixed(2)}
            </text>
          </g>
        ))}
        {/* Query */}
        <line x1={sx(qx)} y1={H * 0.55 - 100} x2={sx(qx)} y2={H * 0.55 + 30} stroke="#ec4899" strokeDasharray="4,3" />
        <polygon points={`${sx(qx)},${H * 0.55 - 100} ${sx(qx) - 6},${H * 0.55 - 90} ${sx(qx) + 6},${H * 0.55 - 90}`} fill="#ec4899" />
        <text x={sx(qx)} y={H * 0.55 - 105} fill="#ec4899" fontSize={11} fontFamily="monospace" textAnchor="middle">q</text>

        {/* Output readout */}
        <text x={W - 40} y={20} fill="#d4a847" fontSize={10} fontFamily="monospace" textAnchor="end">Σ wᵢ vᵢ</text>
        <text x={W - 40} y={36} fill="#d4a847" fontSize={14} fontFamily="monospace" textAnchor="end">
          output = {output.toFixed(3)}
        </text>
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">query position q</label>
          <input type="range" min={-3} max={4} step={0.01} value={qx}
            onChange={(e) => setQx(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{qx.toFixed(2)}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">temperature β⁻¹</label>
          <input type="range" min={0.05} max={3} step={0.01} value={temp}
            onChange={(e) => setTemp(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{temp.toFixed(2)}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        output(q) = Σ softmax(−‖q−kᵢ‖²/τ)·vᵢ — Nadaraya–Watson kernel regression.
      </div>
    </div>
  );
}
