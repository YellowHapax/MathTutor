import React from 'react';
import LessonShell from '../../components/LessonShell';
import NaturalGradient from '../../viz/2d/NaturalGradient';

export default function Lesson4_3() {
  return (
    <LessonShell lessonId="calculus-4-3">
      <div className="space-y-6">
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          The Natural Gradient.
        </p>
        <div className="py-8">
          <NaturalGradient />
        </div>
      </div>
    </LessonShell>
  );
}
