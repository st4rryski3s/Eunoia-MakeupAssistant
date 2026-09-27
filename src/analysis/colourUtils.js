export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;

  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;

    s =
      l > 0.5
        ? d / (2 - max - min)
        : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        h = (b - r) / d + 2;
        break;

      case b:
        h = (r - g) / d + 4;
        break;

      default:
        break;
    }

    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
}

export function averageRGB(imageData) {
  if (
    !imageData ||
    !imageData.data ||
    imageData.data.length === 0
  ) {
    return {
      r: 0,
      g: 0,
      b: 0
    };
  }

  const pixels = imageData.data;
  const samples = [];

  for (
    let i = 0;
    i < pixels.length;
    i += 4
  ) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const a = pixels[i + 3];

    /*
     * Ignore transparent pixels.
     */
    if (a < 200) {
      continue;
    }

    /*
     * Calculate brightness.
     */
    const brightness =
      (r + g + b) / 3;

    /*
     * Ignore extremely dark or extremely
     * bright pixels.
     */
    if (
      brightness < 25 ||
      brightness > 245
    ) {
      continue;
    }

    samples.push({
      r,
      g,
      b
    });
  }

  if (samples.length === 0) {
    return {
      r: 0,
      g: 0,
      b: 0
    };
  }

  /*
   * Sort each channel separately.
   */
  const red = samples
    .map(pixel => pixel.r)
    .sort((a, b) => a - b);

  const green = samples
    .map(pixel => pixel.g)
    .sort((a, b) => a - b);

  const blue = samples
    .map(pixel => pixel.b)
    .sort((a, b) => a - b);

  /*
   * Use the middle 80% of the values.
   */
  const trim = Math.floor(
    samples.length * 0.10
  );

  function trimmedMean(values) {
    const middle =
      values.slice(
        trim,
        values.length - trim
      );

    const total =
      middle.reduce(
        (sum, value) => sum + value,
        0
      );

    return Math.round(
      total / middle.length
    );
  }

  return {
    r: trimmedMean(red),
    g: trimmedMean(green),
    b: trimmedMean(blue)
  };
}
