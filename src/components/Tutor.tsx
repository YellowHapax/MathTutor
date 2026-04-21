import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Key, Settings } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Lesson } from '../curriculum/registry';

interface TutorProps {
  lesson: Lesson;
  onClose: () => void;
}

export default function Tutor({ lesson, onClose }: TutorProps) {
  const [apiKey, setApiKey] = useState(localStorage.getItem('openrouter_api_key') || '');
  const [model, setModel] = useState(localStorage.getItem('openrouter_model') || 'google/gemini-2.5-pro');
  const [showSettings, setShowSettings] = useState(!apiKey);
  
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize fresh transcript on lesson change
  useEffect(() => {
    setMessages([
      {role: 'assistant', content: `Hello. I am here to help you structure your intuition around **${lesson.title}**. What are your initial thoughts on this?`}
    ]);
  }, [lesson.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const saveSettings = () => {
    localStorage.setItem('openrouter_api_key', apiKey);
    localStorage.setItem('openrouter_model', model);
    setShowSettings(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, {role: 'user', content: userMessage}]);
    setLoading(true);

    try {
      const systemPrompt = `
You are a Socratic mathematics tutor for a graduate-level student.
The student's background: polymath, strong pattern intuition, ADHD/ASD processing style — respond to structure and gradient before procedure.
Current lesson: ${lesson.title} — ${lesson.description}
Core concept: ${lesson.coreIdea}
MBD connection: ${lesson.mbdBridge}

Guide with questions, not answers. When the student is correct, say so briefly and push deeper.
Use LaTeX for all math (double-dollar for display, single-dollar for inline).
Keep responses short — 2–4 sentences unless a proof is requested.
      `.trim();

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'MBD Mathematics Educator',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 400
        })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      const botMessage = data.choices[0]?.message?.content || 'Sorry, I returned empty thought space.';
      
      setMessages(prev => [...prev, {role: 'assistant', content: botMessage}]);

    } catch (e: any) {
      setMessages(prev => [...prev, {role: 'assistant', content: `**Error:** Failed to connect to intuition matrix. (${e.message})`}]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (showSettings) {
    return (
      <div className="flex flex-col h-full bg-zinc-900/20 font-sans p-6">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-800">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300 flex items-center">
            <Key size={14} className="mr-2 text-[#d4a847]" /> Configure Tutor
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-2">OpenRouter API Key</label>
            <input 
              type="password" 
              value={apiKey} 
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:border-[#d4a847] transition-colors text-sm"
            />
            <p className="text-[10px] text-zinc-500 mt-2 tracking-wider">Required for Socratic chat. Stored securely in your browser's localStorage.</p>
          </div>

          <div>
            <label className="block text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-2">Language Model</label>
            <select 
              value={model} 
              onChange={e => setModel(e.target.value)}
              className="w-full bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:border-[#d4a847] transition-colors text-sm"
            >
              <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
              <option value="google/gemini-2.5-pro">Gemini 2.5 Pro</option>
              <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
            </select>
          </div>

          <button 
            onClick={saveSettings}
            disabled={!apiKey.trim()}
            className="w-full bg-[#d4a847] text-[#0f0f0f] font-semibold text-xs tracking-widest uppercase rounded-md py-3 hover:bg-[#b48c3b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save & Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-900/20 flex-none">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300">Socratic Tutor</h3>
        </div>
        <div className="flex space-x-4 text-zinc-500">
          <button onClick={() => setShowSettings(true)} className="hover:text-zinc-300 transition-colors">
            <Settings size={16} />
          </button>
          <button onClick={onClose} className="hover:text-zinc-300 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
              {m.role === 'user' ? 'Brandon' : 'Tutor'}
            </span>
            <div 
              className={`max-w-[85%] text-sm leading-relaxed font-serif ${
                m.role === 'user' 
                  ? 'bg-[#d4a847]/10 text-zinc-100 p-4 rounded-xl rounded-tr-none border border-[#d4a847]/20' 
                  : 'bg-zinc-900/80 text-zinc-300 p-4 rounded-xl rounded-tl-none border border-zinc-800'
              }`}
            >
              {m.role === 'user' ? (
                <div className="whitespace-pre-wrap font-sans text-sm">{m.content}</div>
              ) : (
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex flex-col gap-2 items-start">
            <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Tutor</span>
            <div className="bg-zinc-900/80 text-zinc-300 p-4 rounded-xl rounded-tl-none border border-zinc-800 flex items-center space-x-1 h-[54px]">
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
              <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-zinc-800 bg-[#0f0f0f] flex-none">
        <div className="flex items-center bg-zinc-900 rounded-2xl px-4 py-2 border border-zinc-800 group focus-within:border-[#d4a847] transition-colors relative overflow-hidden">
          <textarea 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the structure..."
            rows={2}
            className="w-full bg-transparent border-none text-sm text-zinc-300 focus:outline-none focus:ring-0 resize-none placeholder-zinc-600 custom-scrollbar pr-8 py-2"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-4 bottom-4 text-zinc-600 hover:text-[#d4a847] disabled:opacity-50 transition-colors"
          >
            <Send size={16} className={input.trim() && !loading ? "text-[#d4a847]" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}
