import {
  ArrowLeft,
  Camera,
  Glasses,
  Sun,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Scan() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#111111]">

      {/* Header */}

      <header className="border-b border-[#ddd8d2] bg-[#f7f5f2]">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
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

          <div className="flex items-center gap-4">
            <button>
              <UserRound size={19} strokeWidth={1.5} />
            </button>
          </div>

        </div>

      </header>


      {/* Progress */}

      <div className="mx-auto max-w-3xl px-6 pt-8">

        <div className="flex items-center">

          <div className="flex flex-1 items-center">

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs text-white">
              1
            </div>

            <div className="h-px flex-1 bg-black" />

          </div>

          <div className="flex flex-1 items-center">

            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c9c3bc] bg-[#f7f5f2] text-xs text-[#77716b]">
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

          <span className="text-[#99928b]">
            Preferences
          </span>

          <span className="text-[#99928b]">
            Results
          </span>

        </div>

      </div>


      {/* Main */}

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">

        <div className="text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#77716b]">
            Step 01
          </p>

          <h1 className="mt-4 text-4xl font-semibold uppercase tracking-[-0.03em] md:text-6xl">
            Scan your face
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-[#6c6660] md:text-base">
            We'll analyse your skin tone, undertone and texture
            to help identify your best makeup shades.
          </p>

        </div>


        {/* Camera area */}

        <div className="mx-auto mt-12 max-w-md">

          <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-[#ddd6ce]">

            {/* Camera placeholder */}

            <div className="absolute inset-0 flex items-center justify-center">

              <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/70">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/80">

                  <Camera
                    size={30}
                    strokeWidth={1.4}
                  />

                </div>

              </div>

            </div>


            {/* Face frame */}

            <div className="absolute inset-x-10 top-10 bottom-10 rounded-[45%] border border-white/80" />


            {/* Corner markers */}

            <div className="absolute left-7 top-7 h-7 w-7 border-l-2 border-t-2 border-white" />

            <div className="absolute right-7 top-7 h-7 w-7 border-r-2 border-t-2 border-white" />

            <div className="absolute bottom-7 left-7 h-7 w-7 border-b-2 border-l-2 border-white" />

            <div className="absolute bottom-7 right-7 h-7 w-7 border-b-2 border-r-2 border-white" />


            {/* Instruction */}

            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-5 py-2 text-xs text-white">
              Position your face in the frame
            </div>

          </div>


          {/* Capture button */}

          <div className="mt-7 flex justify-center">

            <button
              onClick={() => navigate("/preferences")}
              className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-black shadow-lg ring-1 ring-[#bbb5ae]"
              aria-label="Capture"
            >
              <Camera
                size={25}
                color="white"
                strokeWidth={1.5}
              />
            </button>

          </div>

        </div>


        {/* Tips */}

        <div className="mx-auto mt-14 max-w-3xl">

          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[#77716b]">
            Tips for best results
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">

            <div className="border border-[#ddd8d2] bg-white p-5">

              <Sun
                size={23}
                strokeWidth={1.3}
              />

              <h3 className="mt-5 text-sm font-semibold uppercase">
                Good lighting
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#77716b]">
                Natural, even lighting works best.
              </p>

            </div>


            <div className="border border-[#ddd8d2] bg-white p-5">

              <Glasses
                size={23}
                strokeWidth={1.3}
              />

              <h3 className="mt-5 text-sm font-semibold uppercase">
                Remove glasses
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#77716b]">
                Keep your face unobstructed.
              </p>

            </div>


            <div className="border border-[#ddd8d2] bg-white p-5">

              <UserRound
                size={23}
                strokeWidth={1.3}
              />

              <h3 className="mt-5 text-sm font-semibold uppercase">
                Face the camera
              </h3>

              <p className="mt-2 text-xs leading-5 text-[#77716b]">
                Look directly at the camera.
              </p>

            </div>

          </div>

        </div>


        {/* Demo button */}

        <div className="mt-10 text-center">

          <button
            onClick={() => navigate("/preferences")}
            className="text-xs uppercase tracking-[0.15em] text-[#77716b] underline underline-offset-4"
          >
            Continue in demo mode
          </button>

        </div>

      </main>

    </div>
  );
}