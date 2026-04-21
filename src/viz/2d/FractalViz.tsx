import React, { useState } from 'react';

/**
 * Box-counting Cantor-like fractal viz.
 * User picks split count k and keep count m; shows dim_H = log m / log k
 * and renders the first few iterations of the iterated-function-system.
 */
export default function FractalViz() {
  const [k, setK] = useState(3);
  const [m, setM] = useState(2);
  const [depth, setDepth] = useState(5);

  const W = 600, H = 240;
  const dim = Math.log(m) / Math.log(k);

  // Choose m indices out of [0, k) — prefer endpoints and evenly spaced ones
  const keepIdx = (() => {
    const idx: number[] = [];
    if (m >= 1) idx.push(0);
    if (m >= 2) idx.push(k - 1);
    let cursor = 1;
    while (idx.length < m && cursor < k - 1) {
      idx.push(cursor);
      cursor += Math.max(1, Math.floor((k - 2) / Math.max(1, m - 2)));
    }
    return idx.slice(0, m).sort((a, b) => a - b);
  })();

  const rows: { x: number; w: number }[][] = [];
  let current: { x: number; w: number }[] = [{ x: 0, w: 1 }];
  rows.push(current);
  for (let d = 0; d < depth; d++) {
    const next: { x: number; w: number }[] = [];
    for (const seg of current) {
      for (const i of keepIdx) {
        next.push({ x: seg.x + (i * seg.w) / k, w: seg.w / k });
      }
    }
    current = next;
    rows.push(current);
  }

  const rowH = (H - 20) / (depth + 1);

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {rows.map((row, r) =>
          row.map((seg, i) => (
            <rect
              key={`${r}-${i}`}
              x={20 + seg.x * (W - 40)}
              y={10 + r * rowH}
              width={seg.w * (W - 40)}
              height={rowH * 0.6}
              fill="#d4a847"
              opacity={0.85 - r * 0.05}
            />
          ))
        )}
      </svg>
      <div className="mt-2 text-center text-xs">
        <span className="text-zinc-500 uppercase tracking-widest mr-2">dim_H = log {m} / log {k} =</span>
        <span className="text-lg text-pink-400 font-mono">{dim.toFixed(4)}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">split k</label>
          <input type="range" min={2} max={7} step={1} value={k}
            onChange={(e) => { const v = +e.target.value; setK(v); if (m > v) setM(v); }} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{k}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">keep m</label>
          <input type="range" min={1} max={k} step={1} value={m}
            onChange={(e) => setM(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{m}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">depth</label>
          <input type="range" min={1} max={7} step={1} value={depth}
            onChange={(e) => setDepth(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{depth}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        Cantor set (k=3, m=2) → 0.6309; Sierpinski-like (k=3, m=2, 2D analogue) → 1.585
      </div>
    </div>
  );
}
