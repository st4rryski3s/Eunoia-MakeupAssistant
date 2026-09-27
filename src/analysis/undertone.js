import { rgbToHsl } from "./colourUtils";

export function analyzeSkin(rgb) {
  const { r, g, b } = rgb;

  const hsl = rgbToHsl(r, g, b);

  const {
    h,
    s,
    l
  } = hsl;

  /*
   * ----------------------------------------
   * 1. SKIN DEPTH / TONE
   * ----------------------------------------
   *
   * Lightness is used as the primary
   * approximation of skin depth.
   */

  let tone;
  let toneLevel;

  if (l >= 88) {
    tone = "Very Fair";
    toneLevel = 1;

  } else if (l >= 80) {
    tone = "Fair";
    toneLevel = 2;

  } else if (l >= 72) {
    tone = "Light";
    toneLevel = 3;

  } else if (l >= 65) {
    tone = "Light-Medium";
    toneLevel = 4;

  } else if (l >= 57) {
    tone = "Medium";
    toneLevel = 5;

  } else if (l >= 49) {
    tone = "Medium-Tan";
    toneLevel = 6;

  } else if (l >= 41) {
    tone = "Tan";
    toneLevel = 7;

  } else if (l >= 33) {
    tone = "Deep-Tan";
    toneLevel = 8;

  } else if (l >= 25) {
    tone = "Deep";
    toneLevel = 9;

  } else {
    tone = "Very Deep";
    toneLevel = 10;
  }

  /*
   * ----------------------------------------
   * 2. COLOUR COMPONENTS
   * ----------------------------------------
   */

  const redStrength = r - b;

  const yellowStrength =
    ((r + g) / 2) - b;

  const greenStrength =
    g - r;

  const blueStrength =
    b - r;

  /*
   * ----------------------------------------
   * 3. NORMALIZED COLOUR FEATURES
   * ----------------------------------------
   *
   * Raw RGB values are heavily affected by
   * brightness and exposure.
   *
   * Normalizing the channels gives us ratios
   * that are less dependent on overall image
   * brightness.
   */

  const total = r + g + b || 1;

  const redRatio = r / total;
  const greenRatio = g / total;
  const blueRatio = b / total;

  /*
   * Difference between the channels after
   * normalization.
   */

  const redGreenRatio =
    redRatio - greenRatio;

  const greenBlueRatio =
    greenRatio - blueRatio;

  const redBlueRatio =
    redRatio - blueRatio;

  /*
   * ----------------------------------------
   * 4. OLIVE SCORE
   * ----------------------------------------
   *
   * Olive usually has:
   *
   * - noticeable green relative to blue
   * - a yellow component
   * - less extreme red dominance than
   *   strongly warm/peach skin
   *
   * IMPORTANT:
   * Olive does NOT require G >= R.
   */

  let oliveScore = 0;

  /*
   * Green relative to blue.
   */

  if (greenBlueRatio > 0.055) {
    oliveScore += 2;
  }

  if (greenBlueRatio > 0.075) {
    oliveScore += 1;
  }

  /*
   * Avoid very strong red dominance.
   */

  if (redGreenRatio < 0.18) {
    oliveScore += 2;
  }

  if (redGreenRatio < 0.12) {
    oliveScore += 1;
  }

  /*
   * Olive generally sits in the yellow/
   * yellow-green portion of the skin range.
   */

  if (h >= 25 && h <= 75) {
    oliveScore += 2;
  }

  /*
   * Very low saturation is more likely to be
   * neutral than olive.
   */

  if (s >= 12 && s <= 55) {
    oliveScore += 1;
  }

  /*
   * Extremely red skin should not easily
   * become olive.
   */

  if (redBlueRatio > 0.25) {
    oliveScore -= 2;
  }

  /*
   * ----------------------------------------
   * 5. WARM SCORE
   * ----------------------------------------
   */

  let warmScore = 0;

  /*
   * Red dominance.
   */

  if (redGreenRatio > 0.12) {
    warmScore += 2;
  }

  if (redGreenRatio > 0.18) {
    warmScore += 1;
  }

  /*
   * Yellow component.
   */

  if (yellowStrength > 20) {
    warmScore += 1;
  }

  if (yellowStrength > 30) {
    warmScore += 1;
  }

  /*
   * Typical warm hue range.
   */

  if (h >= 10 && h < 40) {
    warmScore += 2;
  }

  /*
   * Very red hues are more likely warm/rosy
   * than olive.
   */

  if (h < 10 || h >= 330) {
    warmScore += 1;
  }

  /*
   * ----------------------------------------
   * 6. COOL SCORE
   * ----------------------------------------
   */

  let coolScore = 0;

  /*
   * Blue relative to red.
   */

  if (blueRatio > redRatio) {
    coolScore += 3;
  }

  if (blueStrength > 12) {
    coolScore += 2;
  }

  /*
   * Pink/rosy hue range.
   */

  if (h >= 300 || h < 10) {
    coolScore += 2;
  }

  /*
   * ----------------------------------------
   * 7. UNDERTONE
   * ----------------------------------------
   */

  let undertone;

  /*
   * Olive is checked before warm because
   * olive can contain a strong yellow
   * component and otherwise get classified
   * as warm.
   *
   * We require a meaningful olive score
   * rather than simply checking whether
   * green is greater than red.
   */

  if (
    oliveScore >= 5 &&
    oliveScore > warmScore
  ) {
    undertone = "Olive";

  } else if (
    coolScore >= 4 &&
    coolScore > warmScore
  ) {
    undertone = "Cool";

  } else if (
    warmScore >= 3
  ) {
    undertone = "Warm";

  } else {
    undertone = "Neutral";
  }

  /*
   * ----------------------------------------
   * 8. HUE FAMILY
   * ----------------------------------------
   */

  let hueFamily;

  if (h >= 5 && h < 15) {

    hueFamily = "Peach";

  } else if (h >= 15 && h < 35) {

    hueFamily = "Golden";

  } else if (h >= 35 && h < 55) {

    hueFamily = "Yellow";

  } else if (h >= 55 && h < 90) {

    hueFamily = "Olive";

  } else if (h >= 0 && h < 5) {

    hueFamily = "Red";

  } else if (h >= 330 && h <= 360) {

    hueFamily = "Rosy";

  } else {

    hueFamily = "Neutral";
  }

  /*
   * ----------------------------------------
   * 9. UNDERTONE SUBTYPE
   * ----------------------------------------
   */

  let undertoneDetail;

  if (undertone === "Warm") {

    if (h >= 5 && h < 18) {

      undertoneDetail = "Peach";

    } else if (h >= 18 && h < 40) {

      undertoneDetail = "Golden";

    } else {

      undertoneDetail = "Yellow";
    }

  } else if (undertone === "Cool") {

    if (h >= 330 || h < 8) {

      undertoneDetail = "Rosy";

    } else {

      undertoneDetail = "Pink";
    }

  } else if (undertone === "Olive") {

    /*
     * Distinguish different olive appearances.
     */

    if (
      greenBlueRatio > 0.075 &&
      yellowStrength > 30
    ) {

      undertoneDetail = "Golden Olive";

    } else if (
      greenBlueRatio > 0.065
    ) {

      undertoneDetail = "Green Olive";

    } else {

      undertoneDetail = "Neutral Olive";
    }

  } else {

    undertoneDetail = "Neutral";
  }

  /*
   * ----------------------------------------
   * 10. UNDERTONE STRENGTH
   * ----------------------------------------
   */

  let undertoneStrength;

  const undertoneMagnitude =
    Math.abs(redStrength) +
    Math.abs(yellowStrength);

  if (undertoneMagnitude > 75) {

    undertoneStrength = "Strong";

  } else if (undertoneMagnitude > 45) {

    undertoneStrength = "Moderate";

  } else {

    undertoneStrength = "Subtle";
  }

  /*
   * ----------------------------------------
   * 11. RETURN COMPLETE PROFILE
   * ----------------------------------------
   */

  return {

    tone,

    toneLevel,

    undertone,

    undertoneDetail,

    undertoneStrength,

    hueFamily,

    skinRGB: {
      r,
      g,
      b
    },

    hsl: {
      h: Math.round(h),
      s: Math.round(s),
      l: Math.round(l)
    }

  };
}
