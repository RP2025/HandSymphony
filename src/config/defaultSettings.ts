import { NoteScale, SoundLayerConfig, PresetType, AppSettings } from '../types';

export const NOTE_SCALES: Record<string, NoteScale> = {
  major: {
    id: 'major',
    name: 'Major Pentatonic (Warm & Harmonious)',
    description: '1=C4, 2=D4, 3=E4, 4=F4, 5=G4 - Ideal for bright uplifting melodies',
    notes: {
      1: { note: 'C4', freq: 261.63 },
      2: { note: 'D4', freq: 293.66 },
      3: { note: 'E4', freq: 329.63 },
      4: { note: 'F4', freq: 349.23 },
      5: { note: 'G4', freq: 392.00 },
    },
  },
  synthwave: {
    id: 'synthwave',
    name: 'Synthwave Minor (Futuristic & Moody)',
    description: '1=A3, 2=C4, 3=D4, 4=E4, 5=G4 - Retro-futuristic cyberpunk vibe',
    notes: {
      1: { note: 'A3', freq: 220.00 },
      2: { note: 'C4', freq: 261.63 },
      3: { note: 'D4', freq: 293.66 },
      4: { note: 'E4', freq: 329.63 },
      5: { note: 'G4', freq: 392.00 },
    },
  },
  oriental: {
    id: 'oriental',
    name: 'Japanese Hirajoshi (Exotic & Meditative)',
    description: '1=C4, 2=Db4, 3=F4, 4=Gb4, 5=Bb4 - Deep meditative soundscape',
    notes: {
      1: { note: 'C4', freq: 261.63 },
      2: { note: 'C#4', freq: 277.18 },
      3: { note: 'F4', freq: 349.23 },
      4: { note: 'F#4', freq: 369.99 },
      5: { note: 'A#4', freq: 466.16 },
    },
  },
  extended: {
    id: 'extended',
    name: 'Full Diatonic Major (C4 to A4)',
    description: '1=C4, 2=E4, 3=G4, 4=A4, 5=C5 - Wide melodic expression',
    notes: {
      1: { note: 'C4', freq: 261.63 },
      2: { note: 'E4', freq: 329.63 },
      3: { note: 'G4', freq: 392.00 },
      4: { note: 'A4', freq: 440.00 },
      5: { note: 'C5', freq: 523.25 },
    },
  },
};

export const SOUND_LAYERS: SoundLayerConfig[] = [
  {
    id: 1,
    name: 'Layer 1: Silk Sine',
    oscillatorType: 'sine',
    description: 'Pure, fundamental sub-wave providing a smooth bass foundation.',
    color: 'emerald',
    accentHex: '#10b981',
    volume: 0,
    filterFreq: 1200,
  },
  {
    id: 2,
    name: 'Layer 2: Soft Triangle',
    oscillatorType: 'triangle',
    description: 'Warm, rounded overtone layer adding body and organic acoustic warmth.',
    color: 'cyan',
    accentHex: '#06b6d4',
    volume: -2,
    filterFreq: 2400,
  },
  {
    id: 3,
    name: 'Layer 3: Punchy Pulse',
    oscillatorType: 'square',
    description: 'Rich square pulse with mild chorus for vintage synth pad brightness.',
    color: 'indigo',
    accentHex: '#6366f1',
    volume: -4,
    filterFreq: 3500,
  },
  {
    id: 4,
    name: 'Layer 4: Resonant Saw',
    oscillatorType: 'sawtooth',
    description: 'Harmonically intense saw wave providing presence, bite, and synth lead power.',
    color: 'violet',
    accentHex: '#8b5cf6',
    volume: -6,
    filterFreq: 4800,
  },
  {
    id: 5,
    name: 'Layer 5: Shimmer FM',
    oscillatorType: 'fm',
    description: 'Complex Frequency Modulation texture with delicate bell-like shimmer.',
    color: 'fuchsia',
    accentHex: '#d946ef',
    volume: -5,
    filterFreq: 8000,
  },
];

export const AUDIO_PRESETS: Record<PresetType, { name: string; description: string; masterGain: number; reverbRoom: number }> = {
  ambient: {
    name: 'Ambient Zen',
    description: 'Lush reverb, soft attack, smooth soothing soundscape.',
    masterGain: -3,
    reverbRoom: 0.7,
  },
  cyberpunk: {
    name: 'Cyberpunk Synth',
    description: 'Edgy, filtered drive with punchy attack and space delay.',
    masterGain: -2,
    reverbRoom: 0.4,
  },
  arcade: {
    name: '8-Bit Arcade',
    description: 'Crisp vintage chiptune leads with immediate key response.',
    masterGain: -4,
    reverbRoom: 0.2,
  },
  classical: {
    name: 'Acoustic Warmth',
    description: 'Natural organic resonant resonance mimicking orchestral instruments.',
    masterGain: -3,
    reverbRoom: 0.5,
  },
  cosmic: {
    name: 'Cosmic Pad',
    description: 'Ethereal wide stereo sound with shimmering feedback delay.',
    masterGain: -3,
    reverbRoom: 0.8,
  },
};

export const DEFAULT_SETTINGS: AppSettings = {
  mirrorCamera: true,
  cameraResolution: '640x480',
  minDetectionConfidence: 0.5,
  stabilizationFrames: 4,
  keyboardFallback: true,
  noteScaleId: 'major',
  octaveOffset: 0,
  showLandmarksOnVideo: true,
  showSkeleton3D: false,
  activePreset: 'ambient',
};
