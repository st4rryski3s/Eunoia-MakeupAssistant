import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    brand: "MAYBELLINE",
    name: "Fit Me Matte + Poreless Foundation",
    shade: "220 Natural Beige",
    category: "Foundation",
    price: 699,
    match: 96,
    image:
      "https://images.unsplash.com/photo-1631730486572-226d1c1f1f80?auto=format&fit=crop&w=900&q=85",
    description:
      "A natural matte finish that works well with your skin profile.",
  },
  {
    id: 2,
    brand: "FENTY BEAUTY",
    name: "Pro Filt'r Soft Matte Foundation",
    shade: "290",
    category: "Foundation",
    price: 3500,
    match: 94,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85",
    description:
      "Long-wearing coverage with a soft matte finish.",
  },
  {
    id: 3,
    brand: "RARE BEAUTY",
    name: "Soft Pinch Liquid Blush",
    shade: "Joy",
    category: "Blush",
    price: 2600,
    match: 92,
    image:
      "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?auto=format&fit=crop&w=900&q=85",
    description:
      "A warm peach tone that complements your undertone.",
  },
  {
    id: 4,
    brand: "MAC",
    name: "Studio Fix Fluid",
    shade: "NC30",
    category: "Foundation",
    price: 3400,
    match: 90,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85",
    description:
      "Buildable coverage with a natural skin-like finish.",
  },
];

const filters = [
  "All",
  "Foundation",
  "Concealer",
  "Blush",
  "Lip",
];

export default function Results() {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState("All");
  const [favorites, setFavorites] = useState([]);

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

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const addToKit = (product) => {
    setKit((current) => {
      const alreadyAdded = current.some(
        (item) => item.id === product.id
      );

      if (alreadyAdded) {
        return current;
      }

      const updatedKit = [...current, product];

      localStorage.setItem(
        "aura-kit",
        JSON.stringify(updatedKit)
      );

      return updatedKit;
    });
  };

  const filteredProducts =
    activeFilter === "All"
      ? products
      : products.filter(
          (product) => product.category === activeFilter
        );

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#111111]">

      {/* HEADER */}
      <header className="border-b border-black/10 bg-[#f7f5f2]">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 md:px-10">

          <button
            onClick={() => navigate("/preferences")}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="absolute left-1/2 -translate-x-1/2 text-2xl font-black tracking-[-0.08em]"
          >
            AURA
          </button>

          <button
            onClick={() => navigate("/kit")}
            className="relative flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
          >
            <ShoppingBag size={17} />

            <span className="hidden sm:inline">
              My Kit
            </span>

            {kit.length > 0 && (
              <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">
                {kit.length}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* PROGRESS */}
      <div className="border-b border-black/10">
        <div className="mx-auto flex max-w-[1500px] px-6 md:px-10">

          <div className="flex flex-1 items-center gap-3 border-r border-black/10 py-4">
            <span className="text-xs font-semibold">
              01
            </span>

            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Scan
            </span>
          </div>

          <div className="flex flex-1 items-center gap-3 border-r border-black/10 px-4 py-4">
            <span className="text-xs font-semibold">
              02
            </span>

            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
              Preferences
            </span>
          </div>

          <div className="flex flex-1 items-center gap-3 px-4 py-4">
            <span className="text-xs font-semibold">
              03
            </span>

            <span className="text-[10px] uppercase tracking-[0.2em]">
              Results
            </span>
          </div>

        </div>
      </div>

      {/* MAIN */}
      <main className="mx-auto max-w-[1500px] px-6 py-16 md:px-10 md:py-24">

        {/* HERO */}
        <section className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">

          <div>

            <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-gray-500">
              AURA / PERSONALIZED MATCHES
            </p>

            <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.88] tracking-[-0.06em] md:text-8xl">
              Your best
              <br />
              matches.
            </h1>

          </div>

          <div className="border-l border-black/20 pl-6 lg:mb-2">

            <div className="mb-5 flex items-center gap-2">
              <Sparkles size={16} />

              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                AI Match
              </span>
            </div>

            <p className="max-w-md text-sm leading-7 text-gray-600">
              Based on your skin profile, undertone, preferred finish,
              makeup style and budget, we've selected products that fit you.
            </p>

          </div>

        </section>

        {/* PROFILE */}
        <section className="mt-16 border-y border-black/10">

          <div className="grid md:grid-cols-4">

            <div className="border-b border-black/10 p-6 md:border-b-0 md:border-r">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                Skin tone
              </p>

              <p className="mt-3 text-xl font-semibold">
                Medium
              </p>
            </div>

            <div className="border-b border-black/10 p-6 md:border-b-0 md:border-r">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                Undertone
              </p>

              <p className="mt-3 text-xl font-semibold">
                Warm
              </p>
            </div>

            <div className="border-b border-black/10 p-6 md:border-b-0 md:border-r">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                Skin type
              </p>

              <p className="mt-3 text-xl font-semibold">
                Combination
              </p>
            </div>

            <div className="p-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                Preferred look
              </p>

              <p className="mt-3 text-xl font-semibold">
                Natural
              </p>
            </div>

          </div>

        </section>

        {/* FILTERS */}
        <section className="mt-14 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
              Recommended for you
            </p>

            <p className="mt-2 text-2xl font-semibold">
              {filteredProducts.length} matches
            </p>

          </div>

          <div className="flex flex-wrap gap-2">

            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`border px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
                  activeFilter === filter
                    ? "border-black bg-black text-white"
                    : "border-black/20 bg-transparent hover:border-black"
                }`}
              >
                {filter}
              </button>
            ))}

          </div>

        </section>

        {/* PRODUCTS */}
        <section className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">

          {filteredProducts.map((product) => {

            const isFavorite = favorites.includes(product.id);

            const isInKit = kit.some(
              (item) => item.id === product.id
            );

            return (
              <article
                key={product.id}
                className="group"
              >

                {/* IMAGE */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e5e1]">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  {/* MATCH */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 bg-white px-3 py-2">

                    <Sparkles size={13} />

                    <span className="text-[10px] font-bold tracking-[0.15em]">
                      {product.match}% MATCH
                    </span>

                  </div>

                  {/* FAVORITE */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white transition hover:scale-105"
                  >
                    <Heart
                      size={17}
                      fill={
                        isFavorite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                </div>

                {/* INFO */}
                <div className="pt-5">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <p className="text-[10px] font-bold tracking-[0.22em]">
                        {product.brand}
                      </p>

                      <h2 className="mt-2 text-lg font-semibold leading-snug">
                        {product.name}
                      </h2>

                    </div>

                    <p className="whitespace-nowrap text-sm font-semibold">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>

                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {product.shade}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {product.description}
                  </p>

                  {/* KIT BUTTON */}
                  <button
                    onClick={() => addToKit(product)}
                    className={`mt-5 flex w-full items-center justify-between border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                      isInKit
                        ? "border-black bg-black text-white"
                        : "border-black/20 hover:border-black"
                    }`}
                  >

                    <span>
                      {isInKit
                        ? "Added to kit"
                        : "Add to kit"}
                    </span>

                    {isInKit ? (
                      <Check size={15} />
                    ) : (
                      <ArrowRight size={15} />
                    )}

                  </button>

                </div>

              </article>
            );
          })}

        </section>

        {/* BEHIND THE MATCH */}
        <section className="mt-28 border-t border-black/10 pt-16">

          <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">

            <div>

              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
                Why these products?
              </p>

              <h2 className="mt-4 text-4xl font-black uppercase leading-none tracking-[-0.04em]">
                Behind
                <br />
                the match.
              </h2>

            </div>

            <div className="grid gap-8 md:grid-cols-3">

              <div className="border-t border-black pt-5">

                <span className="text-xs font-bold">
                  01
                </span>

                <h3 className="mt-5 text-lg font-semibold">
                  Skin profile
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Your combination skin profile influenced the finish
                  and formula recommendations.
                </p>

              </div>

              <div className="border-t border-black pt-5">

                <span className="text-xs font-bold">
                  02
                </span>

                <h3 className="mt-5 text-lg font-semibold">
                  Undertone
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Your warm undertone was used to identify shades
                  that complement your complexion.
                </p>

              </div>

              <div className="border-t border-black pt-5">

                <span className="text-xs font-bold">
                  03
                </span>

                <h3 className="mt-5 text-lg font-semibold">
                  Your preferences
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Your preferred natural look and selected budget
                  helped narrow the recommendations.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* KIT BAR */}
      {kit.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur">

          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-6 py-4 md:px-10">

            <div>

              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                Your kit
              </p>

              <p className="mt-1 text-sm font-semibold">
                {kit.length}{" "}
                {kit.length === 1
                  ? "product"
                  : "products"}{" "}
                added
              </p>

            </div>

            <button
              onClick={() => navigate("/kit")}
              className="flex items-center gap-3 bg-black px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
            >
              View my kit
              <ArrowRight size={15} />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}