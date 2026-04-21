import React, { Suspense } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { LESSONS } from '../curriculum/registry';

export default function LessonRoute() {
  const { id } = useParams<{ id: string }>();
  
  const lesson = LESSONS.find(l => l.id === id);
  
  if (!lesson) {
    return <Navigate to="/" replace />;
  }

  const LazyComponent = lesson.component;

  return (
    <div className="w-full h-full overflow-hidden">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-[#d4a847] italic">
          Loading concept space...
        </div>
      }>
        <LazyComponent />
      </Suspense>
    </div>
  );
}
