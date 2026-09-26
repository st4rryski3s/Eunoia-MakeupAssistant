const depthOrder = [
  "fair",
  "fair-medium",
  "light",
  "light-medium",
  "medium",
  "medium-dark",
  "medium-tan",
  "deep-medium",
  "dusky-medium",
  "dark",
  "deep",
  "dusky",
];

function getDepthScore(userDepth, productDepth) {
  const userIndex = depthOrder.indexOf(userDepth);
  const productIndex = depthOrder.indexOf(productDepth);

  if (userIndex === -1 || productIndex === -1) {
    return 0;
  }

  const difference = Math.abs(userIndex - productIndex);

  if (difference === 0) {
    return 50;
  }

  if (difference === 1) {
    return 40;
  }

  if (difference === 2) {
    return 25;
  }

  if (difference === 3) {
    return 10;
  }

  return 0;
}

function getUndertoneScore(userUndertone, productUndertone) {
  if (userUndertone === productUndertone) {
    return 50;
  }

  if (
    userUndertone === "neutral" &&
    (productUndertone === "warm" ||
      productUndertone === "cool")
  ) {
    return 30;
  }

  if (
    productUndertone === "neutral" &&
    (userUndertone === "warm" ||
      userUndertone === "cool")
  ) {
    return 30;
  }

  if (
    userUndertone === "olive" &&
    productUndertone === "warm"
  ) {
    return 25;
  }

  if (
    productUndertone === "olive" &&
    userUndertone === "warm"
  ) {
    return 25;
  }

  return 0;
}

function getBlushScore(user, product) {
  if (user.undertone === product.undertone) {
    return 70;
  }

  if (
    user.undertone === "neutral" ||
    product.undertone === "neutral"
  ) {
    return 50;
  }

  return 20;
}

function getLipstickScore(user, product) {
  if (user.undertone === product.undertone) {
    return 70;
  }

  if (
    user.undertone === "neutral" ||
    product.undertone === "neutral"
  ) {
    return 50;
  }

  if (
    (user.undertone === "olive" &&
      product.undertone === "warm") ||
    (user.undertone === "warm" &&
      product.undertone === "olive")
  ) {
    return 60;
  }

  return 20;
}

function getEyeshadowScore(user, product) {
  if (user.undertone === product.undertone) {
    return 70;
  }

  if (
    user.undertone === "neutral" ||
    product.undertone === "neutral"
  ) {
    return 50;
  }

  if (
    (user.undertone === "olive" &&
      product.undertone === "warm") ||
    (user.undertone === "warm" &&
      product.undertone === "olive")
  ) {
    return 60;
  }

  return 20;
}

function getMatchReason(user, product) {
  if (product.category === "blush") {
    if (user.undertone === product.undertone) {
      return "Blush undertone matches your skin undertone";
    }

    if (
      user.undertone === "neutral" ||
      product.undertone === "neutral"
    ) {
      return "Blush undertone is compatible with your skin undertone";
    }

    return "Blush has a different undertone";
  }

  if (product.category === "lipstick") {
    if (user.undertone === product.undertone) {
      return "Lipstick undertone matches your skin undertone";
    }

    if (
      user.undertone === "neutral" ||
      product.undertone === "neutral"
    ) {
      return "Lipstick undertone is compatible with your skin undertone";
    }

    if (
      (user.undertone === "olive" &&
        product.undertone === "warm") ||
      (user.undertone === "warm" &&
        product.undertone === "olive")
    ) {
      return "Lipstick has a warm-olive compatible undertone";
    }

    return "Lipstick has a different undertone";
  }

  if (product.category === "eyeshadow") {
    if (user.undertone === product.undertone) {
      return "Eyeshadow palette undertone matches your skin undertone";
    }

    if (
      user.undertone === "neutral" ||
      product.undertone === "neutral"
    ) {
      return "Eyeshadow palette has a compatible undertone";
    }

    if (
      (user.undertone === "olive" &&
        product.undertone === "warm") ||
      (user.undertone === "warm" &&
        product.undertone === "olive")
    ) {
      return "Eyeshadow palette has a warm-olive compatible undertone";
    }

    return "Eyeshadow palette has a different undertone";
  }

  const depthScore = getDepthScore(
    user.depth,
    product.depth
  );

  const undertoneScore = getUndertoneScore(
    user.undertone,
    product.undertone
  );

  const reasons = [];

  if (depthScore === 50) {
    reasons.push("Exact depth");
  } else if (depthScore === 40) {
    reasons.push("Nearby depth");
  } else if (depthScore === 25) {
    reasons.push("Moderately close depth");
  } else if (depthScore === 10) {
    reasons.push("Somewhat different depth");
  }

  if (undertoneScore === 50) {
    reasons.push("Exact undertone");
  } else if (undertoneScore === 30) {
    reasons.push("Compatible undertone");
  } else if (undertoneScore === 25) {
    reasons.push("Partially compatible undertone");
  }

  if (reasons.length === 0) {
    return "Low similarity";
  }

  return reasons.join(" + ");
}

export function calculateMatch(user, product) {
  if (product.category === "blush") {
    return getBlushScore(user, product);
  }

  if (product.category === "lipstick") {
    return getLipstickScore(user, product);
  }

  if (product.category === "eyeshadow") {
    return getEyeshadowScore(user, product);
  }

  const depthScore = getDepthScore(
    user.depth,
    product.depth
  );

  const undertoneScore = getUndertoneScore(
    user.undertone,
    product.undertone
  );

  return depthScore + undertoneScore;
}

export function recommendProducts(user, products) {
  return products
    .filter(
      (product) =>
        product.category === user.category
    )
    .filter((product) => {
      if (
        user.category === "concealer" &&
        product.type === "corrector"
      ) {
        return false;
      }

      return true;
    })
    .filter((product) => {
      if (
        user.budget &&
        (!product.price ||
          product.price > user.budget)
      ) {
        return false;
      }

      return true;
    })
    .map((product) => ({
      ...product,
      matchScore: calculateMatch(user, product),
      matchReason: getMatchReason(user, product),
    }))
    .sort(
      (a, b) => b.matchScore - a.matchScore
    );
}