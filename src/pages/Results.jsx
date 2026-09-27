import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Check,
  ChevronRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { getRecommendations } from "../recommend";
import productImages from "../productImages";
import { supabase } from "../lib/supabase";
import {
  getPreferences,
  getLatestSkinAnalysis,
} from "../services/supabaseData";

import EunoiaNav from "../components/EunoiaNav";

const categoryImages = {
  foundation:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",

  concealer:
    "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=900&q=80",

  blush:
    "https://images.unsplash.com/photo-1590156206657-2f1d6f5f2e6c?auto=format&fit=crop&w=900&q=80",

  lipstick:
    "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80",

  eyeshadow:
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80",
};

const categories = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "foundation",
    label: "Foundation",
  },
  {
    id: "concealer",
    label: "Concealer",
  },
  {
    id: "blush",
    label: "Blush",
  },
  {
    id: "lipstick",
    label: "Lip",
  },
  {
    id: "eyeshadow",
    label: "Eyeshadow",
  },
];

/*
 * The matcher returns a score out of 100.
 */
function getDisplayScore(product) {
  return Math.min(
    100,
    Math.max(
      0,
      Math.round(product.matchScore ?? 0)
    )
  );
}

function loadKit() {
  try {
    const saved =
      localStorage.getItem("aura-kit");

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

export default function Results() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] =
    useState("all");

  const [kit, setKit] = useState(loadKit);

  /*
   * ---------------------------------------------------------
   * REAL USER DATA
   * ---------------------------------------------------------
   *
   * Results loads the actual skin analysis and preferences
   * saved during the Scan + Preferences steps.
   */

  const [savedPreferences, setSavedPreferences] =
    useState(null);

  const [skinProfile, setSkinProfile] =
    useState(null);

  const [dataLoading, setDataLoading] =
    useState(true);

  const [dataError, setDataError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadUserData() {
      setDataLoading(true);
      setDataError("");

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error(
            "No logged-in user found."
          );
        }

        const [preferences, skinAnalysis] =
          await Promise.all([
            getPreferences(user.id),
            getLatestSkinAnalysis(user.id),
          ]);

        if (cancelled) {
          return;
        }

        /*
         * -----------------------------------------------------
         * BUDGET RANGE
         * -----------------------------------------------------
         *
         * Supabase stores the selected budget as a label.
         *
         * Convert that label into BOTH:
         *
         * budgetMin
         * budgetMax
         *
         * so the matcher can enforce the complete
         * selected range.
         */

        const budgetMap = {
          "Under ₹1,000": {
            min: 0,
            max: 999,
          },

          "₹1,000–₹2,000": {
            min: 1000,
            max: 2000,
          },

          "₹2,000–₹4,000": {
            min: 2000,
            max: 4000,
          },

          "₹4,000+": {
            min: 4000,
            max: Infinity,
          },
        };

        const selectedBudget =
          budgetMap[
            preferences?.budget_range
          ] || {
            min: 0,
            max: Infinity,
          };

        /*
         * -----------------------------------------------------
         * NORMALIZED PREFERENCES
         * -----------------------------------------------------
         */

        const normalizedPreferences = {
          skinType:
            preferences?.skin_type || "",

          look:
            preferences?.preferred_look || "",

          /*
           * Exact selected range
           */
          budgetMin:
            selectedBudget.min,

          budgetMax:
            selectedBudget.max,

          budgetLabel:
            preferences?.budget_range || "",

          brands:
            preferences?.preferred_brands || [],
        };

        /*
         * -----------------------------------------------------
         * PERSON 2 -> PERSON 3 DEPTH MAPPING
         * -----------------------------------------------------
         *
         * Person 2 stores toneLevel as 1–10.
         *
         * Person 3's matcher expects a depth string.
         */

        const depthMap = {
          1: "fair",
          2: "fair",
          3: "light",
          4: "light-medium",
          5: "medium",
          6: "medium-tan",
          7: "medium-dark",
          8: "deep-medium",
          9: "dark",
          10: "deep",
        };

        const toneLevel =
          skinAnalysis?.analysis_data
            ?.toneLevel ??
          skinAnalysis?.skin_depth;

        const numericToneLevel =
          Number(toneLevel);

        const normalizedSkinProfile = {
          depth:
            depthMap[
              numericToneLevel
            ] || "medium",

          undertone: (
            skinAnalysis?.undertone ||
            skinAnalysis?.analysis_data
              ?.undertone ||
            "neutral"
          ).toLowerCase(),

          tone:
            skinAnalysis?.skin_tone ||
            skinAnalysis?.analysis_data?.tone ||
            "",
        };

        setSavedPreferences(
          normalizedPreferences
        );

        setSkinProfile(
          normalizedSkinProfile
        );
      } catch (error) {
        console.error(
          "Failed to load Results data:",
          error
        );

        if (!cancelled) {
          setDataError(
            "Could not load your personalised analysis. Please try scanning your face again."
          );
        }
      } finally {
        if (!cancelled) {
          setDataLoading(false);
        }
      }
    }

    loadUserData();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * USER PROFILE FOR MATCHER
   * ---------------------------------------------------------
   *
   * All relevant user information is passed into
   * the recommendation engine.
   *
   * 1. depth
   * 2. undertone
   * 3. skin type
   * 4. preferred look
   * 5. preferred brands
   * 6. budgetMin
   * 7. budgetMax
   */

  const baseUser = useMemo(() => {
    if (
      !skinProfile ||
      !savedPreferences
    ) {
      return null;
    }

    return {
      /*
       * Skin analysis
       */

      depth:
        skinProfile.depth,

      undertone:
        skinProfile.undertone,

      /*
       * User preferences
       */

      skinType:
        savedPreferences.skinType,

      look:
        savedPreferences.look,

      brands:
        savedPreferences.brands,

      /*
       * Exact budget range
       */

      budgetMin:
        savedPreferences.budgetMin,

      budgetMax:
        savedPreferences.budgetMax,
    };
  }, [
    skinProfile,
    savedPreferences,
  ]);

  /*
   * ---------------------------------------------------------
   * RECOMMENDATIONS
   * ---------------------------------------------------------
   */

  const recommendations = useMemo(() => {
    if (!baseUser) {
      return [];
    }

    try {
      if (activeCategory === "all") {
        const categoriesToFetch = [
          "foundation",
          "concealer",
          "blush",
          "lipstick",
          "eyeshadow",
        ];

        const allProducts =
          categoriesToFetch.flatMap(
            (category) => {
              return getRecommendations({
                ...baseUser,
                category,
              });
            }
          );

        /*
         * Remove duplicates just in case
         * the same product appears more than once.
         */

        return Array.from(
          new Map(
            allProducts.map(
              (product) => [
                product.id,
                product,
              ]
            )
          ).values()
        );
      }

      return getRecommendations({
        ...baseUser,
        category:
          activeCategory,
      });
    } catch (error) {
      console.error(
        "Recommendation error:",
        error
      );

      return [];
    }
  }, [
    activeCategory,
    baseUser,
  ]);

  /*
   * ---------------------------------------------------------
   * ADD / REMOVE FROM KIT
   * ---------------------------------------------------------
   */

  const toggleKit = (product) => {
    setKit((currentKit) => {
      const alreadyAdded =
        currentKit.some(
          (item) =>
            item.id === product.id
        );

      let updatedKit;

      if (alreadyAdded) {
        updatedKit =
          currentKit.filter(
            (item) =>
              item.id !== product.id
          );
      } else {
        updatedKit = [
          ...currentKit,
          product,
        ];
      }

      /*
       * Save kit locally.
       */

      localStorage.setItem(
        "aura-kit",
        JSON.stringify(updatedKit)
      );

      /*
       * Tell EunoiaNav that the kit changed.
       */

      window.dispatchEvent(
        new CustomEvent(
          "eunoia-kit-updated",
          {
            detail: {
              action:
                alreadyAdded
                  ? "remove"
                  : "add",

              product,
            },
          }
        )
      );

      return updatedKit;
    });
  };

  const isInKit = (productId) => {
    return kit.some(
      (item) =>
        item.id === productId
    );
  };

  /*
   * ---------------------------------------------------------
   * PRODUCT IMAGE
   * ---------------------------------------------------------
   */

  const getProductImage = (
    product
  ) => {
    return (
      productImages[product.id] ||
      product.image ||
      categoryImages[
        product.category
      ] ||
      categoryImages.foundation
    );
  };

  /*
   * ---------------------------------------------------------
   * LOADING STATE
   * ---------------------------------------------------------
   */

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-[#faf8f6] text-[#2d2522]">
        <EunoiaNav
          showFloatingBasket={true}
        />

        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b6f61]">
              Eunoia
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              Preparing your matches...
            </h1>

            <p className="mt-3 text-sm text-[#2d2522]/60">
              Loading your skin analysis and preferences.
            </p>

          </div>
        </main>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * ERROR STATE
   * ---------------------------------------------------------
   */

  if (
    dataError ||
    !skinProfile ||
    !savedPreferences
  ) {
    return (
      <div className="min-h-screen bg-[#faf8f6] text-[#2d2522]">

        <EunoiaNav
          showFloatingBasket={true}
        />

        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="max-w-md text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b6f61]">
              Eunoia
            </p>

            <h1 className="mt-4 text-3xl font-bold">
              We couldn't load your matches
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#2d2522]/60">
              {dataError ||
                "Please complete your skin scan and preferences first."}
            </p>

            <button
              onClick={() =>
                navigate("/scan")
              }
              className="eunoia-button mt-7 bg-[#111] px-6 py-3 text-sm font-semibold text-white"
            >
              Back to scan
            </button>

          </div>
        </main>

      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * MAIN RESULTS PAGE
   * ---------------------------------------------------------
   */

  return (
    <div
      className="
        min-h-screen
        bg-[#faf8f6]
        text-[#2d2522]
      "
    >

      {/* =====================================================
          NAVBAR + FLOATING BASKET
      ===================================================== */}

      <EunoiaNav
        showFloatingBasket={true}
      />

      {/* =====================================================
          PAGE INTRO
      ===================================================== */}

      <main>

        <section
          className="
            mx-auto
            max-w-[1400px]
            px-6
            pb-10
            pt-14
            md:px-10
            md:pt-20
          "
        >

          <button
            onClick={() =>
              navigate("/preferences")
            }
            className="
              mb-10
              flex
              items-center
              gap-2
              text-sm
              uppercase
              tracking-[0.15em]
              text-[#2d2522]/60
              hover:text-[#2d2522]
            "
          >
            <ArrowLeft size={16} />

            Back to preferences
          </button>

          <div
            className="
              grid
              gap-10
              lg:grid-cols-[1fr_1fr]
              lg:items-end
            "
          >

            <div>

              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#8b6f61]
                "
              >
                <Sparkles size={14} />

                Your personalised edit
              </div>

              <h1
                className="
                  max-w-3xl
                  text-5xl
                  font-black
                  leading-[0.92]
                  tracking-[-0.06em]
                  md:text-7xl
                "
              >
                YOUR
                <br />
                MATCHES.
              </h1>

            </div>

            <div
              className="
                max-w-lg
                lg:ml-auto
              "
            >

              <p
                className="
                  text-base
                  leading-7
                  text-[#2d2522]/65
                  md:text-lg
                "
              >
                Based on your skin analysis
                and preferences, EUNOIA has
                selected products that match
                your complexion, undertone,
                skin type, preferred look,
                preferred brands and budget.
              </p>

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-2
                "
              >

                <span
                  className="
                    border
                    border-[#2d2522]/15
                    px-3
                    py-2
                    text-xs
                    uppercase
                    tracking-[0.12em]
                  "
                >
                  {skinProfile.depth} depth
                </span>

                <span
                  className="
                    border
                    border-[#2d2522]/15
                    px-3
                    py-2
                    text-xs
                    uppercase
                    tracking-[0.12em]
                  "
                >
                  {skinProfile.undertone} undertone
                </span>

                {savedPreferences.skinType && (
                  <span
                    className="
                      border
                      border-[#2d2522]/15
                      px-3
                      py-2
                      text-xs
                      uppercase
                      tracking-[0.12em]
                    "
                  >
                    {savedPreferences.skinType}
                  </span>
                )}

                {savedPreferences.look && (
                  <span
                    className="
                      border
                      border-[#2d2522]/15
                      px-3
                      py-2
                      text-xs
                      uppercase
                      tracking-[0.12em]
                    "
                  >
                    {savedPreferences.look}
                  </span>
                )}

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            CATEGORY NAV
        =================================================== */}

        <section
          className="
            border-y
            border-[#2d2522]/15
          "
        >

          <div
            className="
              mx-auto
              flex
              max-w-[1400px]
              overflow-x-auto
              px-6
              md:px-10
            "
          >

            {categories.map(
              (category) => {
                const active =
                  activeCategory ===
                  category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() =>
                      setActiveCategory(
                        category.id
                      )
                    }
                    className={`
                      whitespace-nowrap
                      border-r
                      border-[#2d2522]/15
                      px-5
                      py-5
                      text-sm
                      transition
                      first:border-l

                      ${
                        active
                          ? "bg-[#111] text-white"
                          : "hover:bg-[#eeeae6]"
                      }
                    `}
                  >
                    {category.label}
                  </button>
                );
              }
            )}

          </div>

        </section>

        {/* ===================================================
            RESULTS
        =================================================== */}

        <section
          className="
            mx-auto
            max-w-[1400px]
            px-6
            py-12
            md:px-10
            md:py-16
          "
        >

          <div
            className="
              mb-8
              flex
              items-end
              justify-between
              gap-5
            "
          >

            <div>

              <p
                className="
                  mb-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#8b6f61]
                "
              >
                {recommendations.length} products
              </p>

              <h2
                className="
                  text-3xl
                  font-bold
                  tracking-[-0.04em]
                  md:text-4xl
                "
              >
                Recommended for you
              </h2>

            </div>

            <button
              onClick={() =>
                navigate("/kit")
              }
              className="
                hidden
                items-center
                gap-2
                border-b
                border-[#111]
                pb-1
                text-sm
                font-semibold
                sm:flex
              "
            >
              View my kit

              <ChevronRight size={15} />
            </button>

          </div>

          {/* =================================================
              NO RESULTS
          ================================================= */}

          {recommendations.length ===
          0 ? (
            <div
              className="
                border
                border-[#2d2522]/15
                px-6
                py-20
                text-center
              "
            >

              <h3
                className="
                  mb-3
                  text-2xl
                  font-bold
                "
              >
                No matches found
              </h3>

              <p
                className="
                  mx-auto
                  max-w-md
                  text-sm
                  leading-6
                  text-[#2d2522]/60
                "
              >
                Try increasing your budget
                or changing your preferences
                to see more recommendations.
              </p>

              <button
                onClick={() =>
                  navigate("/preferences")
                }
                className="
                  eunoia-button
                  mt-7
                  bg-[#111]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                "
              >
                Edit preferences
              </button>

            </div>
          ) : (
            <div
              className="
                grid
                gap-x-5
                gap-y-12
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >

              {recommendations.map(
                (product) => {
                  const added =
                    isInKit(
                      product.id
                    );

                  /*
                   * Matcher score is already
                   * out of 100.
                   */

                  const score =
                    getDisplayScore(
                      product
                    );

                  const image =
                    getProductImage(
                      product
                    );

                  return (
                    <article
                      key={product.id}
                      className="
                        eunoia-product-card
                        group
                      "
                    >

                      {/* PRODUCT IMAGE */}

                      <div
                        className="
                          eunoia-product-image
                          relative
                          aspect-[4/5]
                          overflow-hidden
                          bg-[#eeeae6]
                        "
                      >

                        <img
                          src={image}
                          alt={product.name}
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                          onError={(
                            event
                          ) => {
                            /*
                             * Don't keep repeatedly
                             * triggering the error.
                             */

                            event.currentTarget.onerror =
                              null;

                            event.currentTarget.src =
                              categoryImages[
                                product.category
                              ] ||
                              categoryImages.foundation;
                          }}
                        />

                        {/* MATCH */}

                        <div
                          className="
                            score-pop
                            absolute
                            left-4
                            top-4
                            flex
                            items-center
                            gap-2
                            bg-[#faf8f6]
                            px-3
                            py-2
                            text-xs
                            font-bold
                          "
                        >

                          <span
                            className="
                              h-2
                              w-2
                              rounded-full
                              bg-[#8b6f61]
                            "
                          />

                          {score}% match

                        </div>

                        {/* CATEGORY */}

                        <div
                          className="
                            absolute
                            bottom-4
                            left-4
                            bg-[#111]
                            px-3
                            py-2
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.15em]
                            text-white
                          "
                        >
                          {product.category}
                        </div>

                      </div>

                      {/* PRODUCT INFORMATION */}

                      <div className="pt-5">

                        <div
                          className="
                            mb-1
                            text-xs
                            uppercase
                            tracking-[0.15em]
                            text-[#2d2522]/45
                          "
                        >
                          {product.brand}
                        </div>

                        <h3
                          className="
                            text-lg
                            font-bold
                            leading-tight
                          "
                        >
                          {product.name}
                        </h3>

                        {product.shade && (
                          <p
                            className="
                              mt-2
                              text-sm
                              text-[#2d2522]/55
                            "
                          >
                            Shade:{" "}
                            {product.shade}
                          </p>
                        )}

                        {product.matchReason && (
                          <p
                            className="
                              mt-3
                              text-sm
                              leading-5
                              text-[#2d2522]/65
                            "
                          >
                            {product.matchReason}
                          </p>
                        )}

                        {/* PRICE + BUTTON */}

                        <div
                          className="
                            mt-5
                            flex
                            items-center
                            justify-between
                            border-t
                            border-[#2d2522]/10
                            pt-4
                          "
                        >

                          <span
                            className="
                              text-base
                              font-semibold
                            "
                          >
                            ₹
                            {Number(
                              product.price || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </span>

                          <button
                            onClick={() =>
                              toggleKit(
                                product
                              )
                            }
                            className={`
                              flex
                              items-center
                              gap-2
                              border
                              px-3
                              py-2
                              text-xs
                              font-semibold
                              transition

                              ${
                                added
                                  ? `
                                    border-[#111]
                                    bg-[#111]
                                    text-white
                                    hover:bg-white
                                    hover:text-[#111]
                                  `
                                  : `
                                    border-[#111]
                                    bg-transparent
                                    text-[#111]
                                    hover:bg-[#111]
                                    hover:text-white
                                  `
                              }
                            `}
                          >

                            {added ? (
                              <>
                                <Check
                                  size={14}
                                />

                                Added
                              </>
                            ) : (
                              <>
                                <ShoppingBag
                                  size={14}
                                />

                                Add to kit
                              </>
                            )}

                          </button>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* ===================================================
            KIT CTA
        =================================================== */}

        <section
          className="
            border-t
            border-[#2d2522]/15
            bg-[#e9dfd8]
          "
        >

          <div
            className="
              mx-auto
              flex
              max-w-[1400px]
              flex-col
              justify-between
              gap-8
              px-6
              py-14
              md:flex-row
              md:items-center
              md:px-10
              md:py-20
            "
          >

            <div>

              <p
                className="
                  mb-3
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#8b6f61]
                "
              >
                Your collection
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                  tracking-[-0.04em]
                  md:text-5xl
                "
              >
                BUILD YOUR EUNOIA KIT.
              </h2>

              <p
                className="
                  mt-4
                  max-w-xl
                  text-sm
                  leading-6
                  text-[#2d2522]/65
                "
              >
                Save the products you love
                and see your complete
                personalised makeup collection
                in one place.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/kit")
              }
              className="
                eunoia-button
                flex
                w-fit
                items-center
                gap-3
                bg-[#111]
                px-7
                py-4
                text-sm
                font-semibold
                text-white
              "
            >
              View my kit

              <ChevronRight size={17} />
            </button>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="
          border-t
          border-[#2d2522]/15
          bg-[#faf8f6]
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-[1400px]
            flex-col
            gap-4
            px-6
            py-8
            text-xs
            text-[#2d2522]/50
            md:flex-row
            md:items-center
            md:justify-between
            md:px-10
          "
        >

          <span
            className="
              font-black
              tracking-[-0.05em]
              text-[#2d2522]
            "
          >
            EUNOIA
          </span>

          <span>
            Personalised beauty, powered by
            your own features.
          </span>

        </div>

      </footer>

    </div>
  );
}