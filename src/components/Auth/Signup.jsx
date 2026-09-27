import { useState } from "react";
import { supabase } from "../../lib/supabase";


export default function Signup({
  onSwitchToLogin,
  onSignupSuccess,
}) {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSignup = async (event) => {

    event.preventDefault();

    setError("");
    setLoading(true);


    try {

      const cleanFirstName =
        firstName.trim();

      const cleanLastName =
        lastName.trim();

      const cleanEmail =
        email.trim();


      const fullName =
        `${cleanFirstName} ${cleanLastName}`.trim();


      const {
        data,
        error: signupError,
      } = await supabase.auth.signUp({

        email: cleanEmail,

        password,

        options: {
          data: {
            first_name: cleanFirstName,
            last_name: cleanLastName,
            full_name: fullName,
          },
        },

      });


      if (signupError) {
        throw signupError;
      }


      if (data?.user) {

        onSignupSuccess?.(data.user);

      }

    } catch (error) {

      console.error(
        "Signup error:",
        error
      );

      setError(
        error.message ||
        "Unable to create your account. Please try again."
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
                Create your account
              </h2>

              <p className="mt-2 text-sm text-black/50">
                Start your personalized Eunoia journey.
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
              onSubmit={handleSignup}
              className="space-y-5"
            >

              {/* Names */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label
                    htmlFor="signup-first-name"
                    className="
                      mb-2
                      block
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                    "
                  >
                    First name
                  </label>

                  <input
                    id="signup-first-name"
                    type="text"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(event.target.value)
                    }
                    placeholder="First name"
                    required
                    autoComplete="given-name"
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


                <div>

                  <label
                    htmlFor="signup-last-name"
                    className="
                      mb-2
                      block
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                    "
                  >
                    Last name
                  </label>

                  <input
                    id="signup-last-name"
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(event.target.value)
                    }
                    placeholder="Last name"
                    required
                    autoComplete="family-name"
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

              </div>


              {/* Email */}

              <div>

                <label
                  htmlFor="signup-email"
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
                  id="signup-email"
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
                  htmlFor="signup-password"
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
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Create a password"
                  required
                  minLength={6}
                  autoComplete="new-password"
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

                <p className="mt-2 text-xs text-black/40">
                  Password must be at least 6 characters.
                </p>

              </div>


              {/* Signup button */}

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
                  ? "Creating account..."
                  : "Create Account"
                }

              </button>

            </form>


            {/* Login */}

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

                Already have an account?

                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="
                    ml-2
                    font-medium
                    underline
                    underline-offset-4
                    transition
                    hover:opacity-60
                  "
                >
                  Log in
                </button>

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}