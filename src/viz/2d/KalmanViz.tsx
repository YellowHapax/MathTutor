import React, { useState, useEffect, useRef } from 'react';

/**
 * Kalman filter viz: true 1D trajectory with noisy observations,
 * and the running posterior mean ± 1σ band.
 */
export default function KalmanViz() {
  const [Q, setQ] = useState(0.05); // process noise
  const [R, setR] = useState(0.8);  // obs noise
  const [tick, setTick] = useState(0);

  const W = 600, H = 260, pad = 30;
  const N = 100;

  // Deterministic ground truth + obs, regenerated when Q, R change
  const { truth, obs } = React.useMemo(() => {
    let rng = 7;
    const rand = () => { rng = (rng * 1103515245 + 12345) % 2 ** 31; return rng / 2 ** 31; };
    const gauss = () => {
      const u = rand() || 1e-9, v = rand();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    const truth: number[] = [0];
    const obs: number[] = [gauss() * Math.sqrt(R)];
    for (let i = 1; i < N; i++) {
      truth.push(truth[i - 1] + gauss() * Math.sqrt(Q));
      obs.push(truth[i] + gauss() * Math.sqrt(R));
    }
    return { truth, obs };
  }, [Q, R]);

  // Run Kalman filter (scalar, F=1, H=1)
  const { mu, sig } = React.useMemo(() => {
    const mu: number[] = [0], sig: number[] = [1];
    for (let i = 1; i < N; i++) {
      // predict
      const muP = mu[i - 1];
      const sigP = sig[i - 1] + Q;
      // update
      const K = sigP / (sigP + R);
      mu.push(muP + K * (obs[i] - muP));
      sig.push((1 - K) * sigP);
    }
    return { mu, sig };
  }, [Q, R, obs]);

  useEffect(() => {
    if (tick >= N) return;
    const id = setTimeout(() => setTick(tick + 1), 40);
    return () => clearTimeout(id);
  }, [tick]);

  const all = [...truth, ...obs, ...mu];
  const ymin = Math.min(...all), ymax = Math.max(...all);
  const sx = (i: number) => pad + (i / (N - 1)) * (W - 2 * pad);
  const sy = (v: number) => H - pad - ((v - ymin) / (ymax - ymin + 1e-9)) * (H - 2 * pad);

  const pstr = (arr: number[], upTo: number) =>
    arr.slice(0, upTo).map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i)} ${sy(v)}`).join(' ');

  // Build ±1σ band polygon
  const bandUp = mu.slice(0, tick).map((m, i) => `${sx(i)},${sy(m + Math.sqrt(sig[i]))}`);
  const bandDn = mu.slice(0, tick).map((m, i) => `${sx(i)},${sy(m - Math.sqrt(sig[i]))}`).reverse();
  const bandStr = [...bandUp, ...bandDn].join(' ');

  return (
    <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
      <svg width={W} height={H} className="w-full h-auto">
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#333" />
        {bandStr && <polygon points={bandStr} fill="#22d3ee" fillOpacity={0.15} />}
        <path d={pstr(truth, tick)} fill="none" stroke="#888" strokeWidth={1.5} strokeDasharray="3,3" />
        {obs.slice(0, tick).map((v, i) => (
          <circle key={i} cx={sx(i)} cy={sy(v)} r={1.8} fill="#ec4899" opacity={0.55} />
        ))}
        <path d={pstr(mu, tick)} fill="none" stroke="#22d3ee" strokeWidth={2} />
      </svg>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">Process Q</label>
          <input type="range" min={0.001} max={0.5} step={0.001} value={Q}
            onChange={(e) => { setQ(+e.target.value); setTick(0); }}
            className="w-full accent-cyan-500" />
          <span className="text-cyan-400 font-mono">{Q.toFixed(3)}</span>
        </div>
        <div>
          <label className="text-zinc-500 uppercase tracking-widest">Obs R</label>
          <input type="range" min={0.05} max={3} step={0.01} value={R}
            onChange={(e) => { setR(+e.target.value); setTick(0); }}
            className="w-full accent-pink-500" />
          <span className="text-pink-400 font-mono">{R.toFixed(2)}</span>
        </div>
      </div>
      <div className="text-[10px] text-zinc-500 mt-2 font-mono">
        gray = truth · pink = obs · cyan = posterior μ ± σ · K = σ_pred / (σ_pred + R)
      </div>
    </div>
  );
}
