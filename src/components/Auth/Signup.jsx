import { useState } from "react";

import { supabase } from "../../lib/supabase";

function Signup({ onSwitchToLogin, onSignupSuccess }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    

    setSuccess("Account created successfully!");

    if (onSignupSuccess) {
      onSignupSuccess(data.user);
    }

    setLoading(false);
  }

  return (
    <div>
      <h2>Create Your Account</h2>

      <p>Start your personalized GlowMatch experience.</p>

      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="signup-name">Full Name</label>

          <input
            id="signup-name"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div>
          <label htmlFor="signup-email">Email</label>

          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="signup-password">Password</label>

          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            minLength={6}
            required
          />
        </div>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: "green" }}>
            {success}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
        >
          Log In
        </button>
      </p>
    </div>
  );
}

export default Signup;