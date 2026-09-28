import { useLocation } from "react-router-dom";

import EunoiaNav from "./EunoiaNav";
import EunoiaFooter from "./EunoiaFooter";


export default function EunoiaLayout({
  children,
  floatingBasket = false,
}) {

  const location =
    useLocation();


  /*
    Home and About have dark/photographic
    hero sections, so their header sits
    over the hero.
  */

  const darkHeader =
    location.pathname === "/" ||
    location.pathname === "/about";


  const overlayHeader =
    darkHeader;


  return (
    <div
      className="
        eunoia-site
        min-h-screen
      "
    >

      <EunoiaNav
        dark={darkHeader}
        overlay={overlayHeader}
        showFloatingBasket={
          floatingBasket
        }
      />


      <main
        className="
          eunoia-page-content
        "
      >
        {children}
      </main>


      <EunoiaFooter />

    </div>
  );
}