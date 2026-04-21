import React from 'react';

export default function About() {
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-16 space-y-12 leading-relaxed text-zinc-300 font-serif h-full overflow-y-auto custom-scrollbar">
      <h1 className="text-4xl font-serif text-zinc-100">Philosophy</h1>
      
      <div className="space-y-6">
        <p className="text-lg text-zinc-400 italic font-light">
          "Brandon thinks in structures, gradients, and patterns — not in procedural steps."
        </p>
        
        <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          This is not a traditional sequence of lectures. It is an exploration mapping 
          advanced mathematical concepts to intuitive, spatial patterns. 
          By prioritizing geometry and structure before diving into formal proofs, 
          the cognitive payload shifts from memory to visual intuition.
        </p>

        <h2 className="text-2xl font-serif text-zinc-100 mt-12 mb-4 border-b border-zinc-800 pb-2">The MBD Framework Connection</h2>
        <p className="text-sm text-zinc-400 leading-relaxed font-light">
          Throughout this curriculum, you will see bridges to the MBD (Memory as Baseline Deviation) framework.
          MBD describes a system wherein the baseline state is continuously updated by tracking the deviation 
          from reality or an ideal objective.
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed font-light">
          The core equation representing this continuous adjustment is:
        </p>
        <div className="bg-zinc-950 p-6 rounded-xl text-center font-mono my-6 border border-zinc-800 overflow-x-auto text-[#d4a847] tracking-widest text-lg shadow-inner">
            B(t+1) = B(t) + λ(I - B(t))
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed font-light pb-24">
          Understanding this fundamentally changes how we view memory, identity, learning, 
          and structural adaptation over time. Let's explore how mathematics maps precisely onto this framework.
        </p>
      </div>
    </div>
  );
}
