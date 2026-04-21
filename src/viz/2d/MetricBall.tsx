import React, { useState } from 'react';

export default function MetricBall() {
  const [p, setP] = useState<number>(2);

  // Generate points for the boundary of the unit ball in Lp norm
  // |x|^p + |y|^p = 1 => y = (1 - |x|^p)^(1/p)
  
  const generatePath = () => {
    let points = [];
    const step = 0.02;
    
    // Top right
    for(let x = 0; x <= 1; x+=step) {
      const y = Math.pow(1 - Math.pow(x, p), 1/p);
      points.push(`${x},${-y}`); // Invert y for SVG
    }
    points.push(`1,0`);
    
    // Bottom right
    for(let x = 1; x >= 0; x-=step) {
      const y = -Math.pow(1 - Math.pow(x, p), 1/p);
      points.push(`${x},${-y}`);
    }
    points.push(`0,1`);
    
    // Bottom left
    for(let x = 0; x >= -1; x-=step) {
      const y = -Math.pow(1 - Math.pow(Math.abs(x), p), 1/p);
      points.push(`${x},${-y}`);
    }
    points.push(`-1,0`);

    // Top left
    for(let x = -1; x <= 0; x+=step) {
      const y = Math.pow(1 - Math.pow(Math.abs(x), p), 1/p);
      points.push(`${x},${-y}`);
    }
    points.push(`0,-1`);

    return `M ${points.join(' L ')} Z`;
  };

  const getMetricName = () => {
    if (p === 1) return "Manhattan Distance (L1)";
    if (p === 2) return "Euclidean Distance (L2)";
    if (p >= 8) return "Chebyshev Distance (L∞)";
    return `Lp Norm (p=${p.toFixed(1)})`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-12 py-16 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">SVG Engine: MetricBall(Lp)</div>
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5"></div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>

      <div className="relative w-64 h-64 border border-zinc-800 rounded-sm bg-[#0f0f0f] shadow-inner flex items-center justify-center overflow-hidden">
        
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
          {[...Array(11)].map((_, i) => <div key={`h${i}`} className="w-full h-px bg-[#d4a847]" style={{ top: `${i * 10}%`, position: 'absolute' }} />)}
          {[...Array(11)].map((_, i) => <div key={`v${i}`} className="h-full w-px bg-[#d4a847]" style={{ left: `${i * 10}%`, position: 'absolute' }} />)}
        </div>

        <svg viewBox="-1.5 -1.5 3 3" className="w-full h-full overflow-visible z-10 transition-all duration-300 relative">
          <path 
            d={generatePath()} 
            fill="rgba(212, 168, 71, 0.2)" 
            stroke="#d4a847" 
            strokeWidth="0.03"
            strokeLinejoin="round" 
            className="transition-all duration-100 ease-linear"
          />
          <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="#3f3f46" strokeWidth="0.015" />
          <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#3f3f46" strokeWidth="0.015" />
          
          <circle cx="0" cy="0" r="0.04" fill="#d4a847" />
        </svg>
      </div>

      <div className="mt-8 w-full max-w-sm flex flex-col items-center z-20">
        <h3 className="font-serif text-[#d4a847] text-lg mb-2">{getMetricName()}</h3>
        <input 
          type="range" 
          min="1" 
          max="8" 
          step="0.1" 
          value={p} 
          onChange={(e) => setP(parseFloat(e.target.value))}
          className="w-full accent-[#d4a847]"
        />
        <div className="flex justify-between w-full text-[10px] text-zinc-600 mt-2 font-mono uppercase tracking-widest">
          <span>L1 (Diamond)</span>
          <span>L2 (Circle)</span>
          <span>L∞ (Square)</span>
        </div>
      </div>
    </div>
  );
}
