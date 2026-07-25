import React, { useEffect, useRef } from 'react';
import { HandTrackingState, AppSettings } from '../../types';

interface LandmarkCanvasProps {
  trackingState: HandTrackingState;
  settings: AppSettings;
  stabilizedLeftCount: number;
  stabilizedRightCount: number;
  width: number;
  height: number;
}

// MediaPipe 21 Landmark connections for skeleton rendering
const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm connections
  [5, 9], [9, 13], [13, 17],
];

const FINGERTIP_INDICES = [4, 8, 12, 16, 20];

export const LandmarkCanvas: React.FC<LandmarkCanvasProps> = ({
  trackingState,
  settings,
  stabilizedLeftCount,
  stabilizedRightCount,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous frame
    ctx.clearRect(0, 0, width, height);

    if (!settings.showLandmarksOnVideo) return;

    const handsToDraw = [
      { hand: trackingState.leftHand, label: 'LEFT: LAYERS', count: stabilizedLeftCount, color: '#10b981' }, // Emerald
      { hand: trackingState.rightHand, label: 'RIGHT: PITCH', count: stabilizedRightCount, color: '#a855f7' }, // Violet
    ];

    handsToDraw.forEach(({ hand, label, count, color }) => {
      if (!hand || !hand.landmarks || hand.landmarks.length < 21) return;

      const landmarks = hand.landmarks;

      // Draw skeleton connections
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = color + 'aa'; // Semi-transparent line

      HAND_CONNECTIONS.forEach(([i, j]) => {
        const p1 = landmarks[i];
        const p2 = landmarks[j];

        const x1 = p1.x * width;
        const y1 = p1.y * height;
        const x2 = p2.x * width;
        const y2 = p2.y * height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Draw joint nodes
      landmarks.forEach((p, idx) => {
        const x = p.x * width;
        const y = p.y * height;

        const isTip = FINGERTIP_INDICES.includes(idx);
        const radius = isTip ? 6 : 3.5;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (isTip) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
        } else {
          ctx.fillStyle = color;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      });

      // Draw Hand Badge Overlay at Wrist (landmark 0)
      const wrist = landmarks[0];
      const wristX = wrist.x * width;
      const wristY = wrist.y * height;

      ctx.save();
      ctx.font = 'bold 12px Inter, system-ui, sans-serif';

      const badgeText = `${label} (${count}🖐️)`;
      const textMetrics = ctx.measureText(badgeText);
      const bgWidth = textMetrics.width + 20;
      const bgHeight = 26;

      const badgeX = Math.max(10, Math.min(width - bgWidth - 10, wristX - bgWidth / 2));
      const badgeY = Math.max(10, Math.min(height - bgHeight - 10, wristY + 20));

      // Draw Glass Pill Box
      ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, bgWidth, bgHeight, 13);
      ctx.fill();
      ctx.stroke();

      // Text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(badgeText, badgeX + 10, badgeY + 17);
      ctx.restore();
    });
  }, [trackingState, settings, stabilizedLeftCount, stabilizedRightCount, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`absolute inset-0 pointer-events-none z-10 w-full h-full object-cover ${
        settings.mirrorCamera ? 'scale-x-[-1]' : ''
      }`}
    />
  );
};
