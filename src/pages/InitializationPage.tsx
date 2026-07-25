import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { HandTrackerManager } from '../mediapipe/handTracker';
import { AudioEngine } from '../audio/audioEngine';

export const InitializationPage: React.FC = () => {
  const { setCurrentRoute, updateTrackingState, updateAudioMetrics, settings } = useAppStore();

  const [step, setStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stepsList = [
    'Requesting Camera Access Permission...',
    'Loading AI Vision Models (MediaPipe WASM)...',
    'Initializing Tone.js Web Audio Synthesizer...',
    'Calibrating Low-Latency Engine...',
    'Ready!',
  ];

  const startInitialization = async () => {
    setErrorMsg(null);
    setStep(0);

    try {
      // 1. Camera permission check
      setStep(0);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: settings.cameraResolution === '1280x720' ? 1280 : 640 },
          height: { ideal: settings.cameraResolution === '1280x720' ? 720 : 480 },
          frameRate: { ideal: 30 },
        },
      });

      // Stop temporary test stream so the main page video component can acquire it cleanly
      stream.getTracks().forEach((track) => track.stop());

      // 2. Load MediaPipe HandLandmarker
      setStep(1);
      const trackerManager = new HandTrackerManager();
      const visionLoaded = await trackerManager.initialize(settings.minDetectionConfidence);

      if (!visionLoaded) {
        throw new Error('Failed to initialize MediaPipe HandLandmarker vision models.');
      }
      updateTrackingState({ isModelLoaded: true });

      // 3. Initialize Audio Engine
      setStep(2);
      const audioEngine = AudioEngine.getInstance();
      const audioLoaded = await audioEngine.start();
      if (!audioLoaded) {
        throw new Error('Failed to initialize Tone.js Web Audio context.');
      }
      audioEngine.setPreset(settings.activePreset);
      updateAudioMetrics({ isAudioStarted: true, isMuted: false });

      // 4. Calibration
      setStep(3);
      await new Promise((resolve) => setTimeout(resolve, 600));

      setStep(4);
      await new Promise((resolve) => setTimeout(resolve, 400));

      // 5. Navigate to play page
      setCurrentRoute('play');
    } catch (err: any) {
      console.error('Initialization error:', err);
      setErrorMsg(err.message || 'Camera permission denied or browser web worker error.');
    }
  };

  useEffect(() => {
    startInitialization();
  }, []);

  return (
    <div className="min-h-[calc(100vh-5rem)] text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center space-y-6 relative z-10 shadow-2xl"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 p-0.5 mx-auto shadow-xl shadow-indigo-500/30">
          <div className="w-full h-full bg-[#020205] rounded-[14px] flex items-center justify-center">
            {errorMsg ? (
              <AlertCircle className="w-8 h-8 text-rose-500" />
            ) : step === 4 ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : (
              <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Initializing Hand Symphony</h2>
          <p className="text-xs text-slate-400 mt-1">Calibrating real-time vision & synth audio engines</p>
        </div>

        {!errorMsg ? (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((step + 1) / stepsList.length) * 100}%` }}
              />
            </div>

            {/* Steps Checklist */}
            <div className="space-y-2 text-left text-xs">
              {stepsList.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${
                    idx === step
                      ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold'
                      : idx < step
                      ? 'text-emerald-400 bg-emerald-500/5'
                      : 'text-slate-500'
                  }`}
                >
                  {idx < step ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : idx === step ? (
                    <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                  )}
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <strong>Error:</strong> {errorMsg}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Please ensure camera permissions are allowed in your browser address bar and your device supports Web Audio.
            </p>
            <button
              onClick={startInitialization}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Retry Initialization
            </button>
          </div>
        )}

        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Webcam stream processed client-side only</span>
        </div>
      </motion.div>
    </div>
  );
};
