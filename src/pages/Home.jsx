import {
  ArrowDownRight,
  ArrowRight,
  Camera,
  Menu,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);


  /* =========================================================
     CLOSE MOBILE MENU
  ========================================================= */

  useEffect(() => {
    setMenuOpen(false);
  }, []);


  /* =========================================================
     NAVIGATION
  ========================================================= */

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };


  /* =========================================================
     CORRECT BRAND NAMES
  ========================================================= */

  const brands = [
    "L'ORÉAL PARIS",
    "MARS",
    "LAKMÉ",
    "MAYBELLINE",
    "KAY BEAUTY",
  ];


  return (
    <div
      className="
        min-h-screen
        bg-[#f7f5f2]
        text-[#111111]
      "
    >

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

        {/* HERO IMAGE */}

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


        {/* HERO OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/80
            via-black/40
            to-black/10
          "
        />


        {/* ===================================================
            NAVBAR
        =================================================== */}

        <header
          className="
            absolute
            left-0
            right-0
            top-0
            z-50
            text-white
          "
        >

          {/* subtle transparent gradient */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              h-40
              bg-gradient-to-b
              from-black/55
              via-black/20
              to-transparent
            "
          />


          <div
            className="
              relative
              mx-auto
              flex
              h-[84px]
              max-w-[1500px]
              items-center
              justify-between
              px-6
              md:px-10
            "
          >

            {/* LOGO */}

            <button
              type="button"
              onClick={() => goTo("/")}
              className="
                border-0
                bg-transparent
                p-0
                text-xl
                font-light
                tracking-[0.35em]
                text-white
                md:text-2xl
              "
            >
              EUNOIA
            </button>


            {/* DESKTOP NAV */}

            <nav
              className="
                hidden
                items-center
                gap-7
                md:flex
                lg:gap-9
              "
            >

              <button
                type="button"
                onClick={() => goTo("/")}
                className="
                  eunoia-nav-link
                  relative
                  border-0
                  bg-transparent
                  py-2
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-white
                "
              >
                Discover
              </button>


              <button
                type="button"
                onClick={() => goTo("/scan")}
                className="
                  eunoia-nav-link
                  relative
                  border-0
                  bg-transparent
                  py-2
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-white
                "
              >
                AI Scan
              </button>


              <button
                type="button"
                onClick={() => goTo("/shade-match")}
                className="
                  eunoia-nav-link
                  relative
                  border-0
                  bg-transparent
                  py-2
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-white
                "
              >
                Shade Match
              </button>


              <button
                type="button"
                onClick={() => goTo("/results")}
                className="
                  eunoia-nav-link
                  relative
                  border-0
                  bg-transparent
                  py-2
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-white
                "
              >
                Recommendations
              </button>


              <button
                type="button"
                onClick={() => goTo("/about")}
                className="
                  eunoia-nav-link
                  relative
                  border-0
                  bg-transparent
                  py-2
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-white
                "
              >
                About
              </button>

            </nav>


            {/* RIGHT SIDE */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              {/* MY KIT */}

              <button
                type="button"
                onClick={() => goTo("/kit")}
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  border
                  border-white/40
                  bg-transparent
                  px-3
                  text-white
                  hover:border-white
                  hover:bg-white
                  hover:text-black
                "
              >

                <ShoppingBag
                  size={17}
                  strokeWidth={1.5}
                />

                <span
                  className="
                    hidden
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    sm:inline
                  "
                >
                  My Kit
                </span>

              </button>


              {/* MOBILE MENU BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setMenuOpen(
                    (current) => !current
                  )
                }
                aria-label="Open menu"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-white/30
                  bg-transparent
                  text-white
                  hover:bg-white
                  hover:text-black
                  md:hidden
                "
              >

                {menuOpen ? (
                  <X size={20} />
                ) : (
                  <Menu size={20} />
                )}

              </button>

            </div>

          </div>


          {/* =================================================
              MOBILE MENU
          ================================================= */}

          {menuOpen && (
            <div
              className="
                relative
                border-t
                border-white/15
                bg-[#111111]/95
                px-6
                py-5
                backdrop-blur-md
                md:hidden
              "
            >

              <button
                type="button"
                onClick={() => goTo("/")}
                className="
                  block
                  w-full
                  border-b
                  border-white/10
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white
                "
              >
                Discover
              </button>


              <button
                type="button"
                onClick={() => goTo("/scan")}
                className="
                  block
                  w-full
                  border-b
                  border-white/10
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white
                "
              >
                AI Scan
              </button>


              <button
                type="button"
                onClick={() => goTo("/shade-match")}
                className="
                  block
                  w-full
                  border-b
                  border-white/10
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white
                "
              >
                Shade Match
              </button>


              <button
                type="button"
                onClick={() => goTo("/results")}
                className="
                  block
                  w-full
                  border-b
                  border-white/10
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white
                "
              >
                Recommendations
              </button>


              <button
                type="button"
                onClick={() => goTo("/about")}
                className="
                  block
                  w-full
                  border-b
                  border-white/10
                  py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white
                "
              >
                About
              </button>


              <button
                type="button"
                onClick={() => goTo("/kit")}
                className="
                  mt-4
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  border
                  border-white
                  px-5
                  py-3
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white
                "
              >

                <ShoppingBag size={15} />

                My Kit

              </button>

            </div>
          )}

        </header>


        {/* ===================================================
            HERO CONTENT
        =================================================== */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[720px]
            max-w-[1500px]
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
              max-w-3xl
              text-white
            "
          >

            <p
              className="
                fade-up
                mb-7
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.38em]
                text-white/75
                md:text-xs
              "
            >
              AI-powered beauty intelligence
            </p>


            <h1
              className="
                fade-up
                max-w-4xl
                text-6xl
                font-semibold
                uppercase
                leading-[0.86]
                tracking-[-0.055em]
                md:text-8xl
                lg:text-[clamp(5rem,9vw,9rem)]
              "
              style={{
                animationDelay: "100ms",
              }}
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
                fade-up
                mt-8
                max-w-xl
                text-sm
                leading-7
                text-white/75
                md:text-base
                lg:text-lg
              "
              style={{
                animationDelay: "180ms",
              }}
            >
              Scan your face, discover your
              skin profile and get personalised
              makeup recommendations across
              brands, budgets and shades.
            </p>


            {/* =================================================
                START SCAN BUTTON

                Hover → BLACK
            ================================================= */}

            <button
              type="button"
              onClick={() => goTo("/scan")}
              className="
                eunoia-scan-button
                fade-up
                mt-9
                flex
                items-center
                gap-4
                border
                border-white
                bg-white
                px-7
                py-4
                text-sm
                font-semibold
                uppercase
                tracking-[0.08em]
                text-black
              "
              style={{
                animationDelay: "260ms",
              }}
            >

              <span>
                Start your EUNOIA scan
              </span>

              <ArrowRight size={18} />

            </button>

          </div>

        </div>


        {/* ===================================================
            HERO BOTTOM
        =================================================== */}

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
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-white/50
              md:block
            "
          >
            Beauty intelligence / 01
          </div>


          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              })
            }
            className="
              ml-auto
              flex
              items-center
              gap-3
              border-0
              bg-transparent
              text-[10px]
              uppercase
              tracking-[0.2em]
              text-white/70
              hover:text-white
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

            <ArrowDownRight size={14} />

          </button>

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
                Personalised beauty
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
                EUNOIA combines facial
                analysis, skin profiling and
                product intelligence to help
                you find makeup that works
                for you — without endless
                shade testing.
              </p>


              <button
                type="button"
                onClick={() => goTo("/about")}
                className="
                  mt-6
                  flex
                  items-center
                  gap-2
                  border-0
                  border-b
                  border-[#111111]
                  bg-transparent
                  pb-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                "
              >

                Discover EUNOIA

                <ArrowRight size={14} />

              </button>

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

            <button
              type="button"
              onClick={() => goTo("/scan")}
              className="
                shade-step
                group
                border-0
                border-b
                border-[#d8d3cd]
                bg-transparent
                py-8
                text-left
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
                  max-w-xs
                  text-sm
                  leading-6
                  text-[#6c6660]
                "
              >
                Take a quick selfie in
                good lighting.
              </p>


              <span
                className="
                  mt-7
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  opacity-0
                  transition
                  duration-300
                  group-hover:opacity-100
                "
              >
                Start scan

                <ArrowRight size={13} />

              </span>

            </button>


            {/* STEP 02 */}

            <button
              type="button"
              onClick={() => goTo("/shade-match")}
              className="
                shade-step
                group
                border-0
                border-b
                border-[#d8d3cd]
                bg-transparent
                py-8
                text-left
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
                  max-w-xs
                  text-sm
                  leading-6
                  text-[#6c6660]
                "
              >
                Understand your tone,
                undertone and best shades.
              </p>


              <span
                className="
                  mt-7
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  opacity-0
                  transition
                  duration-300
                  group-hover:opacity-100
                "
              >
                Shade match

                <ArrowRight size={13} />

              </span>

            </button>


            {/* STEP 03 */}

            <button
              type="button"
              onClick={() => goTo("/results")}
              className="
                shade-step
                group
                border-0
                bg-transparent
                py-8
                text-left
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
                  max-w-xs
                  text-sm
                  leading-6
                  text-[#6c6660]
                "
              >
                Build your personalised
                makeup kit.
              </p>


              <span
                className="
                  mt-7
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  opacity-0
                  transition
                  duration-300
                  group-hover:opacity-100
                "
              >
                See matches

                <ArrowRight size={13} />

              </span>

            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          BRANDS
      ===================================================== */}

      <section
        className="
          bg-[#111111]
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

            <div>

              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-white/45
                "
              >
                Trusted beauty brands
              </p>


              <p
                className="
                  mt-3
                  max-w-xs
                  text-sm
                  leading-6
                  text-white/60
                "
              >
                Explore products matched
                to your profile across
                multiple beauty brands.
              </p>

            </div>


            <div
              className="
                grid
                grid-cols-2
                gap-x-8
                gap-y-7
                sm:grid-cols-3
                md:grid-cols-5
                justify-items-center
              "
            >

              {brands.map((brand) => (
                <span
                  key={brand}
                  className="
                    whitespace-nowrap
                    text-sm
                    font-medium
                    tracking-[0.08em]
                    text-white
                    transition
                    duration-300
                    hover:text-[#d8c1b8]
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
          SHADE MATCH FEATURE
      ===================================================== */}

      <section
        className="
          bg-[#eee7e1]
          px-6
          py-24
          md:px-12
          md:py-32
        "
      >

        <div
          className="
            mx-auto
            grid
            max-w-7xl
            gap-12
            lg:grid-cols-[1.2fr_0.8fr]
            lg:items-end
          "
        >

          <div>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#716960]
              "
            >
              Cross-brand shade matching
            </p>


            <h2
              className="
                mt-5
                max-w-4xl
                text-5xl
                font-semibold
                uppercase
                leading-[0.92]
                tracking-[-0.045em]
                md:text-7xl
              "
            >
              Find the shade
              <br />
              that feels like
              <br />
              yours.
            </h2>

          </div>


          <div
            className="
              lg:ml-auto
              lg:max-w-md
            "
          >

            <p
              className="
                text-base
                leading-7
                text-[#5f5954]
              "
            >
              Already know your favourite
              brand? Use Shade Match to
              compare a product you already
              wear with compatible shades
              from another brand.
            </p>


            <button
              type="button"
              onClick={() => goTo("/shade-match")}
              className="
                eunoia-button
                mt-8
                flex
                items-center
                gap-4
                border
                border-[#111111]
                bg-[#111111]
                px-7
                py-4
                text-sm
                font-semibold
                uppercase
                tracking-[0.08em]
                text-white
              "
            >

              <span className="relative z-10">
                Try Shade Match
              </span>

              <ArrowRight
                size={17}
                className="relative z-10"
              />

            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
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
              max-w-5xl
              text-5xl
              font-semibold
              uppercase
              leading-[0.92]
              tracking-[-0.045em]
              md:text-7xl
            "
          >
            Stop guessing.
            <br />
            Start matching.
          </h2>


          <p
            className="
              mx-auto
              mt-7
              max-w-lg
              text-sm
              leading-7
              text-[#6c6660]
            "
          >
            Let EUNOIA understand your
            features and help you discover
            makeup that fits you.
          </p>


          <button
            type="button"
            onClick={() => goTo("/scan")}
            className="
              eunoia-button
              mx-auto
              mt-9
              flex
              items-center
              gap-4
              border
              border-[#111111]
              bg-[#111111]
              px-8
              py-4
              text-sm
              font-semibold
              uppercase
              tracking-[0.08em]
              text-white
            "
          >

            <span className="relative z-10">
              Start your EUNOIA scan
            </span>

            <ArrowRight
              size={18}
              className="relative z-10"
            />

          </button>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="
          bg-[#111111]
          px-6
          py-10
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
            gap-6
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
            AI-powered personalised beauty
          </p>


          <p
            className="
              text-xs
              text-white/35
            "
          >
            © 2026 EUNOIA
          </p>

        </div>

      </footer>

    </div>
  );
}