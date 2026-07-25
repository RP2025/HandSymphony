import React, { useEffect } from 'react';
import { Keyboard, Hand } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AudioEngine } from '../../audio/audioEngine';

interface KeyboardFallbackProps {
  manualLeft: number;
  manualRight: number;
  onSetManualGestures: (left: number, right: number) => void;
}

export const KeyboardFallback: React.FC<KeyboardFallbackProps> = ({
  manualLeft,
  manualRight,
  onSetManualGestures,
}) => {
  const { settings } = useAppStore();

  useEffect(() => {
    if (!settings.keyboardFallback) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Keys 1..5 for Left Hand (Layers)
      if (['0', '1', '2', '3', '4', '5'].includes(e.key)) {
        const val = parseInt(e.key, 10);
        onSetManualGestures(val, manualRight);
        AudioEngine.getInstance().updateGestureState(val, manualRight, settings.noteScaleId, settings.octaveOffset);
      }
      // Keys Q..T for Right Hand (Pitch)
      const pitchKeys: Record<string, number> = {
        q: 1,
        w: 2,
        e: 3,
        r: 4,
        t: 5,
        '`': 0,
      };
      if (pitchKeys[e.key.toLowerCase()] !== undefined) {
        const val = pitchKeys[e.key.toLowerCase()];
        onSetManualGestures(manualLeft, val);
        AudioEngine.getInstance().updateGestureState(manualLeft, val, settings.noteScaleId, settings.octaveOffset);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [manualLeft, manualRight, onSetManualGestures, settings]);

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-zinc-200">Interactive Manual Test Controls</span>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-white/5">
          Hotkeys Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Hand Simulation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
              <Hand className="w-3.5 h-3.5" /> Left Hand (Sound Layers)
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Keys [0-5]</span>
          </div>

          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => {
                  onSetManualGestures(num, manualRight);
                  AudioEngine.getInstance().updateGestureState(num, manualRight, settings.noteScaleId, settings.octaveOffset);
                }}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                  manualLeft === num
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                    : 'bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/20'
                }`}
              >
                {num === 0 ? 'Off' : `${num}🖐️`}
              </button>
            ))}
          </div>
        </div>

        {/* Right Hand Simulation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-violet-400 flex items-center gap-1.5">
              <Hand className="w-3.5 h-3.5" /> Right Hand (Note Pitch)
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Keys [Q, W, E, R, T]</span>
          </div>

          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => {
                  onSetManualGestures(manualLeft, num);
                  AudioEngine.getInstance().updateGestureState(manualLeft, num, settings.noteScaleId, settings.octaveOffset);
                }}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                  manualRight === num
                    ? 'bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30'
                    : 'bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/20'
                }`}
              >
                {num === 0 ? 'Rest' : `Key ${num}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
