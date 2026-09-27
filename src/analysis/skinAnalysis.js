import { averageRGB } from "./colourUtils";

/*
 * Extracts several skin regions from the face instead
 * of relying on one central crop.
 */
export function extractSkinColor(imageElement, landmarks) {
  if (!imageElement) {
    throw new Error("Image element not found.");
  }

  if (!landmarks || landmarks.length === 0) {
    throw new Error("No face detected.");
  }

  const face = landmarks[0];

  const imageWidth = imageElement.naturalWidth;
  const imageHeight = imageElement.naturalHeight;

  if (!imageWidth || !imageHeight) {
    throw new Error("Image dimensions are not available.");
  }

  /*
   * Find the bounding box of the face.
   */
  const xs = face.map(point => point.x);
  const ys = face.map(point => point.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const faceWidth = maxX - minX;
  const faceHeight = maxY - minY;

  /*
   * Multiple regions expressed relative to the face.
   *
   * These are approximate regions, not individual
   * MediaPipe landmark indices.
   */
  const regions = [
    {
      name: "leftCheek",
      x: minX + faceWidth * 0.27,
      y: minY + faceHeight * 0.58
    },

    {
      name: "rightCheek",
      x: minX + faceWidth * 0.73,
      y: minY + faceHeight * 0.58
    },

    {
      name: "forehead",
      x: minX + faceWidth * 0.50,
      y: minY + faceHeight * 0.25
    }
  ];

  const samples = [];

  for (const region of regions) {
    const rgb = sampleRegion(
      imageElement,
      region.x,
      region.y,
      faceWidth * imageWidth,
      faceHeight * imageHeight
    );

    if (rgb) {
      samples.push(rgb);

      console.log(
        `${region.name}:`,
        rgb
      );
    }
  }

  if (samples.length === 0) {
    throw new Error(
      "Could not obtain a valid skin sample."
    );
  }

  /*
   * Average the valid facial regions.
   */
  const r =
    samples.reduce(
      (sum, color) => sum + color.r,
      0
    ) / samples.length;

  const g =
    samples.reduce(
      (sum, color) => sum + color.g,
      0
    ) / samples.length;

  const b =
    samples.reduce(
      (sum, color) => sum + color.b,
      0
    ) / samples.length;

  const result = {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b)
  };

  console.log(
    "Combined skin RGB:",
    result
  );

  return result;
}


/*
 * Samples a small region around a normalized
 * face position.
 */
function sampleRegion(
  imageElement,
  normalizedX,
  normalizedY,
  faceWidthPixels,
  faceHeightPixels
) {
  const canvas = document.createElement("canvas");

  const size = 40;

  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const imageWidth = imageElement.naturalWidth;
  const imageHeight = imageElement.naturalHeight;

  const centerX =
    normalizedX * imageWidth;

  const centerY =
    normalizedY * imageHeight;

  /*
   * Keep the sample relatively small.
   */
  const cropWidth =
    Math.max(
      20,
      Math.min(
        faceWidthPixels * 0.18,
        imageWidth * 0.12
      )
    );

  const cropHeight =
    Math.max(
      20,
      Math.min(
        faceHeightPixels * 0.18,
        imageHeight * 0.12
      )
    );

  let sourceX =
    centerX - cropWidth / 2;

  let sourceY =
    centerY - cropHeight / 2;

  sourceX = Math.max(
    0,
    Math.min(
      sourceX,
      imageWidth - cropWidth
    )
  );

  sourceY = Math.max(
    0,
    Math.min(
      sourceY,
      imageHeight - cropHeight
    )
  );

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

  const imageData =
    ctx.getImageData(
      0,
      0,
      size,
      size
    );

  return averageRGB(imageData);
}
