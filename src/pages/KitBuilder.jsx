import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function KitBuilder() {
  const navigate = useNavigate();

  const [kit, setKit] = useState(() => {
    const savedKit = localStorage.getItem("aura-kit");

    if (!savedKit) {
      return [];
    }

    try {
      return JSON.parse(savedKit);
    } catch {
      return [];
    }
  });

  const removeFromKit = (id) => {
    setKit((current) => {
      const updatedKit = current.filter(
        (product) => product.id !== id
      );

      localStorage.setItem(
        "aura-kit",
        JSON.stringify(updatedKit)
      );

      return updatedKit;
    });
  };

  const total = useMemo(() => {
    return kit.reduce(
      (sum, product) => sum + Number(product.price || 0),
      0
    );
  }, [kit]);

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#111111]">

      {/* HEADER */}
      <header className="border-b border-black/10 bg-[#f7f5f2]">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 md:px-10">

          <button
            onClick={() => navigate("/results")}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={16} />
            Back to matches
          </button>

          <button
            onClick={() => navigate("/")}
            className="text-2xl font-black tracking-[-0.08em]"
          >
            AURA
          </button>

          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
            <ShoppingBag size={17} />

            <span className="hidden sm:inline">
              My Kit
            </span>
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-[1500px] px-6 py-16 md:px-10 md:py-24">

        {/* TITLE */}
        <section className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">

          <div>
            <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-gray-500">
              AURA / MY KIT
            </p>

            <h1 className="text-6xl font-black uppercase leading-[0.88] tracking-[-0.06em] md:text-8xl">
              Your
              <br />
              kit.
            </h1>
          </div>

          <div className="border-l border-black/20 pl-6 lg:mb-2">
            <p className="text-sm leading-7 text-gray-600">
              Everything you've selected in one place. Build your
              personalized makeup routine without starting from scratch.
            </p>
          </div>

        </section>

        {/* EMPTY */}
        {kit.length === 0 && (
          <section className="mt-16 border-y border-black/10 py-24 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black/20">
              <ShoppingBag size={24} />
            </div>

            <h2 className="mt-8 text-3xl font-semibold">
              Your kit is empty.
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-600">
              Explore your personalized matches and add products
              you want to keep.
            </p>

            <button
              onClick={() => navigate("/results")}
              className="mt-8 inline-flex items-center gap-3 bg-black px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
            >
              Explore my matches
              <ArrowRight size={15} />
            </button>

          </section>
        )}

        {/* KIT */}
        {kit.length > 0 && (
          <>
            {/* SUMMARY */}
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
                    ₹{total.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="p-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                    Match status
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <Check size={18} />

                    <p className="text-xl font-semibold">
                      Personalized
                    </p>
                  </div>
                </div>

              </div>

            </section>

            {/* PRODUCTS */}
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

                <button
                  onClick={() => navigate("/results")}
                  className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] md:flex"
                >
                  Add more
                  <ArrowRight size={14} />
                </button>

              </div>

              <div className="divide-y divide-black/10 border-y border-black/10">

                {kit.map((product, index) => (
                  <article
                    key={product.id}
                    className="grid gap-6 py-6 md:grid-cols-[80px_180px_1fr_auto] md:items-center"
                  >

                    {/* NUMBER */}
                    <div className="hidden md:block">
                      <span className="text-xs font-semibold">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* IMAGE */}
                    <div className="aspect-square overflow-hidden bg-[#e9e5e1]">

                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />

                    </div>

                    {/* INFO */}
                    <div>

                      <p className="text-[10px] font-bold tracking-[0.22em]">
                        {product.brand}
                      </p>

                      <h3 className="mt-2 text-xl font-semibold">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        {product.shade}
                      </p>

                      <div className="mt-4 flex items-center gap-2">

                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em]">
                          <Check size={13} />
                          {product.match}% match
                        </span>

                      </div>

                    </div>

                    {/* PRICE + DELETE */}
                    <div className="flex items-center justify-between gap-6 md:justify-end">

                      <p className="text-lg font-semibold">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>

                      <button
                        onClick={() => removeFromKit(product.id)}
                        className="flex h-10 w-10 items-center justify-center border border-black/10 transition hover:border-black"
                        aria-label="Remove product"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </article>
                ))}

              </div>

            </section>

            {/* BOTTOM */}
            <section className="mt-20 grid gap-10 lg:grid-cols-2">

              <div className="border-t border-black pt-6">

                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">
                  Your personalized routine
                </p>

                <h2 className="mt-4 max-w-xl text-4xl font-black uppercase leading-none tracking-[-0.04em]">
                  Less guessing.
                  <br />
                  More confidence.
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-7 text-gray-600">
                  Your kit is built around your skin profile, undertone
                  and preferences.
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
                  Explore more products that match your profile.
                </p>

                <button
                  onClick={() => navigate("/results")}
                  className="mt-7 flex items-center gap-3 border border-black px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em]"
                >
                  View more matches
                  <ArrowRight size={15} />
                </button>

              </div>

            </section>
          </>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-black/10">

        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">

          <p className="text-xl font-black tracking-[-0.08em]">
            AURA
          </p>

          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
            Makeup, matched to you.
          </p>

        </div>

      </footer>

    </div>
  );
}