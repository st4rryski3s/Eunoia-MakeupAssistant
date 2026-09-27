/*
 * =========================================================
 * EUNOIA MATCHING ENGINE
 * =========================================================
 *
 * Main goals:
 *
 * 1. Make complexion matching much more sensitive to depth.
 * 2. Give undertone meaningful weight.
 * 3. Use hue family / undertone detail when available.
 * 4. Do not use product RGB/HSL.
 * 5. Treat makeup categories differently.
 * 6. Keep budget as a HARD filter.
 * 7. Return decimal match percentages.
 *
 * =========================================================
 */

/*
 * ---------------------------------------------------------
 * DEPTH ORDER
 * ---------------------------------------------------------
 *
 * These values correspond to the depth scale used by the
 * product database and the P2 skin analysis mapping.
 */

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
 * GENERIC ARRAY MATCHING
 * ---------------------------------------------------------
 */

function arrayIncludesNormalized(array, value) {
  return normalizeArray(array).includes(
    normalize(value)
  );
}

/*
 * ---------------------------------------------------------
 * DEPTH MATCHING
 * ---------------------------------------------------------
 *
 * Exact:
 *   100
 *
 * 1 level away:
 *   78
 *
 * 2 levels away:
 *   50
 *
 * 3 levels away:
 *   25
 *
 * 4 levels away:
 *   10
 *
 * 5+:
 *   0
 *
 * This makes visibly different complexion depths separate
 * much more strongly.
 */

function getDepthSimilarity(
  userDepth,
  productDepth
) {
  const user = normalize(userDepth);
  const product = normalize(productDepth);

  if (!user || !product) {
    return 0;
  }

  const userIndex =
    depthOrder.indexOf(user);

  const productIndex =
    depthOrder.indexOf(product);

  if (
    userIndex === -1 ||
    productIndex === -1
  ) {
    return 0;
  }

  const difference = Math.abs(
    userIndex - productIndex
  );

  if (difference === 0) {
    return 100;
  }

  if (difference === 1) {
    return 78;
  }

  if (difference === 2) {
    return 50;
  }

  if (difference === 3) {
    return 25;
  }

  if (difference === 4) {
    return 10;
  }

  return 0;
}

/*
 * ---------------------------------------------------------
 * UNDERTONE MATCHING
 * ---------------------------------------------------------
 *
 * Returns a percentage rather than raw points.
 *
 * Exact matches are strongest.
 *
 * Neutral is somewhat flexible.
 *
 * Olive has a meaningful relationship with warm, but not
 * the same strength as an exact olive match.
 */

function getUndertoneSimilarity(
  userUndertone,
  productUndertone
) {
  const user = normalize(userUndertone);
  const product = normalize(productUndertone);

  if (!user || !product) {
    return 0;
  }

  if (user === product) {
    return 100;
  }

  if (user === "neutral") {
    if (
      product === "warm" ||
      product === "cool" ||
      product === "olive"
    ) {
      return 65;
    }
  }

  if (product === "neutral") {
    if (
      user === "warm" ||
      user === "cool" ||
      user === "olive"
    ) {
      return 65;
    }
  }

  /*
   * Warm and olive can overlap.
   */

  if (
    (user === "olive" &&
      product === "warm") ||
    (user === "warm" &&
      product === "olive")
  ) {
    return 70;
  }

  /*
   * Cool and olive are generally less directly compatible
   * than warm and olive.
   */

  if (
    (user === "olive" &&
      product === "cool") ||
    (user === "cool" &&
      product === "olive")
  ) {
    return 35;
  }

  /*
   * Warm vs cool is a strong mismatch.
   */

  return 10;
}

/*
 * ---------------------------------------------------------
 * UNDERTONE DETAIL MATCHING
 * ---------------------------------------------------------
 *
 * Examples of product details:
 *
 * pink
 * golden
 * peach
 * yellow
 * red
 * neutral
 * warm beige
 * rosy
 *
 * We use token overlap rather than requiring exact strings.
 */

function getUndertoneDetailTokens(value) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .toLowerCase()
    .split(/[/,&+|()\-]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getUndertoneDetailSimilarity(
  user,
  product
) {
  const userDetail =
    normalize(user.undertoneDetail);

  const productDetail =
    normalize(product.undertoneDetail);

  if (!userDetail || !productDetail) {
    return null;
  }

  if (userDetail === productDetail) {
    return 100;
  }

  const userTokens =
    getUndertoneDetailTokens(
      userDetail
    );

  const productTokens =
    getUndertoneDetailTokens(
      productDetail
    );

  if (
    userTokens.length === 0 ||
    productTokens.length === 0
  ) {
    return null;
  }

  const matches = userTokens.filter(
    (token) =>
      productTokens.some(
        (productToken) =>
          productToken.includes(token) ||
          token.includes(productToken)
      )
  );

  if (matches.length > 0) {
    return Math.min(
      90,
      55 + matches.length * 15
    );
  }

  return 20;
}

/*
 * ---------------------------------------------------------
 * HUE FAMILY HELPERS
 * ---------------------------------------------------------
 */

function normalizeHueFamily(value) {
  if (Array.isArray(value)) {
    return value
      .filter(Boolean)
      .map((item) => normalize(item));
  }

  if (typeof value === "string") {
    return [normalize(value)];
  }

  return [];
}

/*
 * ---------------------------------------------------------
 * COMPLEXION HUE MATCHING
 * ---------------------------------------------------------
 *
 * Used mainly for foundation / concealer.
 *
 * IMPORTANT:
 *
 * Product hueFamily and skin hueFamily are not always the
 * same kind of data.
 *
 * Therefore we only award a strong score when there is
 * meaningful semantic overlap.
 */

function getComplexionHueSimilarity(
  user,
  product
) {
  const userHue =
    normalizeHueFamily(user.hueFamily);

  const productHue =
    normalizeHueFamily(product.hueFamily);

  if (
    userHue.length === 0 ||
    productHue.length === 0
  ) {
    return null;
  }

  const overlap = userHue.filter(
    (userValue) =>
      productHue.some(
        (productValue) =>
          productValue.includes(userValue) ||
          userValue.includes(productValue)
      )
  );

  if (overlap.length > 0) {
    return 100;
  }

  /*
   * Some common related complexion families.
   */

  const relatedFamilies = {
    yellow: [
      "golden",
      "warm",
      "olive",
    ],

    golden: [
      "yellow",
      "warm",
      "olive",
    ],

    warm: [
      "yellow",
      "golden",
      "peach",
    ],

    peach: [
      "warm",
      "golden",
    ],

    pink: [
      "rose",
      "rosy",
      "cool",
    ],

    rose: [
      "pink",
      "rosy",
      "cool",
    ],

    rosy: [
      "pink",
      "rose",
      "cool",
    ],

    red: [
      "rose",
      "rosy",
      "pink",
    ],

    olive: [
      "yellow",
      "golden",
      "warm",
    ],
  };

  for (const userValue of userHue) {
    const related =
      relatedFamilies[userValue] || [];

    for (const productValue of productHue) {
      if (
        related.includes(productValue)
      ) {
        return 65;
      }
    }
  }

  return 20;
}

/*
 * ---------------------------------------------------------
 * MAKEUP COLOR FAMILY MATCHING
 * ---------------------------------------------------------
 *
 * For blush / lipstick / eyeshadow, hueFamily describes
 * makeup colors rather than skin hue.
 *
 * We therefore use the user's undertone to determine
 * broad compatible color families.
 */

const undertoneColorFamilies = {
  warm: [
    "peach",
    "coral",
    "terracotta",
    "orange",
    "warm",
    "gold",
    "bronze",
    "brown",
    "brick",
    "red",
    "nude",
    "caramel",
  ],

  cool: [
    "pink",
    "rose",
    "berry",
    "plum",
    "mauve",
    "red",
    "burgundy",
    "purple",
    "cool",
    "taupe",
  ],

  neutral: [
    "pink",
    "rose",
    "peach",
    "nude",
    "brown",
    "mauve",
    "red",
    "berry",
    "coral",
    "neutral",
  ],

  olive: [
    "peach",
    "coral",
    "terracotta",
    "brown",
    "bronze",
    "gold",
    "brick",
    "nude",
    "warm",
  ],
};

function getMakeupColorSimilarity(
  user,
  product
) {
  const productColors =
    normalizeHueFamily(
      product.hueFamily
    );

  if (productColors.length === 0) {
    return null;
  }

  const undertone =
    normalize(user.undertone);

  if (!undertone) {
    return null;
  }

  const compatibleColors =
    undertoneColorFamilies[
      undertone
    ] || [];

  const matches = productColors.filter(
    (color) =>
      compatibleColors.some(
        (compatible) =>
          color.includes(compatible) ||
          compatible.includes(color)
      )
  );

  if (matches.length >= 2) {
    return 100;
  }

  if (matches.length === 1) {
    return 80;
  }

  return 35;
}

/*
 * ---------------------------------------------------------
 * SKIN TYPE
 * ---------------------------------------------------------
 */

function getSkinTypeSimilarity(
  user,
  product
) {
  const userSkinType =
    normalize(user.skinType);

  const productSkinTypes =
    normalizeArray(product.skinTypes);

  if (
    !userSkinType ||
    productSkinTypes.length === 0
  ) {
    return null;
  }

  return productSkinTypes.includes(
    userSkinType
  )
    ? 100
    : 0;
}

/*
 * ---------------------------------------------------------
 * LOOK
 * ---------------------------------------------------------
 */

function getLookSimilarity(
  user,
  product
) {
  const userLook = normalize(
    user.look || user.preferredLook
  );

  const productLooks =
    normalizeArray(product.looks);

  if (
    !userLook ||
    productLooks.length === 0
  ) {
    return null;
  }

  return productLooks.includes(userLook)
    ? 100
    : 0;
}

/*
 * ---------------------------------------------------------
 * BRAND
 * ---------------------------------------------------------
 */

function getBrandSimilarity(
  user,
  product
) {
  const preferredBrands =
    normalizeArray(
      user.brands ||
        user.preferredBrands
    );

  const productBrand =
    normalize(product.brand);

  if (
    preferredBrands.length === 0 ||
    !productBrand
  ) {
    return null;
  }

  return preferredBrands.includes(
    productBrand
  )
    ? 100
    : 0;
}

/*
 * ---------------------------------------------------------
 * CATEGORY
 * ---------------------------------------------------------
 */

function isComplexionCategory(
  category
) {
  return (
    category === "foundation" ||
    category === "concealer"
  );
}

function isColorCategory(category) {
  return (
    category === "blush" ||
    category === "lipstick" ||
    category === "eyeshadow"
  );
}

/*
 * ---------------------------------------------------------
 * COMPLEXION SCORE
 * ---------------------------------------------------------
 *
 * FOUNDATION / CONCEALER
 *
 * Depth is the most important factor.
 */

function getComplexionScore(
  user,
  product
) {
  const depth =
    getDepthSimilarity(
      user.depth,
      product.depth
    );

  const undertone =
    getUndertoneSimilarity(
      user.undertone,
      product.undertone
    );

  const hue =
    getComplexionHueSimilarity(
      user,
      product
    );

  const detail =
    getUndertoneDetailSimilarity(
      user,
      product
    );

  /*
   * If data is missing, redistribute the weight instead
   * of automatically treating the product as a mismatch.
   */

  let total = 0;
  let weight = 0;

  if (depth !== null) {
    total += depth * 0.40;
    weight += 0.40;
  }

  if (undertone !== null) {
    total += undertone * 0.25;
    weight += 0.25;
  }

  if (hue !== null) {
    total += hue * 0.15;
    weight += 0.15;
  }

  if (detail !== null) {
    total += detail * 0.05;
    weight += 0.05;
  }

  if (weight === 0) {
    return 0;
  }

  /*
   * Normalize if some optional fields are unavailable.
   */

  return total / weight;
}

/*
 * ---------------------------------------------------------
 * COLOR PRODUCT SCORE
 * ---------------------------------------------------------
 *
 * BLUSH / LIPSTICK / EYESHADOW
 */

function getColorProductScore(
  user,
  product
) {
  const undertone =
    getUndertoneSimilarity(
      user.undertone,
      product.undertone
    );

  const color =
    getMakeupColorSimilarity(
      user,
      product
    );

  const detail =
    getUndertoneDetailSimilarity(
      user,
      product
    );

  let total = 0;
  let weight = 0;

  if (undertone !== null) {
    total += undertone * 0.40;
    weight += 0.40;
  }

  if (color !== null) {
    total += color * 0.45;
    weight += 0.45;
  }

  if (detail !== null) {
    total += detail * 0.15;
    weight += 0.15;
  }

  if (weight === 0) {
    return 0;
  }

  return total / weight;
}

/*
 * ---------------------------------------------------------
 * CATEGORY BEAUTY SCORE
 * ---------------------------------------------------------
 */

function getBeautySimilarity(
  user,
  product
) {
  if (
    isComplexionCategory(
      product.category
    )
  ) {
    return getComplexionScore(
      user,
      product
    );
  }

  if (
    isColorCategory(
      product.category
    )
  ) {
    return getColorProductScore(
      user,
      product
    );
  }

  return 0;
}

/*
 * ---------------------------------------------------------
 * FINAL MATCH SCORE
 * ---------------------------------------------------------
 *
 * Complexion:
 *
 *   Beauty compatibility 85%
 *   Skin type              5%
 *   Look                   4%
 *   Brand                  3%
 *   Data quality           3%
 *
 * Color products:
 *
 *   Beauty compatibility  75%
 *   Skin type              8%
 *   Look                   8%
 *   Brand                  5%
 *   Data quality           4%
 *
 * The data-quality component prevents products with almost
 * no useful classification from automatically receiving the
 * same score as well-classified products.
 */

export function calculateMatch(
  user,
  product
) {
  const category =
    normalize(product.category);

  const beautySimilarity =
    getBeautySimilarity(
      user,
      product
    );

  const skinTypeSimilarity =
    getSkinTypeSimilarity(
      user,
      product
    );

  const lookSimilarity =
    getLookSimilarity(
      user,
      product
    );

  const brandSimilarity =
    getBrandSimilarity(
      user,
      product
    );

  let score;

  if (
    isComplexionCategory(category)
  ) {
    score =
      beautySimilarity * 0.85 +
      (skinTypeSimilarity ?? 50) *
        0.05 +
      (lookSimilarity ?? 50) *
        0.04 +
      (brandSimilarity ?? 50) *
        0.03 +
      getDataQualityScore(product) *
        0.03;
  } else {
    score =
      beautySimilarity * 0.75 +
      (skinTypeSimilarity ?? 50) *
        0.08 +
      (lookSimilarity ?? 50) *
        0.08 +
      (brandSimilarity ?? 50) *
        0.05 +
      getDataQualityScore(product) *
        0.04;
  }

  /*
   * Keep score within 0–100.
   */

  return Math.max(
    0,
    Math.min(100, score)
  );
}

/*
 * ---------------------------------------------------------
 * DATA QUALITY
 * ---------------------------------------------------------
 *
 * This does NOT invent missing data.
 *
 * It simply rewards products that actually contain useful
 * classification information.
 */

function getDataQualityScore(
  product
) {
  const fields = [
    product.depth,
    product.toneLevel,
    product.undertone,
    product.undertoneDetail,
    product.hueFamily,
  ];

  let present = 0;

  fields.forEach((field) => {
    if (
      field !== null &&
      field !== undefined &&
      field !== "" &&
      !(
        Array.isArray(field) &&
        field.length === 0
      )
    ) {
      present += 1;
    }
  });

  return (
    (present / fields.length) *
    100
  );
}

/*
 * ---------------------------------------------------------
 * MATCH REASON
 * ---------------------------------------------------------
 */

function getMatchReason(
  user,
  product
) {
  const reasons = [];

  const category =
    normalize(product.category);

  /*
   * FOUNDATION / CONCEALER
   */

  if (
    isComplexionCategory(category)
  ) {
    const depthSimilarity =
      getDepthSimilarity(
        user.depth,
        product.depth
      );

    if (depthSimilarity === 100) {
      reasons.push("Exact skin depth");
    } else if (
      depthSimilarity >= 78
    ) {
      reasons.push(
        "Very close skin depth"
      );
    } else if (
      depthSimilarity >= 50
    ) {
      reasons.push(
        "Moderately close skin depth"
      );
    } else if (
      depthSimilarity >= 25
    ) {
      reasons.push(
        "Different skin depth"
      );
    } else {
      reasons.push(
        "Significantly different depth"
      );
    }

    const undertoneSimilarity =
      getUndertoneSimilarity(
        user.undertone,
        product.undertone
      );

    if (undertoneSimilarity === 100) {
      reasons.push("Exact undertone");
    } else if (
      undertoneSimilarity >= 65
    ) {
      reasons.push(
        "Compatible undertone"
      );
    } else if (
      undertoneSimilarity >= 35
    ) {
      reasons.push(
        "Partially compatible undertone"
      );
    } else if (
      undertoneSimilarity !== null
    ) {
      reasons.push(
        "Undertone differs"
      );
    }

    const hueSimilarity =
      getComplexionHueSimilarity(
        user,
        product
      );

    if (hueSimilarity === 100) {
      reasons.push(
        "Compatible hue family"
      );
    } else if (
      hueSimilarity !== null &&
      hueSimilarity >= 60
    ) {
      reasons.push(
        "Related hue family"
      );
    }
  }

  /*
   * BLUSH / LIPSTICK / EYESHADOW
   */

  if (
    isColorCategory(category)
  ) {
    const undertoneSimilarity =
      getUndertoneSimilarity(
        user.undertone,
        product.undertone
      );

    if (undertoneSimilarity === 100) {
      reasons.push(
        "Matching undertone"
      );
    } else if (
      undertoneSimilarity !== null &&
      undertoneSimilarity >= 65
    ) {
      reasons.push(
        "Compatible undertone"
      );
    }

    const colorSimilarity =
      getMakeupColorSimilarity(
        user,
        product
      );

    if (colorSimilarity === 100) {
      reasons.push(
        "Highly compatible color family"
      );
    } else if (
      colorSimilarity !== null &&
      colorSimilarity >= 80
    ) {
      reasons.push(
        "Compatible color family"
      );
    }
  }

  /*
   * SKIN TYPE
   */

  if (
    getSkinTypeSimilarity(
      user,
      product
    ) === 100
  ) {
    reasons.push(
      "Matches your skin type"
    );
  }

  /*
   * LOOK
   */

  if (
    getLookSimilarity(
      user,
      product
    ) === 100
  ) {
    reasons.push(
      "Matches your preferred look"
    );
  }

  /*
   * BRAND
   */

  if (
    getBrandSimilarity(
      user,
      product
    ) === 100
  ) {
    reasons.push(
      "Preferred brand"
    );
  }

  if (reasons.length === 0) {
    return "Limited matching data";
  }

  return reasons.join(" + ");
}

/*
 * ---------------------------------------------------------
 * BUDGET VALIDATION
 * ---------------------------------------------------------
 *
 * The budget slider provides:
 *
 *   budgetMin
 *   budgetMax
 *
 * The budget is a HARD constraint.
 *
 * A product outside the selected range is removed BEFORE
 * matching and scoring.
 */

function isWithinBudget(
  user,
  product
) {
  const price = Number(
    product.price
  );

  /*
   * Products without a valid price cannot safely be
   * recommended because we cannot verify that they fall
   * inside the user's budget.
   */

  if (!Number.isFinite(price)) {
    return false;
  }

  /*
   * New budget system.
   */

  const hasBudgetMin =
    user.budgetMin !== undefined &&
    user.budgetMin !== null &&
    user.budgetMin !== "";

  const hasBudgetMax =
    user.budgetMax !== undefined &&
    user.budgetMax !== null &&
    user.budgetMax !== "";

  /*
   * If a minimum exists, enforce it.
   */

  if (hasBudgetMin) {
    const minimum =
      Number(user.budgetMin);

    if (
      Number.isFinite(minimum) &&
      price < minimum
    ) {
      return false;
    }
  }

  /*
   * If a maximum exists, enforce it.
   */

  if (hasBudgetMax) {
    const maximum =
      Number(user.budgetMax);

    if (
      Number.isFinite(maximum) &&
      price > maximum
    ) {
      return false;
    }
  }

  return true;
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
  return (
    products

      /*
       * -----------------------------------------------------
       * CATEGORY FILTER
       * -----------------------------------------------------
       */

      .filter(
        (product) =>
          normalize(
            product.category
          ) ===
          normalize(
            user.category
          )
      )

      /*
       * -----------------------------------------------------
       * CONCEALER CORRECTORS
       * -----------------------------------------------------
       *
       * Correctors are not treated as normal concealers.
       */

      .filter((product) => {
        if (
          normalize(
            user.category
          ) === "concealer" &&
          normalize(
            product.type
          ) === "corrector"
        ) {
          return false;
        }

        return true;
      })

      /*
       * -----------------------------------------------------
       * HARD BUDGET FILTER
       * -----------------------------------------------------
       *
       * Products outside the selected slider range are
       * completely removed.
       *
       * Example:
       *
       * User selects ₹500 – ₹2000
       *
       * ₹499     -> removed
       * ₹500     -> allowed
       * ₹1500    -> allowed
       * ₹2000    -> allowed
       * ₹2001    -> removed
       */

      .filter((product) =>
        isWithinBudget(
          user,
          product
        )
      )

      /*
       * -----------------------------------------------------
       * SCORE
       * -----------------------------------------------------
       */

      .map((product) => {
        const rawScore =
          calculateMatch(
            user,
            product
          );

        return {
          ...product,

          /*
           * Keep two decimal places.
           *
           * Example:
           * 87.34
           *
           * instead of:
           * 87
           */

          matchScore:
            Math.round(
              rawScore * 100
            ) / 100,

          matchReason:
            getMatchReason(
              user,
              product
            ),
        };
      })

      /*
       * -----------------------------------------------------
       * SORT
       * -----------------------------------------------------
       */

      .sort(
        (a, b) =>
          b.matchScore -
          a.matchScore
      )
  );
}