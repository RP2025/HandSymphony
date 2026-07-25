import { HandLandmark } from '../types';

export interface FingerAnalysis {
  count: number;
  extendedFingers: [boolean, boolean, boolean, boolean, boolean]; // [thumb, index, middle, ring, pinky]
}

/**
 * Calculates Euclidean distance between two 3D or 2D landmarks
 */
function dist(p1: HandLandmark, p2: HandLandmark): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Analyzes hand landmarks to accurately detect extended fingers.
 * Uses orientation-resilient distance ratios and joint angles.
 */
export function analyzeFingers(landmarks: HandLandmark[], handedness: 'Left' | 'Right'): FingerAnalysis {
  if (!landmarks || landmarks.length < 21) {
    return { count: 0, extendedFingers: [false, false, false, false, false] };
  }

  const wrist = landmarks[0];

  // Key joints for four main fingers
  const fingerJoints = [
    { tip: 8, pip: 6, mcp: 5 },   // Index
    { tip: 12, pip: 10, mcp: 9 },  // Middle
    { tip: 16, pip: 14, mcp: 13 }, // Ring
    { tip: 20, pip: 18, mcp: 17 }, // Pinky
  ];

  const extendedFingers: [boolean, boolean, boolean, boolean, boolean] = [false, false, false, false, false];

  // 1. Check Thumb (Index 0 in extendedFingers array)
  const thumbTip = landmarks[4];
  const thumbIp = landmarks[3];
  const thumbMcp = landmarks[2];
  const indexMcp = landmarks[5];
  const pinkyMcp = landmarks[17];

  // Distance from thumb tip to pinky base vs thumb IP to pinky base
  const thumbTipToPinky = dist(thumbTip, pinkyMcp);
  const thumbIpToPinky = dist(thumbIp, pinkyMcp);
  
  // Distance from wrist to thumb tip vs wrist to thumb MCP
  const wristToThumbTip = dist(wrist, thumbTip);
  const wristToThumbMcp = dist(wrist, thumbMcp);

  // Thumb is extended if its tip extends away from the palm center / pinky MCP
  const isThumbExtended = thumbTipToPinky > thumbIpToPinky * 1.15 && wristToThumbTip > wristToThumbMcp * 1.2;
  extendedFingers[0] = isThumbExtended;

  // 2. Check 4 Main Fingers (Index, Middle, Ring, Pinky)
  fingerJoints.forEach((j, index) => {
    const tip = landmarks[j.tip];
    const pip = landmarks[j.pip];
    const mcp = landmarks[j.mcp];

    const dTipWrist = dist(tip, wrist);
    const dPipWrist = dist(pip, wrist);

    // Primary test: Tip is further from wrist than PIP joint
    const isTipFurther = dTipWrist > dPipWrist * 1.12;

    // Secondary test: Tip height relative to MCP/PIP in normal upright palm
    const isVerticalExtended = tip.y < pip.y && pip.y < mcp.y + 0.05;

    // A finger is extended if distance ratio passes or vertical orientation matches
    const isExtended = isTipFurther || isVerticalExtended;
    extendedFingers[index + 1] = isExtended;
  });

  const count = extendedFingers.filter(Boolean).length;

  return {
    count,
    extendedFingers,
  };
}
