import { averageRGB } from "./colourUtils";

export function extractSkinColor(imageElement, landmarks) {
  if (!imageElement) {
    throw new Error("Image element not found.");
  }

  if (!landmarks || landmarks.length === 0) {
    throw new Error("No face detected.");
  }

  const face = landmarks[0];

  const xs = face.map(point => point.x);
  const ys = face.map(point => point.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const imageWidth = imageElement.naturalWidth;
  const imageHeight = imageElement.naturalHeight;

  console.log("Image dimensions:", imageWidth, imageHeight);
  console.log("Face center:", centerX, centerY);

  if (!imageWidth || !imageHeight) {
    throw new Error("Image dimensions are not available.");
  }

  const canvas = document.createElement("canvas");

  const size = 80;

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context.");
  }

  /*
   * Take a smaller region around the center
   * of the detected face.
   */
  const cropWidth = imageWidth * 0.12;
  const cropHeight = imageHeight * 0.12;

  let sourceX =
    centerX * imageWidth - cropWidth / 2;

  let sourceY =
    centerY * imageHeight - cropHeight / 2;

  /*
   * Keep the crop inside the image.
   */
  sourceX = Math.max(
    0,
    Math.min(sourceX, imageWidth - cropWidth)
  );

  sourceY = Math.max(
    0,
    Math.min(sourceY, imageHeight - cropHeight)
  );

  console.log("Crop:", {
    sourceX,
    sourceY,
    cropWidth,
    cropHeight
  });

  ctx.drawImage(
    imageElement,
    sourceX,
    sourceY,
    cropWidth,
    cropHeight,
    0,
    0,
    size,
    size
  );

  const imageData = ctx.getImageData(
    0,
    0,
    size,
    size
  );

  console.log(
    "First pixel:",
    imageData.data[0],
    imageData.data[1],
    imageData.data[2],
    imageData.data[3]
  );

  const rgb = averageRGB(imageData);

  console.log("Extracted RGB:", rgb);

  return rgb;
}