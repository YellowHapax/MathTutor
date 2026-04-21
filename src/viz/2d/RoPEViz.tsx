import React, { useState } from 'react';

/**
 * RoPE viz: two vectors q, k rotated by angles mθ, nθ, and their
 * inner product q(m)·k(n) as function of relative position m-n.
 */
export default function RoPEViz() {
  const [m, setM] = useState(0);
  const [n, setN] = useState(5);
  const [freq, setFreq] = useState(0.25);

  const W = 600, H = 280;
  const half = W / 2;
  const cx1 = W / 4, cy = H / 2, R = 80;
  const cx2 = 3 * W / 4;

  // Base query and key
  const q0: [number, number] = [1, 0.3];
  const k0: [number, number] = [0.9, -0.4];

  const rot = (v: [number, number], a: number): [number, number] => [
    v[0] * Math.cos(a) - v[1] * Math.sin(a),
    v[0] * Math.sin(a) + v[1] * Math.cos(a),
  ];

  const qr = rot(q0, m * freq);
  const kr = rot(k0, n * freq);

  // Inner product across relative position
  const data = Array.from({ length: 40 }, (_, i) => {
    const rel = i - 20;
    const qm = rot(q0, 0);
    const kn = rot(k0, rel * freq);
    return qm[0] * kn[0] + qm[1] * kn[1];
  });

  const inner = qr[0] * kr[0] + qr[1] * kr[1];

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {/* Two circles */}
        <circle cx={cx1} cy={cy} r={R} fill="none" stroke="#333" strokeDasharray="3,3" />
        <circle cx={cx2} cy={cy} r={R} fill="none" stroke="#333" strokeDasharray="3,3" />
        {/* Q(m) */}
        <line x1={cx1} y1={cy} x2={cx1 + qr[0] * R * 0.8} y2={cy - qr[1] * R * 0.8}
          stroke="#d4a847" strokeWidth={3} markerEnd="url(#arr)" />
        <text x={cx1} y={cy + R + 20} fill="#d4a847" fontSize={11} textAnchor="middle" fontFamily="monospace">
          q(m={m})
        </text>
        {/* K(n) */}
        <line x1={cx2} y1={cy} x2={cx2 + kr[0] * R * 0.8} y2={cy - kr[1] * R * 0.8}
          stroke="#22d3ee" strokeWidth={3} markerEnd="url(#arr2)" />
        <text x={cx2} y={cy + R + 20} fill="#22d3ee" fontSize={11} textAnchor="middle" fontFamily="monospace">
          k(n={n})
        </text>
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#d4a847" />
          </marker>
          <marker id="arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#22d3ee" />
          </marker>
        </defs>
      </svg>
      {/* Inner product plot vs relative */}
      <div className="mt-2">
        <svg width={W} height={80}>
          <line x1={0} y1={40} x2={W} y2={40} stroke="#333" />
          {data.map((v, i) => {
            const x = (i / 40) * W;
            const isSel = i - 20 === m - n;
            return <rect key={i} x={x} y={40 - v * 25} width={W / 40 - 1} height={Math.abs(v * 25)}
              fill={isSel ? '#ec4899' : (v > 0 ? '#d4a847' : '#22d3ee')} opacity={isSel ? 1 : 0.55} />;
          })}
        </svg>
        <div className="text-[10px] text-zinc-500 font-mono text-center mt-1">
          ⟨q(m), k(n)⟩ depends only on m − n = <span className="text-pink-400">{m - n}</span> (= {inner.toFixed(3)})
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">m</label>
          <input type="range" min={-15} max={15} value={m}
            onChange={(e) => setM(+e.target.value)} className="w-full accent-amber-500" />
          <span className="text-amber-400 font-mono">{m}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">n</label>
          <input type="range" min={-15} max={15} value={n}
            onChange={(e) => setN(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{n}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">θ (freq)</label>
          <input type="range" min={0.05} max={1} step={0.01} value={freq}
            onChange={(e) => setFreq(+e.target.value)} className="w-full accent-pink-500" />
          <span className="text-pink-400 font-mono">{freq.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
