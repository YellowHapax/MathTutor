import React from 'react';
import LessonShell from '../../components/LessonShell';
import GradientField from '../../viz/2d/GradientField';

export default function Lesson2_3() {
  return (
    <LessonShell lessonId="linearalgebra-2-3">
      <div className="space-y-6">
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          The gradient calculates steepness. It's a covector.
        </p>
        <div className="py-8">
          <GradientField />
        </div>
      </div>
    </LessonShell>
  );
}
