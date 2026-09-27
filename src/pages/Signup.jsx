import { useState } from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { supabase } from "../lib/supabase";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const from =
    location.state?.from?.pathname || "/";

  async function handleSignup(event) {
    event.preventDefault();

    setError("");

    if (!email || !password || !confirmPassword) {
      setError(
        "Please complete all fields."
      );

      return;
    }

    if (password.length < 6) {
      setError(
        "Your password must be at least 6 characters."
      );

      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error: signupError,
      } =
        await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

      if (signupError) {
        throw signupError;
      }

      /*
       * Depending on your Supabase email
       * confirmation settings, session may
       * either exist immediately or remain null.
       */

      if (data.session) {
        navigate(from, {
          replace: true,
        });

        return;
      }

      setSuccess(true);
    } catch (signupError) {
      console.error(
        "Signup error:",
        signupError
      );

      setError(
        signupError.message ||
          "Unable to create your account."
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
          SIGNUP
      ================================================== */}

      <main className="grid min-h-[calc(100vh-82px)] lg:grid-cols-2">

        {/* IMAGE */}

        <div className="relative hidden overflow-hidden bg-[#111111] lg:block">

          <img
            src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=90"
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
              Discover
              <br />
              <span className="italic">
                your match.
              </span>
            </h1>

            <p className="mt-7 max-w-md text-sm leading-7 text-white/65">
              Create your EUNOIA profile and
              let your beauty preferences
              travel with you.
            </p>

          </div>

        </div>


        {/* FORM */}

        <div className="flex items-center justify-center px-6 py-16 md:px-12 lg:px-20">

          <div className="w-full max-w-[470px]">

            {!success ? (
              <>

                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#77716b]">
                  New here?
                </p>

                <h2 className="text-5xl font-light leading-[0.92] tracking-[-0.05em] md:text-6xl">
                  Create your
                  <br />
                  <span className="italic">
                    EUNOIA profile.
                  </span>
                </h2>

                <p className="mt-7 text-sm leading-7 text-[#77716b]">
                  Your personalized beauty
                  experience starts here.
                </p>


                {/* ERROR */}

                {error && (
                  <div className="mt-8 border border-[#b98c82] bg-[#f3e5e1] px-5 py-4 text-sm leading-6 text-[#6e3f37]">
                    {error}
                  </div>
                )}


                <form
                  onSubmit={handleSignup}
                  className="mt-10"
                >

                  {/* EMAIL */}

                  <div className="mb-7">

                    <label
                      htmlFor="signup-email"
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
                      id="signup-email"
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

                  <div className="mb-7">

                    <label
                      htmlFor="signup-password"
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
                        id="signup-password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) =>
                          setPassword(
                            event.target.value
                          )
                        }
                        placeholder="At least 6 characters"
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


                  {/* CONFIRM PASSWORD */}

                  <div className="mb-8">

                    <label
                      htmlFor="confirm-password"
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
                      Confirm password
                    </label>

                    <div className="relative">

                      <input
                        id="confirm-password"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="new-password"
                        value={
                          confirmPassword
                        }
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value
                          )
                        }
                        placeholder="Enter your password again"
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
                          setShowConfirmPassword(
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
                      >
                        {showConfirmPassword ? (
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


                  {/* SIGN UP */}

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
                      ? "Creating account..."
                      : "Create account"}

                    {!loading && (
                      <ArrowRight
                        size={17}
                        strokeWidth={1.6}
                      />
                    )}

                  </button>

                </form>


                {/* LOGIN */}

                <div className="mt-10 border-t border-[#d8d3cd] pt-7 text-center">

                  <p className="text-sm text-[#77716b]">
                    Already have an account?
                  </p>

                  <Link
                    to="/login"
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
                    Sign in
                  </Link>

                </div>

              </>
            ) : (

              /* ==================================================
                 EMAIL CONFIRMATION
              ================================================== */

              <div className="text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#111111] text-white">

                  <Check
                    size={27}
                    strokeWidth={1.5}
                  />

                </div>

                <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#77716b]">
                  Almost there
                </p>

                <h2 className="mt-5 text-4xl font-light leading-[0.95] tracking-[-0.04em]">
                  Check your
                  <br />
                  <span className="italic">
                    email.
                  </span>
                </h2>

                <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-[#77716b]">
                  We've created your account.
                  If email confirmation is enabled
                  in Supabase, click the confirmation
                  link we sent you before signing in.
                </p>

                <Link
                  to="/login"
                  className="
                    mt-10
                    flex
                    min-h-[58px]
                    w-full
                    items-center
                    justify-center
                    gap-3
                    bg-[#111111]
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-white
                    transition
                    hover:bg-[#2c2926]
                  "
                >
                  Continue to login

                  <ArrowRight
                    size={17}
                    strokeWidth={1.6}
                  />
                </Link>

              </div>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}