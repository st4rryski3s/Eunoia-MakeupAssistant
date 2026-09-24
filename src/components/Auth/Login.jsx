import { useState } from "react";
import { supabase } from "../../lib/supabase";

function Login({ onSwitchToSignup, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess("Login successful!");

    if (onLoginSuccess) {
      onLoginSuccess(data.user);
    }

    setLoading(false);
  }

  return (
    <div>
      <h2>Welcome Back</h2>

      <p>Log in to continue to GlowMatch.</p>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="login-email">Email</label>

          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="login-password">Password</label>

          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
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
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;