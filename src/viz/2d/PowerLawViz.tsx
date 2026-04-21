import React, { useState } from 'react';

/**
 * Power-law density viz: p(x) ∝ x^-α on [xmin, xmax] shown in linear + log-log.
 * Highlights the mean/variance divergence thresholds as α crosses 1 and 2.
 */
export default function PowerLawViz() {
  const [alpha, setAlpha] = useState(2.5);

  const W = 600, H = 240;
  const xmin = 1, xmax = 100;
  const N = 160;

  const xs = Array.from({ length: N }, (_, i) => xmin * Math.pow(xmax / xmin, i / (N - 1)));
  const ys = xs.map(x => Math.pow(x, -alpha));

  // Linear plot domain
  const lx = (x: number) => 40 + ((x - xmin) / (xmax - xmin)) * (W / 2 - 60);
  const maxY = ys[0];
  const ly = (y: number) => H - 30 - (y / maxY) * (H - 60);

  // Log-log plot domain
  const logX = (x: number) => Math.log10(x);
  const logY = (y: number) => Math.log10(y);
  const lxmin = logX(xmin), lxmax = logX(xmax);
  const lymin = logY(ys[ys.length - 1]), lymax = logY(ys[0]);
  const llx = (x: number) => W / 2 + 40 + ((logX(x) - lxmin) / (lxmax - lxmin)) * (W / 2 - 60);
  const lly = (y: number) => H - 30 - ((logY(y) - lymin) / (lymax - lymin)) * (H - 60);

  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${lx(x)},${ly(ys[i])}`).join(' ');
  const logPath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${llx(x)},${lly(ys[i])}`).join(' ');

  const meanStatus = alpha > 2 ? 'finite' : alpha > 1 ? 'finite mean, ∞ variance' : '∞ mean';
  const meanColor = alpha > 2 ? '#22d3ee' : alpha > 1 ? '#d4a847' : '#ec4899';

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {/* Linear plot */}
        <line x1={40} y1={H - 30} x2={W / 2 - 20} y2={H - 30} stroke="#333" />
        <line x1={40} y1={30} x2={40} y2={H - 30} stroke="#333" />
        <text x={W / 4} y={18} fill="#666" fontSize={10} fontFamily="monospace" textAnchor="middle">linear</text>
        <path d={linePath} fill="none" stroke="#d4a847" strokeWidth={2} />

        {/* Log-log plot */}
        <line x1={W / 2 + 40} y1={H - 30} x2={W - 20} y2={H - 30} stroke="#333" />
        <line x1={W / 2 + 40} y1={30} x2={W / 2 + 40} y2={H - 30} stroke="#333" />
        <text x={(3 * W) / 4} y={18} fill="#666" fontSize={10} fontFamily="monospace" textAnchor="middle">log–log (slope = −α)</text>
        <path d={logPath} fill="none" stroke="#ec4899" strokeWidth={2} />
      </svg>
      <div className="mt-2 text-center text-xs">
        <span className="text-zinc-500 uppercase tracking-widest mr-2">α =</span>
        <span className="text-lg font-mono" style={{ color: meanColor }}>{alpha.toFixed(2)}</span>
        <span className="ml-3 text-zinc-400 italic">{meanStatus}</span>
      </div>
      <div className="mt-3 text-xs">
        <label className="text-zinc-500 uppercase tracking-widest">exponent α</label>
        <input type="range" min={0.5} max={4} step={0.01} value={alpha}
          onChange={(e) => setAlpha(+e.target.value)} className="w-full accent-cyan-500" />
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        α ≤ 1: mean diverges. α ≤ 2: variance diverges. CLT fails; Lévy-stable limit.
      </div>
    </div>
  );
}
