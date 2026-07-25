import { create } from 'zustand';
import { PageRoute, AppSettings, HandTrackingState, AudioEngineMetrics, RecordingState, DetectedHand } from '../types';
import { DEFAULT_SETTINGS } from '../config/defaultSettings';

interface AppStoreState {
  currentRoute: PageRoute;
  setCurrentRoute: (route: PageRoute) => void;

  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // Hand tracking state
  trackingState: HandTrackingState;
  updateTrackingState: (state: Partial<HandTrackingState>) => void;

  // Real-time gesture outcomes
  rawLeftCount: number;
  rawRightCount: number;
  stabilizedLeftCount: number; // 0..5 (Layer activation)
  stabilizedRightCount: number; // 0..5 (Note selection)
  setGestures: (left: number, right: number, rawLeft?: number, rawRight?: number) => void;

  // Audio status
  audioMetrics: AudioEngineMetrics;
  updateAudioMetrics: (metrics: Partial<AudioEngineMetrics>) => void;

  // Performance recording
  recordingState: RecordingState;
  updateRecordingState: (state: Partial<RecordingState>) => void;

  // Active initialization step text
  initProgressMessage: string;
  setInitProgressMessage: (msg: string) => void;
  initProgressPercent: number;
  setInitProgressPercent: (pct: number) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  currentRoute: 'landing',
  setCurrentRoute: (route) => set({ currentRoute: route }),

  settings: DEFAULT_SETTINGS,
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  trackingState: {
    leftHand: null,
    rightHand: null,
    fps: 0,
    isModelLoaded: false,
    isCameraActive: false,
    cameraError: null,
  },
  updateTrackingState: (newState) =>
    set((state) => ({
      trackingState: { ...state.trackingState, ...newState },
    })),

  rawLeftCount: 0,
  rawRightCount: 0,
  stabilizedLeftCount: 0,
  stabilizedRightCount: 0,
  setGestures: (left, right, rawLeft, rawRight) =>
    set({
      stabilizedLeftCount: left,
      stabilizedRightCount: right,
      rawLeftCount: rawLeft !== undefined ? rawLeft : left,
      rawRightCount: rawRight !== undefined ? rawRight : right,
    }),

  audioMetrics: {
    activeNote: 'Muted',
    activeFreq: 0,
    activeLayersCount: 0,
    isAudioStarted: false,
    isMuted: false,
    masterVolume: 0,
    selectedPreset: 'ambient',
  },
  updateAudioMetrics: (newMetrics) =>
    set((state) => ({
      audioMetrics: { ...state.audioMetrics, ...newMetrics },
    })),

  recordingState: {
    isRecording: false,
    durationSeconds: 0,
    audioBlobUrl: null,
  },
  updateRecordingState: (newRecState) =>
    set((state) => ({
      recordingState: { ...state.recordingState, ...newRecState },
    })),

  initProgressMessage: 'Ready to initialize...',
  setInitProgressMessage: (msg) => set({ initProgressMessage: msg }),
  initProgressPercent: 0,
  setInitProgressPercent: (pct) => set({ initProgressPercent: pct }),
}));
