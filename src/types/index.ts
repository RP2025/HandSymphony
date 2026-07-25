export type PageRoute = 'landing' | 'init' | 'play' | 'settings' | 'help';

export interface NoteScale {
  id: string;
  name: string;
  description: string;
  notes: Record<number, { note: string; freq: number }>;
}

export type PresetType = 'ambient' | 'cyberpunk' | 'arcade' | 'classical' | 'cosmic';

export interface SoundLayerConfig {
  id: number;
  name: string;
  oscillatorType: 'sine' | 'triangle' | 'square' | 'sawtooth' | 'fm';
  description: string;
  color: string; // Tailwind color string, e.g., 'emerald'
  accentHex: string; // Hex for canvas & glows
  volume: number; // dB
  filterFreq: number; // Hz
}

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface DetectedHand {
  handedness: 'Left' | 'Right';
  fingerCount: number;
  extendedFingers: boolean[]; // [thumb, index, middle, ring, pinky]
  confidence: number;
  landmarks: HandLandmark[];
}

export interface HandTrackingState {
  leftHand: DetectedHand | null;
  rightHand: DetectedHand | null;
  fps: number;
  isModelLoaded: boolean;
  isCameraActive: boolean;
  cameraError: string | null;
}

export interface AudioEngineMetrics {
  activeNote: string;
  activeFreq: number;
  activeLayersCount: number;
  isAudioStarted: boolean;
  isMuted: boolean;
  masterVolume: number; // dB (-60 to +6)
  selectedPreset: PresetType;
}

export interface AppSettings {
  mirrorCamera: boolean;
  cameraResolution: '640x480' | '1280x720';
  minDetectionConfidence: number; // 0.1 to 0.9
  stabilizationFrames: number; // 2 to 10
  keyboardFallback: boolean;
  noteScaleId: string;
  octaveOffset: number; // -1, 0, +1
  showLandmarksOnVideo: boolean;
  showSkeleton3D: boolean;
  activePreset: PresetType;
}

export interface RecordingState {
  isRecording: boolean;
  durationSeconds: number;
  audioBlobUrl: string | null;
}
