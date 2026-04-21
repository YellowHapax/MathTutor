import React from 'react';
import LessonShell from '../../components/LessonShell';
import VectorField from '../../viz/2d/VectorField';

export default function Lesson2_1() {
  return (
    <LessonShell lessonId="linearalgebra-2-1">
      <div className="space-y-6">
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          Vectors are arrows. They point somewhere, and they have a length.
        </p>
        <div className="py-8">
          <VectorField />
        </div>
      </div>
    </LessonShell>
  );
}
