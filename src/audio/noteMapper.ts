import { NOTE_SCALES } from '../config/defaultSettings';

export interface NoteInfo {
  note: string;
  freq: number;
}

export function getNoteForFingerCount(fingerCount: number, scaleId = 'major', octaveOffset = 0): NoteInfo | null {
  if (fingerCount < 1 || fingerCount > 5) {
    return null;
  }

  const scale = NOTE_SCALES[scaleId] || NOTE_SCALES['major'];
  const noteData = scale.notes[fingerCount];

  if (!noteData) return null;

  if (octaveOffset === 0) {
    return noteData;
  }

  // Parse note name e.g. "C4" -> "C" + (4 + octaveOffset)
  const match = noteData.note.match(/^([A-G]#?)(\d+)$/);
  if (!match) return noteData;

  const letter = match[1];
  const octave = parseInt(match[2], 10) + octaveOffset;
  const transposedNote = `${letter}${octave}`;
  const transposedFreq = noteData.freq * Math.pow(2, octaveOffset);

  return {
    note: transposedNote,
    freq: transposedFreq,
  };
}
