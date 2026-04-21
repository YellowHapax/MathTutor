import React, { useRef, useState } from 'react';

export default function VectorField() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMouse({ x, y });
  };
  
  const handleMouseLeave = () => {
    setMouse({ x: 0, y: 0 });
  };

  const grid = [];
  const steps = 12;
  for (let i = 0; i <= steps; i++) {
    for (let j = 0; j <= steps; j++) {
      const x = (i / steps) * 2 - 1;
      const y = (j / steps) * 2 - 1;
      
      // Vector logic - point towards mouse, add a little swirl
      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const dist = Math.sqrt(dx*dx + dy*dy) || 0.001;
      
      // Vector field equation
      let vx = -y + dx / dist * 0.5;
      let vy = x + dy / dist * 0.5;
      
      // Normalize arrow size
      const vLen = Math.sqrt(vx*vx + vy*vy);
      const scale = 0.08 / Math.max(vLen, 0.5);
      vx *= scale;
      vy *= scale;

      grid.push({ x, y, vx, vy, dist });
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-12 py-16 bg-zinc-950 rounded-xl border border-zinc-800 select-none overflow-hidden mt-6">
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <div className="w-2 h-2 rounded-full bg-[#d4a847] animate-pulse mt-0.5"></div>
        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">Interactive Mode Active</span>
      </div>
      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest text-zinc-600 z-20">
        SVG Engine: VectorField
      </div>

      <div 
        ref={containerRef}
        className="relative w-64 h-64 border border-zinc-800 rounded-sm bg-[#0f0f0f] shadow-inner overflow-hidden z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg viewBox="-1.1 -1.1 2.2 2.2" className="w-full h-full pointer-events-none">
          {grid.map((pt, i) => {
            const intensity = Math.max(0.2, 1 - pt.dist * 0.5);
            return (
              <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
                <line 
                  x1="0" y1="0" 
                  x2={pt.vx} y2={pt.vy} 
                  stroke={`rgba(212, 168, 71, ${intensity})`} 
                  strokeWidth="0.015" 
                  strokeLinecap="round"
                />
                {/* Arrowhead */}
                <circle cx={pt.vx} cy={pt.vy} r="0.015" fill={`rgba(212, 168, 71, ${intensity})`} />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
