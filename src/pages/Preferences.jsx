import {
  ArrowRight,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";
import { savePreferences } from "../services/supabaseData";

const skinTypes = [
  "Oily",
  "Dry",
  "Combination",
  "Normal",
];

const looks = [
  {
    name: "Natural",
    image: "/natural.jpg",
  },
  {
    name: "Everyday",
    image: "/everyday.jpg",
  },
  {
    name: "Glam",
    image: "/glam.jpg",
  },
  {
    name: "Bold",
    image: "/bold.jpg",
  },
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

  // Budget slider
  const [budgetMin, setBudgetMin] = useState(0);

  const [budgetMax, setBudgetMax] = useState(5000);

  const [selectedBrands, setSelectedBrands] = useState([]);

  const toggleBrand = (brand) => {
    setSelectedBrands((current) => {
      if (current.includes(brand)) {
        return current.filter(
          (item) => item !== brand
        );
      }

      return [
        ...current,
        brand,
      ];
    });
  };

  const handleMinBudgetChange = (event) => {
    const value =
      Number(event.target.value);

    setBudgetMin(
      Math.min(
        value,
        budgetMax - 50
      )
    );
  };

  const handleMaxBudgetChange = (event) => {
    const value =
      Number(event.target.value);

    setBudgetMax(
      Math.max(
        value,
        budgetMin + 50
      )
    );
  };

  const handleContinue = async () => {
    console.log(
      "SELECTED BRANDS:",
      selectedBrands
    );

    const preferences = {
      skinType,

      look,

      budgetMin,

      budgetMax,

      budgetLabel:
        `₹${budgetMin.toLocaleString(
          "en-IN"
        )} – ₹${budgetMax.toLocaleString(
          "en-IN"
        )}`,

      brands:
        selectedBrands,
    };

    localStorage.setItem(
      "aura-preferences",
      JSON.stringify(preferences)
    );

    try {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        console.error(
          "No logged-in user found."
        );

        return;
      }

      await savePreferences(
        user.id,
        {
          skinType,
          preferredLook: look,
          budgetMin,
          budgetMax,
          preferredBrands:
            selectedBrands,
        }
      );

      navigate("/results");
    } catch (error) {
      console.error(
        "Failed to save preferences:",
        error
      );
    }
  };

  const canContinue =
    skinType !== "" &&
    look !== "";

  return (
    <div
      className="
        min-h-screen
        bg-[#f7f5f2]
        text-[#111111]
      "
    >
      {/* =====================================================
          PROGRESS
      ===================================================== */}

      <div
        className="
          border-b
          border-black/10
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-[1500px]
            grid-cols-3
          "
        >
          {/* STEP 01 */}

          <div
            className="
              border-r
              border-black/10
              px-6
              py-4
              md:px-10
            "
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-black/40
              "
            >
              01
            </p>

            <p
              className="
                mt-1
                text-xs
                font-bold
                uppercase
                tracking-[0.12em]
              "
            >
              Scan
            </p>
          </div>

          {/* STEP 02 */}

          <div
            className="
              bg-[#111111]
              px-6
              py-4
              text-white
              md:px-10
            "
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-white/50
              "
            >
              02
            </p>

            <p
              className="
                mt-1
                text-xs
                font-bold
                uppercase
                tracking-[0.12em]
              "
            >
              Preferences
            </p>
          </div>

          {/* STEP 03 */}

          <div
            className="
              px-6
              py-4
              md:px-10
            "
          >
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-black/40
              "
            >
              03
            </p>

            <p
              className="
                mt-1
                text-xs
                font-bold
                uppercase
                tracking-[0.12em]
              "
            >
              Results
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section
        className="
          border-b
          border-black/10
        "
      >
        <div
          className="
            mx-auto
            max-w-[1500px]
            px-6
            py-14
            md:px-10
            md:py-20
          "
        >
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-black/40
            "
          >
            Personalize your results
          </p>

          <h1
            className="
              mt-4
              max-w-4xl
              text-[clamp(3rem,7vw,7rem)]
              font-black
              uppercase
              leading-[0.85]
              tracking-[-0.07em]
            "
          >
            Tell us
            <br />
            about you.
          </h1>

          <p
            className="
              mt-7
              max-w-xl
              text-base
              leading-7
              text-black/55
            "
          >
            Your answers help Eunoia narrow
            down products that fit your
            preferences, budget and makeup
            style.
          </p>
        </div>
      </section>

      {/* =====================================================
          FORM
      ===================================================== */}

      <main
        className="
          mx-auto
          max-w-[1500px]
          px-6
          py-12
          md:px-10
          md:py-20
        "
      >
        {/* ===================================================
            SKIN TYPE
        =================================================== */}

        <section
          className="
            border-b
            border-black/10
            pb-14
          "
        >
          <div className="mb-7">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-black/40
              "
            >
              01
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
                uppercase
                tracking-[-0.04em]
                md:text-4xl
              "
            >
              What's your skin type?
            </h2>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              md:grid-cols-4
            "
          >
            {skinTypes.map((type) => {
              const selected =
                skinType === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setSkinType(type)
                  }
                  className={`
                    border
                    px-5
                    py-6
                    text-left
                    transition
                    ${
                      selected
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-black/10 bg-white hover:border-black/40"
                    }
                  `}
                >
                  <p
                    className="
                      text-sm
                      font-bold
                      uppercase
                      tracking-[0.1em]
                    "
                  >
                    {type}
                  </p>

                  {selected && (
                    <p
                      className="
                        mt-2
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-white/50
                      "
                    >
                      Selected
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ===================================================
            LOOK
        =================================================== */}

        <section
          className="
            border-b
            border-black/10
            py-14
          "
        >
          <div className="mb-7">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-black/40
              "
            >
              02
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
                uppercase
                tracking-[-0.04em]
                md:text-4xl
              "
            >
              What's your look?
            </h2>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              md:grid-cols-4
            "
          >
            {looks.map((item) => {
              const selected =
                look === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    setLook(item.name)
                  }
                  className={`
                    group
                    relative
                    overflow-hidden
                    border
                    text-left
                    ${
                      selected
                        ? "border-[#111111]"
                        : "border-black/10"
                    }
                  `}
                >
                  <div
                    className="
                      aspect-[4/5]
                      overflow-hidden
                    "
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`
                        h-full
                        w-full
                        object-cover
                        transition
                        duration-500
                        ${
                          selected
                            ? "scale-105"
                            : "group-hover:scale-105"
                        }
                      `}
                    />
                  </div>

                  <div
                    className={`
                      absolute
                      inset-x-0
                      bottom-0
                      p-4
                      ${
                        selected
                          ? "bg-[#111111] text-white"
                          : "bg-white/90"
                      }
                    `}
                  >
                    <p
                      className="
                        text-sm
                        font-black
                        uppercase
                        tracking-[0.1em]
                      "
                    >
                      {item.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ===================================================
            BUDGET
        =================================================== */}

        <section
          className="
            border-b
            border-black/10
            py-14
          "
        >
          {/* BUDGET HEADING */}

          <div className="mb-10">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-black/40
              "
            >
              03
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
                uppercase
                tracking-[-0.04em]
                md:text-4xl
              "
            >
              What's your budget?
            </h2>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-black/50
              "
            >
              Choose the price range you'd like
              Eunoia to consider.
            </p>
          </div>

          {/* CENTERED BUDGET CONTROL */}

          <div
            className="
              mx-auto
              w-full
              max-w-5xl
            "
          >
            {/* CURRENT VALUES */}

            <div
              className="
                mx-auto
                mb-8
                flex
                w-[85%]
                max-w-[1000px]
                items-end
                justify-between
                gap-6
              "
            >
              <div>
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-black/40
                  "
                >
                  Minimum
                </p>

                <p
                  className="
                    mt-1
                    text-3xl
                    font-black
                    tracking-[-0.05em]
                  "
                >
                  ₹
                  {budgetMin.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <div className="text-right">
                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.15em]
                    text-black/40
                  "
                >
                  Maximum
                </p>

                <p
                  className="
                    mt-1
                    text-3xl
                    font-black
                    tracking-[-0.05em]
                  "
                >
                  ₹
                  {budgetMax.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>

            {/* SLIDER */}

            <div className="budget-slider">
              <div className="budget-slider-track" />

              <div
                className="budget-slider-range"
                style={{
                  left:
                    `${(budgetMin / 5000) * 100}%`,

                  right:
                    `${100 - (budgetMax / 5000) * 100}%`,
                }}
              />

              {/* MINIMUM HANDLE */}

              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={budgetMin}
                onChange={
                  handleMinBudgetChange
                }
                className="
                  budget-slider-input
                  budget-slider-min
                "
                aria-label="Minimum budget"
              />

              {/* MAXIMUM HANDLE */}

              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={budgetMax}
                onChange={
                  handleMaxBudgetChange
                }
                className="
                  budget-slider-input
                  budget-slider-max
                "
                aria-label="Maximum budget"
              />
            </div>

            {/* SCALE */}

            <div
              className="
                mx-auto
                mt-5
                flex
                w-[85%]
                max-w-[1000px]
                justify-between
                text-[9px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-black/35
              "
            >
              <span>₹0</span>
              <span>₹1,000</span>
              <span>₹2,000</span>
              <span>₹3,000</span>
              <span>₹4,000</span>
              <span>₹5,000</span>
            </div>

            {/* SELECTED RANGE */}

            <div
              className="
                mx-auto
                mt-8
                w-[85%]
                max-w-[1000px]
                border
                border-black/10
                bg-white
                px-5
                py-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-black/40
                    "
                  >
                    Selected range
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-black
                      uppercase
                      tracking-[0.08em]
                    "
                  >
                    ₹
                    {budgetMin.toLocaleString(
                      "en-IN"
                    )}

                    {" – "}

                    ₹
                    {budgetMax.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className="
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.15em]
                      text-black/40
                    "
                  >
                    Range
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-black
                    "
                  >
                    ₹
                    {(
                      budgetMax -
                      budgetMin
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            BRANDS
        =================================================== */}

        <section
          className="
            border-b
            border-black/10
            py-14
          "
        >
          <div className="mb-7">
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-black/40
              "
            >
              04
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-black
                uppercase
                tracking-[-0.04em]
                md:text-4xl
              "
            >
              Any preferred brands?
            </h2>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-black/50
              "
            >
              Optional. Select as many as you
              want. Leave this empty if you want
              Eunoia to consider everything.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => {
              const selected =
                selectedBrands.includes(
                  brand
                );

              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() =>
                    toggleBrand(brand)
                  }
                  className={`
                    border
                    px-4
                    py-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    transition
                    ${
                      selected
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-black/15 bg-white hover:border-black/40"
                    }
                  `}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </section>

        {/* ===================================================
            CONTINUE
        =================================================== */}

        <section
          className="
            flex
            flex-col
            items-start
            justify-between
            gap-6
            pt-12
            md:flex-row
            md:items-center
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-black/40
              "
            >
              Almost there
            </p>

            <p
              className="
                mt-2
                max-w-md
                text-sm
                leading-6
                text-black/50
              "
            >
              We'll combine these preferences
              with your skin analysis to create
              your recommendations.
            </p>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue}
            className={`
              flex
              items-center
              gap-3
              px-7
              py-4
              text-xs
              font-black
              uppercase
              tracking-[0.15em]
              transition
              ${
                canContinue
                  ? "bg-[#111111] text-white hover:bg-black/80"
                  : "cursor-not-allowed bg-black/10 text-black/30"
              }
            `}
          >
            Show my results

            <ArrowRight size={16} />
          </button>
        </section>
      </main>
    </div>
  );
}