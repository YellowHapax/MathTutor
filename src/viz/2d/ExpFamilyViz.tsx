import React, { useState } from 'react';

/**
 * Exponential-family viz: categorical simplex on 3 outcomes, with
 * natural parameters θ and mean parameters η shown side-by-side.
 * Slider controls θ₁, θ₂; θ₃ = 0 by convention.
 */
export default function ExpFamilyViz() {
  const [theta1, setTheta1] = useState(0);
  const [theta2, setTheta2] = useState(0);
  const theta3 = 0;

  // softmax
  const ez = [Math.exp(theta1), Math.exp(theta2), Math.exp(theta3)];
  const Z = ez[0] + ez[1] + ez[2];
  const p = ez.map(v => v / Z);
  const A = Math.log(Z); // log partition

  // Triangle vertices (2-simplex)
  const W = 500, H = 320;
  const V1 = [W / 2, 40];
  const V2 = [40, H - 40];
  const V3 = [W - 40, H - 40];

  // Barycentric → pixel
  const toPx = (w: number[]) => [
    w[0] * V1[0] + w[1] * V2[0] + w[2] * V3[0],
    w[0] * V1[1] + w[1] * V2[1] + w[2] * V3[1],
  ];

  const point = toPx(p);

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {/* triangle */}
        <polygon points={`${V1[0]},${V1[1]} ${V2[0]},${V2[1]} ${V3[0]},${V3[1]}`}
          fill="none" stroke="#555" />
        <text x={V1[0]} y={V1[1] - 8} fill="#71717a" fontSize={11} textAnchor="middle" fontFamily="monospace">η₁</text>
        <text x={V2[0] - 10} y={V2[1] + 16} fill="#71717a" fontSize={11} textAnchor="middle" fontFamily="monospace">η₂</text>
        <text x={V3[0] + 10} y={V3[1] + 16} fill="#71717a" fontSize={11} textAnchor="middle" fontFamily="monospace">η₃</text>
        {/* Contours of equal A(θ) — not easy, skip; show gradient flow */}
        {/* current η */}
        <circle cx={point[0]} cy={point[1]} r={8} fill="#d4a847" stroke="#fff" />
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-6 text-xs">
        <div>
          <div className="text-zinc-500 uppercase tracking-widest mb-1">Natural θ</div>
          <div className="font-mono text-amber-400">θ₁ = {theta1.toFixed(2)}</div>
          <div className="font-mono text-amber-400">θ₂ = {theta2.toFixed(2)}</div>
          <div className="font-mono text-zinc-500">θ₃ = 0 (fixed)</div>
          <div className="font-mono text-cyan-400 mt-2">A(θ) = {A.toFixed(3)}</div>
        </div>
        <div>
          <div className="text-zinc-500 uppercase tracking-widest mb-1">Mean η = ∇A(θ)</div>
          <div className="font-mono text-pink-400">η₁ = {p[0].toFixed(3)}</div>
          <div className="font-mono text-pink-400">η₂ = {p[1].toFixed(3)}</div>
          <div className="font-mono text-pink-400">η₃ = {p[2].toFixed(3)}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">θ₁</label>
          <input type="range" min={-3} max={3} step={0.05} value={theta1}
            onChange={(e) => setTheta1(+e.target.value)} className="w-full accent-amber-500" />
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">θ₂</label>
          <input type="range" min={-3} max={3} step={0.05} value={theta2}
            onChange={(e) => setTheta2(+e.target.value)} className="w-full accent-amber-500" />
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        softmax is the duality map θ ↦ η = ∇A(θ); KL(p_θ ‖ p_θ') = Bregman divergence of A
      </div>
    </div>
  );
}
