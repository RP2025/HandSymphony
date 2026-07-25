import React, { useEffect, useRef, useState } from 'react';
import { AudioEngine } from '../../audio/audioEngine';
import { Activity, BarChart2 } from 'lucide-react';

export const WaveformVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<'waveform' | 'spectrum'>('waveform');

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const engine = AudioEngine.getInstance();

      if (mode === 'waveform') {
        // Draw Oscilloscope Waveform
        const waveform = engine.getWaveformData();
        ctx.lineWidth = 2.5;

        // Gradient line
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#10b981'); // Emerald
        gradient.addColorStop(0.5, '#6366f1'); // Indigo
        gradient.addColorStop(1, '#d946ef'); // Fuchsia

        ctx.strokeStyle = gradient;
        ctx.beginPath();

        const sliceWidth = width / waveform.length;
        let x = 0;

        for (let i = 0; i < waveform.length; i++) {
          const v = waveform[i]; // -1 to +1
          const y = (v * height) / 2 + height / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // Subtle glow effect
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // Draw Frequency Spectrum Bars
        const fftData = engine.getFftData();
        const barCount = Math.min(32, fftData.length);
        const barWidth = (width / barCount) - 3;

        for (let i = 0; i < barCount; i++) {
          // fftData in dB (-100 to 0)
          const db = fftData[i];
          const normalized = Math.max(0, Math.min(1, (db + 90) / 90));
          const barHeight = normalized * height * 0.9;

          const x = i * (barWidth + 3);
          const y = height - barHeight;

          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, '#06b6d4');
          gradient.addColorStop(0.7, '#8b5cf6');
          gradient.addColorStop(1, '#f43f5e');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [mode]);

  return (
    <div className="glass-panel p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-zinc-200">Audio Signal Visualizer</span>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setMode('waveform')}
            className={`p-1.5 rounded text-[10px] font-medium transition-colors ${
              mode === 'waveform' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Oscilloscope Waveform"
          >
            <Activity className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setMode('spectrum')}
            className={`p-1.5 rounded text-[10px] font-medium transition-colors ${
              mode === 'spectrum' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Frequency Spectrum Bars"
          >
            <BarChart2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="w-full h-24 relative bg-zinc-950/80 rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
        <canvas ref={canvasRef} width={400} height={100} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};
