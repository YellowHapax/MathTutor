import React, { useMemo, useState } from 'react';

/**
 * Measure concentration viz: sample N points uniformly on S^{n-1} and
 * show the distribution of ⟨x, e₁⟩. As n grows the distribution
 * concentrates sharply around 0 with std ~ 1/√n.
 */
export default function ConcentrationViz() {
  const [n, setN] = useState(50);
  const [samples, setSamples] = useState(2000);

  const W = 600, H = 240;

  const data = useMemo(() => {
    // Sample on S^{n-1} and take x_1
    const vals: number[] = [];
    for (let s = 0; s < samples; s++) {
      let sumSq = 0;
      const x = new Array(n);
      for (let i = 0; i < n; i++) {
        const u = 1 - Math.random(); const v = Math.random();
        x[i] = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        sumSq += x[i] * x[i];
      }
      const r = Math.sqrt(sumSq) || 1;
      vals.push(x[0] / r);
    }
    return vals;
  }, [n, samples]);

  const bins = 40;
  const lo = -1, hi = 1;
  const hist = new Array(bins).fill(0);
  for (const v of data) {
    const b = Math.floor(((v - lo) / (hi - lo)) * bins);
    if (b >= 0 && b < bins) hist[b]++;
  }
  const maxH = Math.max(...hist, 1);
  const bx = (b: number) => 30 + (b / bins) * (W - 60);
  const bw = (W - 60) / bins;

  // Theoretical: for x ~ Unif(S^{n-1}), x_1 has density ∝ (1-x^2)^((n-3)/2)
  const theoryVals: number[][] = [];
  const pts = 100;
  // Normalize using a discrete approximation
  const unnorm: number[] = [];
  for (let i = 0; i <= pts; i++) {
    const x = lo + (i / pts) * (hi - lo);
    const val = Math.pow(Math.max(0, 1 - x * x), (n - 3) / 2);
    unnorm.push(val);
  }
  const area = unnorm.reduce((s, v) => s + v, 0) * ((hi - lo) / pts);
  for (let i = 0; i <= pts; i++) {
    const x = lo + (i / pts) * (hi - lo);
    const density = unnorm[i] / area;
    // Convert density to expected bin-count height for overlay
    const expected = density * ((hi - lo) / bins) * samples;
    theoryVals.push([x, expected]);
  }

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        <line x1={30} y1={H - 30} x2={W - 30} y2={H - 30} stroke="#333" />
        {hist.map((c, b) => (
          <rect key={b} x={bx(b)} y={H - 30 - (c / maxH) * (H - 60)}
            width={bw - 1} height={(c / maxH) * (H - 60)} fill="#22d3ee" opacity={0.65} />
        ))}
        <path d={theoryVals.map(([x, y], i) =>
          `${i === 0 ? 'M' : 'L'}${30 + ((x - lo) / (hi - lo)) * (W - 60)},${H - 30 - (y / maxH) * (H - 60)}`
        ).join(' ')} fill="none" stroke="#d4a847" strokeWidth={2} />
        <text x={W - 40} y={22} fill="#d4a847" fontSize={10} fontFamily="monospace" textAnchor="end">∝ (1−x²)^((n−3)/2)</text>
        <text x={W / 2} y={H - 10} fill="#666" fontSize={10} fontFamily="monospace" textAnchor="middle">⟨x, e₁⟩ for x ∈ Sⁿ⁻¹</text>
      </svg>
      <div className="mt-2 text-center text-xs text-zinc-400 font-mono">
        observed std ≈ {(Math.sqrt(data.reduce((s, v) => s + v * v, 0) / data.length)).toFixed(3)}
        <span className="mx-3 text-zinc-600">|</span>
        theoretical 1/√n ≈ {(1 / Math.sqrt(n)).toFixed(3)}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">dimension n</label>
          <input type="range" min={2} max={500} step={1} value={n}
            onChange={(e) => setN(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{n}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">samples</label>
          <input type="range" min={200} max={10000} step={100} value={samples}
            onChange={(e) => setSamples(+e.target.value)} className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{samples}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        Lévy's isoperimetric / Gaussian-concentration: a 1-Lipschitz function on Sⁿ⁻¹ has fluctuations O(1/√n).
      </div>
    </div>
  );
}
