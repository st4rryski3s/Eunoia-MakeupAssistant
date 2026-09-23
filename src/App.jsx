import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Scan from "./pages/Scan";
import Preferences from "./pages/Preferences";
import Results from "./pages/Results";
import KitBuilder from "./pages/KitBuilder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/results" element={<Results />} />
        <Route path="/kit" element={<KitBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;