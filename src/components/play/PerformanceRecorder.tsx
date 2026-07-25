import React, { useEffect, useState } from 'react';
import { Disc, Square, Download, Play, Trash2 } from 'lucide-react';
import { AudioEngine } from '../../audio/audioEngine';
import { useAppStore } from '../../store/useAppStore';
import { formatDuration } from '../../utils/formatters';

export const PerformanceRecorder: React.FC = () => {
  const { recordingState, updateRecordingState } = useAppStore();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (recordingState.isRecording) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [recordingState.isRecording]);

  const handleStartRecording = () => {
    const success = AudioEngine.getInstance().startRecording();
    if (success) {
      updateRecordingState({
        isRecording: true,
        durationSeconds: 0,
        audioBlobUrl: null,
      });
    }
  };

  const handleStopRecording = async () => {
    const url = await AudioEngine.getInstance().stopRecording();
    updateRecordingState({
      isRecording: false,
      durationSeconds: seconds,
      audioBlobUrl: url,
    });
  };

  const handleClearRecording = () => {
    if (recordingState.audioBlobUrl) {
      URL.revokeObjectURL(recordingState.audioBlobUrl);
    }
    updateRecordingState({
      isRecording: false,
      durationSeconds: 0,
      audioBlobUrl: null,
    });
  };

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
            recordingState.isRecording
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse'
              : 'bg-zinc-900 border-white/5 text-zinc-400'
          }`}
        >
          <Disc className={`w-4 h-4 ${recordingState.isRecording ? 'animate-spin' : ''}`} />
        </div>
        <div>
          <div className="text-xs font-semibold text-zinc-200">Session Performance Recorder</div>
          <div className="text-[10px] text-zinc-400">
            {recordingState.isRecording ? (
              <span className="text-rose-400 font-mono font-bold animate-pulse">
                REC ● {formatDuration(seconds)}
              </span>
            ) : recordingState.audioBlobUrl ? (
              <span className="text-emerald-400 font-medium">Recording Saved ({formatDuration(recordingState.durationSeconds)})</span>
            ) : (
              'Capture your live hand symphony performance'
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!recordingState.isRecording ? (
          <button
            onClick={handleStartRecording}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all"
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            onClick={handleStopRecording}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all"
          >
            <Square className="w-3.5 h-3.5 fill-rose-400" />
            <span>Stop Recording</span>
          </button>
        )}

        {recordingState.audioBlobUrl && (
          <>
            <audio src={recordingState.audioBlobUrl} controls className="h-8 max-w-[180px] rounded" />
            <a
              href={recordingState.audioBlobUrl}
              download={`hand-symphony-${Date.now()}.webm`}
              className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
              title="Download Recorded Audio"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={handleClearRecording}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-white/5 transition-colors"
              title="Discard Recording"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
