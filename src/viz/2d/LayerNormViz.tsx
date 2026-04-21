import React, { useState } from 'react';

/**
 * LayerNorm / residual-stream viz.
 * Treat x_l as a 2D vector. Show the residual stream as iterated steps
 *   x_{l+1} = x_l + f_l(LN(x_l))
 * where LN projects to the unit circle (approximating mean-zero-unit-var
 * in 2D as normalize-to-unit-length) and f_l is a small learned rotation+shift.
 */
export default function LayerNormViz() {
  const [steps, setSteps] = useState(8);
  const [twist, setTwist] = useState(0.35);

  const W = 600, H = 260;
  const cx = W / 2, cy = H / 2;
  const scale = 60;

  // Start state
  let x = [1.6, -0.4];
  const pts: number[][] = [x.slice()];
  const ptsLN: number[][] = [];
  for (let l = 0; l < steps; l++) {
    // LayerNorm: project to unit norm
    const n = Math.hypot(x[0], x[1]) || 1;
    const ln = [x[0] / n, x[1] / n];
    ptsLN.push(ln);
    // f_l: small rotation by `twist` plus a little pull toward a target direction
    const theta = twist * (1 + 0.3 * Math.sin(l));
    const target = [Math.cos(0.4 * l + 0.3), Math.sin(0.4 * l + 0.3)];
    const rotated = [
      Math.cos(theta) * ln[0] - Math.sin(theta) * ln[1],
      Math.sin(theta) * ln[0] + Math.cos(theta) * ln[1],
    ];
    const delta = [
      0.3 * rotated[0] + 0.1 * (target[0] - ln[0]),
      0.3 * rotated[1] + 0.1 * (target[1] - ln[1]),
    ];
    x = [x[0] + delta[0], x[1] + delta[1]];
    pts.push(x.slice());
  }

  const sx = (v: number) => cx + v * scale;
  const sy = (v: number) => cy - v * scale;

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {/* Grid */}
        <line x1={30} y1={cy} x2={W - 30} y2={cy} stroke="#333" />
        <line x1={cx} y1={30} x2={cx} y2={H - 30} stroke="#333" />
        {/* Unit circle (LN manifold) */}
        <circle cx={cx} cy={cy} r={scale} fill="none" stroke="#d4a847" strokeOpacity={0.4} strokeDasharray="4,3" />
        <text x={cx + scale + 6} y={cy - 4} fill="#d4a847" fontSize={10} fontFamily="monospace" opacity={0.6}>LN surface</text>

        {/* Residual stream path */}
        {pts.slice(0, -1).map((pt, i) => (
          <line key={`seg${i}`} x1={sx(pt[0])} y1={sy(pt[1])} x2={sx(pts[i + 1][0])} y2={sy(pts[i + 1][1])}
            stroke="#22d3ee" strokeWidth={1.5} opacity={0.7} />
        ))}

        {/* LN projections */}
        {ptsLN.map((p, i) => (
          <line key={`ln${i}`} x1={sx(pts[i][0])} y1={sy(pts[i][1])} x2={sx(p[0])} y2={sy(p[1])}
            stroke="#ec4899" strokeWidth={0.5} strokeDasharray="2,2" opacity={0.5} />
        ))}
        {ptsLN.map((p, i) => (
          <circle key={`lnp${i}`} cx={sx(p[0])} cy={sy(p[1])} r={3} fill="#ec4899" />
        ))}

        {/* Stream points */}
        {pts.map((p, i) => (
          <circle key={`p${i}`} cx={sx(p[0])} cy={sy(p[1])} r={i === 0 ? 6 : 4}
            fill={i === 0 ? '#22d3ee' : '#d4a847'} stroke="#fff" strokeWidth={i === 0 ? 1.5 : 0} />
        ))}
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">layers L</label>
          <input type="range" min={1} max={20} step={1} value={steps}
            onChange={(e) => setSteps(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{steps}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">per-layer twist</label>
          <input type="range" min={-1} max={1} step={0.01} value={twist}
            onChange={(e) => setTwist(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{twist.toFixed(2)}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        Residual stream: x_{'{l+1}'} = x_l + f_l(LN(x_l)). Euler integration of dx/dℓ = f_l(x̂). LN projects to unit shell before each update.
      </div>
    </div>
  );
}
