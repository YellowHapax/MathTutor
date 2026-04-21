import React from 'react';
import { LESSONS } from '../curriculum/registry';
import { Link } from 'react-router-dom';

export default function Home() {
  const tracks = Array.from(new Set(LESSONS.map(l => l.trackLabel)));

  return (
    <div className="w-full max-w-4xl mx-auto px-6 lg:px-12 py-12 flex flex-col space-y-16 overflow-y-auto custom-scrollbar h-full">
      
      {/* Hero Section */}
      <section className="space-y-6 pt-8 pb-4">
        <h1 className="text-4xl md:text-6xl font-serif leading-tight text-zinc-100">
          A Structural <br /> <span className="text-[#d4a847] italic">Thinking Environment</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 font-light max-w-2xl leading-relaxed italic">
          Mathematics tailored for polymath-oriented pattern intuition. 
          Intuitive geometry first, formalism second. Bound together by the 
          Memory as Baseline Deviation (MBD) framework.
        </p>
      </section>

      {/* Curriculum Grid */}
      <section className="space-y-12 pb-24">
        {tracks.map(trackLabel => {
          const trackLessons = LESSONS.filter(l => l.trackLabel === trackLabel);
          return (
            <div key={trackLabel} className="space-y-6">
              <h2 className="text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">
                {trackLabel}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trackLessons.map(lesson => (
                  <Link 
                    key={lesson.id} 
                    to={`/lesson/${lesson.id}`}
                    className="group flex flex-col bg-zinc-900/30 rounded-xl p-5 border border-zinc-800 hover:border-[#d4a847]/50 transition-all hover:-translate-y-1 duration-200 shadow-sm hover:shadow-lg hover:shadow-[#d4a847]/5 cursor-pointer no-underline"
                  >
                    <div className="text-[#d4a847] font-serif text-sm italic mb-2">
                      Lesson {lesson.index}
                    </div>
                    <h3 className="text-lg font-serif text-zinc-100 mb-2">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-zinc-500 font-light leading-relaxed group-hover:text-zinc-400 transition-colors">
                      {lesson.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
      
    </div>
  );
}
