import { useEffect, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * Where the user originally wanted to go.
   *
   * Example:
   * User clicks AI Scan while logged out
   * → Login
   * → after login → /scan
   */
  const from =
    location.state?.from?.pathname || "/";

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (
        mounted &&
        session?.user
      ) {
        navigate(from, {
          replace: true,
        });
      }
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [navigate, from]);

  async function handleLogin(event) {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error: loginError,
      } =
        await supabase.auth.signInWithPassword(
          {
            email: email.trim(),
            password,
          }
        );

      if (loginError) {
        throw loginError;
      }

      if (!data.user) {
        throw new Error(
          "Login could not be completed."
        );
      }

      navigate(from, {
        replace: true,
      });
    } catch (loginError) {
      console.error(
        "Login error:",
        loginError
      );

      setError(
        loginError.message ||
          "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#111111]">

      {/* ==================================================
          TOP BAR
      ================================================== */}

      <header className="border-b border-[#d8d3cd]">

        <div className="mx-auto flex h-[82px] max-w-[1500px] items-center justify-between px-6 md:px-10 lg:px-12">

          <Link
            to="/"
            className="
              text-xl
              font-light
              tracking-[0.34em]
              transition
              hover:opacity-60
              md:text-2xl
            "
          >
            EUNOIA
          </Link>

          <Link
            to="/"
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[#66605a]
              transition
              hover:text-[#111111]
            "
          >
            Back to site
          </Link>

        </div>

      </header>


      {/* ==================================================
          LOGIN
      ================================================== */}

      <main className="grid min-h-[calc(100vh-82px)] lg:grid-cols-2">

        {/* LEFT SIDE */}

        <div className="relative hidden overflow-hidden bg-[#111111] lg:block">

          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=90"
            alt="Beauty"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              opacity-70
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

          <div className="absolute bottom-12 left-12 max-w-lg text-white">

            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
              EUNOIA
            </p>

            <h1 className="text-6xl font-light leading-[0.9] tracking-[-0.05em]">
              Beauty,
              <br />
              <span className="italic">
                made personal.
              </span>
            </h1>

            <p className="mt-7 max-w-md text-sm leading-7 text-white/65">
              Your skin. Your preferences.
              Your makeup.
              One intelligent beauty profile.
            </p>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="flex items-center justify-center px-6 py-16 md:px-12 lg:px-20">

          <div className="w-full max-w-[470px]">

            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#77716b]">
              Welcome back
            </p>

            <h2 className="text-5xl font-light leading-[0.92] tracking-[-0.05em] md:text-6xl">
              Sign in
              <br />
              <span className="italic">
                to EUNOIA.
              </span>
            </h2>

            <p className="mt-7 text-sm leading-7 text-[#77716b]">
              Continue your personalized
              beauty journey.
            </p>


            {/* ERROR */}

            {error && (
              <div className="mt-8 border border-[#b98c82] bg-[#f3e5e1] px-5 py-4 text-sm leading-6 text-[#6e3f37]">
                {error}
              </div>
            )}


            {/* FORM */}

            <form
              onSubmit={handleLogin}
              className="mt-10"
            >

              {/* EMAIL */}

              <div className="mb-7">

                <label
                  htmlFor="email"
                  className="
                    mb-3
                    block
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-[#66605a]
                  "
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  className="
                    w-full
                    border-b
                    border-[#aaa39c]
                    bg-transparent
                    px-0
                    py-4
                    text-base
                    outline-none
                    placeholder:text-[#aaa39c]
                    focus:border-[#111111]
                  "
                />

              </div>


              {/* PASSWORD */}

              <div className="mb-8">

                <label
                  htmlFor="password"
                  className="
                    mb-3
                    block
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-[#66605a]
                  "
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    className="
                      w-full
                      border-b
                      border-[#aaa39c]
                      bg-transparent
                      px-0
                      py-4
                      pr-10
                      text-base
                      outline-none
                      placeholder:text-[#aaa39c]
                      focus:border-[#111111]
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) =>
                          !value
                      )
                    }
                    className="
                      absolute
                      right-0
                      top-1/2
                      -translate-y-1/2
                      text-[#77716b]
                      hover:text-[#111111]
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={19}
                        strokeWidth={1.5}
                      />
                    ) : (
                      <Eye
                        size={19}
                        strokeWidth={1.5}
                      />
                    )}
                  </button>

                </div>

              </div>


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  min-h-[60px]
                  w-full
                  items-center
                  justify-center
                  gap-3
                  bg-[#111111]
                  px-6
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-white
                  transition
                  hover:bg-[#2c2926]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {loading
                  ? "Signing in..."
                  : "Sign in"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    strokeWidth={1.6}
                  />
                )}

              </button>

            </form>


            {/* SIGN UP */}

            <div className="mt-10 border-t border-[#d8d3cd] pt-7 text-center">

              <p className="text-sm text-[#77716b]">
                Don't have an account?
              </p>

              <Link
                to="/signup"
                state={{
                  from:
                    location.state?.from,
                }}
                className="
                  mt-3
                  inline-block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  underline
                  underline-offset-4
                "
              >
                Create an account
              </Link>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}