import {
  initializeFaceLandmarker
} from "./faceLandmarker";

import {
  extractSkinColor
} from "./skinAnalysis";

import {
  analyzeSkin
} from "./undertone";

export async function buildSkinProfile(imageElement) {
  const landmarker =
    await initializeFaceLandmarker();

  const detection =
    landmarker.detect(imageElement);

  if (
    !detection.faceLandmarks ||
    detection.faceLandmarks.length === 0
  ) {
    return {
      faceDetected: false,
      skinRGB: null,
      undertone: null
    };
  }

  const landmarks =
    detection.faceLandmarks;

  const skinRGB =
    extractSkinColor(
      imageElement,
      landmarks
    );

  const undertone =
    analyzeSkin(skinRGB);

  return {
    faceDetected: true,
    skinRGB,
    undertone
  };
}