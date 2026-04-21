import React, { useState } from 'react';

/**
 * Scaling-law viz: plot L(N) = E + A · N^(−α) on linear and log-log axes.
 * User adjusts E (irreducible loss), A, α. Highlights the "elbow" where
 * reducible loss drops below irreducible.
 */
export default function ScalingLawViz() {
  const [E, setE] = useState(1.8);
  const [A, setA] = useState(400);
  const [alpha, setAlpha] = useState(0.076);

  const W = 600, H = 240;
  const Nmin = 1e6, Nmax = 1e12;
  const pts = 140;

  const Ns = Array.from({ length: pts + 1 }, (_, i) => Nmin * Math.pow(Nmax / Nmin, i / pts));
  const losses = Ns.map(N => E + A * Math.pow(N, -alpha));

  const logN = (x: number) => Math.log10(x);
  const lxMin = logN(Nmin), lxMax = logN(Nmax);
  const yMin = E - 0.2, yMax = Math.max(...losses);
  const sx = (N: number) => 30 + ((logN(N) - lxMin) / (lxMax - lxMin)) * (W - 60);
  const sy = (y: number) => H - 30 - ((y - yMin) / (yMax - yMin)) * (H - 60);

  const curve = Ns.map((N, i) => `${i === 0 ? 'M' : 'L'}${sx(N)},${sy(losses[i])}`).join(' ');

  // Asymptote line at E
  const asymY = sy(E);

  // Find elbow: where A·N^(−α) = E
  const elbowN = Math.pow(A / E, 1 / alpha);
  const elbowIn = elbowN > Nmin && elbowN < Nmax;

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        {/* Axes */}
        <line x1={30} y1={H - 30} x2={W - 30} y2={H - 30} stroke="#333" />
        <line x1={30} y1={30} x2={30} y2={H - 30} stroke="#333" />

        {/* Log-N ticks */}
        {[6, 7, 8, 9, 10, 11, 12].map(ex => (
          <g key={ex}>
            <line x1={sx(Math.pow(10, ex))} y1={H - 30} x2={sx(Math.pow(10, ex))} y2={H - 27} stroke="#555" />
            <text x={sx(Math.pow(10, ex))} y={H - 14} fill="#666" fontSize={9} fontFamily="monospace" textAnchor="middle">
              10^{ex}
            </text>
          </g>
        ))}

        {/* Asymptote */}
        <line x1={30} y1={asymY} x2={W - 30} y2={asymY} stroke="#ec4899" strokeDasharray="4,3" opacity={0.7} />
        <text x={W - 40} y={asymY - 4} fill="#ec4899" fontSize={10} fontFamily="monospace" textAnchor="end">E (irreducible)</text>

        {/* Curve */}
        <path d={curve} fill="none" stroke="#d4a847" strokeWidth={2} />

        {/* Elbow */}
        {elbowIn && (
          <g>
            <line x1={sx(elbowN)} y1={30} x2={sx(elbowN)} y2={H - 30} stroke="#22d3ee" strokeDasharray="2,3" opacity={0.6} />
            <circle cx={sx(elbowN)} cy={sy(2 * E)} r={4} fill="#22d3ee" />
            <text x={sx(elbowN) + 6} y={sy(2 * E) - 6} fill="#22d3ee" fontSize={10} fontFamily="monospace">
              N* ≈ {elbowN.toExponential(1)}
            </text>
          </g>
        )}

        <text x={W / 2} y={18} fill="#d4a847" fontSize={11} fontFamily="monospace" textAnchor="middle">
          L(N) = E + A · N^(−α)
        </text>
      </svg>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">E</label>
          <input type="range" min={0.5} max={3} step={0.01} value={E}
            onChange={(e) => setE(+e.target.value)} className="w-full accent-pink-500" />
          <span className="text-pink-400 font-mono">{E.toFixed(2)}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">A</label>
          <input type="range" min={10} max={2000} step={10} value={A}
            onChange={(e) => setA(+e.target.value)} className="w-full accent-yellow-500" />
          <span className="text-yellow-400 font-mono">{A}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">α</label>
          <input type="range" min={0.02} max={0.3} step={0.002} value={alpha}
            onChange={(e) => setAlpha(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{alpha.toFixed(3)}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        Chinchilla parameters: E ≈ 1.69, A_N ≈ 406.4, α_N ≈ 0.34 (per-param); ensemble picks may differ by paper.
      </div>
    </div>
  );
}
