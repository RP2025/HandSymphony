import React from 'react';
import { Sliders, Music, Camera, Cpu, Sparkles, Volume2, ArrowLeft, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { NOTE_SCALES, AUDIO_PRESETS } from '../config/defaultSettings';
import { PresetType } from '../types';
import { AudioEngine } from '../audio/audioEngine';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, setCurrentRoute } = useAppStore();

  const handlePresetSelect = (presetKey: PresetType) => {
    updateSettings({ activePreset: presetKey });
    AudioEngine.getInstance().setPreset(presetKey);
  };

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
            <Sliders className="w-6 h-6 text-indigo-400" />
            <span>Audio & AI Vision Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure note scales, sound presets, camera resolution and stabilization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Audio & Note Mappings Section */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl space-y-5 border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 border-b border-white/10 pb-3">
              <Music className="w-5 h-5" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Note Scale Mapping</h2>
            </div>

            <div className="space-y-3">
              {Object.values(NOTE_SCALES).map((scale) => {
                const isSelected = settings.noteScaleId === scale.id;
                return (
                  <button
                    key={scale.id}
                    onClick={() => updateSettings({ noteScaleId: scale.id })}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-md'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{scale.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{scale.description}</p>
                  </button>
                );
              })}
            </div>

            {/* Octave Transpose */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Octave Offset</label>
              <div className="flex gap-2">
                {[-1, 0, 1].map((oct) => (
                  <button
                    key={oct}
                    onClick={() => updateSettings({ octaveOffset: oct })}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      settings.octaveOffset === oct
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {oct === 0 ? 'Standard (0)' : `${oct > 0 ? '+' : ''}${oct} Octave`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sound Presets */}
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl space-y-5 border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 text-violet-400 border-b border-white/10 pb-3">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Audio Synth Presets</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(AUDIO_PRESETS) as PresetType[]).map((pKey) => {
                const preset = AUDIO_PRESETS[pKey];
                const isSelected = settings.activePreset === pKey;
                return (
                  <button
                    key={pKey}
                    onClick={() => handlePresetSelect(pKey)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500/50 text-white shadow-md'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-200">{preset.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{preset.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Camera & Gesture Vision Section */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl space-y-5 border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 border-b border-white/10 pb-3">
              <Camera className="w-5 h-5" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Camera & Vision Settings</h2>
            </div>

            {/* Mirror Camera */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <div className="text-xs font-bold text-slate-200">Mirror Webcam View</div>
                <div className="text-[11px] text-slate-400">Flips video horizontally for intuitive mirror reflection</div>
              </div>
              <input
                type="checkbox"
                checked={settings.mirrorCamera}
                onChange={(e) => updateSettings({ mirrorCamera: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {/* Resolution */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Webcam Resolution</label>
              <div className="flex gap-2">
                {['640x480', '1280x720'].map((res) => (
                  <button
                    key={res}
                    onClick={() => updateSettings({ cameraResolution: res as any })}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      settings.cameraResolution === res
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {res === '640x480' ? 'Standard (480p)' : 'High Def (720p)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Landmarks Overlay */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <div className="text-xs font-bold text-slate-200">Show Hand Landmarks Overlay</div>
                <div className="text-[11px] text-slate-400">Draw 21 skeleton joints and glowing fingertips on video</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showLandmarksOnVideo}
                onChange={(e) => updateSettings({ showLandmarksOnVideo: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* AI Detection Stability Section */}
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl space-y-5 border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 border-b border-white/10 pb-3">
              <Cpu className="w-5 h-5" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Gesture Stabilization</h2>
            </div>

            {/* Stabilization Buffer Frames */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Stabilization Frames (Hysteresis Window)</span>
                <span className="text-cyan-400 font-mono">{settings.stabilizationFrames} frames</span>
              </div>
              <input
                type="range"
                min="2"
                max="8"
                step="1"
                value={settings.stabilizationFrames}
                onChange={(e) => updateSettings({ stabilizationFrames: parseInt(e.target.value, 10) })}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Higher frames = smoother, zero flicker. Lower frames = instant reaction speed.
              </p>
            </div>

            {/* Confidence Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Minimum Detection Confidence</span>
                <span className="text-cyan-400 font-mono">{Math.round(settings.minDetectionConfidence * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="0.8"
                step="0.05"
                value={settings.minDetectionConfidence}
                onChange={(e) => updateSettings({ minDetectionConfidence: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
