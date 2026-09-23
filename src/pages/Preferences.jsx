import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const skinTypes = [
  {
    name: "Oily",
    description: "More shine",
    icon: "💧",
  },
  {
    name: "Dry",
    description: "Less moisture",
    icon: "〰",
  },
  {
    name: "Combination",
    description: "Mixed areas",
    icon: "◌",
  },
  {
    name: "Normal",
    description: "Balanced",
    icon: "○",
  },
];

const looks = [
  {
    name: "Natural",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Everyday",
    image:
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Glam",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bold",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
];

const budgets = [
  "Under ₹1,000",
  "₹1,000–₹2,000",
  "₹2,000–₹4,000",
  "₹4,000+",
];

const brands = [
  "Maybelline",
  "Lancôme",
  "Fenty Beauty",
  "MAC",
  "Rare Beauty",
  "NYX",
  "e.l.f.",
  "L'Oréal",
  "Others",
];

export default function Preferences() {
  const navigate = useNavigate();

  const [skinType, setSkinType] = useState("");
  const [look, setLook] = useState("");
  const [budget, setBudget] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  const toggleBrand = (brand) => {
    setSelectedBrands((current) => {
      if (current.includes(brand)) {
        return current.filter((item) => item !== brand);
      }

      return [...current, brand];
    });
  };

  const canContinue =
    skinType &&
    look &&
    budget;

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#111111]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-[#ddd8d2] bg-[#f7f5f2]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">

          <button
            onClick={() => navigate("/scan")}
            className="flex items-center gap-2 text-sm"
          >
            <ArrowLeft
              size={18}
              strokeWidth={1.5}
            />

            <span className="hidden md:inline">
              Back
            </span>
          </button>

          <button
            onClick={() => navigate("/")}
            className="text-xl font-light tracking-[0.35em]"
          >
            AURA
          </button>

          <div className="flex items-center gap-5">

            <button>
              <Search
                size={19}
                strokeWidth={1.5}
              />
            </button>

            <button
              onClick={() => navigate("/kit")}
            >
              <ShoppingBag
                size={19}
                strokeWidth={1.5}
              />
            </button>

          </div>

        </div>

      </header>


      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div className="mx-auto max-w-4xl px-6 pt-8">

        <div className="flex items-center">

          <div className="flex flex-1 items-center">

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs text-white">
              ✓
            </div>

            <div className="h-px flex-1 bg-black" />

          </div>


          <div className="flex flex-1 items-center">

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs text-white">
              2
            </div>

            <div className="h-px flex-1 bg-[#d8d3cd]" />

          </div>


          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c9c3bc] bg-[#f7f5f2] text-xs text-[#77716b]">
            3
          </div>

        </div>


        <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-[0.15em]">

          <span>
            Scan
          </span>

          <span>
            Preferences
          </span>

          <span className="text-[#99928b]">
            Results
          </span>

        </div>

      </div>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-4xl px-6 py-12 md:py-16">

        {/* Heading */}

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#77716b]">
            Step 02
          </p>

          <h1 className="mt-4 text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.03em] md:text-6xl">
            Tell us about you
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-[#6c6660] md:text-base">
            This helps us personalize your recommendations
            and find products that work for you.
          </p>

        </div>


        {/* =====================================================
            SKIN TYPE
        ===================================================== */}

        <section className="mt-14">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-[#8a847e]">
                01
              </p>

              <h2 className="mt-2 text-lg font-semibold uppercase">
                Skin type
              </h2>

            </div>

          </div>


          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">

            {skinTypes.map((type) => {

              const selected =
                skinType === type.name;

              return (
                <button
                  key={type.name}
                  onClick={() => setSkinType(type.name)}
                  className={`relative min-h-[125px] border p-5 text-left transition ${
                    selected
                      ? "border-black bg-black text-white"
                      : "border-[#d8d3cd] bg-white hover:border-black"
                  }`}
                >

                  <span className="text-2xl">
                    {type.icon}
                  </span>

                  <span className="mt-7 block text-sm font-semibold uppercase">
                    {type.name}
                  </span>

                  <span
                    className={`mt-1 block text-xs ${
                      selected
                        ? "text-white/60"
                        : "text-[#8a847e]"
                    }`}
                  >
                    {type.description}
                  </span>

                </button>
              );
            })}

          </div>

        </section>


        {/* =====================================================
            PREFERRED LOOK
        ===================================================== */}

        <section className="mt-14">

          <p className="text-xs uppercase tracking-[0.2em] text-[#8a847e]">
            02
          </p>

          <h2 className="mt-2 text-lg font-semibold uppercase">
            Your preferred look
          </h2>


          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">

            {looks.map((item) => {

              const selected =
                look === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setLook(item.name)}
                  className={`group relative overflow-hidden border transition ${
                    selected
                      ? "border-black"
                      : "border-transparent"
                  }`}
                >

                  <div className="aspect-[4/5] overflow-hidden bg-[#ded8d0]">

                    <img
                      src={item.image}
                      alt={item.name}
                      className={`h-full w-full object-cover transition duration-500 ${
                        selected
                          ? "scale-105"
                          : "group-hover:scale-105"
                      }`}
                    />

                  </div>


                  <div
                    className={`absolute inset-x-0 bottom-0 p-4 text-left ${
                      selected
                        ? "bg-black text-white"
                        : "bg-gradient-to-t from-black/70 to-transparent text-white"
                    }`}
                  >

                    <span className="text-sm font-semibold uppercase">
                      {item.name}
                    </span>

                  </div>

                </button>
              );
            })}

          </div>

        </section>


        {/* =====================================================
            BUDGET
        ===================================================== */}

        <section className="mt-14">

          <p className="text-xs uppercase tracking-[0.2em] text-[#8a847e]">
            03
          </p>

          <h2 className="mt-2 text-lg font-semibold uppercase">
            Budget range
          </h2>


          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">

            {budgets.map((item) => {

              const selected =
                budget === item;

              return (
                <button
                  key={item}
                  onClick={() => setBudget(item)}
                  className={`min-h-[75px] border px-4 text-sm font-medium transition ${
                    selected
                      ? "border-black bg-black text-white"
                      : "border-[#d8d3cd] bg-white hover:border-black"
                  }`}
                >
                  {item}
                </button>
              );
            })}

          </div>

        </section>


        {/* =====================================================
            BRANDS
        ===================================================== */}

        <section className="mt-14">

          <p className="text-xs uppercase tracking-[0.2em] text-[#8a847e]">
            04
          </p>

          <div className="flex items-center justify-between">

            <h2 className="mt-2 text-lg font-semibold uppercase">
              Preferred brands
            </h2>

            <span className="text-xs text-[#99928b]">
              Optional
            </span>

          </div>


          {/* Search */}

          <div className="mt-5 flex items-center gap-3 border border-[#d8d3cd] bg-white px-4 py-3">

            <Search
              size={17}
              strokeWidth={1.5}
            />

            <input
              type="text"
              placeholder="Search brands..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaa39c]"
            />

          </div>


          {/* Brand pills */}

          <div className="mt-4 flex flex-wrap gap-2">

            {brands.map((brand) => {

              const selected =
                selectedBrands.includes(brand);

              return (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`rounded-full border px-4 py-2 text-xs transition ${
                    selected
                      ? "border-black bg-black text-white"
                      : "border-[#d8d3cd] bg-white hover:border-black"
                  }`}
                >
                  {brand}
                </button>
              );
            })}

          </div>

        </section>


        {/* =====================================================
            CONTINUE
        ===================================================== */}

        <button
          disabled={!canContinue}
          onClick={() => navigate("/results")}
          className={`mt-16 flex w-full items-center justify-center gap-3 rounded-full py-5 text-sm font-semibold uppercase tracking-[0.12em] transition ${
            canContinue
              ? "bg-black text-white hover:bg-[#292929]"
              : "cursor-not-allowed bg-[#d8d3cd] text-[#99928b]"
          }`}
        >

          Show my results

          <ArrowRight size={18} />

        </button>


        <p className="mt-4 text-center text-xs text-[#99928b]">
          You can change these preferences later.
        </p>

      </main>

    </div>
  );
}