import products from "./data/products";

/*
=========================================================
EUNOIA CROSS-BRAND SHADE MATCHER
=========================================================

Priority:
1. Shade depth
2. Undertone
3. Undertone detail

Depth = 80%
Undertone = 20%
Detail = tiny tie-breaker

Uses the categorical information already present
in products.js.
=========================================================
*/


// =======================================================
// NORMALIZE
// =======================================================

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


// =======================================================
// BRAND MATCHING
// =======================================================

function brandsMatch(a, b) {
  const first = normalize(a);
  const second = normalize(b);

  if (!first || !second) {
    return false;
  }

  if (first === second) {
    return true;
  }

  /*
   Handles variations such as:

   L'Oréal
   L'Oréal Paris

   without requiring the strings to be identical.
  */

  return (
    first.includes(second) ||
    second.includes(first)
  );
}


// =======================================================
// DEPTH ORDER
// =======================================================

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


// =======================================================
// DEPTH DIFFERENCE
// =======================================================

function getDepthDifference(source, target) {
  const sourceDepth =
    normalize(source?.depth);

  const targetDepth =
    normalize(target?.depth);

  /*
   CRITICAL:

   If both products literally have the same
   categorical depth, the difference is ZERO.

   Example:

   medium → medium = 0
  */

  if (
    sourceDepth &&
    targetDepth &&
    sourceDepth === targetDepth
  ) {
    return 0;
  }

  const sourceIndex =
    depthOrder.indexOf(sourceDepth);

  const targetIndex =
    depthOrder.indexOf(targetDepth);

  /*
   Unknown depth values should not accidentally
   become a good match.
  */

  if (
    sourceIndex === -1 ||
    targetIndex === -1
  ) {
    return 99;
  }

  return Math.abs(
    sourceIndex - targetIndex
  );
}


// =======================================================
// DEPTH SCORE
// =======================================================

function getDepthScore(
  depthDifference
) {
  if (depthDifference === 0) {
    return 100;
  }

  if (depthDifference === 1) {
    return 82;
  }

  if (depthDifference === 2) {
    return 58;
  }

  if (depthDifference === 3) {
    return 32;
  }

  if (depthDifference === 4) {
    return 12;
  }

  return 0;
}


// =======================================================
// UNDERTONE SCORE
// =======================================================

function getUndertoneScore(
  source,
  target
) {
  const sourceUndertone =
    normalize(source?.undertone);

  const targetUndertone =
    normalize(target?.undertone);

  if (
    !sourceUndertone ||
    !targetUndertone
  ) {
    return 55;
  }

  // Exact undertone
  if (
    sourceUndertone ===
    targetUndertone
  ) {
    return 100;
  }

  // Warm ↔ Neutral
  if (
    (sourceUndertone === "warm" &&
      targetUndertone === "neutral") ||
    (sourceUndertone === "neutral" &&
      targetUndertone === "warm")
  ) {
    return 82;
  }

  // Cool ↔ Neutral
  if (
    (sourceUndertone === "cool" &&
      targetUndertone === "neutral") ||
    (sourceUndertone === "neutral" &&
      targetUndertone === "cool")
  ) {
    return 82;
  }

  // Warm ↔ Olive
  if (
    (sourceUndertone === "warm" &&
      targetUndertone === "olive") ||
    (sourceUndertone === "olive" &&
      targetUndertone === "warm")
  ) {
    return 88;
  }

  // Neutral ↔ Olive
  if (
    (sourceUndertone === "neutral" &&
      targetUndertone === "olive") ||
    (sourceUndertone === "olive" &&
      targetUndertone === "neutral")
  ) {
    return 80;
  }

  // Warm ↔ Cool
  if (
    (sourceUndertone === "warm" &&
      targetUndertone === "cool") ||
    (sourceUndertone === "cool" &&
      targetUndertone === "warm")
  ) {
    return 35;
  }

  // Olive ↔ Cool
  if (
    (sourceUndertone === "olive" &&
      targetUndertone === "cool") ||
    (sourceUndertone === "cool" &&
      targetUndertone === "olive")
  ) {
    return 35;
  }

  return 55;
}


// =======================================================
// UNDERTONE DETAIL BONUS
// =======================================================

function getUndertoneDetailBonus(
  source,
  target
) {
  const sourceDetail =
    normalize(source?.undertoneDetail);

  const targetDetail =
    normalize(target?.undertoneDetail);

  if (
    !sourceDetail ||
    !targetDetail
  ) {
    return 0;
  }

  // Exact detail
  if (
    sourceDetail === targetDetail
  ) {
    return 2;
  }

  const warmWords = [
    "warm",
    "yellow",
    "golden",
    "honey",
    "olive-warm",
  ];

  const coolWords = [
    "cool",
    "pink",
    "rosy",
    "red",
  ];

  const sourceWarm =
    warmWords.some((word) =>
      sourceDetail.includes(word)
    );

  const targetWarm =
    warmWords.some((word) =>
      targetDetail.includes(word)
    );

  const sourceCool =
    coolWords.some((word) =>
      sourceDetail.includes(word)
    );

  const targetCool =
    coolWords.some((word) =>
      targetDetail.includes(word)
    );

  if (
    (sourceWarm && targetWarm) ||
    (sourceCool && targetCool)
  ) {
    return 1;
  }

  return 0;
}


// =======================================================
// CALCULATE SHADE MATCH
// =======================================================

export function calculateShadeMatch(
  source,
  target
) {
  const depthDifference =
    getDepthDifference(
      source,
      target
    );

  const depthScore =
    getDepthScore(
      depthDifference
    );

  const undertoneScore =
    getUndertoneScore(
      source,
      target
    );

  const undertoneDetailBonus =
    getUndertoneDetailBonus(
      source,
      target
    );

  /*
   Depth = 80%
   Undertone = 20%
   Detail = tiny tie-breaker
  */

  const baseScore =
    depthScore * 0.8 +
    undertoneScore * 0.2;

  const finalScore =
    Math.min(
      100,
      Math.round(
        baseScore +
          undertoneDetailBonus
      )
    );

  return {
    matchScore: finalScore,
    depthDifference,
    depthScore,
    undertoneScore,
    undertoneDetailBonus,
  };
}


// =======================================================
// MATCH QUALITY
// =======================================================

export function getMatchQuality(
  score
) {
  if (score >= 95) {
    return "Best match";
  }

  if (score >= 90) {
    return "Very close";
  }

  if (score >= 80) {
    return "Close";
  }

  if (score >= 65) {
    return "Possible";
  }

  if (score >= 50) {
    return "Weak";
  }

  return "Poor";
}


// =======================================================
// MATCH REASON
// =======================================================

function getMatchReason(
  source,
  target,
  scoreData
) {
  const {
    depthDifference,
    undertoneScore,
  } = scoreData;

  if (
    depthDifference === 0 &&
    undertoneScore === 100
  ) {
    return "Excellent compatibility — same depth and same undertone.";
  }

  if (
    depthDifference === 0 &&
    undertoneScore >= 80
  ) {
    return "Excellent compatibility — same depth with compatible undertone.";
  }

  if (
    depthDifference === 1 &&
    undertoneScore === 100
  ) {
    return "Very close compatibility — one depth level apart with the same undertone.";
  }

  if (
    depthDifference === 1 &&
    undertoneScore >= 80
  ) {
    return "Close compatibility — one depth level apart with a compatible undertone.";
  }

  if (depthDifference === 2) {
    return "Possible compatibility — approximately two depth levels apart.";
  }

  return "Lower compatibility based on the available shade data.";
}


// =======================================================
// GET BRANDS FOR CATEGORY
// =======================================================

export function getBrandsForCategory(
  category
) {
  const normalizedCategory =
    normalize(category);

  return [
    ...new Set(
      products
        .filter(
          (product) =>
            normalize(
              product.category
            ) === normalizedCategory
        )
        .map(
          (product) =>
            product.brand
        )
        .filter(Boolean)
    ),
  ].sort((a, b) =>
    a.localeCompare(b)
  );
}


// =======================================================
// GET PRODUCTS FOR BRAND
// =======================================================

export function getProductsForBrand(
  first,
  second
) {
  const categories = [
    "foundation",
    "concealer",
    "blush",
    "lipstick",
    "lip",
    "eyeshadow",
    "corrector",
  ];

  const firstNormalized =
    normalize(first);

  const secondNormalized =
    normalize(second);

  let category;
  let brand;

  /*
   Supports BOTH:

   getProductsForBrand(category, brand)

   and:

   getProductsForBrand(brand, category)
  */

  if (
    categories.includes(
      firstNormalized
    )
  ) {
    category = firstNormalized;
    brand = secondNormalized;
  } else {
    brand = firstNormalized;
    category = secondNormalized;
  }

  return products
    .filter(
      (product) =>
        normalize(
          product.category
        ) === category &&
        brandsMatch(
          product.brand,
          brand
        )
    )
    .sort((a, b) =>
      String(
        a.shade ?? ""
      ).localeCompare(
        String(
          b.shade ?? ""
        ),
        undefined,
        {
          numeric: true,
        }
      )
    );
}


// =======================================================
// FIND SHADE MATCHES
// =======================================================

export function findShadeMatches({
  category,
  sourceBrand,
  sourceProductId,
  targetBrand,
}) {
  const normalizedCategory =
    normalize(category);

  /*
   Find source by its unique ID first.

   This is much safer than depending on the brand
   string supplied by the UI.
  */

  let source =
    products.find(
      (product) =>
        product.id ===
        sourceProductId
    );

  /*
   Fallback if sourceProductId isn't available.
  */

  if (!source && sourceBrand) {
    source =
      products.find(
        (product) =>
          normalize(
            product.category
          ) === normalizedCategory &&
          brandsMatch(
            product.brand,
            sourceBrand
          )
      );
  }

  if (!source) {
    return [];
  }

  /*
   Find every product in the requested category
   whose brand matches the selected target brand.
  */

  const targets =
    products.filter(
      (product) =>
        normalize(
          product.category
        ) === normalizedCategory &&
        brandsMatch(
          product.brand,
          targetBrand
        ) &&
        product.id !== source.id
    );

  return targets
    .map((target) => {
      const scoreData =
        calculateShadeMatch(
          source,
          target
        );

      return {
        ...target,

        matchScore:
          scoreData.matchScore,

        matchQuality:
          getMatchQuality(
            scoreData.matchScore
          ),

        matchReason:
          getMatchReason(
            source,
            target,
            scoreData
          ),

        depthDifference:
          scoreData.depthDifference,

        depthScore:
          scoreData.depthScore,

        undertoneScore:
          scoreData.undertoneScore,
      };
    })
    .sort((a, b) => {
      // 1. Highest score
      if (
        b.matchScore !==
        a.matchScore
      ) {
        return (
          b.matchScore -
          a.matchScore
        );
      }

      // 2. Same depth preferred
      if (
        a.depthDifference !==
        b.depthDifference
      ) {
        return (
          a.depthDifference -
          b.depthDifference
        );
      }

      // 3. Better undertone compatibility
      return (
        b.undertoneScore -
        a.undertoneScore
      );
    });
}


// =======================================================
// DEFAULT EXPORT
// =======================================================

export default {
  getBrandsForCategory,
  getProductsForBrand,
  findShadeMatches,
  calculateShadeMatch,
  getMatchQuality,
};