import {
  ArrowRight,
  Camera,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import EunoiaNav from "../components/EunoiaNav";

export default function Home() {
  const navigate = useNavigate();

  const brands = [
    "L'ORÉAL PARIS",
    "MARS",
    "LAKMÉ",
    "MAYBELLINE",
    "KAY BEAUTY",
  ];

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#111111]">

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <EunoiaNav
        dark={true}
        overlay={true}
        showFloatingBasket={false}
      />


      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          min-h-[720px]
          overflow-hidden
          bg-black
          md:min-h-screen
        "
      >

        {/* Background image */}

        <img
          src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1800&q=85"
          alt="Beauty portrait"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            animate-[heroImage_1.2s_ease-out_both]
          "
        />

        {/* Dark overlay */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/75
            via-black/35
            to-black/10
          "
        />

        {/* Hero content */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[720px]
            max-w-7xl
            items-center
            px-6
            pb-20
            pt-32
            md:min-h-screen
            md:px-12
          "
        >

          <div
            className="
              max-w-2xl
              text-white
              fade-up
            "
          >

            <p
              className="
                mb-7
                text-xs
                font-medium
                uppercase
                tracking-[0.35em]
                text-white/80
              "
            >
              AI-powered beauty intelligence
            </p>


            <h1
              className="
                max-w-3xl
                text-6xl
                font-semibold
                uppercase
                leading-[0.9]
                tracking-[-0.04em]
                md:text-8xl
              "
            >

              Makeup that

              <span className="block">
                actually
              </span>

              <span className="block">
                fits you.
              </span>

            </h1>


            <p
              className="
                mt-8
                max-w-lg
                text-base
                leading-7
                text-white/80
                md:text-lg
              "
            >
              Scan your face, discover your skin profile and
              get personalized makeup recommendations across
              brands, budgets and shades.
            </p>


            {/* MAIN CTA */}

            <button
              onClick={() => navigate("/scan")}
              className="
                eunoia-scan-button
                mt-9
                flex
                items-center
                gap-4
                rounded-full
                px-7
                py-4
                text-sm
                font-semibold
                uppercase
                tracking-[0.08em]
              "
            >
              Start your EUNOIA scan

              <ArrowRight
                size={18}
                strokeWidth={1.8}
              />
            </button>

          </div>

        </div>


        {/* Bottom hero label */}

        <div
          className="
            absolute
            bottom-7
            left-6
            right-6
            z-10
            flex
            items-end
            justify-between
            text-white
            md:left-12
            md:right-12
          "
        >

          <div
            className="
              hidden
              text-xs
              uppercase
              tracking-[0.25em]
              text-white/60
              md:block
            "
          >
            Beauty intelligence / 01
          </div>


          <div
            className="
              ml-auto
              flex
              items-center
              gap-3
              text-xs
              uppercase
              tracking-[0.2em]
              text-white/70
            "
          >
            Scroll to explore

            <span
              className="
                h-px
                w-10
                bg-white/50
              "
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section
        className="
          bg-[#f7f5f2]
          px-6
          py-24
          md:px-12
          md:py-32
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
          "
        >

          <div
            className="
              grid
              gap-16
              md:grid-cols-12
              md:items-end
            "
          >

            {/* LEFT */}

            <div className="md:col-span-7">

              <p
                className="
                  mb-5
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[#77716b]
                "
              >
                Personalized beauty
              </p>


              <h2
                className="
                  text-4xl
                  font-semibold
                  uppercase
                  leading-[0.95]
                  tracking-[-0.03em]
                  md:text-6xl
                "
              >
                Your face.

                <br />

                Your skin.

                <br />

                Your match.
              </h2>

            </div>


            {/* RIGHT */}

            <div
              className="
                md:col-span-4
                md:col-start-9
              "
            >

              <p
                className="
                  text-base
                  leading-7
                  text-[#5f5954]
                "
              >
                EUNOIA combines facial analysis, skin profiling
                and product intelligence to help you find makeup
                that works for you — without endless shade testing.
              </p>

            </div>

          </div>


          {/* =================================================
              THREE STEP SYSTEM
          ================================================= */}

          <div
            className="
              mt-20
              grid
              border-t
              border-[#d8d3cd]
              md:grid-cols-3
            "
          >

            {/* STEP 01 */}

            <div
              className="
                border-b
                border-[#d8d3cd]
                py-8
                md:border-b-0
                md:border-r
                md:pr-10
              "
            >

              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >

                <Camera
                  size={25}
                  strokeWidth={1.3}
                />

                <span
                  className="
                    text-xs
                    text-[#8a847e]
                  "
                >
                  01
                </span>

              </div>


              <h3
                className="
                  mt-12
                  text-xl
                  font-semibold
                  uppercase
                "
              >
                Scan
              </h3>


              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-[#6c6660]
                "
              >
                Take a quick selfie in good lighting.
              </p>

            </div>


            {/* STEP 02 */}

            <div
              className="
                border-b
                border-[#d8d3cd]
                py-8
                md:border-b-0
                md:border-r
                md:px-10
              "
            >

              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >

                <Sparkles
                  size={25}
                  strokeWidth={1.3}
                />

                <span
                  className="
                    text-xs
                    text-[#8a847e]
                  "
                >
                  02
                </span>

              </div>


              <h3
                className="
                  mt-12
                  text-xl
                  font-semibold
                  uppercase
                "
              >
                Discover
              </h3>


              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-[#6c6660]
                "
              >
                Understand your tone, undertone and best shades.
              </p>

            </div>


            {/* STEP 03 */}

            <div
              className="
                py-8
                md:pl-10
              "
            >

              <div
                className="
                  flex
                  items-start
                  justify-between
                "
              >

                <ShoppingBag
                  size={25}
                  strokeWidth={1.3}
                />

                <span
                  className="
                    text-xs
                    text-[#8a847e]
                  "
                >
                  03
                </span>

              </div>


              <h3
                className="
                  mt-12
                  text-xl
                  font-semibold
                  uppercase
                "
              >
                Shop
              </h3>


              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-[#6c6660]
                "
              >
                Build your personalized makeup kit.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TRUSTED BRANDS
      ===================================================== */}

      <section
        className="
          bg-black
          px-6
          py-20
          text-white
          md:px-12
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
          "
        >

          <div
            className="
              flex
              flex-col
              gap-10
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            <p
              className="
                text-xs
                uppercase
                tracking-[0.3em]
                text-white/50
              "
            >
              Explore products from
            </p>


            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-10
                gap-y-6
              "
            >

              {brands.map((brand) => (
                <span
                  key={brand}
                  className="
                    text-lg
                    tracking-[0.12em]
                  "
                >
                  {brand}
                </span>
              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SHADE MATCH
      ===================================================== */}

      <section
        className="
          bg-[#f7f5f2]
          px-6
          py-24
          md:px-12
          md:py-32
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
          "
        >

          <div
            className="
              grid
              gap-12
              md:grid-cols-12
              md:items-end
            "
          >

            <div className="md:col-span-7">

              <p
                className="
                  mb-5
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[#77716b]
                "
              >
                Cross-brand intelligence
              </p>


              <h2
                className="
                  text-4xl
                  font-semibold
                  uppercase
                  leading-[0.95]
                  tracking-[-0.03em]
                  md:text-6xl
                "
              >
                Love the shade.

                <br />

                Find it elsewhere.
              </h2>

            </div>


            <div
              className="
                md:col-span-4
                md:col-start-9
              "
            >

              <p
                className="
                  text-base
                  leading-7
                  text-[#5f5954]
                "
              >
                Already know a shade that works for you?
                EUNOIA can help you discover comparable
                foundation and concealer shades across brands.
              </p>


              <button
                onClick={() => navigate("/shade-match")}
                className="
                  mt-7
                  flex
                  items-center
                  gap-3
                  border-b
                  border-[#111]
                  pb-2
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  transition
                  hover:opacity-60
                "
              >
                Explore Shade Match

                <ArrowRight
                  size={16}
                />

              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section
        className="
          bg-[#e8dfd7]
          px-6
          py-24
          md:px-12
          md:py-32
        "
      >

        <div
          className="
            mx-auto
            max-w-7xl
            text-center
          "
        >

          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.3em]
              text-[#716960]
            "
          >
            Find your match
          </p>


          <h2
            className="
              mx-auto
              mt-5
              max-w-4xl
              text-5xl
              font-semibold
              uppercase
              leading-[0.95]
              tracking-[-0.04em]
              md:text-7xl
            "
          >
            Stop guessing.

            <br />

            Start matching.
          </h2>


          <button
            onClick={() => navigate("/scan")}
            className="
              mx-auto
              mt-9
              flex
              items-center
              gap-4
              rounded-full
              bg-black
              px-8
              py-4
              text-sm
              font-semibold
              uppercase
              tracking-[0.08em]
              text-white
              transition
              hover:bg-[#292929]
            "
          >
            Start your EUNOIA scan

            <ArrowRight
              size={18}
            />

          </button>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="
          bg-black
          px-6
          py-8
          text-white
          md:px-12
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            gap-5
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div
            className="
              text-xl
              font-light
              tracking-[0.35em]
            "
          >
            EUNOIA
          </div>


          <p
            className="
              text-xs
              text-white/50
            "
          >
            AI-powered personalized beauty
          </p>


          <p
            className="
              text-xs
              text-white/40
            "
          >
            © 2026 Eunoia
          </p>

        </div>

      </footer>

    </div>
  );
}