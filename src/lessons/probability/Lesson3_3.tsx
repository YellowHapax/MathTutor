import React from 'react';
import LessonShell from '../../components/LessonShell';
import BayesUpdate from '../../viz/2d/BayesUpdate';

export default function Lesson3_3() {
  return (
    <LessonShell lessonId="probability-3-3">
      <div className="space-y-6">
        <p className="text-lg text-zinc-200 leading-relaxed font-serif bg-zinc-900/30 p-6 rounded-lg border border-zinc-800">
          Bayes rule is an update on a prior.
        </p>
        <div className="py-8">
          <BayesUpdate />
        </div>
      </div>
    </LessonShell>
  );
}
