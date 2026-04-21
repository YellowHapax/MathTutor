import React, { useState, useRef, useEffect } from 'react';

export default function Simplex2D() {
  const [point, setPoint] = useState({ x: 0, y: 0 }); // Center
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Triangle vertices
  const R = 0.8;
  const v1 = { x: 0, y: -R };
  const v2 = { x: -R * Math.cos(Math.PI/6), y: R * Math.sin(Math.PI/6) };
  const v3 = { x: R * Math.cos(Math.PI/6), y: R * Math.sin(Math.PI/6) };

  // Calculate barycentric coordinates
  const getProbs = (pt: {x: number, y: number}) => {
    const den = (v2.y - v3.y)*(v1.x - v3.x) + (v3.x - v2.x)*(v1.y - v3.y);
    let p1 = ((v2.y - v3.y)*(pt.x - v3.x) + (v3.x - v2.x)*(pt.y - v3.y)) / den;
    let p2 = ((v3.y - v1.y)*(pt.x - v3.x) + (v1.x - v3.x)*(pt.y - v3.y)) / den;
    let p3 = 1 - p1 - p2;
    
    // Clamp
    if (p1 < 0) { p2 += p1/2; p3 += p1/2; p1 = 0; }
    if (p2 < 0) { p1 += p2/2; p3 += p2/2; p2 = 0; }
    if (p3 < 0) { p1 += p3/2; p2 += p3/2; p3 = 0; }
    
    // Normalize after clamp
    const sum = p1 + p2 + p3;
    if (sum === 0) return [0.33, 0.33, 0.34];
    return [p1/sum, p2/sum, p3/sum];
  };

  const handlePointer = (e: React.PointerEvent | React.MouseEvent) => {
    if (!svgRef.current || e.buttons !== 1) return;
    const rect = svgRef.current.getBoundingClientRect();
    let cx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    let cy = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    // Naively clamp to bounding box, barycentric calculation handles triangle bounds loosely above
    setPoint({ x: cx, y: cy });
  };

  const probs = getProbs(point);
  
  // Actually position the dot exactly via barycentric reconstruction to keep it strictly inside
  const dotX = probs[0] * v1.x + probs[1] * v2.x + probs[2] * v3.x;
  const dotY = probs[0] * v1.y + probs[1] * v2.y + probs[2] * v3.y;

  return (
    <div className="relative flex flex-col items-center justify-center p-12 py-20 bg-zinc-950 rounded-xl border border-zinc-800 select-none overflow-hidden mt-6">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5"></div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>
      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        SVG Engine: Simplex2D
      </div>

      <div className="relative w-64 h-64 cursor-crosshair touch-none">
        <svg 
          ref={svgRef}
          viewBox="-1 -1 2 2" 
          className="w-full h-full overflow-visible"
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); handlePointer(e); }}
          onPointerMove={handlePointer}
        >
          {/* Grid/Background */}
          <polygon 
            points={`${v1.x},${v1.y} ${v2.x},${v2.y} ${v3.x},${v3.y}`} 
            fill="#0f0f0f" 
            stroke="#27272a" 
            strokeWidth="0.02" 
          />
          
          {/* Inner constraint lines */}
          <line x1={v1.x} y1={v1.y} x2={v2.x} y2={v2.y} stroke="#d4a847" strokeWidth="0.01" />
          <line x1={v2.x} y1={v2.y} x2={v3.x} y2={v3.y} stroke="#d4a847" strokeWidth="0.01" />
          <line x1={v3.x} y1={v3.y} x2={v1.x} y2={v1.y} stroke="#d4a847" strokeWidth="0.01" />

          {/* Connect to vertices */}
          <line x1={dotX} y1={dotY} x2={v1.x} y2={v1.y} stroke="#d4a847" strokeWidth="0.005" strokeDasharray="0.02,0.02" opacity={0.5} />
          <line x1={dotX} y1={dotY} x2={v2.x} y2={v2.y} stroke="#d4a847" strokeWidth="0.005" strokeDasharray="0.02,0.02" opacity={0.5} />
          <line x1={dotX} y1={dotY} x2={v3.x} y2={v3.y} stroke="#d4a847" strokeWidth="0.005" strokeDasharray="0.02,0.02" opacity={0.5} />

          <circle cx={dotX} cy={dotY} r="0.05" fill="#d4a847" className="transition-all duration-75" />
          
          <text x={v1.x} y={v1.y - 0.1} fontSize="0.1" fill="#71717a" textAnchor="middle">P₁</text>
          <text x={v2.x - 0.1} y={v2.y + 0.1} fontSize="0.1" fill="#71717a" textAnchor="end">P₂</text>
          <text x={v3.x + 0.1} y={v3.y + 0.1} fontSize="0.1" fill="#71717a" textAnchor="start">P₃</text>
        </svg>
      </div>

      <div className="mt-8 flex justify-between space-x-6 w-full max-w-[200px] text-xs font-mono tracking-widest z-20">
        <div className="flex flex-col items-center">
          <span className="text-zinc-500 mb-1">P₁</span>
          <span className="text-[#d4a847]">{(probs[0] * 100).toFixed(0)}%</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-zinc-500 mb-1">P₂</span>
          <span className="text-[#d4a847]">{(probs[1] * 100).toFixed(0)}%</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-zinc-500 mb-1">P₃</span>
          <span className="text-[#d4a847]">{(probs[2] * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
