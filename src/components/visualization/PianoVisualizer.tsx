import React from 'react';
import { NOTE_SCALES } from '../../config/defaultSettings';
import { Music } from 'lucide-react';

interface PianoVisualizerProps {
  activeNote: string;
  activeFingerCount: number;
  scaleId?: string;
  octaveOffset?: number;
}

export const PianoVisualizer: React.FC<PianoVisualizerProps> = ({
  activeNote,
  activeFingerCount,
  scaleId = 'major',
}) => {
  const scale = NOTE_SCALES[scaleId] || NOTE_SCALES['major'];

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-zinc-200">Pitch Mapping (Right Hand)</span>
        </div>
        <span className="text-[10px] text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-full border border-white/5">
          {scale.name.split('(')[0]}
        </span>
      </div>

      {/* Piano Keys */}
      <div className="grid grid-cols-5 gap-2 w-full h-24">
        {[1, 2, 3, 4, 5].map((fingerNum) => {
          const noteInfo = scale.notes[fingerNum];
          const isActive = activeFingerCount === fingerNum && activeNote !== 'Muted';

          return (
            <div
              key={fingerNum}
              className={`relative rounded-xl border flex flex-col items-center justify-between p-2 transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-b from-violet-600/90 to-indigo-700/90 border-violet-400 text-white shadow-lg shadow-violet-500/40 scale-[1.03] z-10'
                  : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:border-white/20'
              }`}
            >
              {/* Top Finger Badge */}
              <div
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                Finger {fingerNum}
              </div>

              {/* Note Name */}
              <div className="text-center my-1">
                <div className={`text-lg font-black tracking-tight ${isActive ? 'text-white' : 'text-zinc-200'}`}>
                  {noteInfo?.note || 'C'}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono">
                  {noteInfo?.freq ? `${Math.round(noteInfo.freq)}Hz` : ''}
                </div>
              </div>

              {/* Active Indicator Bar */}
              <div
                className={`w-full h-1 rounded-full ${
                  isActive ? 'bg-white shadow-[0_0_8px_#ffffff]' : 'bg-zinc-800'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
