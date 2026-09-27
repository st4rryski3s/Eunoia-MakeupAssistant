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

/*
 * ---------------------------------------------------------
 * NORMALIZATION
 * ---------------------------------------------------------
 */

function normalize(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

function normalizeArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(Boolean)
    .map((item) => normalize(item));
}

/*
 * ---------------------------------------------------------
 * DEPTH SCORE
 * ---------------------------------------------------------
 */

function getDepthScore(userDepth, productDepth) {
  const normalizedUserDepth = normalize(userDepth);
  const normalizedProductDepth = normalize(productDepth);

  const userIndex = depthOrder.indexOf(normalizedUserDepth);
  const productIndex = depthOrder.indexOf(normalizedProductDepth);

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

/*
 * ---------------------------------------------------------
 * UNDERTONE SCORE
 * ---------------------------------------------------------
 */

function getUndertoneScore(userUndertone, productUndertone) {
  const user = normalize(userUndertone);
  const product = normalize(productUndertone);

  if (!user || !product) {
    return 0;
  }

  /*
   * Exact match
   */
  if (user === product) {
    return 50;
  }

  /*
   * Neutral works with warm/cool/olive
   */
  if (
    user === "neutral" &&
    (
      product === "warm" ||
      product === "cool" ||
      product === "olive"
    )
  ) {
    return 30;
  }

  if (
    product === "neutral" &&
    (
      user === "warm" ||
      user === "cool" ||
      user === "olive"
    )
  ) {
    return 30;
  }

  /*
   * Warm / olive compatibility
   */
  if (
    (
      user === "olive" &&
      product === "warm"
    ) ||
    (
      user === "warm" &&
      product === "olive"
    )
  ) {
    return 25;
  }

  return 0;
}

/*
 * ---------------------------------------------------------
 * SKIN TYPE SCORE
 * ---------------------------------------------------------
 *
 * Exact match = 20 points
 */

function getSkinTypeScore(user, product) {
  const userSkinType = normalize(user.skinType);

  const productSkinTypes = normalizeArray(
    product.skinTypes
  );

  if (
    !userSkinType ||
    productSkinTypes.length === 0
  ) {
    return 0;
  }

  if (productSkinTypes.includes(userSkinType)) {
    return 20;
  }

  return 0;
}

/*
 * ---------------------------------------------------------
 * LOOK SCORE
 * ---------------------------------------------------------
 *
 * Exact match = 15 points
 */

function getLookScore(user, product) {
  const userLook = normalize(user.look);

  const productLooks = normalizeArray(
    product.looks
  );

  if (
    !userLook ||
    productLooks.length === 0
  ) {
    return 0;
  }

  if (productLooks.includes(userLook)) {
    return 15;
  }

  return 0;
}

/*
 * ---------------------------------------------------------
 * BRAND SCORE
 * ---------------------------------------------------------
 *
 * Preferred brand = 10 points
 */

function getBrandScore(user, product) {
  const preferredBrands = normalizeArray(
    user.brands
  );

  const productBrand = normalize(product.brand);

  if (
    preferredBrands.length === 0 ||
    !productBrand
  ) {
    return 0;
  }

  if (preferredBrands.includes(productBrand)) {
    return 10;
  }

  return 0;
}

/*
 * ---------------------------------------------------------
 * BLUSH SCORE
 * ---------------------------------------------------------
 */

function getBlushScore(user, product) {
  const userUndertone = normalize(user.undertone);
  const productUndertone = normalize(product.undertone);

  if (
    userUndertone &&
    productUndertone &&
    userUndertone === productUndertone
  ) {
    return 70;
  }

  if (
    userUndertone === "neutral" ||
    productUndertone === "neutral"
  ) {
    return 50;
  }

  if (
    (
      userUndertone === "olive" &&
      productUndertone === "warm"
    ) ||
    (
      userUndertone === "warm" &&
      productUndertone === "olive"
    )
  ) {
    return 60;
  }

  return 20;
}

/*
 * ---------------------------------------------------------
 * LIPSTICK SCORE
 * ---------------------------------------------------------
 */

function getLipstickScore(user, product) {
  const userUndertone = normalize(user.undertone);
  const productUndertone = normalize(product.undertone);

  if (
    userUndertone &&
    productUndertone &&
    userUndertone === productUndertone
  ) {
    return 70;
  }

  if (
    userUndertone === "neutral" ||
    productUndertone === "neutral"
  ) {
    return 50;
  }

  if (
    (
      userUndertone === "olive" &&
      productUndertone === "warm"
    ) ||
    (
      userUndertone === "warm" &&
      productUndertone === "olive"
    )
  ) {
    return 60;
  }

  return 20;
}

/*
 * ---------------------------------------------------------
 * EYESHADOW SCORE
 * ---------------------------------------------------------
 */

function getEyeshadowScore(user, product) {
  const userUndertone = normalize(user.undertone);
  const productUndertone = normalize(product.undertone);

  if (
    userUndertone &&
    productUndertone &&
    userUndertone === productUndertone
  ) {
    return 70;
  }

  if (
    userUndertone === "neutral" ||
    productUndertone === "neutral"
  ) {
    return 50;
  }

  if (
    (
      userUndertone === "olive" &&
      productUndertone === "warm"
    ) ||
    (
      userUndertone === "warm" &&
      productUndertone === "olive"
    )
  ) {
    return 60;
  }

  return 20;
}

/*
 * ---------------------------------------------------------
 * BASE BEAUTY MATCH
 * ---------------------------------------------------------
 */

function getBaseMatchScore(user, product) {
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

/*
 * ---------------------------------------------------------
 * BASE SCORE NORMALIZATION
 * ---------------------------------------------------------
 *
 * 55 points = complexion / undertone
 * 20 points = skin type
 * 15 points = look
 * 10 points = preferred brand
 *
 * Total = 100
 */

function getBaseScorePercentage(user, product) {
  const baseScore = getBaseMatchScore(
    user,
    product
  );

  const maximumBaseScore =
    product.category === "blush" ||
    product.category === "lipstick" ||
    product.category === "eyeshadow"
      ? 70
      : 100;

  if (maximumBaseScore === 0) {
    return 0;
  }

  return (
    (baseScore / maximumBaseScore) * 55
  );
}

/*
 * ---------------------------------------------------------
 * FINAL MATCH SCORE
 * ---------------------------------------------------------
 */

export function calculateMatch(user, product) {
  const baseScore = getBaseScorePercentage(
    user,
    product
  );

  const skinTypeScore = getSkinTypeScore(
    user,
    product
  );

  const lookScore = getLookScore(
    user,
    product
  );

  const brandScore = getBrandScore(
    user,
    product
  );

  return Math.round(
    baseScore +
      skinTypeScore +
      lookScore +
      brandScore
  );
}

/*
 * ---------------------------------------------------------
 * MATCH REASON
 * ---------------------------------------------------------
 */

function getMatchReason(user, product) {
  const reasons = [];

  /*
   * DEPTH
   */

  const depthScore = getDepthScore(
    user.depth,
    product.depth
  );

  if (
    product.category !== "blush" &&
    product.category !== "lipstick" &&
    product.category !== "eyeshadow"
  ) {
    if (depthScore === 50) {
      reasons.push("Exact depth");
    } else if (depthScore === 40) {
      reasons.push("Nearby depth");
    } else if (depthScore === 25) {
      reasons.push("Moderately close depth");
    } else if (depthScore === 10) {
      reasons.push("Somewhat different depth");
    }
  }

  /*
   * UNDERTONE
   */

  const userUndertone = normalize(
    user.undertone
  );

  const productUndertone = normalize(
    product.undertone
  );

  if (
    product.category === "blush" ||
    product.category === "lipstick" ||
    product.category === "eyeshadow"
  ) {
    if (
      userUndertone &&
      productUndertone &&
      userUndertone === productUndertone
    ) {
      reasons.push(
        `${product.category} undertone matches`
      );
    } else if (
      userUndertone === "neutral" ||
      productUndertone === "neutral"
    ) {
      reasons.push(
        `${product.category} undertone is compatible`
      );
    } else if (
      (
        userUndertone === "olive" &&
        productUndertone === "warm"
      ) ||
      (
        userUndertone === "warm" &&
        productUndertone === "olive"
      )
    ) {
      reasons.push(
        "Warm-olive compatible undertone"
      );
    }
  } else {
    const undertoneScore =
      getUndertoneScore(
        user.undertone,
        product.undertone
      );

    if (undertoneScore === 50) {
      reasons.push("Exact undertone");
    } else if (undertoneScore === 30) {
      reasons.push("Compatible undertone");
    } else if (undertoneScore === 25) {
      reasons.push(
        "Partially compatible undertone"
      );
    }
  }

  /*
   * SKIN TYPE
   */

  const skinTypeScore =
    getSkinTypeScore(
      user,
      product
    );

  if (skinTypeScore > 0) {
    reasons.push(
      "Matches your skin type"
    );
  }

  /*
   * LOOK
   */

  const lookScore =
    getLookScore(
      user,
      product
    );

  if (lookScore > 0) {
    reasons.push(
      "Matches your preferred look"
    );
  }

  /*
   * BRAND
   */

  const brandScore =
    getBrandScore(
      user,
      product
    );

  if (brandScore > 0) {
    reasons.push(
      "Preferred brand"
    );
  }

  if (reasons.length === 0) {
    return "Low similarity";
  }

  return reasons.join(" + ");
}

/*
 * ---------------------------------------------------------
 * RECOMMEND PRODUCTS
 * ---------------------------------------------------------
 */

export function recommendProducts(
  user,
  products
) {
  return products

    /*
     * -----------------------------------------------------
     * CATEGORY
     * -----------------------------------------------------
     */

    .filter(
      (product) =>
        product.category === user.category
    )

    /*
     * -----------------------------------------------------
     * CONCEALER CORRECTORS
     * -----------------------------------------------------
     */

    .filter((product) => {
      if (
        user.category === "concealer" &&
        product.type === "corrector"
      ) {
        return false;
      }

      return true;
    })

    /*
     * -----------------------------------------------------
     * BUDGET RANGE
     * -----------------------------------------------------
     *
     * The product must be INSIDE the selected range.
     *
     * Examples:
     *
     * Under ₹1,000
     *     0 <= price < 1000
     *
     * ₹1,000–₹2,000
     *     1000 <= price <= 2000
     *
     * ₹2,000–₹4,000
     *     2000 <= price <= 4000
     *
     * ₹4,000+
     *     price >= 4000
     */

    .filter((product) => {
      const price = Number(product.price);

      if (!Number.isFinite(price)) {
        return false;
      }

      /*
       * If budgetMin exists,
       * product must be >= minimum.
       */
      if (
        user.budgetMin !== undefined &&
        user.budgetMin !== null &&
        price < Number(user.budgetMin)
      ) {
        return false;
      }

      /*
       * If budgetMax exists,
       * product must be <= maximum.
       *
       * For ₹4,000+,
       * budgetMax should be Infinity
       * or simply omitted.
       */
      if (
        user.budgetMax !== undefined &&
        user.budgetMax !== null &&
        price > Number(user.budgetMax)
      ) {
        return false;
      }

      return true;
    })

    /*
     * -----------------------------------------------------
     * CALCULATE SCORE
     * -----------------------------------------------------
     */

    .map((product) => ({
      ...product,

      matchScore: Math.round(
        calculateMatch(
          user,
          product
        )
      ),

      matchReason:
        getMatchReason(
          user,
          product
        ),
    }))

    /*
     * -----------------------------------------------------
     * HIGHEST MATCH FIRST
     * -----------------------------------------------------
     */

    .sort(
      (a, b) =>
        b.matchScore - a.matchScore
    );
}