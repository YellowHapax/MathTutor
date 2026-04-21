import React from 'react';

/**
 * Reusable paragraph/section primitives for graduate-register lesson bodies.
 * Keeps markup consistent across the 40+ lessons while allowing per-lesson
 * inline KaTeX content and bespoke viz.
 */

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
      {children}
    </p>
  );
}

/** Definition or formal statement block */
export function Def({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/50 border-l-2 border-zinc-600 pl-5 pr-6 py-4 rounded-r-md">
      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Definition — {title}</div>
      <div className="text-sm text-zinc-300 leading-relaxed font-serif">{children}</div>
    </div>
  );
}

/** Theorem / Proposition block with optional proof sketch */
export function Thm({
  title,
  children,
  proof,
}: {
  title: string;
  children: React.ReactNode;
  proof?: React.ReactNode;
}) {
  return (
    <div className="bg-[#1a1410] border-l-2 border-[#d4a847] pl-5 pr-6 py-4 rounded-r-md">
      <div className="text-[10px] text-[#d4a847] uppercase tracking-widest mb-2">Theorem — {title}</div>
      <div className="text-sm text-zinc-200 leading-relaxed font-serif">{children}</div>
      {proof && (
        <details className="mt-3">
          <summary className="text-[10px] text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-[#d4a847] transition-colors">
            Proof sketch
          </summary>
          <div className="text-xs text-zinc-400 leading-relaxed font-serif mt-2 pl-2 border-l border-zinc-800">
            {proof}
          </div>
        </details>
      )}
    </div>
  );
}

/** "In practice" sidebar: grounds the math in transformer / LLM architecture */
export function Practice({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-cyan-950/20 border-l-2 border-cyan-700 pl-5 pr-6 py-4 rounded-r-md">
      <div className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2">In Practice — LLM Architecture</div>
      <div className="text-sm text-zinc-300 leading-relaxed font-serif">{children}</div>
    </div>
  );
}

/** Inline callout for a key remark */
export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-zinc-400 italic font-serif px-4 border-l border-zinc-700">
      {children}
    </div>
  );
}
