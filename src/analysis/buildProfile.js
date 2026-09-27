import {
  initializeFaceLandmarker
} from "./faceLandmarker";

import {
  extractSkinColor
} from "./skinAnalysis";

import {
  analyzeSkin
} from "./undertone";


/*
 * ============================================================
 * MAIN SKIN PROFILE BUILDER
 * ============================================================
 *
 * Analysis flow:
 *
 * 1. Validate image
 * 2. Detect face
 * 3. Check face framing
 * 4. Check lighting around the face
 * 5. Extract skin RGB
 * 6. Analyse undertone
 *
 * Lighting is checked AFTER face detection so that the
 * background does not control the lighting decision.
 */
export async function buildSkinProfile(imageElement) {

  /*
   * ----------------------------------------------------------
   * STEP 1 — Validate image
   * ----------------------------------------------------------
   */

  if (!imageElement) {
    return {
      faceDetected: false,
      framingAcceptable: false,
      lightingAcceptable: false,

      lighting: {
        acceptable: false,
        reason: "image-unavailable",
        message:
          "Please take or upload a photo first."
      },

      framing: {
        acceptable: false,
        reason: "image-unavailable"
      },

      skinRGB: null,
      undertone: null
    };
  }


  /*
   * ----------------------------------------------------------
   * STEP 2 — Initialize MediaPipe FaceLandmarker
   * ----------------------------------------------------------
   */

  const landmarker =
    await initializeFaceLandmarker();


  /*
   * ----------------------------------------------------------
   * STEP 3 — Detect face
   * ----------------------------------------------------------
   */

  const detection =
    landmarker.detect(
      imageElement
    );


  /*
   * No face detected.
   */

  if (
    !detection.faceLandmarks ||
    detection.faceLandmarks.length === 0
  ) {
    return {
      faceDetected: false,
      framingAcceptable: false,
      lightingAcceptable: null,

      lighting: null,

      framing: {
        acceptable: false,
        reason: "no-face"
      },

      skinRGB: null,
      undertone: null
    };
  }


  /*
   * Get detected face landmarks.
   */

  const landmarks =
    detection.faceLandmarks;


  /*
   * ----------------------------------------------------------
   * STEP 4 — Check face framing
   * ----------------------------------------------------------
   */

  const framing =
    checkFaceFraming(
      imageElement,
      landmarks
    );


  if (!framing.acceptable) {
    return {
      faceDetected: true,
      framingAcceptable: false,
      lightingAcceptable: null,

      lighting: null,

      framing,

      skinRGB: null,
      undertone: null
    };
  }


  /*
   * ----------------------------------------------------------
   * STEP 5 — Check lighting around the face
   * ----------------------------------------------------------
   */

  const lighting =
    checkFaceLighting(
      imageElement,
      landmarks
    );


  if (!lighting.acceptable) {
    return {
      faceDetected: true,
      framingAcceptable: true,
      lightingAcceptable: false,

      lighting,

      framing,

      skinRGB: null,
      undertone: null
    };
  }


  /*
   * ----------------------------------------------------------
   * STEP 6 — Extract skin RGB
   * ----------------------------------------------------------
   */

  const skinRGB =
    extractSkinColor(
      imageElement,
      landmarks
    );


  /*
   * ----------------------------------------------------------
   * STEP 7 — Analyse skin
   * ----------------------------------------------------------
   */

  const undertone =
    analyzeSkin(
      skinRGB
    );


  /*
   * ----------------------------------------------------------
   * STEP 8 — Return complete profile
   * ----------------------------------------------------------
   */

  return {
    faceDetected: true,
    framingAcceptable: true,
    lightingAcceptable: true,

    lighting,

    framing,

    skinRGB,

    undertone
  };
}


/*
 * ============================================================
 * FACE LIGHTING CHECK
 * ============================================================
 *
 * This checks the actual area occupied by the face.
 *
 * We deliberately avoid using the entire photograph because
 * the background can contain:
 *
 * - white walls
 * - windows
 * - dark rooms
 * - lamps
 * - furniture
 * - shadows
 *
 * The lighting decision should primarily represent the face.
 */
function checkFaceLighting(
  imageElement,
  landmarks
) {

  if (
    !imageElement ||
    !landmarks ||
    landmarks.length === 0
  ) {
    return {
      acceptable: false,
      reason: "lighting-check-failed",
      message:
        "The lighting could not be checked. Please try again."
    };
  }


  /*
   * ----------------------------------------------------------
   * IMAGE DIMENSIONS
   * ----------------------------------------------------------
   */

  const imageWidth =
    imageElement.naturalWidth;

  const imageHeight =
    imageElement.naturalHeight;


  if (
    !imageWidth ||
    !imageHeight
  ) {
    return {
      acceptable: false,
      reason: "invalid-image",
      message:
        "The image dimensions could not be read. Please try another photo."
    };
  }


  /*
   * ----------------------------------------------------------
   * FIND FACE BOUNDING BOX
   * ----------------------------------------------------------
   */

  const face =
    landmarks[0];

  const xs =
    face.map(
      point => point.x
    );

  const ys =
    face.map(
      point => point.y
    );


  const minX =
    Math.min(...xs);

  const maxX =
    Math.max(...xs);

  const minY =
    Math.min(...ys);

  const maxY =
    Math.max(...ys);


  const faceWidth =
    maxX - minX;

  const faceHeight =
    maxY - minY;


  /*
   * ----------------------------------------------------------
   * USE INNER FACE REGION
   * ----------------------------------------------------------
   *
   * We intentionally remove some of the outside of the
   * bounding box.
   *
   * This reduces contamination from:
   *
   * - hair
   * - ears
   * - background
   * - clothes
   *
   * The lighting test therefore focuses more strongly
   * on the face.
   */

  const innerMinX =
    minX + faceWidth * 0.15;

  const innerMaxX =
    maxX - faceWidth * 0.15;

  const innerMinY =
    minY + faceHeight * 0.10;

  const innerMaxY =
    maxY - faceHeight * 0.10;


  /*
   * ----------------------------------------------------------
   * CONVERT NORMALIZED COORDINATES TO PIXELS
   * ----------------------------------------------------------
   */

  const startX =
    Math.max(
      0,
      Math.floor(
        innerMinX *
        imageWidth
      )
    );

  const endX =
    Math.min(
      imageWidth,
      Math.ceil(
        innerMaxX *
        imageWidth
      )
    );

  const startY =
    Math.max(
      0,
      Math.floor(
        innerMinY *
        imageHeight
      )
    );

  const endY =
    Math.min(
      imageHeight,
      Math.ceil(
        innerMaxY *
        imageHeight
      )
    );


  const regionWidth =
    endX - startX;

  const regionHeight =
    endY - startY;


  if (
    regionWidth <= 0 ||
    regionHeight <= 0
  ) {
    return {
      acceptable: false,
      reason: "lighting-check-failed",
      message:
        "The face lighting could not be measured. Please try another photo."
    };
  }


  /*
   * ----------------------------------------------------------
   * CREATE SMALL CANVAS
   * ----------------------------------------------------------
   */

  const canvas =
    document.createElement(
      "canvas"
    );

  const maxDimension = 300;

  const scale =
    Math.min(
      1,
      maxDimension /
      Math.max(
        regionWidth,
        regionHeight
      )
    );


  canvas.width =
    Math.max(
      1,
      Math.round(
        regionWidth *
        scale
      )
    );

  canvas.height =
    Math.max(
      1,
      Math.round(
        regionHeight *
        scale
      )
    );


  const ctx =
    canvas.getContext(
      "2d",
      {
        willReadFrequently: true
      }
    );


  if (!ctx) {
    return {
      acceptable: false,
      reason: "canvas-error",
      message:
        "The image could not be processed. Please try again."
    };
  }


  /*
   * Draw only the face region.
   */

  ctx.drawImage(
    imageElement,

    startX,
    startY,
    regionWidth,
    regionHeight,

    0,
    0,
    canvas.width,
    canvas.height
  );


  /*
   * ----------------------------------------------------------
   * READ PIXELS
   * ----------------------------------------------------------
   */

  let imageData;

  try {
    imageData =
      ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
  } catch (error) {

    console.error(
      "Could not read face lighting:",
      error
    );

    return {
      acceptable: false,
      reason: "pixel-read-error",
      message:
        "The image could not be analysed. Please try again."
    };
  }


  const pixels =
    imageData.data;


  if (
    !pixels ||
    pixels.length === 0
  ) {
    return {
      acceptable: false,
      reason: "no-pixels",
      message:
        "The face lighting could not be measured. Please try another photo."
    };
  }


  /*
   * ----------------------------------------------------------
   * BRIGHTNESS STATISTICS
   * ----------------------------------------------------------
   */

  let totalBrightness = 0;

  let validPixels = 0;

  let darkPixels = 0;

  let brightPixels = 0;

  let extremeBrightPixels = 0;

  let extremeDarkPixels = 0;


  const brightnessValues = [];


  /*
   * Left/right brightness.
   *
   * This specifically detects situations such as:
   *
   *       LIGHT | DARK
   *          FACE
   *
   * which is a common form of uneven lighting.
   */

  let leftSum = 0;
  let leftCount = 0;

  let rightSum = 0;
  let rightCount = 0;


  /*
   * Top/bottom brightness.
   */

  let topSum = 0;
  let topCount = 0;

  let bottomSum = 0;
  let bottomCount = 0;


  /*
   * ----------------------------------------------------------
   * PROCESS PIXELS
   * ----------------------------------------------------------
   */

  for (
    let y = 0;
    y < canvas.height;
    y++
  ) {

    for (
      let x = 0;
      x < canvas.width;
      x++
    ) {

      const index =
        (
          y *
          canvas.width +
          x
        ) * 4;


      const r =
        pixels[index];

      const g =
        pixels[index + 1];

      const b =
        pixels[index + 2];

      const alpha =
        pixels[index + 3];


      /*
       * Ignore transparent pixels.
       */

      if (
        alpha < 200
      ) {
        continue;
      }


      /*
       * Perceived brightness.
       *
       * Human vision is more sensitive to green,
       * so this is preferable to a simple RGB average.
       */

      const brightness =
        0.2126 * r +
        0.7152 * g +
        0.0722 * b;


      totalBrightness +=
        brightness;

      validPixels++;


      brightnessValues.push(
        brightness
      );


      /*
       * Dark pixels.
       */

      if (
        brightness < 40
      ) {
        darkPixels++;
      }


      /*
       * Bright pixels.
       */

      if (
        brightness > 215
      ) {
        brightPixels++;
      }


      /*
       * Almost completely white pixels.
       */

      if (
        brightness > 245
      ) {
        extremeBrightPixels++;
      }


      /*
       * Almost completely black pixels.
       */

      if (
        brightness < 15
      ) {
        extremeDarkPixels++;
      }


      /*
       * ------------------------------------------------------
       * LEFT / RIGHT
       * ------------------------------------------------------
       */

      if (
        x <
        canvas.width / 2
      ) {

        leftSum +=
          brightness;

        leftCount++;

      } else {

        rightSum +=
          brightness;

        rightCount++;
      }


      /*
       * ------------------------------------------------------
       * TOP / BOTTOM
       * ------------------------------------------------------
       */

      if (
        y <
        canvas.height / 2
      ) {

        topSum +=
          brightness;

        topCount++;

      } else {

        bottomSum +=
          brightness;

        bottomCount++;
      }
    }
  }


  /*
   * ----------------------------------------------------------
   * VALIDATE PIXELS
   * ----------------------------------------------------------
   */

  if (
    validPixels === 0
  ) {
    return {
      acceptable: false,
      reason: "no-valid-pixels",
      message:
        "The face lighting could not be measured. Please try another photo."
    };
  }


  /*
   * ----------------------------------------------------------
   * OVERALL BRIGHTNESS
   * ----------------------------------------------------------
   */

  const averageBrightness =
    totalBrightness /
    validPixels;


  /*
   * ----------------------------------------------------------
   * PIXEL RATIOS
   * ----------------------------------------------------------
   */

  const darkPixelRatio =
    darkPixels /
    validPixels;

  const brightPixelRatio =
    brightPixels /
    validPixels;

  const extremeBrightRatio =
    extremeBrightPixels /
    validPixels;

  const extremeDarkRatio =
    extremeDarkPixels /
    validPixels;


  /*
   * ----------------------------------------------------------
   * BRIGHTNESS PERCENTILES
   * ----------------------------------------------------------
   */

  const sortedBrightness =
    [...brightnessValues]
      .sort(
        (a, b) =>
          a - b
      );


  const percentile = (
    values,
    percentage
  ) => {

    const index =
      Math.floor(
        values.length *
        percentage
      );

    return values[
      Math.min(
        index,
        values.length - 1
      )
    ];
  };


  const lowerBrightness =
    percentile(
      sortedBrightness,
      0.10
    );

  const upperBrightness =
    percentile(
      sortedBrightness,
      0.90
    );

  const veryHighBrightness =
    percentile(
      sortedBrightness,
      0.95
    );


  /*
   * ----------------------------------------------------------
   * LEFT / RIGHT BRIGHTNESS
   * ----------------------------------------------------------
   */

  const leftBrightness =
    leftCount > 0
      ? leftSum /
        leftCount
      : null;

  const rightBrightness =
    rightCount > 0
      ? rightSum /
        rightCount
      : null;


  const horizontalDifference =
    leftBrightness !== null &&
    rightBrightness !== null
      ? Math.abs(
          leftBrightness -
          rightBrightness
        )
      : 0;


  /*
   * ----------------------------------------------------------
   * TOP / BOTTOM BRIGHTNESS
   * ----------------------------------------------------------
   */

  const topBrightness =
    topCount > 0
      ? topSum /
        topCount
      : null;

  const bottomBrightness =
    bottomCount > 0
      ? bottomSum /
        bottomCount
      : null;


  const verticalDifference =
    topBrightness !== null &&
    bottomBrightness !== null
      ? Math.abs(
          topBrightness -
          bottomBrightness
        )
      : 0;


  /*
   * The strongest lighting difference.
   */

  const lightingDifference =
    Math.max(
      horizontalDifference,
      verticalDifference
    );


  /*
   * ==========================================================
   * REJECTION RULES
   * ==========================================================
   */


  /*
   * ----------------------------------------------------------
   * 1. TOO DARK
   * ----------------------------------------------------------
   */

  if (
    averageBrightness < 48
  ) {

    return {
      acceptable: false,
      reason: "too-dark",
      message:
        "The lighting on your face is too dark. Please move to a brighter, well-lit area and try again.",
      averageBrightness,
      darkPixelRatio,
      brightPixelRatio,
      extremeBrightRatio,
      extremeDarkRatio,
      lowerBrightness,
      upperBrightness,
      lightingDifference
    };
  }


  /*
   * A reasonable average can still hide a very dark face.
   */

  if (
    averageBrightness < 68 &&
    darkPixelRatio > 0.38
  ) {

    return {
      acceptable: false,
      reason: "too-dark",
      message:
        "The lighting on your face is too dark. Please move to a brighter, well-lit area and try again.",
      averageBrightness,
      darkPixelRatio,
      brightPixelRatio,
      extremeBrightRatio,
      extremeDarkRatio,
      lowerBrightness,
      upperBrightness,
      lightingDifference
    };
  }


  /*
   * Very large amount of almost-black pixels.
   */

  if (
    extremeDarkRatio > 0.20 &&
    averageBrightness < 90
  ) {

    return {
      acceptable: false,
      reason: "too-dark",
      message:
        "The lighting on your face is too dark. Please move to a brighter, well-lit area and try again.",
      averageBrightness,
      darkPixelRatio,
      brightPixelRatio,
      extremeBrightRatio,
      extremeDarkRatio,
      lowerBrightness,
      upperBrightness,
      lightingDifference
    };
  }


  /*
   * ----------------------------------------------------------
   * 2. TOO BRIGHT
   * ----------------------------------------------------------
   */

  if (
    averageBrightness > 215 &&
    brightPixelRatio > 0.25
  ) {

    return {
      acceptable: false,
      reason: "too-bright",
      message:
        "The lighting on your face is too bright. Please avoid harsh direct light and try again.",
      averageBrightness,
      darkPixelRatio,
      brightPixelRatio,
      extremeBrightRatio,
      extremeDarkRatio,
      lowerBrightness,
      upperBrightness,
      lightingDifference
    };
  }


  /*
   * ----------------------------------------------------------
   * 3. OVEREXPOSURE
   * ----------------------------------------------------------
   *
   * We use multiple signals.
   *
   * This catches bright images even when the average
   * brightness is not extremely high.
   */

  if (
    extremeBrightRatio > 0.05
  ) {

    return {
      acceptable: false,
      reason: "overexposed",
      message:
        "The lighting on your face is overexposed. Please move away from very bright or direct light and try again.",
      averageBrightness,
      darkPixelRatio,
      brightPixelRatio,
      extremeBrightRatio,
      extremeDarkRatio,
      lowerBrightness,
      upperBrightness,
      lightingDifference
    };
  }


  /*
   * Large amount of bright pixels plus a very high
   * upper percentile.
   */

  if (
    brightPixelRatio > 0.30 &&
    veryHighBrightness > 238
  ) {

    return {
      acceptable: false,
      reason: "overexposed",
      message:
        "The lighting on your face is overexposed. Please move away from very bright or direct light and try again.",
      averageBrightness,
      darkPixelRatio,
      brightPixelRatio,
      extremeBrightRatio,
      extremeDarkRatio,
      lowerBrightness,
      upperBrightness,
      lightingDifference
    };
  }


  /*
   * Very bright face with a high 90th percentile.
   */

  if (
    averageBrightness > 195 &&
    upperBrightness > 230 &&
    brightPixelRatio > 0.20
  ) {

    return {
      acceptable: false,
      reason: "overexposed",
      message:
        "The lighting on your face is overexposed. Please move away from very bright or direct light and try again.",
      averageBrightness,
      darkPixelRatio,
      brightPixelRatio,
      extremeBrightRatio,
      extremeDarkRatio,
      lowerBrightness,
      upperBrightness,
      lightingDifference
    };
  }


  /*
   * ----------------------------------------------------------
   * 4. UNEVEN LIGHTING
   * ----------------------------------------------------------
   *
   * Instead of comparing four large quadrants, we compare:
   *
   * LEFT  ↔ RIGHT
   * TOP   ↔ BOTTOM
   *
   * This is more directly related to uneven illumination
   * across the face.
   */


  /*
   * Strong left/right difference.
   */

  if (
    horizontalDifference > 55
  ) {

    return {
      acceptable: false,
      reason: "uneven-lighting",
      message:
        "The lighting on your face is uneven. Please face a light source directly and try again.",
      averageBrightness,
      darkPixelRatio,
      brightPixelRatio,
      extremeBrightRatio,
      extremeDarkRatio,
      lowerBrightness,
      upperBrightness,
      lightingDifference,
      horizontalDifference,
      verticalDifference
    };
  }


  /*
   * Strong top/bottom difference.
   */

  if (
    verticalDifference > 65
  ) {

    return {
      acceptable: false,
      reason: "uneven-lighting",
      message:
        "The lighting on your face is uneven. Please face a light source directly and try again.",
      averageBrightness,
      darkPixelRatio,
      brightPixelRatio,
      extremeBrightRatio,
      extremeDarkRatio,
      lowerBrightness,
      upperBrightness,
      lightingDifference,
      horizontalDifference,
      verticalDifference
    };
  }


  /*
   * ----------------------------------------------------------
   * 5. ACCEPTABLE LIGHTING
   * ----------------------------------------------------------
   */

  return {
    acceptable: true,
    reason: "good-lighting",
    message:
      "Lighting conditions are suitable for analysis.",

    averageBrightness,

    darkPixelRatio,

    brightPixelRatio,

    extremeBrightRatio,

    extremeDarkRatio,

    lowerBrightness,

    upperBrightness,

    lightingDifference,

    horizontalDifference,

    verticalDifference
  };
}


/*
 * ============================================================
 * FACE FRAMING CHECK
 * ============================================================
 *
 * MediaPipe can detect a face even when only part of the face
 * is visible.
 *
 * We therefore inspect the landmark bounding box.
 */
function checkFaceFraming(
  imageElement,
  landmarks
) {

  if (
    !imageElement ||
    !landmarks ||
    landmarks.length === 0
  ) {
    return {
      acceptable: false,
      reason: "no-face"
    };
  }


  const imageWidth =
    imageElement.naturalWidth;

  const imageHeight =
    imageElement.naturalHeight;


  if (
    !imageWidth ||
    !imageHeight
  ) {
    return {
      acceptable: false,
      reason: "invalid-image"
    };
  }


  /*
   * First detected face.
   */

  const face =
    landmarks[0];


  /*
   * Find landmark bounding box.
   */

  const xs =
    face.map(
      point =>
        point.x
    );

  const ys =
    face.map(
      point =>
        point.y
    );


  const minX =
    Math.min(...xs);

  const maxX =
    Math.max(...xs);

  const minY =
    Math.min(...ys);

  const maxY =
    Math.max(...ys);


  /*
   * ----------------------------------------------------------
   * EDGE MARGINS
   * ----------------------------------------------------------
   */

  const leftMargin =
    minX;

  const rightMargin =
    1 - maxX;

  const topMargin =
    minY;

  const bottomMargin =
    1 - maxY;


  /*
   * ----------------------------------------------------------
   * FACE DIMENSIONS
   * ----------------------------------------------------------
   */

  const faceWidth =
    maxX - minX;

  const faceHeight =
    maxY - minY;


  /*
   * ----------------------------------------------------------
   * DIRECT CUT-OFF
   * ----------------------------------------------------------
   */

  const edgeThreshold =
    0.025;


  if (
    leftMargin < edgeThreshold
  ) {

    return {
      acceptable: false,

      reason:
        "face-cut-off-left",

      leftMargin,

      rightMargin,

      topMargin,

      bottomMargin,

      faceWidth,

      faceHeight
    };
  }


  if (
    rightMargin < edgeThreshold
  ) {

    return {
      acceptable: false,

      reason:
        "face-cut-off-right",

      leftMargin,

      rightMargin,

      topMargin,

      bottomMargin,

      faceWidth,

      faceHeight
    };
  }


  if (
    topMargin < edgeThreshold
  ) {

    return {
      acceptable: false,

      reason:
        "face-cut-off-top",

      leftMargin,

      rightMargin,

      topMargin,

      bottomMargin,

      faceWidth,

      faceHeight
    };
  }


  if (
    bottomMargin < edgeThreshold
  ) {

    return {
      acceptable: false,

      reason:
        "face-cut-off-bottom",

      leftMargin,

      rightMargin,

      topMargin,

      bottomMargin,

      faceWidth,

      faceHeight
    };
  }


  /*
   * ----------------------------------------------------------
   * FACE TOO SMALL
   * ----------------------------------------------------------
   */

  if (
    faceWidth < 0.20 ||
    faceHeight < 0.20
  ) {

    return {
      acceptable: false,

      reason:
        "face-too-small",

      leftMargin,

      rightMargin,

      topMargin,

      bottomMargin,

      faceWidth,

      faceHeight
    };
  }


  /*
   * ----------------------------------------------------------
   * FACE TOO CLOSE
   * ----------------------------------------------------------
   */

  if (
    faceWidth > 0.90 ||
    faceHeight > 0.90
  ) {

    return {
      acceptable: false,

      reason:
        "face-too-close",

      leftMargin,

      rightMargin,

      topMargin,

      bottomMargin,

      faceWidth,

      faceHeight
    };
  }


  /*
   * ----------------------------------------------------------
   * FACE TOO FAR LEFT
   * ----------------------------------------------------------
   */

  if (
    leftMargin < 0.06 &&
    rightMargin > 0.30
  ) {

    return {
      acceptable: false,

      reason:
        "face-too-far-left",

      leftMargin,

      rightMargin,

      topMargin,

      bottomMargin,

      faceWidth,

      faceHeight
    };
  }


  /*
   * ----------------------------------------------------------
   * FACE TOO FAR RIGHT
   * ----------------------------------------------------------
   */

  if (
    rightMargin < 0.06 &&
    leftMargin > 0.30
  ) {

    return {
      acceptable: false,

      reason:
        "face-too-far-right",

      leftMargin,

      rightMargin,

      topMargin,

      bottomMargin,

      faceWidth,

      faceHeight
    };
  }


  /*
   * ----------------------------------------------------------
   * FACE TOO FAR TOP
   * ----------------------------------------------------------
   */

  if (
    topMargin < 0.06 &&
    bottomMargin > 0.30
  ) {

    return {
      acceptable: false,

      reason:
        "face-too-far-top",

      leftMargin,

      rightMargin,

      topMargin,

      bottomMargin,

      faceWidth,

      faceHeight
    };
  }


  /*
   * ----------------------------------------------------------
   * FACE TOO FAR BOTTOM
   * ----------------------------------------------------------
   */

  if (
    bottomMargin < 0.06 &&
    topMargin > 0.30
  ) {

    return {
      acceptable: false,

      reason:
        "face-too-far-bottom",

      leftMargin,

      rightMargin,

      topMargin,

      bottomMargin,

      faceWidth,

      faceHeight
    };
  }


  /*
   * ----------------------------------------------------------
   * FACE IS SUFFICIENTLY INSIDE FRAME
   * ----------------------------------------------------------
   */

  return {
    acceptable: true,

    reason: "acceptable",

    leftMargin,

    rightMargin,

    topMargin,

    bottomMargin,

    faceWidth,

    faceHeight
  };
}