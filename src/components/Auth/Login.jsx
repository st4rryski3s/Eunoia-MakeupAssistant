import { useState } from "react";
import { supabase } from "../../lib/supabase";


export default function Login({
  onSwitchToSignup,
  onLoginSuccess,
}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);


    try {

      const {
        data,
        error: loginError,
      } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });


      if (loginError) {
        throw loginError;
      }


      if (data?.user) {
        onLoginSuccess?.(data.user);
      }

    } catch (error) {

      console.error("Login error:", error);

      setError(
        error.message ||
        "Unable to log in. Please try again."
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#111111]">

      <div className="flex min-h-screen items-center justify-center px-6">

        <div className="w-full max-w-md">

          {/* Logo */}

          <div className="mb-12 text-center">

            <h1
              className="
                text-3xl
                font-light
                tracking-[0.35em]
              "
            >
              EUNOIA
            </h1>

            <p
              className="
                mt-4
                text-xs
                uppercase
                tracking-[0.2em]
                text-black/45
              "
            >
              Your personal beauty assistant
            </p>

          </div>


          {/* Card */}

          <div
            className="
              border
              border-black/10
              bg-white
              p-8
              md:p-10
            "
          >

            <div className="mb-8">

              <h2 className="text-2xl font-medium">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-black/50">
                Log in to continue to Eunoia.
              </p>

            </div>


            {/* Error */}

            {error && (

              <div
                className="
                  mb-6
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
              >
                {error}
              </div>

            )}


            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label
                  htmlFor="login-email"
                  className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                  "
                >
                  Email
                </label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="
                    w-full
                    border
                    border-black/15
                    bg-[#faf9f7]
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-black
                  "
                />

              </div>


              {/* Password */}

              <div>

                <label
                  htmlFor="login-password"
                  className="
                    mb-2
                    block
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                  "
                >
                  Password
                </label>

                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="
                    w-full
                    border
                    border-black/15
                    bg-[#faf9f7]
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-black
                  "
                />

              </div>


              {/* Login button */}

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-3
                  w-full
                  bg-[#111111]
                  px-5
                  py-3.5
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-white
                  transition
                  hover:bg-black/80
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                {loading
                  ? "Logging in..."
                  : "Log In"
                }

              </button>

            </form>


            {/* Signup */}

            <div
              className="
                mt-8
                border-t
                border-black/10
                pt-6
                text-center
              "
            >

              <p className="text-sm text-black/50">

                Don't have an account?

                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="
                    ml-2
                    font-medium
                    underline
                    underline-offset-4
                    transition
                    hover:opacity-60
                  "
                >
                  Create one
                </button>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}