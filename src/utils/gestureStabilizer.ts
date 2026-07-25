/**
 * Class that maintains rolling buffer of gesture detections
 * to prevent flickering and sudden single-frame spikes.
 */
export class GestureStabilizer {
  private history: number[] = [];
  private currentStabilized: number = 0;
  private bufferSize: number;

  constructor(bufferSize = 4) {
    this.bufferSize = bufferSize;
  }

  public setBufferSize(size: number) {
    this.bufferSize = Math.max(1, Math.min(10, size));
  }

  /**
   * Pushes raw detected count and returns stabilized majority value
   */
  public update(rawCount: number): number {
    this.history.push(rawCount);
    if (this.history.length > this.bufferSize) {
      this.history.shift();
    }

    // Count frequency of each gesture value in window
    const counts: Record<number, number> = {};
    let maxFreq = 0;
    let modeValue = rawCount;

    for (const val of this.history) {
      counts[val] = (counts[val] || 0) + 1;
      if (counts[val] > maxFreq) {
        maxFreq = counts[val];
        modeValue = val;
      }
    }

    // Require majority consensus before switching away from current state
    const requiredConsensus = Math.ceil(this.bufferSize * 0.5);
    if (maxFreq >= requiredConsensus) {
      this.currentStabilized = modeValue;
    }

    return this.currentStabilized;
  }

  public reset() {
    this.history = [];
    this.currentStabilized = 0;
  }
}
