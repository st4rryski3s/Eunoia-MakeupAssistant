import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Palette,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#111111]">

      {/* HEADER */}
      <header className="border-b border-[#d8d3cd] bg-[#f7f5f2]">
        <div className="flex items-center justify-between px-6 py-5 md:px-10">

          <button
            onClick={() => navigate("/")}
            className="text-2xl font-light tracking-[0.35em]"
          >
            AURA
          </button>

          <nav className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.15em] md:flex">
            <button
              onClick={() => navigate("/")}
              className="transition-opacity hover:opacity-50"
            >
              Home
            </button>

            <button
              onClick={() => navigate("/scan")}
              className="transition-opacity hover:opacity-50"
            >
              AI Scan
            </button>

            <button
              onClick={() => navigate("/shade-match")}
              className="transition-opacity hover:opacity-50"
            >
              Shade Match
            </button>

            <span className="border-b border-black pb-1">
              About
            </span>
          </nav>

          <button
            onClick={() => navigate("/kit")}
            aria-label="Shopping bag"
            className="transition-opacity hover:opacity-50"
          >
            <ShoppingBag size={19} strokeWidth={1.5} />
          </button>

        </div>
      </header>


      {/* HERO */}
      <section className="bg-black px-6 py-24 text-white md:px-12 md:py-32">

        <div className="mx-auto max-w-7xl">

          <button
            onClick={() => navigate("/")}
            className="mb-16 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
          >
            <ArrowLeft size={15} />
            Back home
          </button>

          <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/50">
            About AURA
          </p>

          <h1 className="mt-7 max-w-5xl text-6xl font-semibold uppercase leading-[0.9] tracking-[-0.05em] md:text-8xl">
            Makeup
            <br />
            that makes
            <br />
            sense.
          </h1>

          <p className="mt-10 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
            AURA is an AI-powered personalized beauty assistant designed
            to make finding makeup that works for you simpler, faster
            and more personal.
          </p>

        </div>

      </section>


      {/* WHAT IS AURA */}
      <section className="px-6 py-24 md:px-12 md:py-32">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-16 md:grid-cols-12">

            <div className="md:col-span-5">

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#77716b]">
                01 / The idea
              </p>

              <h2 className="mt-6 text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.03em] md:text-6xl">
                Beauty
                <br />
                should not
                <br />
                be guesswork.
              </h2>

            </div>

            <div className="md:col-span-6 md:col-start-7">

              <p className="text-lg leading-8 text-[#514b46]">
                Choosing makeup can mean comparing hundreds of shades,
                brands and products without knowing what will actually
                work for you.
              </p>

              <p className="mt-7 text-base leading-7 text-[#77716b]">
                AURA brings those decisions into one personalized
                experience. It combines facial analysis, skin profiling,
                preferences and product information to help you discover
                products suited to you.
              </p>

              <p className="mt-7 text-base leading-7 text-[#77716b]">
                Instead of searching through endless products, you start
                with yourself — your skin, your preferences, your budget
                and your desired look.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="border-y border-[#d8d3cd] bg-[#e8dfd7] px-6 py-24 md:px-12 md:py-32">

        <div className="mx-auto max-w-7xl">

          <div className="mb-16">

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#716960]">
              02 / How it works
            </p>

            <h2 className="mt-5 max-w-3xl text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] md:text-7xl">
              From scan
              <br />
              to match.
            </h2>

          </div>


          <div className="grid border-t border-[#cfc5bc] md:grid-cols-3">

            {/* STEP 1 */}
            <div className="border-b border-[#cfc5bc] py-10 md:border-b-0 md:border-r md:pr-10">

              <div className="flex items-start justify-between">

                <Camera
                  size={27}
                  strokeWidth={1.3}
                />

                <span className="text-xs text-[#8a8179]">
                  01
                </span>

              </div>

              <h3 className="mt-14 text-xl font-semibold uppercase">
                Scan
              </h3>

              <p className="mt-4 text-sm leading-6 text-[#6c625b]">
                Take a quick photo in good lighting. AURA analyses
                your facial and skin characteristics to create your
                starting profile.
              </p>

            </div>


            {/* STEP 2 */}
            <div className="border-b border-[#cfc5bc] py-10 md:border-b-0 md:border-r md:px-10">

              <div className="flex items-start justify-between">

                <Sparkles
                  size={27}
                  strokeWidth={1.3}
                />

                <span className="text-xs text-[#8a8179]">
                  02
                </span>

              </div>

              <h3 className="mt-14 text-xl font-semibold uppercase">
                Discover
              </h3>

              <p className="mt-4 text-sm leading-6 text-[#6c625b]">
                Tell us about your skin type, preferred look, budget
                and brands. Your preferences help personalize the
                recommendations.
              </p>

            </div>


            {/* STEP 3 */}
            <div className="py-10 md:pl-10">

              <div className="flex items-start justify-between">

                <Palette
                  size={27}
                  strokeWidth={1.3}
                />

                <span className="text-xs text-[#8a8179]">
                  03
                </span>

              </div>

              <h3 className="mt-14 text-xl font-semibold uppercase">
                Match
              </h3>

              <p className="mt-4 text-sm leading-6 text-[#6c625b]">
                AURA compares your profile with products across
                brands and ranks the shades and products that best
                fit your profile.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* SHADE MATCH */}
      <section className="bg-black px-6 py-24 text-white md:px-12 md:py-28">

        <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
              Cross-brand matching
            </p>

            <h2 className="mt-5 max-w-3xl text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] md:text-7xl">
              Already have
              <br />
              a shade you love?
            </h2>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/60">
              Enter a product you already use and discover the closest
              available shade in another brand.
            </p>

          </div>

          <button
            onClick={() => navigate("/shade-match")}
            className="flex w-fit items-center gap-4 rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-black transition hover:bg-[#e8e4df]"
          >
            Explore shade match
            <ArrowRight size={18} />
          </button>

        </div>

      </section>


      {/* OUR APPROACH */}
      <section className="px-6 py-24 md:px-12 md:py-32">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-16 md:grid-cols-12">

            <div className="md:col-span-4">

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#77716b]">
                03 / Our approach
              </p>

              <h2 className="mt-6 text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.03em] md:text-5xl">
                Personal.
                <br />
                Practical.
                <br />
                Inclusive.
              </h2>

            </div>


            <div className="md:col-span-7 md:col-start-6">

              <div className="border-t border-[#d8d3cd]">

                <div className="border-b border-[#d8d3cd] py-8">

                  <h3 className="text-lg font-semibold uppercase">
                    Personal
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#6c6660]">
                    Recommendations are based on the individual rather
                    than treating every user the same.
                  </p>

                </div>


                <div className="border-b border-[#d8d3cd] py-8">

                  <h3 className="text-lg font-semibold uppercase">
                    Practical
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#6c6660]">
                    Budget, preferred brands and product categories
                    are part of the recommendation process.
                  </p>

                </div>


                <div className="border-b border-[#d8d3cd] py-8">

                  <h3 className="text-lg font-semibold uppercase">
                    Inclusive
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#6c6660]">
                    AURA is designed to work across different skin
                    depths, undertones, preferences and budgets.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="bg-[#f0ebe6] px-6 py-24 md:px-12 md:py-32">

        <div className="mx-auto max-w-7xl text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#716960]">
            Your beauty profile starts here
          </p>

          <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.04em] md:text-7xl">
            Find makeup
            <br />
            that fits you.
          </h2>

          <button
            onClick={() => navigate("/scan")}
            className="mx-auto mt-9 flex items-center gap-4 rounded-full bg-black px-8 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#292929]"
          >
            Start your Aura scan
            <ArrowRight size={18} />
          </button>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="bg-black px-6 py-8 text-white md:px-12">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <button
            onClick={() => navigate("/")}
            className="text-xl font-light tracking-[0.35em]"
          >
            AURA
          </button>

          <p className="text-xs text-white/50">
            AI-powered personalized beauty
          </p>

          <p className="text-xs text-white/40">
            © 2026 Aura
          </p>

        </div>

      </footer>

    </div>
  );
}