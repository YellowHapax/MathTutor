import React from 'react';
import LessonShell from '../../components/LessonShell';
import PhasePortrait from '../../viz/2d/PhasePortrait';

export default function Lesson4_2() {
  return (
    <LessonShell lessonId="calculus-4-2">
      <div className="space-y-6">
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          Flow lines in a vector field.
        </p>
        <div className="py-8">
          <PhasePortrait />
        </div>
      </div>
    </LessonShell>
  );
}
