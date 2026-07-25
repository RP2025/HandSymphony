import React from 'react';
import { Music, Cpu, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#020205]/90 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-auto relative z-10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Music className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-200">HAND SYMPHONY.</div>
            <div className="text-xs text-slate-500">Real-time Computer Vision & Web Audio Synth</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-emerald-400" /> MediaPipe Vision
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-violet-400" /> Tone.js Audio Engine
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            React 19 & TypeScript
          </span>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for computer vision audio synthesis.
        </div>
      </div>
    </footer>
  );
};
