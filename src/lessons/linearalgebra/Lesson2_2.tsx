import React from 'react';
import LessonShell from '../../components/LessonShell';
import EigenViz from '../../viz/2d/EigenViz';

export default function Lesson2_2() {
  return (
    <LessonShell lessonId="linearalgebra-2-2">
      <div className="space-y-6">
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          Transformations can warp space. Eigenvectors stay on their own span.
        </p>
        <div className="py-8">
          <EigenViz />
        </div>
      </div>
    </LessonShell>
  );
}
