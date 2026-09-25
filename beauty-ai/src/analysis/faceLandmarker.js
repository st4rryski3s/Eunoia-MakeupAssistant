import {
  FaceLandmarker,
  FilesetResolver
} from "@mediapipe/tasks-vision";

let faceLandmarker = null;

export async function initializeFaceLandmarker() {
  if (faceLandmarker) {
    return faceLandmarker;
  }

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(
    vision,
    {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
      },

      runningMode: "IMAGE",

      numFaces: 1
    }
  );

  return faceLandmarker;
}

export async function detectFace(imageElement) {
  const landmarker = await initializeFaceLandmarker();

  const result = landmarker.detect(imageElement);

  return result;
}