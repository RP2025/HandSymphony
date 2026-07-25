import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { HandTrackerManager } from '../mediapipe/handTracker';
import { AudioEngine } from '../audio/audioEngine';
import { LandmarkCanvas } from '../components/visualization/LandmarkCanvas';
import { WaveformVisualizer } from '../components/visualization/WaveformVisualizer';
import { PianoVisualizer } from '../components/visualization/PianoVisualizer';
import { LayerStatusBadge } from '../components/visualization/LayerStatusBadge';
import { LiveMetricsBar } from '../components/play/LiveMetricsBar';
import { PerformanceRecorder } from '../components/play/PerformanceRecorder';
import { KeyboardFallback } from '../components/play/KeyboardFallback';

import { Camera, CameraOff, Maximize2, Minimize2, RefreshCw, Sliders, Volume2, VolumeX, Hand, HelpCircle } from 'lucide-react';

export const MusicPage: React.FC = () => {
  const {
    trackingState,
    updateTrackingState,
    audioMetrics,
    updateAudioMetrics,
    stabilizedLeftCount,
    stabilizedRightCount,
    setGestures,
    settings,
    updateSettings,
    setCurrentRoute,
  } = useAppStore();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const trackerManagerRef = useRef<HandTrackerManager | null>(null);

  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [manualLeft, setManualLeft] = useState<number>(0);
  const [manualRight, setManualRight] = useState<number>(0);

  // Video container dimension tracking for canvas overlay
  const [containerDim, setContainerDim] = useState({ width: 640, height: 480 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ResizeObserver for canvas dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerDim({
            width: Math.round(entry.contentRect.width),
            height: Math.round(entry.contentRect.height),
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize Camera Stream & Hand Tracking Loop
  useEffect(() => {
    let localStream: MediaStream | null = null;
    let tracker: HandTrackerManager | null = null;

    const setupCameraAndTracker = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: settings.cameraResolution === '1280x720' ? 1280 : 640 },
            height: { ideal: settings.cameraResolution === '1280x720' ? 720 : 480 },
            frameRate: { ideal: 30 },
          },
        });

        localStream = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        tracker = new HandTrackerManager();
        trackerManagerRef.current = tracker;

        const isOk = await tracker.initialize(settings.minDetectionConfidence);
        if (isOk && videoRef.current) {
          tracker.setStabilizationFrames(settings.stabilizationFrames);

          tracker.startTracking(
            videoRef.current,
            (leftHand, rightHand, stabLeft, stabRight, fps) => {
              updateTrackingState({
                leftHand,
                rightHand,
                fps,
                isCameraActive: true,
              });

              // Apply gesture outcome to store and audio engine
              setGestures(stabLeft, stabRight);

              const engine = AudioEngine.getInstance();
              engine.updateGestureState(stabLeft, stabRight, settings.noteScaleId, settings.octaveOffset);

              const status = engine.getStatus();
              updateAudioMetrics({
                activeNote: status.activeNote,
                activeFreq: status.activeFreq,
                activeLayersCount: status.activeLayersCount,
              });
            }
          );
        }
      } catch (err: any) {
        console.error('Camera access error in MusicPage:', err);
        updateTrackingState({ isCameraActive: false, cameraError: err.message });
        setIsCameraActive(false);
      }
    };

    if (isCameraActive) {
      setupCameraAndTracker();
    }

    return () => {
      if (tracker) tracker.dispose();
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraActive, settings.cameraResolution, settings.minDetectionConfidence, settings.stabilizationFrames]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleMuteToggle = () => {
    const newMute = !audioMetrics.isMuted;
    AudioEngine.getInstance().setMute(newMute);
    updateAudioMetrics({ isMuted: newMute });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] text-slate-200 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>Live Gesture Performance</span>
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {settings.noteScaleId.toUpperCase()} SCALE
              </span>
            </h1>
            <p className="text-xs text-slate-400">Move both hands in front of your camera to conduct sound live</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio Mute Toggle */}
          <button
            onClick={handleMuteToggle}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              audioMetrics.isMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            {audioMetrics.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{audioMetrics.isMuted ? 'Muted' : 'Audio On'}</span>
          </button>

          {/* Camera Toggle */}
          <button
            onClick={() => setIsCameraActive(!isCameraActive)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isCameraActive
                ? 'bg-white/5 border-white/10 text-slate-200 hover:text-white hover:bg-white/10'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {isCameraActive ? <Camera className="w-4 h-4" /> : <CameraOff className="w-4 h-4" />}
            <span>{isCameraActive ? 'Camera Active' : 'Camera Paused'}</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => setCurrentRoute('settings')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
            title="Open Audio & Vision Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Help */}
          <button
            onClick={() => setCurrentRoute('help')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
            title="Hand Gesture Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Live Metrics Header Bar */}
      <LiveMetricsBar
        trackingState={trackingState}
        audioMetrics={audioMetrics}
        stabilizedLeft={stabilizedLeftCount}
        stabilizedRight={stabilizedRightCount}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Camera Preview Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div
            ref={containerRef}
            className="relative w-full aspect-video rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl flex items-center justify-center bg-zinc-950"
          >
            {isCameraActive ? (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${settings.mirrorCamera ? 'scale-x-[-1]' : ''}`}
                />
                <LandmarkCanvas
                  trackingState={trackingState}
                  settings={settings}
                  stabilizedLeftCount={stabilizedLeftCount}
                  stabilizedRightCount={stabilizedRightCount}
                  width={containerDim.width}
                  height={containerDim.height}
                />
              </>
            ) : (
              <div className="text-center p-8 space-y-3">
                <CameraOff className="w-12 h-12 text-zinc-600 mx-auto" />
                <div className="text-sm font-semibold text-zinc-400">Camera Feed Paused</div>
                <button
                  onClick={() => setIsCameraActive(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition-colors"
                >
                  Turn On Camera
                </button>
              </div>
            )}

            {/* Hand Roles Quick Banner Overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none z-20">
              <div className="px-3 py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <Hand className="w-3.5 h-3.5" />
                <span>LEFT: Sound Layers ({stabilizedLeftCount}🖐️)</span>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-violet-500/30 text-violet-400 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <Hand className="w-3.5 h-3.5" />
                <span>RIGHT: Pitch ({stabilizedRightCount}🖐️)</span>
              </div>
            </div>
          </div>

          {/* Signal Waveform Visualizer */}
          <WaveformVisualizer />
        </div>

        {/* Right Dashboard Column (1 Col) */}
        <div className="space-y-6">
          {/* Active Sound Layers (Left Hand) */}
          <LayerStatusBadge activeLayersCount={stabilizedLeftCount} />

          {/* Mini Piano Pitch Visualizer (Right Hand) */}
          <PianoVisualizer
            activeNote={audioMetrics.activeNote}
            activeFingerCount={stabilizedRightCount}
            scaleId={settings.noteScaleId}
            octaveOffset={settings.octaveOffset}
          />

          {/* Performance Recorder */}
          <PerformanceRecorder />
        </div>
      </div>

      {/* Manual Test Fallback Toolbar */}
      <KeyboardFallback
        manualLeft={manualLeft}
        manualRight={manualRight}
        onSetManualGestures={(l, r) => {
          setManualLeft(l);
          setManualRight(r);
          setGestures(l, r);
        }}
      />
    </div>
  );
};
