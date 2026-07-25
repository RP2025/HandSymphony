import React from 'react';
import { AudioEngineMetrics, HandTrackingState } from '../../types';
import { Cpu, Music, Gauge, Radio, Layers } from 'lucide-react';
import { formatFrequency } from '../../utils/formatters';

interface LiveMetricsBarProps {
  trackingState: HandTrackingState;
  audioMetrics: AudioEngineMetrics;
  stabilizedLeft: number;
  stabilizedRight: number;
}

export const LiveMetricsBar: React.FC<LiveMetricsBarProps> = ({
  trackingState,
  audioMetrics,
  stabilizedLeft,
  stabilizedRight,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
      {/* Current Pitch */}
      <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <Music className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Active Note</div>
          <div className="text-base font-extrabold text-white flex items-baseline gap-1.5">
            <span>{audioMetrics.activeNote !== 'Muted' ? audioMetrics.activeNote : 'Silence'}</span>
            <span className="text-xs text-zinc-400 font-mono font-normal">
              {formatFrequency(audioMetrics.activeFreq)}
            </span>
          </div>
        </div>
      </div>

      {/* Active Layers */}
      <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Sound Layers</div>
          <div className="text-base font-extrabold text-white">
            {stabilizedLeft > 0 ? `Layers 1–${stabilizedLeft}` : 'Muted (0)'}
          </div>
        </div>
      </div>

      {/* Right Hand Note Finger Count */}
      <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Radio className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Right Hand</div>
          <div className="text-base font-extrabold text-white">
            {stabilizedRight > 0 ? `${stabilizedRight} Finger${stabilizedRight > 1 ? 's' : ''}` : 'No Pitch'}
          </div>
        </div>
      </div>

      {/* Tracking FPS */}
      <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Gauge className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Vision Speed</div>
          <div className="text-base font-extrabold text-white flex items-baseline gap-1">
            <span>{trackingState.fps || 30}</span>
            <span className="text-xs text-zinc-400 font-normal">FPS</span>
          </div>
        </div>
      </div>

      {/* Model & Latency Status */}
      <div className="glass-panel p-3.5 rounded-2xl flex items-center gap-3 col-span-2 sm:col-span-1">
        <div className="w-9 h-9 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
          <Cpu className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Engine Status</div>
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Low Latency AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};
