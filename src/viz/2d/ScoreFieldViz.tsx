import React, { useState } from 'react';

/**
 * Score field viz: a 2D mixture-of-Gaussians density with its
 * score field ∇ log p overlaid as vectors, and a denoising trajectory.
 */
export default function ScoreFieldViz() {
  const [sigma, setSigma] = useState(0.4);

  const W = 500, H = 320;
  const xmin = -2, xmax = 2, ymin = -1.5, ymax = 1.5;
  const sx = (x: number) => ((x - xmin) / (xmax - xmin)) * W;
  const sy = (y: number) => H - ((y - ymin) / (ymax - ymin)) * H;

  // Mixture of 3 Gaussians
  const modes = [
    { x: -1, y: 0.5, w: 0.4 },
    { x: 1, y: 0.5, w: 0.3 },
    { x: 0, y: -0.7, w: 0.3 },
  ];

  const logp = (x: number, y: number) => {
    let s = 0;
    for (const m of modes) {
      const d2 = (x - m.x) ** 2 + (y - m.y) ** 2;
      s += m.w * Math.exp(-d2 / (2 * sigma * sigma));
    }
    return Math.log(s + 1e-12);
  };

  const score = (x: number, y: number) => {
    const h = 0.01;
    return [
      (logp(x + h, y) - logp(x - h, y)) / (2 * h),
      (logp(x, y + h) - logp(x, y - h)) / (2 * h),
    ];
  };

  // Denoising trajectory from a noisy start
  const traj: [number, number][] = [[-1.8, -1.3]];
  for (let i = 0; i < 80; i++) {
    const [x, y] = traj[traj.length - 1];
    const [gx, gy] = score(x, y);
    traj.push([x + 0.04 * gx, y + 0.04 * gy]);
  }

  const arrows: { x1: number; y1: number; x2: number; y2: number; mag: number }[] = [];
  const GX = 16, GY = 10;
  for (let i = 0; i < GX; i++) {
    for (let j = 0; j < GY; j++) {
      const x = xmin + ((i + 0.5) / GX) * (xmax - xmin);
      const y = ymin + ((j + 0.5) / GY) * (ymax - ymin);
      const [gx, gy] = score(x, y);
      const mag = Math.sqrt(gx * gx + gy * gy);
      const scale = 0.06 / (1 + mag * 0.1);
      arrows.push({ x1: x, y1: y, x2: x + gx * scale, y2: y + gy * scale, mag });
    }
  }

  // Density heat backdrop
  const HEAT = 40;
  const cells: { x: number; y: number; v: number }[] = [];
  let vmax = 0;
  for (let i = 0; i < HEAT; i++) {
    for (let j = 0; j < HEAT / 1.5; j++) {
      const x = xmin + (i / HEAT) * (xmax - xmin);
      const y = ymin + (j / (HEAT / 1.5)) * (ymax - ymin);
      const v = Math.exp(logp(x, y));
      if (v > vmax) vmax = v;
      cells.push({ x, y, v });
    }
  }

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto bg-black/50 rounded">
        {cells.map((c, i) => {
          const alpha = (c.v / vmax) * 0.6;
          const cx = sx(c.x), cy = sy(c.y);
          const cw = W / HEAT, ch = H / (HEAT / 1.5);
          return <rect key={i} x={cx - cw / 2} y={cy - ch / 2} width={cw} height={ch}
            fill="#d4a847" opacity={alpha} />;
        })}
        {arrows.map((a, i) => (
          <line key={i} x1={sx(a.x1)} y1={sy(a.y1)} x2={sx(a.x2)} y2={sy(a.y2)}
            stroke="#22d3ee" strokeWidth={1} opacity={0.7} />
        ))}
        <path d={traj.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${sx(x)} ${sy(y)}`).join(' ')}
          fill="none" stroke="#ec4899" strokeWidth={2} />
        <circle cx={sx(traj[0][0])} cy={sy(traj[0][1])} r={4} fill="#ec4899" />
        <circle cx={sx(traj[traj.length - 1][0])} cy={sy(traj[traj.length - 1][1])} r={4}
          fill="#fff" stroke="#ec4899" strokeWidth={2} />
      </svg>
      <div className="mt-3 flex items-center gap-3 text-xs">
        <label className="text-zinc-500 uppercase tracking-widest">σ</label>
        <input type="range" min={0.15} max={0.9} step={0.01} value={sigma}
          onChange={(e) => setSigma(+e.target.value)}
          className="flex-1 accent-cyan-500" />
        <span className="text-cyan-400 font-mono w-12 text-right">{sigma.toFixed(2)}</span>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        gold = p(x), cyan = ∇ log p(x), pink = ascent trajectory → mode
      </div>
    </div>
  );
}
