import React from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import LessonRoute from './pages/LessonRoute';

export default function App() {
  return (
    <HashRouter>
      <div className="flex flex-col h-screen w-full bg-[#0f0f0f] text-zinc-100 font-sans overflow-hidden">
        {/* Top Navigation Bar from Theme */}
        <header className="flex items-center justify-between px-8 h-16 border-b border-zinc-800 bg-[#0f0f0f] flex-none z-50">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-[#d4a847] font-serif text-xl tracking-widest font-bold no-underline">
              MBD
            </Link>
            <span className="text-zinc-500 font-light hidden sm:inline">/</span>
            <span className="text-zinc-300 font-medium uppercase tracking-widest text-xs hidden sm:inline">Graduate Mathematics Educator</span>
          </div>
          <div className="flex items-center gap-6 text-xs uppercase tracking-widest">
            <Link to="/" className="text-[#d4a847] border-b border-[#d4a847] pb-1 hover:text-[#b48c3b] transition-colors">Curriculum</Link>
            <Link to="/about" className="text-zinc-500 hover:text-zinc-300 transition-colors">About</Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col w-full relative overflow-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/lesson/:id" element={<LessonRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}
