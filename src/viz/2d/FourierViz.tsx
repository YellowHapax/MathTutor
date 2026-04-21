import React, { useState } from 'react';

/**
 * Fourier synthesis of a square wave: slider controls number of
 * harmonics, showing convergence and Gibbs phenomenon.
 */
export default function FourierViz() {
  const [K, setK] = useState(5);

  const W = 600, H = 260, pad = 30;
  const N = 400;
  const xmin = -Math.PI, xmax = Math.PI;

  const square = (x: number) => (x > 0 ? 1 : -1);
  const partial = (x: number, K: number) => {
    let s = 0;
    for (let k = 1; k <= K; k++) {
      s += (Math.sin((2 * k - 1) * x)) / (2 * k - 1);
    }
    return (4 / Math.PI) * s;
  };

  const sx = (x: number) => pad + ((x - xmin) / (xmax - xmin)) * (W - 2 * pad);
  const sy = (y: number) => H / 2 - y * 70;

  const sqPath = Array.from({ length: N }, (_, i) => {
    const x = xmin + (i / (N - 1)) * (xmax - xmin);
    return `${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(square(x))}`;
  }).join(' ');
  const fPath = Array.from({ length: N }, (_, i) => {
    const x = xmin + (i / (N - 1)) * (xmax - xmin);
    return `${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(partial(x, K))}`;
  }).join(' ');

  // Spectrum bars
  const barY0 = H - pad;
  const barW = 4;
  const spectrum = Array.from({ length: Math.min(K, 20) }, (_, i) => i + 1);

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} stroke="#333" />
        <path d={sqPath} fill="none" stroke="#555" strokeWidth={1.5} />
        <path d={fPath} fill="none" stroke="#d4a847" strokeWidth={2} />
      </svg>
      <div className="mt-3 flex items-center gap-3 text-xs">
        <label className="text-zinc-500 uppercase tracking-widest">K (harmonics)</label>
        <input type="range" min={1} max={40} value={K}
          onChange={(e) => setK(+e.target.value)} className="flex-1 accent-amber-500" />
        <span className="text-amber-400 font-mono w-8 text-right">{K}</span>
      </div>
      <svg width={W - 2 * pad} height={40} className="mt-2">
        {spectrum.map((k, i) => {
          const h = (4 / Math.PI) / (2 * k - 1) * 30;
          return <rect key={i} x={i * (barW + 2)} y={40 - h} width={barW} height={h} fill="#22d3ee" />;
        })}
      </svg>
      <div className="text-[10px] text-zinc-500 mt-1 font-mono">
        Partial sum of <InlineM /> odd harmonics with coefficients 4/(π(2k−1)) — the Fourier spectrum of a square wave.
      </div>
    </div>
  );
}

function InlineM() { return <span className="text-amber-400">K = {/* filled by slider */}</span>; }
