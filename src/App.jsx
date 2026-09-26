import { useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Scan from "./pages/Scan";
import Preferences from "./pages/Preferences";
import Results from "./pages/Results";
import KitBuilder from "./pages/KitBuilder";
import ShadeMatch from "./pages/ShadeMatch";


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


export default function App() {
  return (
    <BrowserRouter>

      <ScrollToTop />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/scan"
          element={<Scan />}
        />

        <Route
          path="/preferences"
          element={<Preferences />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

        <Route
          path="/kit"
          element={<KitBuilder />}
        />

        <Route
          path="/shade-match"
          element={<ShadeMatch />}
        />

      </Routes>

    </BrowserRouter>
  );
}