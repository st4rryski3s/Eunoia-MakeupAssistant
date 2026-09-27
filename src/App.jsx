import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
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


export default function App() {

  /* =========================================================
     AUTH STATE
  ========================================================= */

  const [user, setUser] = useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [showSignup, setShowSignup] =
    useState(false);


  /* =========================================================
     CHECK EXISTING SESSION
  ========================================================= */

  useEffect(() => {
    let mounted = true;


    async function getCurrentSession() {

      const {
        data,
        error,
      } = await supabase.auth.getSession();


      if (error) {
        console.error(
          "Error getting Supabase session:",
          error
        );
      }


      if (mounted) {
        setUser(
          data?.session?.user ?? null
        );

        setAuthLoading(false);
      }
    }


    getCurrentSession();


    /* =======================================================
       LISTEN FOR LOGIN / LOGOUT
    ======================================================= */

    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {

          if (mounted) {
            setUser(
              session?.user ?? null
            );
          }

        }
      );


    return () => {

      mounted = false;

      authListener?.subscription?.unsubscribe();

    };

  }, []);


  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (authLoading) {

    return (
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#f7f5f2]
          text-[#111111]
        "
      >

        <div className="text-center">

          <p
            className="
              text-3xl
              font-light
              tracking-[0.35em]
            "
          >
            EUNOIA
          </p>

          <p
            className="
              mt-5
              text-xs
              uppercase
              tracking-[0.2em]
              text-black/40
            "
          >
            Loading...
          </p>

        </div>

      </div>
    );
  }


  /* =========================================================
     AUTH SCREEN
     
     If there is no logged-in user:
     
     Login
       ↓
     Signup
     
     The app itself remains locked until authentication.
  ========================================================= */

  if (!user) {

    if (showSignup) {

      return (
        <Signup

          onSwitchToLogin={() => {
            setShowSignup(false);
          }}

          onSignupSuccess={(newUser) => {
            setUser(newUser);
          }}

        />
      );

    }


    return (
      <Login

        onSwitchToSignup={() => {
          setShowSignup(true);
        }}

        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
        }}

      />
    );
  }


  /* =========================================================
     LOGGED-IN APPLICATION
  ========================================================= */

  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =================================================
            AI SKIN SCAN
        ================================================= */}

        <Route
          path="/scan"
          element={<Scan />}
        />


        {/* =================================================
            USER PREFERENCES
        ================================================= */}

        <Route
          path="/preferences"
          element={<Preferences />}
        />


        {/* =================================================
            RECOMMENDATIONS
        ================================================= */}

        <Route
          path="/results"
          element={<Results />}
        />


        {/* =================================================
            MY KIT
        ================================================= */}

        <Route
          path="/kit"
          element={<KitBuilder />}
        />


        {/* =================================================
            SHADE MATCH
        ================================================= */}

        <Route
          path="/shade-match"
          element={<ShadeMatch />}
        />


        {/* =================================================
            ABOUT
        ================================================= */}

        <Route
          path="/about"
          element={<About />}
        />


        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={<Home />}
        />

      </Routes>

    </BrowserRouter>
  );
}