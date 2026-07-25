import * as Tone from 'tone';
import { SOUND_LAYERS } from '../config/defaultSettings';

export interface LayerInstance {
  id: number;
  synth: Tone.Synth<any> | Tone.FMSynth;
  filter: Tone.Filter;
  gainNode: Tone.Gain;
  active: boolean;
}

export class LayerManager {
  private layers: LayerInstance[] = [];
  private masterOutput: Tone.Gain;
  private currentNote: string | null = null;

  constructor(masterOutput: Tone.Gain) {
    this.masterOutput = masterOutput;
    this.initLayers();
  }

  private initLayers() {
    SOUND_LAYERS.forEach((cfg) => {
      const gainNode = new Tone.Gain(0).connect(this.masterOutput);
      const filter = new Tone.Filter({
        frequency: cfg.filterFreq,
        type: 'lowpass',
        rolloff: -12,
      }).connect(gainNode);

      let synth: Tone.Synth<any> | Tone.FMSynth;

      if (cfg.oscillatorType === 'fm') {
        synth = new Tone.FMSynth({
          harmonicity: 2.5,
          modulationIndex: 8,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.08, decay: 0.3, sustain: 0.9, release: 0.4 },
          modulation: { type: 'triangle' },
          modulationEnvelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.4 },
        }).connect(filter);
      } else {
        synth = new Tone.Synth({
          oscillator: { type: cfg.oscillatorType as any },
          envelope: {
            attack: 0.05,
            decay: 0.2,
            sustain: 0.9,
            release: 0.3,
          },
        }).connect(filter);
      }

      this.layers.push({
        id: cfg.id,
        synth,
        filter,
        gainNode,
        active: false,
      });
    });
  }

  /**
   * Sets the active cumulative layers based on left finger count (0 to 5)
   */
  public setCumulativeActiveLayers(activeCount: number) {
    const clampedCount = Math.max(0, Math.min(5, activeCount));

    this.layers.forEach((layer, index) => {
      const shouldBeActive = index < clampedCount;
      layer.active = shouldBeActive;

      // Target gain: 1.0 / sqrt(clampedCount) or proportional for balanced mix
      const targetGainVal = shouldBeActive ? 0.35 : 0;

      // Smooth gain ramp in 0.04s to avoid clicking
      layer.gainNode.gain.rampTo(targetGainVal, 0.04);
    });

    // If active count > 0 and we have a current note playing, trigger attack for newly activated layers
    if (clampedCount > 0 && this.currentNote) {
      this.playNote(this.currentNote);
    } else if (clampedCount === 0) {
      this.releaseAll();
    }
  }

  /**
   * Plays note across all active synth layers without recreating instances
   */
  public playNote(note: string) {
    if (this.currentNote === note) return; // Note unchanged
    this.currentNote = note;

    this.layers.forEach((layer) => {
      if (layer.active) {
        // Trigger attack or update pitch
        try {
          layer.synth.triggerAttack(note, Tone.now());
        } catch {
          // If already playing, update frequency smoothly
          if ('frequency' in layer.synth) {
            (layer.synth as any).frequency.setValueAtTime(note, Tone.now());
          }
        }
      }
    });
  }

  /**
   * Releases all notes gracefully
   */
  public releaseAll() {
    this.currentNote = null;
    this.layers.forEach((layer) => {
      try {
        layer.synth.triggerRelease(Tone.now());
      } catch {
        // ignore
      }
    });
  }

  /**
   * Updates individual layer parameter settings (filter frequency or volume)
   */
  public updateLayerConfig(layerId: number, filterFreq?: number) {
    const layer = this.layers.find((l) => l.id === layerId);
    if (layer && filterFreq !== undefined) {
      layer.filter.frequency.value = filterFreq;
    }
  }

  public dispose() {
    this.releaseAll();
    this.layers.forEach((layer) => {
      layer.synth.dispose();
      layer.filter.dispose();
      layer.gainNode.dispose();
    });
    this.layers = [];
  }
}
