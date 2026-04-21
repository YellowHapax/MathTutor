import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MessageSquare } from 'lucide-react';
import { LESSONS } from '../curriculum/registry';
import Tutor from './Tutor';

interface LessonShellProps {
  lessonId: string;
  children: React.ReactNode;
}

export default function LessonShell({ lessonId, children }: LessonShellProps) {
  const [tutorOpen, setTutorOpen] = useState(false);
  const navigate = useNavigate();

  const currentIndex = LESSONS.findIndex(l => l.id === lessonId);
  const lesson = LESSONS[currentIndex];
  
  if (!lesson) return null;

  const prevLesson = currentIndex > 0 ? LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;

  return (
    <div className="flex h-full w-full bg-[#0f0f0f] relative overflow-hidden">
      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${tutorOpen ? 'mr-0 lg:mr-[400px]' : 'mr-0'}`}>
        
        {/* Lesson Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-10 relative custom-scrollbar">
          <div className="max-w-2xl mx-auto flex flex-col w-full pb-32">
            
            <header className="mb-6 flex justify-between items-start">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                  {lesson.trackLabel} — Lesson {lesson.index}
                </div>
                <h1 className="text-4xl font-serif text-zinc-100 mb-2">
                  {lesson.title}
                </h1>
                <p className="text-zinc-400 font-light leading-relaxed italic">
                  {lesson.description}
                </p>
              </div>
              
              <button 
                onClick={() => setTutorOpen(!tutorOpen)}
                className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-4 py-2 rounded-full transition-colors text-[10px] font-bold uppercase tracking-widest hover:border-[#d4a847]/50 mt-1 shrink-0"
              >
                <MessageSquare size={14} className={tutorOpen ? "text-[#d4a847]" : "text-zinc-500"} />
                <span className="hidden sm:inline">{tutorOpen ? 'Close Tutor' : 'Tutor'}</span>
              </button>
            </header>

            <div className="space-y-8 flex-col flex">
              {children}
            </div>
            
            {/* MBD Bridge Callout */}
            <div className="mt-12 border-l-2 border-[#d4a847] pl-6 py-2 bg-transparent">
              <h5 className="text-[#d4a847] text-xs font-bold uppercase tracking-widest mb-3">MBD Bridge</h5>
              <p className="text-sm text-zinc-400 font-serif leading-relaxed italic">
                {lesson.mbdBridge}
              </p>
            </div>
            
            {/* Bottom Navigation */}
            <div className="pt-12 mt-16 border-t border-zinc-800 flex items-center justify-between">
              {prevLesson ? (
                <button onClick={() => navigate(`/lesson/${prevLesson.id}`)} className="group flex items-center text-left gap-4 cursor-pointer hover:bg-zinc-900/40 p-3 rounded-lg transition-colors">
                  <span className="text-zinc-600 group-hover:text-[#d4a847] transition-colors">
                    <ArrowLeft size={16} />
                  </span>
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-[#d4a847] transition-colors">Previous</span>
                    <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors font-serif">{prevLesson.title}</span>
                  </div>
                </button>
              ) : <div></div>}
              
              {nextLesson ? (
                <button onClick={() => navigate(`/lesson/${nextLesson.id}`)} className="group flex items-center text-right gap-4 cursor-pointer hover:bg-zinc-900/40 p-3 rounded-lg transition-colors">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-[#d4a847] transition-colors">Next</span>
                    <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors font-serif">{nextLesson.title}</span>
                  </div>
                  <span className="text-zinc-600 group-hover:text-[#d4a847] transition-colors">
                    <ArrowRight size={16} />
                  </span>
                </button>
              ) : (
                <div className="text-right font-serif italic text-zinc-500 text-sm">
                  Curriculum Complete
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Socratic Tutor Sidebar */}
      <div 
        className={`absolute lg:fixed right-0 top-0 bottom-0 w-full lg:w-[400px] border-l border-zinc-800 bg-zinc-900/20 backdrop-blur-md lg:backdrop-blur-none transition-transform duration-300 z-40 transform flex flex-col ${tutorOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <Tutor lesson={lesson} onClose={() => setTutorOpen(false)} />
      </div>
    </div>
  );
}
