import React from 'react';
import { HelpCircle, Hand, Music, Camera, Lightbulb, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const HelpPage: React.FC = () => {
  const { setCurrentRoute } = useAppStore();

  return (
    <div className="min-h-[calc(100vh-5rem)] text-slate-200 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <button
            onClick={() => setCurrentRoute('play')}
            className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Music Performance
          </button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
            <span>Gesture Guide & Troubleshooting</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Learn how to control sound layers, notes, and optimize camera tracking</p>
        </div>
      </div>

      {/* Hand Responsibilities Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Hand Card */}
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-emerald-500/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Hand className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">LEFT HAND → SOUND LAYERS</h2>
              <p className="text-xs text-emerald-400">Controls Cumulative Synthesizer Texture</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The Left Hand determines how many harmonic synth layers play simultaneously inside the master synthesizer.
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
              <span className="text-emerald-400 font-bold">0 Fingers (Fist)</span>
              <span className="text-slate-400">All Layers Muted (Silence)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
              <span className="text-emerald-400 font-bold">1 Finger</span>
              <span className="text-slate-300">Layer 1 (Silk Sine Sub-bass)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
              <span className="text-emerald-400 font-bold">2 Fingers</span>
              <span className="text-slate-300">Layer 1 + Layer 2 (Soft Triangle)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
              <span className="text-emerald-400 font-bold">3 Fingers</span>
              <span className="text-slate-300">Layers 1 + 2 + 3 (Punchy Pulse)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
              <span className="text-emerald-400 font-bold">4 Fingers</span>
              <span className="text-slate-300">Layers 1 + 2 + 3 + 4 (Resonant Saw)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
              <span className="text-emerald-400 font-bold">5 Fingers (Open Palm)</span>
              <span className="text-slate-300">All 5 Layers Active (Shimmer FM)</span>
            </div>
          </div>
        </div>

        {/* Right Hand Card */}
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-violet-500/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">RIGHT HAND → MUSICAL PITCH</h2>
              <p className="text-xs text-violet-400">Selects Note Pitch (C4 to G4)</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            The Right Hand selects the exact note pitch played across all active sound layers.
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
              <span className="text-violet-400 font-bold">1 Finger</span>
              <span className="text-slate-200">C4 Note (261.6 Hz)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
              <span className="text-violet-400 font-bold">2 Fingers</span>
              <span className="text-slate-200">D4 Note (293.7 Hz)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
              <span className="text-violet-400 font-bold">3 Fingers</span>
              <span className="text-slate-200">E4 Note (329.6 Hz)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
              <span className="text-violet-400 font-bold">4 Fingers</span>
              <span className="text-slate-200">F4 Note (349.2 Hz)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
              <span className="text-violet-400 font-bold">5 Fingers (Open Palm)</span>
              <span className="text-slate-200">G4 Note (392.0 Hz)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Camera & Lighting Tips */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-400">
          <Lightbulb className="w-5 h-5" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Tips for Best Hand Tracking</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Good Lighting
            </div>
            <p className="text-slate-400 leading-relaxed">
              Ensure your face and hands are well-lit from the front. Avoid dark backlighting behind your head.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-indigo-400" /> Camera Distance
            </div>
            <p className="text-slate-400 leading-relaxed">
              Position yourself 1.5 to 3 feet from your webcam with palms facing straight towards the camera lens.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Separation
            </div>
            <p className="text-slate-400 leading-relaxed">
              Keep your left and right hands distinct in the video frame to avoid overlapping gestures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
