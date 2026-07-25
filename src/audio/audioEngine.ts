import * as Tone from 'tone';
import { LayerManager } from './layerManager';
import { getNoteForFingerCount } from './noteMapper';
import { AUDIO_PRESETS } from '../config/defaultSettings';
import { PresetType } from '../types';

export class AudioEngine {
  private static instance: AudioEngine | null = null;

  private isStarted = false;
  private isMuted = false;

  private masterGain!: Tone.Gain;
  private reverb!: Tone.Reverb;
  private delay!: Tone.FeedbackDelay;
  private limiter!: Tone.Limiter;
  private analyserWaveform!: Tone.Waveform;
  private analyserFft!: Tone.FFT;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  private layerManager!: LayerManager;
  private currentActiveNote: string = 'Muted';
  private currentActiveFreq: number = 0;
  private currentActiveLayersCount: number = 0;

  private constructor() {
    // Lazy setup on start()
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  /**
   * Initializes Web Audio context and Tone.js master signal graph
   */
  public async start(): Promise<boolean> {
    if (this.isStarted) return true;

    try {
      await Tone.start();

      // Master signal chain
      this.masterGain = new Tone.Gain(0.8);
      this.reverb = new Tone.Reverb({ decay: 2.5, wet: 0.35 });
      this.delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.25, wet: 0.2 });
      this.limiter = new Tone.Limiter(-1); // Prevent clipping

      this.analyserWaveform = new Tone.Waveform(512);
      this.analyserFft = new Tone.FFT(64);

      // Connect master graph
      this.masterGain
        .connect(this.delay)
        .connect(this.reverb)
        .connect(this.limiter);

      this.limiter.connect(Tone.Destination);
      this.limiter.connect(this.analyserWaveform);
      this.limiter.connect(this.analyserFft);

      // Create 5-layer synth manager
      this.layerManager = new LayerManager(this.masterGain);

      this.isStarted = true;
      return true;
    } catch (err) {
      console.error('Failed to initialize Audio Engine:', err);
      return false;
    }
  }

  /**
   * Updates state based on left hand (layers) and right hand (note)
   */
  public updateGestureState(leftCount: number, rightCount: number, scaleId = 'major', octaveOffset = 0) {
    if (!this.isStarted || this.isMuted) return;

    this.currentActiveLayersCount = Math.max(0, Math.min(5, leftCount));

    // 1. Update layers activation
    this.layerManager.setCumulativeActiveLayers(this.currentActiveLayersCount);

    // 2. If left hand is active (>= 1 finger), resolve right hand note
    if (this.currentActiveLayersCount > 0 && rightCount >= 1 && rightCount <= 5) {
      const noteInfo = getNoteForFingerCount(rightCount, scaleId, octaveOffset);
      if (noteInfo) {
        this.currentActiveNote = noteInfo.note;
        this.currentActiveFreq = noteInfo.freq;
        this.layerManager.playNote(noteInfo.note);
      }
    } else if (this.currentActiveLayersCount === 0 || rightCount === 0) {
      this.currentActiveNote = 'Muted';
      this.currentActiveFreq = 0;
      this.layerManager.releaseAll();
    }
  }

  /**
   * Sets audio preset (ambient, cyberpunk, etc.)
   */
  public setPreset(presetKey: PresetType) {
    if (!this.isStarted) return;
    const preset = AUDIO_PRESETS[presetKey];
    if (preset) {
      this.reverb.wet.rampTo(preset.reverbRoom, 0.1);
    }
  }

  /**
   * Toggles master audio mute
   */
  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.rampTo(muted ? 0 : 0.8, 0.05);
    }
    if (muted && this.layerManager) {
      this.layerManager.releaseAll();
    }
  }

  /**
   * Returns current waveform buffer for Canvas drawing
   */
  public getWaveformData(): Float32Array {
    if (!this.isStarted || !this.analyserWaveform) {
      return new Float32Array(128);
    }
    return this.analyserWaveform.getValue() as Float32Array;
  }

  /**
   * Returns current FFT frequency data for visualizer
   */
  public getFftData(): Float32Array {
    if (!this.isStarted || !this.analyserFft) {
      return new Float32Array(32);
    }
    return this.analyserFft.getValue() as Float32Array;
  }

  public getStatus() {
    return {
      isStarted: this.isStarted,
      isMuted: this.isMuted,
      activeNote: this.currentActiveNote,
      activeFreq: this.currentActiveFreq,
      activeLayersCount: this.currentActiveLayersCount,
    };
  }

  /**
   * Starts live audio stream recording
   */
  public startRecording(): boolean {
    if (!this.isStarted) return false;
    try {
      const destinationStream = Tone.getDestination().context.createMediaStreamDestination();
      Tone.getDestination().connect(destinationStream);

      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(destinationStream.stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '',
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      return true;
    } catch (e) {
      console.error('Error starting audio recording:', e);
      return false;
    }
  }

  /**
   * Stops live recording and returns recorded audio Blob URL
   */
  public async stopRecording(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        resolve(url);
      };

      this.mediaRecorder.stop();
    });
  }
}
