import { useMemo, useState } from "react";
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
  { id: "all", label: "All" },
  { id: "foundation", label: "Foundation" },
  { id: "concealer", label: "Concealer" },
  { id: "blush", label: "Blush" },
  { id: "lipstick", label: "Lip" },
  { id: "eyeshadow", label: "Eyeshadow" },
];

function getDisplayScore(product) {
  if (
    product.category === "foundation" ||
    product.category === "concealer"
  ) {
    return Math.min(100, Math.max(0, Math.round(product.matchScore ?? 0)));
  }

  return Math.min(
    100,
    Math.max(0, Math.round(((product.matchScore ?? 0) / 70) * 100))
  );
}

function Results() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("all");

  const [kit, setKit] = useState(() => {
    try {
      const savedKit = localStorage.getItem("aura-kit");

      if (!savedKit) {
        return [];
      }

      return JSON.parse(savedKit);
    } catch {
      return [];
    }
  });

  const savedPreferences = useMemo(() => {
    try {
      const saved = localStorage.getItem("aura-preferences");

      if (!saved) {
        return {
          skinType: "combination",
          look: "natural",
          budget: 4000,
          brands: [],
        };
      }

      return JSON.parse(saved);
    } catch {
      return {
        skinType: "combination",
        look: "natural",
        budget: 4000,
        brands: [],
      };
    }
  }, []);

  /*
    TEMPORARY PROFILE

    Person 2 will eventually replace this with the
    actual MediaPipe skin analysis result.
  */
  const skinProfile = {
    depth: "medium",
    undertone: "warm",
  };

  const baseUser = {
    depth: skinProfile.depth,
    undertone: skinProfile.undertone,
    budget: savedPreferences.budget,
  };

  const recommendations = useMemo(() => {
    try {
      if (activeCategory === "all") {
        const categoriesToFetch = [
          "foundation",
          "concealer",
          "blush",
          "lipstick",
          "eyeshadow",
        ];

        const allProducts = categoriesToFetch.flatMap((category) => {
          return getRecommendations({
            ...baseUser,
            category,
          });
        });

        return allProducts;
      }

      return getRecommendations({
        ...baseUser,
        category: activeCategory,
      });
    } catch (error) {
      console.error("Recommendation error:", error);
      return [];
    }
  }, [
    activeCategory,
    savedPreferences.budget,
  ]);

  const toggleKit = (product) => {
    setKit((currentKit) => {
      const alreadyAdded = currentKit.some(
        (item) => item.id === product.id
      );

      let updatedKit;

      if (alreadyAdded) {
        updatedKit = currentKit.filter(
          (item) => item.id !== product.id
        );
      } else {
        updatedKit = [
          ...currentKit,
          product,
        ];
      }

      localStorage.setItem(
        "aura-kit",
        JSON.stringify(updatedKit)
      );

      return updatedKit;
    });
  };

  const isInKit = (productId) => {
    return kit.some((item) => item.id === productId);
  };

  const getProductImage = (product) => {
    return (
      productImages[product.id] ||
      product.image ||
      categoryImages[product.category] ||
      categoryImages.foundation
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f6] text-[#2d2522]">
      {/* HEADER */}
      <header className="border-b border-[#2d2522]/15 bg-[#faf8f6]">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-10">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-black tracking-[-0.08em]"
          >
            AURA
          </button>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <button
              onClick={() => navigate("/")}
              className="hover:opacity-60"
            >
              Discover
            </button>

            <button
              onClick={() => navigate("/scan")}
              className="hover:opacity-60"
            >
              AI Scan
            </button>

            <button
              className="font-semibold underline underline-offset-4"
            >
              Recommendations
            </button>
          </div>

          <button
            onClick={() => navigate("/kit")}
            className="relative flex items-center gap-2 text-sm"
          >
            <ShoppingBag size={19} />

            <span className="hidden sm:inline">
              My Kit
            </span>

            {kit.length > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#111] px-1 text-[10px] font-semibold text-white">
                {kit.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* PAGE INTRO */}
      <main>
        <section className="mx-auto max-w-[1400px] px-6 pb-10 pt-14 md:px-10 md:pt-20">
          <button
            onClick={() => navigate("/preferences")}
            className="mb-10 flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-[#2d2522]/60 hover:text-[#2d2522]"
          >
            <ArrowLeft size={16} />
            Back to preferences
          </button>

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b6f61]">
                <Sparkles size={14} />
                Your personalised edit
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.06em] md:text-7xl">
                YOUR
                <br />
                MATCHES.
              </h1>
            </div>

            <div className="max-w-lg lg:ml-auto">
              <p className="text-base leading-7 text-[#2d2522]/65 md:text-lg">
                Based on your skin analysis and preferences,
                AURA has selected products that match your
                complexion, undertone and budget.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="border border-[#2d2522]/15 px-3 py-2 text-xs uppercase tracking-[0.12em]">
                  {skinProfile.depth} depth
                </span>

                <span className="border border-[#2d2522]/15 px-3 py-2 text-xs uppercase tracking-[0.12em]">
                  {skinProfile.undertone} undertone
                </span>

                {savedPreferences.look && (
                  <span className="border border-[#2d2522]/15 px-3 py-2 text-xs uppercase tracking-[0.12em]">
                    {savedPreferences.look}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY NAV */}
        <section className="border-y border-[#2d2522]/15">
          <div className="mx-auto flex max-w-[1400px] gap-0 overflow-x-auto px-6 md:px-10">
            {categories.map((category) => {
              const active = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`whitespace-nowrap border-r border-[#2d2522]/15 px-5 py-5 text-sm transition first:border-l ${
                    active
                      ? "bg-[#111] text-white"
                      : "hover:bg-[#eeeae6]"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* RESULTS */}
        <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-10 md:py-16">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b6f61]">
                {recommendations.length} products
              </p>

              <h2 className="text-3xl font-bold tracking-[-0.04em] md:text-4xl">
                Recommended for you
              </h2>
            </div>

            <button
              onClick={() => navigate("/kit")}
              className="hidden items-center gap-2 border-b border-[#111] pb-1 text-sm font-semibold sm:flex"
            >
              View my kit
              <ChevronRight size={15} />
            </button>
          </div>

          {recommendations.length === 0 ? (
            <div className="border border-[#2d2522]/15 px-6 py-20 text-center">
              <h3 className="mb-3 text-2xl font-bold">
                No matches found
              </h3>

              <p className="mx-auto max-w-md text-sm leading-6 text-[#2d2522]/60">
                Try increasing your budget or changing your
                preferences to see more recommendations.
              </p>

              <button
                onClick={() => navigate("/preferences")}
                className="mt-7 bg-[#111] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2d2522]"
              >
                Edit preferences
              </button>
            </div>
          ) : (
            <div className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recommendations.map((product) => {
                const added = isInKit(product.id);
                const score = getDisplayScore(product);
                const image = getProductImage(product);

                return (
                  <article
                    key={product.id}
                    className="group"
                  >
                    {/* PRODUCT IMAGE */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#eeeae6]">
                      <img
                        src={image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        onError={(event) => {
                          event.currentTarget.src =
                            categoryImages[
                              product.category
                            ] ||
                            categoryImages.foundation;
                        }}
                      />

                      {/* MATCH SCORE */}
                      <div className="absolute left-4 top-4 flex items-center gap-2 bg-[#faf8f6] px-3 py-2 text-xs font-bold">
                        <span className="h-2 w-2 rounded-full bg-[#8b6f61]" />
                        {score}% match
                      </div>

                      {/* CATEGORY */}
                      <div className="absolute bottom-4 left-4 bg-[#111] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                        {product.category}
                      </div>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="pt-5">
                      <div className="mb-1 text-xs uppercase tracking-[0.15em] text-[#2d2522]/45">
                        {product.brand}
                      </div>

                      <h3 className="text-lg font-bold leading-tight">
                        {product.name}
                      </h3>

                      {product.shade && (
                        <p className="mt-2 text-sm text-[#2d2522]/55">
                          Shade: {product.shade}
                        </p>
                      )}

                      {product.matchReason && (
                        <p className="mt-3 text-sm leading-5 text-[#2d2522]/65">
                          {product.matchReason}
                        </p>
                      )}

                      <div className="mt-5 flex items-center justify-between border-t border-[#2d2522]/10 pt-4">
                        <span className="text-base font-semibold">
                          ₹{product.price}
                        </span>

                        <button
                          onClick={() => toggleKit(product)}
                          className={`flex items-center gap-2 border px-3 py-2 text-xs font-semibold transition ${
                            added
                              ? "border-[#111] bg-[#111] text-white hover:bg-transparent hover:text-[#111]"
                              : "border-[#111] bg-transparent text-[#111] hover:bg-[#111] hover:text-white"
                          }`}
                        >
                          {added ? (
                            <>
                              <Check size={14} />
                              Added to kit
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} />
                              Add to kit
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* KIT CTA */}
        <section className="border-t border-[#2d2522]/15 bg-[#e9dfd8]">
          <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 px-6 py-14 md:flex-row md:items-center md:px-10 md:py-20">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b6f61]">
                Your collection
              </p>

              <h2 className="text-3xl font-black tracking-[-0.04em] md:text-5xl">
                BUILD YOUR AURA KIT.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-[#2d2522]/65">
                Save the products you love and see your complete
                personalised makeup collection in one place.
              </p>
            </div>

            <button
              onClick={() => navigate("/kit")}
              className="flex w-fit items-center gap-3 bg-[#111] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#2d2522]"
            >
              View my kit
              <ChevronRight size={17} />
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#2d2522]/15 bg-[#faf8f6]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-6 py-8 text-xs text-[#2d2522]/50 md:flex-row md:items-center md:justify-between md:px-10">
          <span className="font-black tracking-[-0.05em] text-[#2d2522]">
            AURA
          </span>

          <span>
            Personalised beauty, powered by your own features.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Results;