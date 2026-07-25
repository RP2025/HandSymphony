import React from 'react';
import { motion } from 'motion/react';
import { Camera, Eye, Zap, Music, Cpu, ShieldCheck, Play, Radio, Volume2, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const LandingPage: React.FC = () => {
  const { setCurrentRoute } = useAppStore();

  const handleStartExperience = () => {
    setCurrentRoute('init');
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] text-slate-200 flex flex-col justify-between overflow-hidden">
      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center flex-grow px-6 pt-12 pb-16 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          AI-POWERED COMPUTER VISION AUDIO ENGINE
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-white mb-6 leading-[1.1]"
        >
          Play Music With <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 italic">
            Your Hands.
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed font-normal"
        >
          Turn simple hand gestures into beautiful music using futuristic computer vision.
          Conduct your own orchestra in the browser with zero latency.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={handleStartExperience}
            className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:scale-105 cursor-pointer flex items-center gap-3"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Your Musical Experience</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setCurrentRoute('help')}
            className="px-8 py-4 bg-transparent border border-white/10 hover:bg-white/5 text-white rounded-xl font-bold text-lg transition-all cursor-pointer"
          >
            Watch Demo
          </button>
        </motion.div>

        <p className="mt-4 text-xs text-slate-500">
          🔒 Private & Client-Side Only. Camera permissions are requested on start.
        </p>

        {/* Visual Hands Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-14 w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl text-left shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                ✋ Left Hand (1-5 Fingers)
              </div>
              <h3 className="text-lg font-semibold text-white">Sonic Layer Stacking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stack up to 5 rich synthesizer harmonic layers cumulatively from Sub-bass to Shimmer FM.
              </p>
              <div className="flex gap-1.5 pt-1">
                {['Sub-bass', 'Triangle', 'Pulse', 'Saw', 'FM Shimmer'].map((label, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono border border-emerald-500/20">
                    L{i + 1}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
                🖐️ Right Hand (1-5 Fingers)
              </div>
              <h3 className="text-lg font-semibold text-white">Pitch & Note Selection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Control musical note pitch across pentatonic, major, minor, or custom scales with zero glitching.
              </p>
              <div className="flex gap-1.5 pt-1">
                {['C4', 'D4', 'E4', 'F4', 'G4'].map((note) => (
                  <span key={note} className="px-2 py-1 rounded bg-violet-500/10 text-violet-300 text-[10px] font-mono border border-violet-500/20">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 sm:px-10 pb-16 max-w-7xl mx-auto w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
          <div className="text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-white font-semibold mb-1">AI Hand Tracking</h3>
          <p className="text-sm text-slate-500">Real-time 21-point landmark detection via MediaPipe.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
          <div className="text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-white font-semibold mb-1">Zero Latency</h3>
          <p className="text-sm text-slate-500">Low-level Tone.js implementation for instant response.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
          <div className="text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
            <Music className="w-6 h-6" />
          </div>
          <h3 className="text-white font-semibold mb-1">Sonic Layers</h3>
          <p className="text-sm text-slate-500">Cumulative synthesis textures powered by hand gestures.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:border-indigo-500/40 transition-all group">
          <div className="text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-white font-semibold mb-1">Pure Web Engine</h3>
          <p className="text-sm text-slate-500">No plugins. No backend. Entirely browser-based engine.</p>
        </div>
      </section>

      {/* Subtle Sound Wave Graphic */}
      <div className="relative w-full h-12 flex items-end gap-[2px] px-4 opacity-20 pointer-events-none overflow-hidden">
        {[20, 40, 70, 50, 90, 30, 60, 100, 40, 80, 20, 50, 10, 80, 60, 90, 30, 70, 50, 80, 40, 100, 60, 30, 70].map((h, i) => (
          <div key={i} className="flex-1 bg-indigo-500 rounded-t-sm" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
};

