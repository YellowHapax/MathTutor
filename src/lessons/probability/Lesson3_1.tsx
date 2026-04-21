import React from 'react';
import LessonShell from '../../components/LessonShell';
import Simplex2D from '../../viz/2d/Simplex2D';

export default function Lesson3_1() {
  return (
    <LessonShell lessonId="probability-3-1">
      <div className="space-y-6">
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          Probabilities live on a simplex.
        </p>
        <div className="py-8">
          <Simplex2D />
        </div>
      </div>
    </LessonShell>
  );
}
