import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { supabase } from "./lib/supabase";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

import Home from "./pages/Home";
import About from "./pages/About";
import Scan from "./pages/Scan";
import Preferences from "./pages/Preferences";
import Results from "./pages/Results";
import KitBuilder from "./pages/KitBuilder";
import ShadeMatch from "./pages/ShadeMatch";

import "./App.css";

// --------------------------------------------
// Scroll to top whenever the page changes
// --------------------------------------------

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

// --------------------------------------------
// Person 1's GlowMatch routes
// --------------------------------------------

function GlowMatchRoutes() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/scan" element={<Scan />} />

        <Route path="/preferences" element={<Preferences />} />

        <Route path="/results" element={<Results />} />

        <Route path="/kit" element={<KitBuilder />} />

        <Route path="/shade-match" element={<ShadeMatch />} />

        {/* If the user enters an unknown URL, go home */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </>
  );
}

// --------------------------------------------
// Main App
// --------------------------------------------

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
  // Login / Signup
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
  // Logged-in GlowMatch application
  // --------------------------------------------

  return (
    <BrowserRouter>
      <GlowMatchRoutes />
    </BrowserRouter>
  );
}

export default App;