import React, { useState } from 'react';

/**
 * Tropical / ReLU region count viz.
 *
 * Simulate a 2-hidden-layer ReLU network with adjustable widths (w1, w2)
 * in 2D input space. Sample random weights; shade which cell of the
 * polyhedral complex each point lies in by encoding its ReLU sign
 * pattern as a color. Displays the total number of observed regions.
 */
export default function TropicalViz() {
  const [w1, setW1] = useState(4);
  const [w2, setW2] = useState(4);
  const [seed, setSeed] = useState(3);

  const W = 600, H = 260;
  const size = 200;  // grid side

  // Generate weights deterministically from seed
  const genW = (rows: number, cols: number, s: number) => {
    let st = s * 2654435761 >>> 0;
    const rng = () => { st = (1664525 * st + 1013904223) >>> 0; return (st / 2 ** 32 - 0.5) * 2; };
    const M: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const r: number[] = [];
      for (let j = 0; j < cols; j++) r.push(rng());
      M.push(r);
    }
    return M;
  };

  const W1 = genW(w1, 2, seed);
  const b1 = genW(w1, 1, seed + 1).map(r => r[0]);
  const W2 = genW(w2, w1, seed + 2);
  const b2 = genW(w2, 1, seed + 3).map(r => r[0]);

  const patterns = new Map<string, number>();
  const regionColors: { key: string; idx: number }[][] = [];

  for (let iy = 0; iy < size; iy++) {
    const row: { key: string; idx: number }[] = [];
    for (let ix = 0; ix < size; ix++) {
      const x = (ix / (size - 1) - 0.5) * 4;
      const y = (iy / (size - 1) - 0.5) * 4;
      const h1 = W1.map((r, i) => Math.max(0, r[0] * x + r[1] * y + b1[i]));
      const sig1 = W1.map((r, i) => (r[0] * x + r[1] * y + b1[i]) > 0 ? '1' : '0').join('');
      const sig2 = W2.map((r, i) => (r.reduce((s, v, k) => s + v * h1[k], 0) + b2[i]) > 0 ? '1' : '0').join('');
      const key = sig1 + sig2;
      if (!patterns.has(key)) patterns.set(key, patterns.size);
      row.push({ key, idx: patterns.get(key)! });
    }
    regionColors.push(row);
  }

  const pixSize = Math.min((W - 60) / size, (H - 60) / size);
  const offX = 30, offY = 20;

  // Paint to a canvas-style rect grid (SVG with many rects is heavy; use image via data url)
  const imgCanvas = useImageCanvas(regionColors, patterns.size, size);

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        <image href={imgCanvas} x={offX} y={offY} width={size * pixSize} height={size * pixSize}
          style={{ imageRendering: 'pixelated' }} />
        <rect x={offX} y={offY} width={size * pixSize} height={size * pixSize}
          fill="none" stroke="#333" />
      </svg>
      <div className="mt-2 text-center text-xs font-mono">
        <span className="text-zinc-500 uppercase tracking-widest mr-2">regions observed</span>
        <span className="text-pink-400">{patterns.size}</span>
        <span className="mx-3 text-zinc-600">/ upper bound</span>
        <span className="text-zinc-400">≤ 2^({w1}+{w2}) = {Math.pow(2, w1 + w2)}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">width 1</label>
          <input type="range" min={2} max={8} step={1} value={w1}
            onChange={(e) => setW1(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{w1}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">width 2</label>
          <input type="range" min={2} max={8} step={1} value={w2}
            onChange={(e) => setW2(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{w2}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">seed</label>
          <input type="range" min={1} max={30} step={1} value={seed}
            onChange={(e) => setSeed(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{seed}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        Each cell is a distinct ReLU sign pattern → a single linear piece of the piecewise-linear function.
      </div>
    </div>
  );
}

function useImageCanvas(
  regions: { key: string; idx: number }[][],
  nRegions: number,
  size: number
): string {
  return React.useMemo(() => {
    if (typeof document === 'undefined') return '';
    const cvs = document.createElement('canvas');
    cvs.width = size; cvs.height = size;
    const ctx = cvs.getContext('2d');
    if (!ctx) return '';
    const img = ctx.createImageData(size, size);
    for (let iy = 0; iy < size; iy++) {
      for (let ix = 0; ix < size; ix++) {
        const idx = regions[iy][ix].idx;
        const t = idx / Math.max(1, nRegions - 1);
        // Gold→pink→cyan→violet cycle
        const r = Math.floor(60 + 180 * Math.abs(Math.sin(t * Math.PI * 2)));
        const g = Math.floor(60 + 120 * Math.abs(Math.sin(t * Math.PI * 2 + 2)));
        const b = Math.floor(60 + 180 * Math.abs(Math.sin(t * Math.PI * 2 + 4)));
        const p = ((size - 1 - iy) * size + ix) * 4;
        img.data[p] = r;
        img.data[p + 1] = g;
        img.data[p + 2] = b;
        img.data[p + 3] = 220;
      }
    }
    ctx.putImageData(img, 0, 0);
    return cvs.toDataURL();
  }, [regions, nRegions, size]);
}
