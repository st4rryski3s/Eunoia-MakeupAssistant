import { useEffect, useState } from "react";

import { supabase } from "./lib/supabase";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

import "./App.css";

function App() {
  const [supabaseStatus, setSupabaseStatus] = useState(
    "Testing Supabase connection..."
  );

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  // --------------------------------------------
  // Test Supabase connection
  // --------------------------------------------

  useEffect(() => {
    async function testSupabase() {
      const { error } = await supabase.auth.getSession();

      if (error) {
        console.error("Supabase connection error:", error);
        setSupabaseStatus("Supabase connection failed.");
        return;
      }

      setSupabaseStatus("Supabase connected!");
    }

    testSupabase();
  }, []);

  // --------------------------------------------
  // Check existing login session
  // --------------------------------------------

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setAuthLoading(false);
    }

    getUser();

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // --------------------------------------------
  // Logout
  // --------------------------------------------

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return;
    }

    setUser(null);
  }

  // --------------------------------------------
  // Loading screen
  // --------------------------------------------

  if (authLoading) {
    return (
      <div>
        <h1>GlowMatch</h1>
        <p>Loading...</p>
      </div>
    );
  }

  // --------------------------------------------
  // Login / Signup screen
  // --------------------------------------------

  if (!user) {
    return (
      <div>
        {showSignup ? (
          <Signup
            onSwitchToLogin={() => setShowSignup(false)}
            onSignupSuccess={(newUser) => {
              setUser(newUser);
            }}
          />
        ) : (
          <Login
            onSwitchToSignup={() => setShowSignup(true)}
            onLoginSuccess={(loggedInUser) => {
              setUser(loggedInUser);
            }}
          />
        )}
      </div>
    );
  }

  // --------------------------------------------
  // Logged-in app
  // --------------------------------------------

  return (
    <>
      <div
        style={{
          padding: "16px",
          textAlign: "right",
          borderBottom: "1px solid #ddd",
        }}
      >
        <span>
          Logged in as: <strong>{user.email}</strong>
        </span>

        <button
          type="button"
          onClick={handleLogout}
          style={{ marginLeft: "12px" }}
        >
          Log Out
        </button>
      </div>

      {/* 
        MAIN GLOWMATCH APP GOES HERE

        Person 1's UI will be connected here later.
        Person 2's skin analysis will be connected here later.
        Person 3's recommendations will be connected here later.
      */}

      <main>
        <h1>GlowMatch</h1>

        <p>
          <strong>{supabaseStatus}</strong>
        </p>

        <p>
          Logged in successfully as:
          <br />
          <strong>{user.email}</strong>
        </p>
      </main>
    </>
  );
}

export default App;