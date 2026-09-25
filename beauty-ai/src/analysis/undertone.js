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
   * 3. OLIVE DETECTION
   * ----------------------------------------
   *
   * Olive skin tends toward a yellow/green
   * appearance rather than strongly red,
   * pink, or golden.
   */

  const oliveScore =
    greenStrength +
    yellowStrength * 0.35;

  /*
   * ----------------------------------------
   * 4. HUE FAMILY
   * ----------------------------------------
   */

  let hueFamily;

  if (
    h >= 5 &&
    h < 15
  ) {
    hueFamily = "Peach";

  } else if (
    h >= 15 &&
    h < 35
  ) {
    hueFamily = "Golden";

  } else if (
    h >= 35 &&
    h < 55
  ) {
    hueFamily = "Yellow";

  } else if (
    h >= 55 &&
    h < 90
  ) {
    hueFamily = "Olive";

  } else if (
    h >= 0 &&
    h < 5
  ) {
    hueFamily = "Red";

  } else if (
    h >= 330 &&
    h <= 360
  ) {
    hueFamily = "Rosy";

  } else {
    hueFamily = "Neutral";
  }

  /*
   * ----------------------------------------
   * 5. UNDERTONE
   * ----------------------------------------
   */

  let undertone;

  /*
   * Olive gets checked first because olive
   * can otherwise be incorrectly classified
   * as warm.
   */

  if (oliveScore > 18 && g >= r - 5) {

    undertone = "Olive";

  } else if (redStrength > 35 && r > g) {

    undertone = "Warm";

  } else if (blueStrength > 18) {

    undertone = "Cool";

  } else if (
    yellowStrength > 28 &&
    r >= g
  ) {

    undertone = "Warm";

  } else {

    undertone = "Neutral";

  }

  /*
   * ----------------------------------------
   * 6. UNDERTONE SUBTYPE
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

    if (
      h >= 330 ||
      h < 8
    ) {
      undertoneDetail = "Rosy";

    } else {
      undertoneDetail = "Pink";
    }

  } else if (undertone === "Olive") {

    if (yellowStrength > 35) {
      undertoneDetail = "Golden Olive";

    } else if (greenStrength > 10) {
      undertoneDetail = "Green Olive";

    } else {
      undertoneDetail = "Neutral Olive";
    }

  } else {

    undertoneDetail = "Neutral";
  }

  /*
   * ----------------------------------------
   * 7. STRENGTH
   * ----------------------------------------
   */

  let undertoneStrength;

  const undertoneMagnitude =
    Math.abs(redStrength) +
    Math.abs(yellowStrength);

  if (undertoneMagnitude > 75) {

    undertoneStrength = "Strong";

  } else if (
    undertoneMagnitude > 45
  ) {

    undertoneStrength = "Moderate";

  } else {

    undertoneStrength = "Subtle";
  }

  /*
   * ----------------------------------------
   * 8. RETURN COMPLETE PROFILE
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