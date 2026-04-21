import React, { useState, useEffect } from 'react';

// Loss: L = x² + 9y²  →  ∇L = [2x, 18y]
// Natural gradient: F⁻¹∇L = [2x/1, 18y/9] = [2x, 2y]  (F = diag(1,9))
function runPath(x0: number, y0: number, useNatural: boolean, eta: number, steps: number): [number, number][] {
  const path: [number, number][] = [[x0, y0]];
  let x = x0, y = y0;
  for (let i = 0; i < steps; i++) {
    x -= eta * 2 * x;
    y -= eta * (useNatural ? 2 * y : 18 * y);
    path.push([x, y]);
    if (Math.hypot(x, y) < 0.008) break;
  }
  return path;
}

const X0 = 0.85, Y0 = 0.85, ETA = 0.08;
const eucPath = runPath(X0, Y0, false, ETA, 80);
const natPath = runPath(X0, Y0, true, ETA, 80);

const W = 260, H = 200;
const SX = W / 2.2, SY = H / 2.2;
const toSVG = (x: number, y: number): [number, number] => [W / 2 + x * SX, H / 2 - y * SY];

export default function NaturalGradient() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const maxStep = Math.max(eucPath.length, natPath.length) - 1;

  useEffect(() => {
    if (!playing || step >= maxStep) { if (step >= maxStep) setPlaying(false); return; }
    const id = setTimeout(() => setStep(s => s + 1), 55);
    return () => clearTimeout(id);
  }, [playing, step, maxStep]);

  const contours = [0.08, 0.25, 0.55, 1.0, 1.6].map(k => (
    <ellipse key={k} cx={W / 2} cy={H / 2}
      rx={Math.sqrt(k) * SX} ry={Math.sqrt(k / 9) * SY}
      fill="none" stroke="#27272a" strokeWidth="1" />
  ));

  const pathStr = (pts: [number, number][], n: number) =>
    pts.slice(0, n + 1).map(([x, y], i) => { const [sx, sy] = toSVG(x, y); return `${i === 0 ? 'M' : 'L'}${sx},${sy}`; }).join(' ');

  const es = Math.min(step, eucPath.length - 1);
  const ns = Math.min(step, natPath.length - 1);
  const [ex, ey] = toSVG(eucPath[es][0], eucPath[es][1]);
  const [nx, ny] = toSVG(natPath[ns][0], natPath[ns][1]);

  return (
    <div className="relative flex flex-col items-center p-8 py-10 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden mt-6">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5" />
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>

      <svg width={W} height={H} className="bg-[#0f0f0f] rounded border border-zinc-800">
        {contours}
        <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="#27272a" strokeWidth="1" />
        <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="#27272a" strokeWidth="1" />
        <path d={pathStr(eucPath, es)} fill="none" stroke="#f472b6" strokeWidth="2" />
        <circle cx={ex} cy={ey} r="5" fill="#f472b6" />
        <path d={pathStr(natPath, ns)} fill="none" stroke="#22d3ee" strokeWidth="2" />
        <circle cx={nx} cy={ny} r="5" fill="#22d3ee" />
        <circle cx={W / 2} cy={H / 2} r="4" fill="#d4a847" />
      </svg>

      <div className="flex gap-6 mt-4 text-[10px] font-mono uppercase tracking-widest">
        <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-[#f472b6]" /><span className="text-zinc-500">Euclidean</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-0.5 bg-[#22d3ee]" /><span className="text-zinc-500">Natural</span></div>
        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#d4a847]" /><span className="text-zinc-500">Min</span></div>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={() => { setStep(0); setPlaying(true); }}
          className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded border border-[#d4a847] text-[#d4a847] hover:bg-[#d4a847]/10 transition-colors">
          ▶ Play
        </button>
        <button onClick={() => { setStep(0); setPlaying(false); }}
          className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-widest rounded border border-zinc-700 text-zinc-500 hover:border-zinc-500 transition-colors">
          ↺ Reset
        </button>
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        SVG Engine: NaturalGradient
      </div>
    </div>
  );
}
