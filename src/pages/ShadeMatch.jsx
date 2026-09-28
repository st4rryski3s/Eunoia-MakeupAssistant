import { useMemo, useRef, useState } from "react";
import { ArrowRight, Check, ShoppingBag } from "lucide-react";

import productImages from "../productImages";

import {
  getBrandsForCategory,
  getProductsForBrand,
  findShadeMatches,
} from "../shadeMatcher";

const KIT_KEY = "aura-kit";

const categoryImages = {
  foundation:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=85",

  concealer:
    "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=1400&q=85",
};

const categories = [
  {
    value: "foundation",
    label: "Foundation",
  },
  {
    value: "concealer",
    label: "Concealer",
  },
];

function getProductImage(product) {
  return (
    productImages[product.id] ||
    product.image ||
    categoryImages[product.category] ||
    categoryImages.foundation
  );
}

function getInitialKit() {
  try {
    const saved = localStorage.getItem(KIT_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ShadeMatch() {
  const [category, setCategory] =
    useState("foundation");

  const [sourceBrand, setSourceBrand] =
    useState("");

  const [sourceProduct, setSourceProduct] =
    useState("");

  const [targetBrand, setTargetBrand] =
    useState("");

  const [matches, setMatches] = useState([]);

  const [hasSearched, setHasSearched] =
    useState(false);

  const [kit, setKit] =
    useState(getInitialKit);

  const resultsRef = useRef(null);

  const sourceBrands = useMemo(() => {
    return getBrandsForCategory(category);
  }, [category]);

  const sourceProducts = useMemo(() => {
    if (!sourceBrand) {
      return [];
    }

    return getProductsForBrand(
      category,
      sourceBrand
    );
  }, [category, sourceBrand]);

  const targetBrands = useMemo(() => {
    return getBrandsForCategory(category);
  }, [category]);

  const selectedProduct = useMemo(() => {
    return sourceProducts.find(
      (product) =>
        product.id === sourceProduct
    );
  }, [
    sourceProducts,
    sourceProduct,
  ]);

  function handleCategoryChange(value) {
    setCategory(value);
    setSourceBrand("");
    setSourceProduct("");
    setTargetBrand("");
    setMatches([]);
    setHasSearched(false);
  }

  function handleSourceBrandChange(value) {
    setSourceBrand(value);
    setSourceProduct("");
    setMatches([]);
    setHasSearched(false);
  }

  function handleFindMatch() {
    if (
      !category ||
      !sourceBrand ||
      !sourceProduct ||
      !targetBrand
    ) {
      return;
    }

    const results = findShadeMatches({
      category,
      sourceBrand,
      sourceProductId: sourceProduct,
      targetBrand,
    });

    setMatches(results);
    setHasSearched(true);

    requestAnimationFrame(() => {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    });
  }

  function toggleKit(product) {
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
        KIT_KEY,
        JSON.stringify(updatedKit)
      );

      window.dispatchEvent(
        new CustomEvent(
          "eunoia-kit-updated",
          {
            detail: {
              action: alreadyAdded
                ? "remove"
                : "add",
              product,
            },
          }
        )
      );

      return updatedKit;
    });
  }

  function isInKit(product) {
    return kit.some(
      (item) => item.id === product.id
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#111111]">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="border-b border-[#d8d3cd]">
        <div className="mx-auto max-w-[1500px] px-6 pb-24 pt-20 md:px-10 md:pb-32 md:pt-24 lg:px-12">

          <div className="max-w-5xl">

            <p className="mb-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#77716b]">
              EUNOIA / 02
            </p>

            <h1 className="text-[clamp(3.8rem,8vw,8.5rem)] font-light leading-[0.86] tracking-[-0.06em]">
              Find your
              <br />

              <span className="italic">
                shade elsewhere.
              </span>
            </h1>

            <p className="mt-10 max-w-2xl text-base leading-8 text-[#68635e] md:text-lg">
              Already know a shade you love?
              EUNOIA translates it across
              brands using depth and
              undertone — so you can discover
              your closest match without
              starting from zero.
            </p>

          </div>

        </div>
      </section>


      {/* ==================================================
          MATCHER
      ================================================== */}

      <section className="border-b border-[#d8d3cd]">

        <div className="mx-auto max-w-[1500px] px-6 py-14 md:px-10 md:py-20 lg:px-12">

          {/* HEADER */}

          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#77716b]">
                Shade translator
              </p>

              <h2 className="text-3xl font-light tracking-[-0.04em] md:text-4xl">
                Tell us what you wear.
              </h2>

            </div>

            <p className="max-w-md text-sm leading-6 text-[#77716b] md:text-right">
              Choose your current product,
              then select the brand you want
              to explore.
            </p>

          </div>


          {/* ==================================================
              CATEGORY
          ================================================== */}

          <div className="mb-10 border-y border-[#d8d3cd]">

            <div className="flex">

              {categories.map((item) => {

                const active =
                  category === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      handleCategoryChange(
                        item.value
                      )
                    }
                    className={`
                      min-w-[170px]
                      border-r
                      border-[#d8d3cd]
                      px-8
                      py-5
                      text-[10px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      transition
                      first:border-l
                      first:border-[#d8d3cd]

                      ${
                        active
                          ? "bg-[#111111] text-white"
                          : "bg-transparent text-[#55504b] hover:bg-[#ebe7e2]"
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}

            </div>

          </div>


          {/* ==================================================
              MAIN HORIZONTAL MATCHER
          ================================================== */}

          <div className="grid overflow-hidden border border-[#d8d3cd] bg-[#efebe6] lg:grid-cols-[1fr_1.15fr_auto_1fr_220px]">

            {/* SOURCE BRAND */}

            <div className="border-b border-[#d8d3cd] p-8 lg:border-b-0 lg:border-r lg:p-11">

              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#66605a]">
                01 / Your brand
              </p>

              <select
                value={sourceBrand}
                onChange={(event) =>
                  handleSourceBrandChange(
                    event.target.value
                  )
                }
                className="
                  w-full
                  appearance-none
                  border-b
                  border-[#aaa39c]
                  bg-transparent
                  pb-5
                  text-lg
                  font-medium
                  outline-none
                "
              >

                <option value="">
                  Select brand
                </option>

                {sourceBrands.map(
                  (brand) => (
                    <option
                      key={brand}
                      value={brand}
                    >
                      {brand}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* SOURCE SHADE */}

            <div className="border-b border-[#d8d3cd] p-8 lg:border-b-0 lg:border-r lg:p-11">

              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#66605a]">
                02 / Your shade
              </p>

              <select
                value={sourceProduct}
                onChange={(event) => {

                  setSourceProduct(
                    event.target.value
                  );

                  setMatches([]);
                  setHasSearched(false);

                }}
                disabled={!sourceBrand}
                className="
                  w-full
                  appearance-none
                  border-b
                  border-[#aaa39c]
                  bg-transparent
                  pb-5
                  text-lg
                  font-medium
                  outline-none
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >

                <option value="">
                  {sourceBrand
                    ? "Select shade"
                    : "Select brand first"}
                </option>

                {sourceProducts.map(
                  (product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.shade ||
                        product.name}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* ARROW */}

            <div className="hidden items-center justify-center px-10 lg:flex">

              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c7c0b9]">

                <ArrowRight
                  size={24}
                  strokeWidth={1.5}
                />

              </div>

            </div>


            {/* TARGET BRAND */}

            <div className="border-b border-[#d8d3cd] p-8 lg:border-b-0 lg:border-r lg:p-11">

              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#66605a]">
                03 / Find it in
              </p>

              <select
                value={targetBrand}
                onChange={(event) => {

                  setTargetBrand(
                    event.target.value
                  );

                  setMatches([]);
                  setHasSearched(false);

                }}
                className="
                  w-full
                  appearance-none
                  border-b
                  border-[#aaa39c]
                  bg-transparent
                  pb-5
                  text-lg
                  font-medium
                  outline-none
                "
              >

                <option value="">
                  Select brand
                </option>

                {targetBrands
                  .filter(
                    (brand) =>
                      brand !== sourceBrand
                  )
                  .map((brand) => (

                    <option
                      key={brand}
                      value={brand}
                    >
                      {brand}
                    </option>

                  ))}

              </select>

            </div>


            {/* FIND BUTTON */}

            <div className="flex items-center p-6 lg:p-8">

              <button
                type="button"
                onClick={handleFindMatch}
                disabled={
                  !sourceBrand ||
                  !sourceProduct ||
                  !targetBrand
                }
                className="
                  flex
                  min-h-[72px]
                  w-full
                  items-center
                  justify-center
                  gap-4
                  bg-[#111111]
                  px-8
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-white
                  transition
                  hover:bg-[#2c2926]
                  disabled:cursor-not-allowed
                  disabled:bg-[#aaa39c]
                "
              >

                <span>
                  Find
                  <br />
                  Match
                </span>

                <ArrowRight
                  size={19}
                  strokeWidth={1.7}
                />

              </button>

            </div>

          </div>


          {/* ==================================================
              CURRENT PRODUCT PREVIEW
          ================================================== */}

          {selectedProduct && (

            <div className="mt-10 grid overflow-hidden border border-[#d8d3cd] bg-white md:grid-cols-[300px_1fr]">

              <div className="h-[320px] overflow-hidden md:h-full">

                <img
                  src={getProductImage(
                    selectedProduct
                  )}
                  alt={
                    selectedProduct.name
                  }
                  className="h-full w-full object-cover"
                  onError={(event) => {

                    event.currentTarget.src =
                      categoryImages[
                        selectedProduct
                          .category
                      ] ||
                      categoryImages.foundation;

                  }}
                />

              </div>


              <div className="flex flex-col justify-center p-9 md:p-12 lg:p-14">

                <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8a837c]">
                  Your current shade
                </p>

                <h3 className="text-3xl font-light tracking-[-0.04em] md:text-4xl">
                  {selectedProduct.brand}
                </h3>

                <p className="mt-2 text-base text-[#55504b]">
                  {selectedProduct.name}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">

                  <span className="border border-[#d8d3cd] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em]">
                    {selectedProduct.shade ||
                      "Shade"}
                  </span>

                  {selectedProduct.depth && (
                    <span className="border border-[#d8d3cd] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em]">
                      {selectedProduct.depth}
                    </span>
                  )}

                  {selectedProduct.undertone && (
                    <span className="border border-[#d8d3cd] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em]">
                      {selectedProduct.undertone}
                    </span>
                  )}

                </div>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* ==================================================
          RESULTS
      ================================================== */}

      {hasSearched && (

        <section
          ref={resultsRef}
          className="scroll-mt-20 border-b border-[#d8d3cd]"
        >

          <div className="mx-auto max-w-[1500px] px-6 py-20 md:px-10 md:py-28 lg:px-12">

            {/* RESULT HEADER */}

            <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">

              <div>

                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#77716b]">
                  EUNOIA translation
                </p>

                <h2 className="text-5xl font-light leading-[0.9] tracking-[-0.05em] md:text-7xl">
                  Your closest
                  <br />

                  <span className="italic">
                    matches.
                  </span>
                </h2>

              </div>

              <div className="max-w-md text-sm leading-7 text-[#68635e] md:text-right">

                {matches.length > 0
                  ? `We found ${matches.length} ${
                      matches.length === 1
                        ? "possible match"
                        : "possible matches"
                    } in ${targetBrand}.`
                  : `We couldn't find a matching shade in ${targetBrand}.`}

              </div>

            </div>


            {/* NO RESULTS */}

            {matches.length === 0 ? (

              <div className="border border-[#d8d3cd] bg-white px-8 py-24 text-center">

                <p className="text-3xl font-light">
                  No close matches found.
                </p>

                <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#77716b]">
                  Try another shade or another
                  target brand. EUNOIA only
                  displays products available
                  in the current database.
                </p>

              </div>

            ) : (

              <>

                {/* ==================================================
                    BEST MATCH
                ================================================== */}

                <article className="group mb-20 overflow-hidden border border-[#d8d3cd] bg-white">

                  <div className="grid lg:grid-cols-[1.25fr_1fr]">

                    {/* IMAGE */}

                    <div className="relative min-h-[520px] overflow-hidden bg-[#ebe7e2] md:min-h-[650px]">

                      <img
                        src={getProductImage(
                          matches[0]
                        )}
                        alt={
                          matches[0].name
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-700
                          group-hover:scale-[1.025]
                        "
                        onError={(event) => {

                          event.currentTarget.src =
                            categoryImages[
                              matches[0]
                                .category
                            ] ||
                            categoryImages.foundation;

                        }}
                      />

                      <div className="absolute left-7 top-7 bg-[#111111] px-5 py-3.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
                        Best match
                      </div>

                      <div className="absolute bottom-7 left-7 bg-white px-6 py-5">

                        <div className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[#77716b]">
                          Match score
                        </div>

                        <div className="mt-1 text-5xl font-light tracking-[-0.06em]">
                          {Math.round(
                            matches[0]
                              .matchScore ??
                              0
                          )}

                          <span className="text-xl">
                            %
                          </span>
                        </div>

                      </div>

                    </div>


                    {/* INFORMATION */}

                    <div className="flex flex-col justify-between p-10 md:p-14 lg:p-16">

                      <div>

                        <div className="mb-10 flex items-start justify-between gap-8">

                          <div>

                            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a837c]">
                              Closest translation
                            </p>

                            <h3 className="text-4xl font-light tracking-[-0.045em] md:text-5xl">
                              {
                                matches[0]
                                  .brand
                              }
                            </h3>

                            <p className="mt-3 text-base text-[#55504b]">
                              {
                                matches[0]
                                  .name
                              }
                            </p>

                          </div>

                          {matches[0]
                            .price !=
                            null && (

                            <p className="whitespace-nowrap text-xl font-medium">
                              ₹
                              {
                                matches[0]
                                  .price
                              }
                            </p>

                          )}

                        </div>


                        {/* SHADE */}

                        <div className="border-y border-[#d8d3cd] py-7">

                          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8a837c]">
                            Shade
                          </p>

                          <p className="mt-3 text-xl">
                            {matches[0]
                              .shade ||
                              "Available shade"}
                          </p>

                        </div>


                        {/* ATTRIBUTES */}

                        <div className="mt-7 flex flex-wrap gap-2">

                          {matches[0]
                            .depth && (

                            <span className="border border-[#d8d3cd] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em]">
                              {
                                matches[0]
                                  .depth
                              }
                            </span>

                          )}

                          {matches[0]
                            .undertone && (

                            <span className="border border-[#d8d3cd] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em]">
                              {
                                matches[0]
                                  .undertone
                              }
                            </span>

                          )}

                          {matches[0]
                            .matchQuality && (

                            <span className="border border-[#d8d3cd] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.14em]">
                              {
                                matches[0]
                                  .matchQuality
                              }
                            </span>

                          )}

                        </div>


                        {/* WHY IT MATCHES */}

                        {matches[0]
                          .matchReason && (

                          <div className="mt-10">

                            <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8a837c]">
                              Why it matches
                            </p>

                            <p className="max-w-xl text-sm leading-7 text-[#68635e]">
                              {
                                matches[0]
                                  .matchReason
                              }
                            </p>

                          </div>

                        )}

                      </div>


                      {/* ACTION */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleKit(
                            matches[0]
                          )
                        }
                        className={`
                          mt-12
                          flex
                          min-h-[60px]
                          w-full
                          items-center
                          justify-center
                          gap-3
                          border
                          px-6
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          transition

                          ${
                            isInKit(
                              matches[0]
                            )
                              ? "border-[#111111] bg-[#111111] text-white"
                              : "border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-white"
                          }
                        `}
                      >

                        {isInKit(
                          matches[0]
                        ) ? (
                          <>
                            <Check
                              size={17}
                              strokeWidth={
                                1.6
                              }
                            />
                            Added to kit
                          </>
                        ) : (
                          <>
                            <ShoppingBag
                              size={17}
                              strokeWidth={
                                1.6
                              }
                            />
                            Add to my kit
                          </>
                        )}

                      </button>

                    </div>

                  </div>

                </article>


                {/* ==================================================
                    OTHER MATCHES
                ================================================== */}

                {matches.length > 1 && (

                  <div>

                    <div className="mb-8 flex items-end justify-between border-b border-[#d8d3cd] pb-6">

                      <div>

                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#77716b]">
                          Other possibilities
                        </p>

                        <h3 className="mt-3 text-3xl font-light tracking-[-0.04em]">
                          More shades to consider.
                        </h3>

                      </div>

                      <p className="hidden text-xs text-[#77716b] md:block">
                        Ranked by shade similarity
                      </p>

                    </div>


                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                      {matches
                        .slice(1)
                        .map(
                          (
                            product,
                            index
                          ) => {

                            const score =
                              Math.round(
                                product.matchScore ??
                                  0
                              );

                            const added =
                              isInKit(
                                product
                              );

                            return (

                              <article
                                key={
                                  product.id
                                }
                                className="
                                  group
                                  overflow-hidden
                                  border
                                  border-[#d8d3cd]
                                  bg-white
                                  transition
                                  duration-300
                                  hover:-translate-y-1
                                  hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]
                                "
                              >

                                <div className="relative h-[390px] overflow-hidden bg-[#ebe7e2]">

                                  <img
                                    src={getProductImage(
                                      product
                                    )}
                                    alt={
                                      product.name
                                    }
                                    className="
                                      h-full
                                      w-full
                                      object-cover
                                      transition
                                      duration-700
                                      group-hover:scale-[1.035]
                                    "
                                    onError={(
                                      event
                                    ) => {

                                      event.currentTarget.src =
                                        categoryImages[
                                          product
                                            .category
                                        ] ||
                                        categoryImages.foundation;

                                    }}
                                  />

                                  <div className="absolute left-5 top-5 bg-white px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.15em]">
                                    #
                                    {index +
                                      2}
                                  </div>

                                  <div className="absolute bottom-5 right-5 bg-[#111111] px-4 py-2.5 text-xs font-semibold text-white">
                                    {score}%
                                  </div>

                                </div>


                                <div className="p-7">

                                  <div className="flex items-start justify-between gap-5">

                                    <div>

                                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8a837c]">
                                        {
                                          product.brand
                                        }
                                      </p>

                                      <h4 className="mt-2 text-xl font-light tracking-[-0.025em]">
                                        {
                                          product.name
                                        }
                                      </h4>

                                    </div>

                                    {product.price !=
                                      null && (

                                      <p className="text-sm font-medium">
                                        ₹
                                        {
                                          product.price
                                        }
                                      </p>

                                    )}

                                  </div>


                                  <p className="mt-2 text-sm text-[#68635e]">
                                    {product.shade ||
                                      "Available shade"}
                                  </p>


                                  <div className="mt-5 flex flex-wrap gap-2">

                                    {product.depth && (

                                      <span className="border border-[#d8d3cd] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.12em]">
                                        {
                                          product.depth
                                        }
                                      </span>

                                    )}

                                    {product.undertone && (

                                      <span className="border border-[#d8d3cd] px-3 py-2 text-[8px] font-semibold uppercase tracking-[0.12em]">
                                        {
                                          product.undertone
                                        }
                                      </span>

                                    )}

                                  </div>


                                  {product.matchReason && (

                                    <p className="mt-6 min-h-[52px] text-xs leading-6 text-[#77716b]">
                                      {
                                        product.matchReason
                                      }
                                    </p>

                                  )}


                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleKit(
                                        product
                                      )
                                    }
                                    className={`
                                      mt-7
                                      flex
                                      min-h-[52px]
                                      w-full
                                      items-center
                                      justify-center
                                      gap-2
                                      border
                                      px-4
                                      text-[9px]
                                      font-semibold
                                      uppercase
                                      tracking-[0.16em]
                                      transition

                                      ${
                                        added
                                          ? "border-[#111111] bg-[#111111] text-white"
                                          : "border-[#111111] bg-transparent text-[#111111] hover:bg-[#111111] hover:text-white"
                                      }
                                    `}
                                  >

                                    {added ? (
                                      <>
                                        <Check
                                          size={
                                            14
                                          }
                                          strokeWidth={
                                            1.7
                                          }
                                        />
                                        Added
                                      </>
                                    ) : (
                                      <>
                                        <ShoppingBag
                                          size={
                                            14
                                          }
                                          strokeWidth={
                                            1.7
                                          }
                                        />
                                        Add to kit
                                      </>
                                    )}

                                  </button>

                                </div>

                              </article>

                            );
                          }
                        )}

                    </div>

                  </div>

                )}

              </>

            )}

          </div>

        </section>

      )}


      {/* ==================================================
          HOW IT WORKS
      ================================================== */}

      <section className="border-b border-[#d8d3cd]">

        <div className="mx-auto max-w-[1500px] px-6 py-14 md:px-10 md:py-18 lg:px-12">

          <div className="grid md:grid-cols-3">

            {/* 01 */}

            <div className="border-b border-[#d8d3cd] pb-10 md:border-b-0 md:border-r md:pb-0 md:pr-10">

              <p className="mb-5 text-[10px] font-semibold tracking-[0.2em] text-[#8a837c]">
                01
              </p>

              <h3 className="max-w-sm text-2xl font-light leading-[1.05] tracking-[-0.04em] md:text-[2rem]">
                Start with what
                <br />
                you already know.
              </h3>

              <p className="mt-5 max-w-sm text-sm leading-6 text-[#77716b]">
                Select a foundation or
                concealer shade from your
                current makeup collection.
              </p>

            </div>


            {/* 02 */}

            <div className="border-b border-[#d8d3cd] py-10 md:border-b-0 md:border-r md:px-10 md:py-0">

              <p className="mb-5 text-[10px] font-semibold tracking-[0.2em] text-[#8a837c]">
                02
              </p>

              <h3 className="max-w-sm text-2xl font-light leading-[1.05] tracking-[-0.04em] md:text-[2rem]">
                Choose where
                <br />
                you want to shop.
              </h3>

              <p className="mt-5 max-w-sm text-sm leading-6 text-[#77716b]">
                Pick another brand and
                EUNOIA compares available
                shades within that range.
              </p>

            </div>


            {/* 03 */}

            <div className="pt-10 md:pl-10 md:pt-0">

              <p className="mb-5 text-[10px] font-semibold tracking-[0.2em] text-[#8a837c]">
                03
              </p>

              <h3 className="max-w-sm text-2xl font-light leading-[1.05] tracking-[-0.04em] md:text-[2rem]">
                Find your
                <br />
                closest translation.
              </h3>

              <p className="mt-5 max-w-sm text-sm leading-6 text-[#77716b]">
                Results are ranked using shade
                depth and undertone similarity.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}