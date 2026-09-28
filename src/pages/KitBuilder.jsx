import {
  ArrowRight,
  Check,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";


import productImages from "../productImages";

import { supabase } from "../lib/supabase";
import {
  getSavedProducts,
  deleteSavedProduct,
} from "../services/supabaseData";

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

function getProductImage(product) {
  return (
    productImages[product.id] ||
    product.image ||
    product.imageUrl ||
    categoryImages[product.category] ||
    categoryImages.foundation
  );
}

function getMatchScore(product) {
  if (
    product.match !== undefined &&
    product.match !== null
  ) {
    return Math.round(Number(product.match));
  }

  if (
    product.matchScore !== undefined &&
    product.matchScore !== null
  ) {
    if (
      product.category === "foundation" ||
      product.category === "concealer"
    ) {
      return Math.min(
        100,
        Math.max(
          0,
          Math.round(Number(product.matchScore))
        )
      );
    }

    return Math.min(
      100,
      Math.max(
        0,
        Math.round(
          (Number(product.matchScore) / 70) * 100
        )
      )
    );
  }

  return null;
}

export default function KitBuilder() {
  const navigate = useNavigate();

  const [kit, setKit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /*
   * ---------------------------------------------------------
   * LOAD SAVED PRODUCTS FROM SUPABASE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    async function loadKit() {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error("No logged-in user found.");
        }

        const savedProducts = await getSavedProducts(user.id);

        if (cancelled) {
          return;
        }

        /*
         * Convert Supabase rows back into the
         * product format used by the Kit UI.
         */

        const formattedProducts = savedProducts.map(
          (product) => ({
            id: product.product_id,
            name: product.product_name,
            brand: product.brand,
            category: product.category,
            shade: product.shade,
            price: product.price,
            imageUrl: product.image_url,
          })
        );

        setKit(formattedProducts);

        /*
         * Remove the old localStorage copy.
         *
         * Supabase is now the source of truth.
         */

        localStorage.removeItem("aura-kit");
      } catch (error) {
        console.error(
          "Error loading saved products:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadKit();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * REMOVE ONE PRODUCT
   * ---------------------------------------------------------
   */

  const removeFromKit = async (id) => {
    try {
      setActionLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error("No logged-in user found.");
      }

      /*
       * Delete from Supabase FIRST.
       */

      await deleteSavedProduct(
        user.id,
        id
      );

      /*
       * Then update the UI.
       */

      setKit((currentKit) =>
        currentKit.filter(
          (product) =>
            String(product.id) !== String(id)
        )
      );

      /*
       * Tell the navbar / basket that the kit changed.
       */

      window.dispatchEvent(
        new CustomEvent(
          "eunoia-kit-updated",
          {
            detail: {
              action: "remove",
              product: {
                id,
              },
            },
          }
        )
      );
    } catch (error) {
      console.error(
        "Error removing product from kit:",
        error
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * DELETE ALL PRODUCTS
   * ---------------------------------------------------------
   */

  const deleteAll = async () => {
    try {
      setActionLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error("No logged-in user found.");
      }

      /*
       * Delete every saved product from Supabase.
       *
       * We intentionally use the existing
       * deleteSavedProduct() function so we don't
       * need another database function.
       */

      const currentProducts = [...kit];

      await Promise.all(
        currentProducts.map((product) =>
          deleteSavedProduct(
            user.id,
            product.id
          )
        )
      );

      /*
       * Clear the UI only after Supabase
       * deletion succeeds.
       */

      setKit([]);

      /*
       * Remove any old localStorage copy.
       */

      localStorage.removeItem("aura-kit");

      /*
       * Update navbar / basket.
       */

      window.dispatchEvent(
        new CustomEvent(
          "eunoia-kit-updated",
          {
            detail: {
              action: "clear",
            },
          }
        )
      );
    } catch (error) {
      console.error(
        "Error deleting all saved products:",
        error
      );
    } finally {
      setActionLoading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * TOTAL
   * ---------------------------------------------------------
   */

  const total = useMemo(() => {
    return kit.reduce(
      (sum, product) =>
        sum + Number(product.price || 0),
      0
    );
  }, [kit]);

  /*
   * ---------------------------------------------------------
   * LOADING STATE
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5f2] text-[#111111]">
       

        <main className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gray-500">
              EUNOIA / MY KIT
            </p>

            <h1 className="mt-5 text-4xl font-semibold">
              Loading your kit...
            </h1>

            <p className="mt-4 text-sm text-gray-500">
              Retrieving your saved products.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#111111]">
{/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-[1500px] px-6 py-16 md:px-10 md:py-24">

        {/* ===================================================
            TITLE
        =================================================== */}

        <section className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">

          <div>

            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-gray-500">
              EUNOIA / MY KIT
            </p>

            <h1 className="text-6xl font-semibold uppercase leading-[0.88] tracking-[-0.06em] md:text-8xl">
              Your
              <br />
              kit.
            </h1>

          </div>

          <div className="border-l border-black/20 pl-6 lg:mb-2">

            <p className="text-sm leading-7 text-gray-600">
              Everything you've selected in
              one place. Build your personalised
              makeup routine without starting
              from scratch.
            </p>

          </div>

        </section>

        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {kit.length === 0 && (
          <section className="mt-16 border-y border-black/10 py-24 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black/20">
              <ShoppingBag
                size={24}
                strokeWidth={1.5}
              />
            </div>

            <h2 className="mt-8 text-3xl font-semibold">
              Your kit is empty.
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-600">
              Explore your personalised matches
              and add products you want to keep.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/results")
              }
              className="
                mt-8
                inline-flex
                items-center
                gap-3
                bg-black
                px-7
                py-4
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-white
                transition
                hover:bg-[#2d2522]
              "
            >
              Explore my matches
              <ArrowRight size={15} />
            </button>

          </section>
        )}

        {/* ===================================================
            KIT CONTENT
        =================================================== */}

        {kit.length > 0 && (
          <>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <section className="mt-16 border-y border-black/10">

              <div className="grid md:grid-cols-3">

                <div className="border-b border-black/10 p-6 md:border-b-0 md:border-r">

                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                    Products
                  </p>

                  <p className="mt-3 text-3xl font-semibold">
                    {kit.length}
                  </p>

                </div>

                <div className="border-b border-black/10 p-6 md:border-b-0 md:border-r">

                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                    Estimated total
                  </p>

                  <p className="mt-3 text-3xl font-semibold">
                    ₹
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

                <div className="p-6">

                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                    Match status
                  </p>

                  <div className="mt-3 flex items-center gap-2">

                    <Check size={18} />

                    <p className="text-xl font-semibold">
                      Personalised
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                SELECTED PRODUCTS
            ================================================= */}

            <section className="mt-12">

              <div className="mb-6 flex items-center justify-between">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
                    Selected products
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold">
                    Your routine
                  </h2>

                </div>

                <div className="flex items-center gap-5">

                  <button
                    type="button"
                    onClick={deleteAll}
                    disabled={actionLoading}
                    className="
                      flex
                      items-center
                      gap-2
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#8b5f53]
                      transition
                      hover:text-black
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <Trash2 size={14} />
                    Delete all
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/results")
                    }
                    className="
                      hidden
                      items-center
                      gap-2
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      md:flex
                    "
                  >
                    Add more
                    <ArrowRight size={14} />
                  </button>

                </div>

              </div>

              <div className="divide-y divide-black/10 border-y border-black/10">

                {kit.map(
                  (product, index) => {

                    const image =
                      getProductImage(product);

                    const score =
                      getMatchScore(product);

                    return (
                      <article
                        key={product.id}
                        className="
                          grid
                          gap-6
                          py-6
                          md:grid-cols-[60px_180px_1fr_auto]
                          md:items-center
                        "
                      >

                        {/* NUMBER */}

                        <div className="hidden md:block">

                          <span className="text-xs font-semibold">
                            {String(
                              index + 1
                            ).padStart(2, "0")}
                          </span>

                        </div>

                        {/* IMAGE */}

                        <div className="aspect-square overflow-hidden bg-[#e9e5e1]">

                          <img
                            src={image}
                            alt={product.name}
                            className="
                              h-full
                              w-full
                              object-cover
                              transition
                              duration-500
                              hover:scale-[1.03]
                            "
                            onError={(
                              event
                            ) => {
                              event.currentTarget.src =
                                categoryImages[
                                  product.category
                                ] ||
                                categoryImages.foundation;
                            }}
                          />

                        </div>

                        {/* INFO */}

                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/50">
                            {product.brand}
                          </p>

                          <h3 className="mt-2 text-xl font-semibold">
                            {product.name}
                          </h3>

                          {product.shade && (
                            <p className="mt-2 text-sm text-gray-500">
                              Shade:{" "}
                              {product.shade}
                            </p>
                          )}

                          {score !== null && (
                            <div className="mt-4 flex items-center gap-2">

                              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em]">

                                <Check size={13} />

                                {score}% match

                              </span>

                            </div>
                          )}

                        </div>

                        {/* PRICE + DELETE */}

                        <div className="flex items-center justify-between gap-6 md:justify-end">

                          <p className="text-lg font-semibold">
                            ₹
                            {Number(
                              product.price || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromKit(
                                product.id
                              )
                            }
                            disabled={
                              actionLoading
                            }
                            className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              border
                              border-black/10
                              transition
                              hover:border-black
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            </section>

            {/* =================================================
                BOTTOM INFORMATION
            ================================================= */}

            <section className="mt-20 grid gap-10 lg:grid-cols-2">

              <div className="border-t border-black pt-6">

                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
                  Your personalised routine
                </p>

                <h2 className="mt-4 max-w-xl text-4xl font-semibold uppercase leading-none tracking-[-0.04em]">
                  Less guessing.
                  <br />
                  More confidence.
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-7 text-gray-600">
                  Your kit is built around your
                  skin profile, undertone and
                  preferences.
                </p>

              </div>

              <div className="border-t border-black pt-6">

                <div className="flex items-center gap-3">

                  <Heart size={17} />

                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Keep exploring
                  </p>

                </div>

                <p className="mt-5 max-w-md text-sm leading-7 text-gray-600">
                  Explore more products that
                  match your profile.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/results")
                  }
                  className="
                    mt-6
                    flex
                    items-center
                    gap-3
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                  "
                >
                  Explore matches
                  <ArrowRight size={14} />
                </button>

              </div>

            </section>

          </>
        )}

      </main>


    </div>
  );
}