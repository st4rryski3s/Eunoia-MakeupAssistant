import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  ScanFace,
  Palette,
  ShoppingBag,
} from "lucide-react";

import { useNavigate } from "react-router-dom";



export default function About() {
  const navigate = useNavigate();

  return (
    <div
      className="
        min-h-screen
        bg-[#f7f5f2]
        text-[#111111]
      "
    >

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

    


      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          min-h-[680px]
          overflow-hidden
          bg-black
          text-white
          md:min-h-[760px]
        "
      >

        {/* BACKGROUND */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black
            via-black/90
            to-black/60
          "
        />


        {/* CONTENT */}

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[680px]
            max-w-[1500px]
            flex-col
            justify-center
            px-6
            pt-28
            md:min-h-[760px]
            md:px-10
          "
        >

          {/* BACK */}

          <button
            onClick={() => navigate("/")}
            className="
              mb-20
              flex
              w-fit
              items-center
              gap-3
              text-xs
              font-bold
              uppercase
              tracking-[0.2em]
              text-white/60
              transition
              hover:text-white
            "
          >

            <ArrowLeft
              size={16}
              strokeWidth={1.5}
            />

            Back home

          </button>


          {/* LABEL */}

          <p
            className="
              mb-7
              text-xs
              font-bold
              uppercase
              tracking-[0.35em]
              text-white/60
            "
          >
            About EUNOIA
          </p>


          {/* TITLE */}

          <h1
            className="
              max-w-5xl
              text-6xl
              font-semibold
              uppercase
              leading-[0.87]
              tracking-[-0.05em]
              md:text-8xl
              lg:text-[9rem]
            "
          >
            Makeup

            <br />

            that makes

            <br />

            sense.
          </h1>


          {/* DESCRIPTION */}

          <p
            className="
              mt-10
              max-w-xl
              text-base
              leading-7
              text-white/65
              md:text-lg
            "
          >
            EUNOIA brings together facial analysis,
            shade intelligence and product discovery
            to make finding makeup feel less like
            guesswork and more like a match.
          </p>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section
        className="
          px-6
          py-24
          md:px-10
          md:py-32
        "
      >

        <div
          className="
            mx-auto
            max-w-[1500px]
          "
        >

          <div
            className="
              grid
              gap-14
              md:grid-cols-12
            "
          >

            <div className="md:col-span-7">

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-[#817971]
                "
              >
                Why EUNOIA
              </p>


              <h2
                className="
                  mt-6
                  max-w-4xl
                  text-4xl
                  font-semibold
                  uppercase
                  leading-[0.95]
                  tracking-[-0.04em]
                  md:text-6xl
                "
              >
                Beauty should
                <br />
                feel personal.
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
                Choosing makeup can mean comparing
                hundreds of shades, brands and formulas.
                EUNOIA simplifies that process by using
                your own features and preferences to
                narrow everything down.
              </p>


              <p
                className="
                  mt-6
                  text-base
                  leading-7
                  text-[#5f5954]
                "
              >
                Instead of asking you to adapt to
                makeup, EUNOIA is designed to help
                makeup adapt to you.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          THREE PILLARS
      ===================================================== */}

      <section
        className="
          border-y
          border-[#d8d3cd]
          bg-[#ebe3dc]
          px-6
          md:px-10
        "
      >

        <div
          className="
            mx-auto
            grid
            max-w-[1500px]
            md:grid-cols-3
          "
        >

          {/* 01 */}

          <div
            className="
              border-b
              border-[#d8d3cd]
              px-0
              py-12
              md:border-b-0
              md:border-r
              md:px-10
              md:py-16
              md:first:pl-0
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
              "
            >

              <ScanFace
                size={28}
                strokeWidth={1.3}
              />

              <span
                className="
                  text-xs
                  font-semibold
                  text-[#817971]
                "
              >
                01
              </span>

            </div>


            <h3
              className="
                mt-16
                text-2xl
                font-semibold
                uppercase
              "
            >
              Understand
            </h3>


            <p
              className="
                mt-4
                text-sm
                leading-6
                text-[#6c655f]
              "
            >
              Analyse your facial features and
              skin characteristics to build a
              personalised beauty profile.
            </p>

          </div>


          {/* 02 */}

          <div
            className="
              border-b
              border-[#d8d3cd]
              px-0
              py-12
              md:border-b-0
              md:border-r
              md:px-10
              md:py-16
            "
          >

            <div
              className="
                flex
                items-start
                justify-between
              "
            >

              <Palette
                size={28}
                strokeWidth={1.3}
              />

              <span
                className="
                  text-xs
                  font-semibold
                  text-[#817971]
                "
              >
                02
              </span>

            </div>


            <h3
              className="
                mt-16
                text-2xl
                font-semibold
                uppercase
              "
            >
              Match
            </h3>


            <p
              className="
                mt-4
                text-sm
                leading-6
                text-[#6c655f]
              "
            >
              Connect your complexion, undertone
              and preferences with products and
              shades from different brands.
            </p>

          </div>


          {/* 03 */}

          <div
            className="
              px-0
              py-12
              md:px-10
              md:py-16
              md:last:pr-0
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
                size={28}
                strokeWidth={1.3}
              />

              <span
                className="
                  text-xs
                  font-semibold
                  text-[#817971]
                "
              >
                03
              </span>

            </div>


            <h3
              className="
                mt-16
                text-2xl
                font-semibold
                uppercase
              "
            >
              Discover
            </h3>


            <p
              className="
                mt-4
                text-sm
                leading-6
                text-[#6c655f]
              "
            >
              Save products you love, build your
              personal kit and discover beauty
              without endless trial and error.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          CTA
      ===================================================== */}

      <section
        className="
          bg-[#f7f5f2]
          px-6
          py-24
          md:px-10
          md:py-32
        "
      >

        <div
          className="
            mx-auto
            max-w-[1500px]
          "
        >

          <div
            className="
              flex
              flex-col
              gap-8
              md:flex-row
              md:items-end
              md:justify-between
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.3em]
                  text-[#817971]
                "
              >
                Your beauty profile
              </p>


              <h2
                className="
                  mt-5
                  max-w-4xl
                  text-5xl
                  font-semibold
                  uppercase
                  leading-[0.92]
                  tracking-[-0.04em]
                  md:text-7xl
                "
              >
                Find what
                <br />
                fits you.
              </h2>

            </div>


            <button
              onClick={() => navigate("/scan")}
              className="
                flex
                w-fit
                items-center
                gap-4
                bg-black
                px-7
                py-4
                text-sm
                font-bold
                uppercase
                tracking-[0.1em]
                text-white
                transition
                hover:bg-[#292929]
              "
            >

              Start your scan

              <ArrowRight
                size={18}
              />

            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

    

    </div>
  );
}