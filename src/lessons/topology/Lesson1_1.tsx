import React from 'react';
import LessonShell from '../../components/LessonShell';
import MetricBall from '../../viz/2d/MetricBall';
import { InlineMath, BlockMath } from 'react-katex';

export default function Lesson1_1() {
  return (
    <LessonShell lessonId="topology-1-1">
      <div className="space-y-6">
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          When we think of geometry, we usually think of a grid: an <InlineMath math="x" /> and <InlineMath math="y" /> axis. We measure distances using the Pythagorean theorem:
        </p>
        <BlockMath math="d(p, q) = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}" />
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          But what if you don't have a grid? What if you only know what points are <em>close</em> to each other?
        </p>
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          This is the foundation of topology. Instead of rigid coordinates, we define a space by its <strong>neighborhoods</strong>. A neighborhood is simply a set of points that are considered "close" to a central point.
        </p>

        <div className="py-8">
          <MetricBall />
        </div>

        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          Even when we do have distance metrics, the "shape" of a neighborhood changes depending on how we define distance. The standard circle is just one way to define a "ball" of equidistant points.
        </p>
      </div>
    </LessonShell>
  );
}
