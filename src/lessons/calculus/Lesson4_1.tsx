import React from 'react';
import LessonShell from '../../components/LessonShell';
import TangentLine from '../../viz/2d/TangentLine';

export default function Lesson4_1() {
  return (
    <LessonShell lessonId="calculus-4-1">
      <div className="space-y-6">
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          Derivatives are linear approximations.
        </p>
        <div className="py-8">
          <TangentLine />
        </div>
      </div>
    </LessonShell>
  );
}
