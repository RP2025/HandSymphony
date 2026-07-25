import React from 'react';
import { SOUND_LAYERS } from '../../config/defaultSettings';
import { Layers, Volume2, VolumeX } from 'lucide-react';

interface LayerStatusBadgeProps {
  activeLayersCount: number; // 0..5
}

export const LayerStatusBadge: React.FC<LayerStatusBadgeProps> = ({ activeLayersCount }) => {
  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-zinc-200">Active Sound Layers (Left Hand)</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span>{activeLayersCount}/5 Active</span>
        </div>
      </div>

      <div className="space-y-2">
        {SOUND_LAYERS.map((layer, idx) => {
          const isActive = idx < activeLayersCount;

          return (
            <div
              key={layer.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                isActive
                  ? 'bg-zinc-900/90 border-emerald-500/40 text-white shadow-md shadow-emerald-950/40'
                  : 'bg-zinc-950/40 border-white/5 text-zinc-600'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Layer Icon Indicator */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-900 text-zinc-600'
                  }`}
                >
                  {isActive ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
                </div>

                <div>
                  <div className={`text-xs font-bold ${isActive ? 'text-zinc-100' : 'text-zinc-500'}`}>
                    {layer.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                    {layer.oscillatorType} wave
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-zinc-900 text-zinc-600'
                  }`}
                >
                  {isActive ? 'ENABLED' : 'MUTED'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
