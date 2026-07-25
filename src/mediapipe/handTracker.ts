import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { analyzeFingers } from '../utils/fingerCounter';
import { GestureStabilizer } from '../utils/gestureStabilizer';
import { DetectedHand, HandLandmark } from '../types';

export class HandTrackerManager {
  private handLandmarker: HandLandmarker | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private animFrameId: number | null = null;
  private lastVideoTime = -1;

  private leftStabilizer = new GestureStabilizer(4);
  private rightStabilizer = new GestureStabilizer(4);

  private onResultsCallback: ((
    leftHand: DetectedHand | null,
    rightHand: DetectedHand | null,
    stabilizedLeft: number,
    stabilizedRight: number,
    fps: number
  ) => void) | null = null;

  private frameCount = 0;
  private lastFpsCalcTime = performance.now();
  private currentFps = 0;

  public async initialize(minConfidence = 0.5): Promise<boolean> {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );

      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
        minHandDetectionConfidence: minConfidence,
        minHandPresenceConfidence: minConfidence,
        minTrackingConfidence: minConfidence,
      });

      return true;
    } catch (err) {
      console.warn('GPU delegate failed or initial CDN loading issue, trying CPU fallback:', err);
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'CPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: minConfidence,
          minHandPresenceConfidence: minConfidence,
          minTrackingConfidence: minConfidence,
        });
        return true;
      } catch (cpuErr) {
        console.error('Failed to load MediaPipe HandLandmarker:', cpuErr);
        return false;
      }
    }
  }

  public setStabilizationFrames(frames: number) {
    this.leftStabilizer.setBufferSize(frames);
    this.rightStabilizer.setBufferSize(frames);
  }

  public startTracking(
    video: HTMLVideoElement,
    callback: (
      leftHand: DetectedHand | null,
      rightHand: DetectedHand | null,
      stabilizedLeft: number,
      stabilizedRight: number,
      fps: number
    ) => void
  ) {
    this.videoElement = video;
    this.onResultsCallback = callback;
    this.processFrame();
  }

  private processFrame = () => {
    if (!this.videoElement || !this.handLandmarker) return;

    if (this.videoElement.currentTime !== this.lastVideoTime && this.videoElement.readyState >= 2) {
      this.lastVideoTime = this.videoElement.currentTime;
      const startTimeMs = performance.now();

      // Run MediaPipe detection
      const results = this.handLandmarker.detectForVideo(this.videoElement, startTimeMs);

      // FPS Calculation
      this.frameCount++;
      const now = performance.now();
      if (now - this.lastFpsCalcTime >= 1000) {
        this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsCalcTime));
        this.frameCount = 0;
        this.lastFpsCalcTime = now;
      }

      let detectedLeft: DetectedHand | null = null;
      let detectedRight: DetectedHand | null = null;

      if (results.landmarks && results.landmarks.length > 0) {
        results.landmarks.forEach((landmarks, index) => {
          const handednessCategory = results.handednesses?.[index]?.[0];
          // MediaPipe categoryName: 'Left' or 'Right'
          let side: 'Left' | 'Right' = (handednessCategory?.categoryName as 'Left' | 'Right') || 'Right';
          const score = handednessCategory?.score || 0.9;

          const analysis = analyzeFingers(landmarks as HandLandmark[], side);

          const handData: DetectedHand = {
            handedness: side,
            fingerCount: analysis.count,
            extendedFingers: analysis.extendedFingers,
            confidence: score,
            landmarks: landmarks as HandLandmark[],
          };

          if (side === 'Left') {
            detectedLeft = handData;
          } else {
            detectedRight = handData;
          }
        });
      }

      // Stabilize counts
      const stabLeft = this.leftStabilizer.update(detectedLeft ? (detectedLeft as DetectedHand).fingerCount : 0);
      const stabRight = this.rightStabilizer.update(detectedRight ? (detectedRight as DetectedHand).fingerCount : 0);

      if (this.onResultsCallback) {
        this.onResultsCallback(detectedLeft, detectedRight, stabLeft, stabRight, this.currentFps);
      }
    }

    this.animFrameId = requestAnimationFrame(this.processFrame);
  };

  public stopTracking() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  public dispose() {
    this.stopTracking();
    if (this.handLandmarker) {
      this.handLandmarker.close();
      this.handLandmarker = null;
    }
  }
}
