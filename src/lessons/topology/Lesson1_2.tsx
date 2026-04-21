import React from 'react';
import LessonShell from '../../components/LessonShell';
import SurfaceDeform from '../../viz/3d/SurfaceDeform';

export default function Lesson1_2() {
  return (
    <LessonShell lessonId="topology-1-2">
      <div className="space-y-6">
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          If distance is flexible, what remains true when a space is deformed? Topology is often called "rubber-sheet geometry."
        </p>
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          Two spaces are considered topologically identical (homeomorphic) if you can continuously stretch, twist, and bend one into the other without tearing it or gluing parts together.
        </p>

        <div className="py-8 h-[400px]">
          <SurfaceDeform />
        </div>
      </div>
    </LessonShell>
  );
}
