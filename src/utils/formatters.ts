export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatFrequency(freq: number): string {
  if (!freq || freq <= 0) return '0 Hz';
  return `${freq.toFixed(1)} Hz`;
}

export function getFingerNames(extended: boolean[]): string[] {
  const names = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
  return names.filter((_, idx) => extended[idx]);
}
