import React from 'react';
import LessonShell from '../../components/LessonShell';
import TangentPlane from '../../viz/3d/TangentPlane';

export default function Lesson1_3() {
  return (
    <LessonShell lessonId="topology-1-3">
      <div className="space-y-6">
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          A manifold is a space that might be globally complicated (curved, wrapped around itself), but locally looks flat. 
        </p>

        <div className="py-8 h-[400px]">
          <TangentPlane />
        </div>
      </div>
    </LessonShell>
  );
}
