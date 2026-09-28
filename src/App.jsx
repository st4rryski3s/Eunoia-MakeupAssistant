import {
  useEffect,
  useState,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { supabase } from "./lib/supabase";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

import EunoiaLayout from "./components/EunoiaLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Scan from "./pages/Scan";
import Preferences from "./pages/Preferences";
import Results from "./pages/Results";
import KitBuilder from "./pages/KitBuilder";
import ShadeMatch from "./pages/ShadeMatch";

import "./App.css";


function AuthLoading() {
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
            tracking-[0.34em]
            md:text-4xl
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


function SitePage({
  children,
  floatingBasket = false,
}) {
  return (
    <EunoiaLayout
      floatingBasket={floatingBasket}
    >
      {children}
    </EunoiaLayout>
  );
}


function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <SitePage>
            <Home />
          </SitePage>
        }
      />

      <Route
        path="/about"
        element={
          <SitePage>
            <About />
          </SitePage>
        }
      />

      <Route
        path="/scan"
        element={
          <SitePage>
            <Scan />
          </SitePage>
        }
      />

      <Route
        path="/preferences"
        element={
          <SitePage>
            <Preferences />
          </SitePage>
        }
      />

      <Route
        path="/results"
        element={
          <SitePage
            floatingBasket
          >
            <Results />
          </SitePage>
        }
      />

      <Route
        path="/kit"
        element={
          <SitePage>
            <KitBuilder />
          </SitePage>
        }
      />

      <Route
        path="/shade-match"
        element={
          <SitePage
            floatingBasket
          >
            <ShadeMatch />
          </SitePage>
        }
      />

      <Route
        path="*"
        element={
          <SitePage>
            <Home />
          </SitePage>
        }
      />

    </Routes>
  );
}


export default function App() {

  const [user, setUser] =
    useState(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const [showSignup, setShowSignup] =
    useState(false);


  useEffect(() => {

    let mounted = true;


    async function getCurrentSession() {

      const {
        data,
        error,
      } =
        await supabase.auth.getSession();


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

      authListener
        ?.subscription
        ?.unsubscribe();

    };

  }, []);


  if (authLoading) {
    return <AuthLoading />;
  }


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


  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}