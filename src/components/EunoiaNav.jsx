import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  ShoppingBag,
  X,
} from "lucide-react";

const KIT_KEY = "aura-kit";

function getKitCount() {
  try {
    const saved = localStorage.getItem(KIT_KEY);

    if (!saved) {
      return 0;
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed.length
      : 0;
  } catch {
    return 0;
  }
}

export default function EunoiaNav({
  dark = false,
  overlay = false,
  showFloatingBasket = false,
}) {
  const location = useLocation();

  const [kitCount, setKitCount] =
    useState(getKitCount);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [basketPopping, setBasketPopping] =
    useState(false);

  const animationTimer =
    useRef(null);

  /*
   * ---------------------------------------------------------
   * LIVE KIT UPDATES
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleKitUpdate = (event) => {
      setKitCount(getKitCount());

      /*
       * Only pop when a product is ADDED.
       */

      if (
        showFloatingBasket &&
        event?.detail?.action === "add"
      ) {
        setBasketPopping(false);

        window.requestAnimationFrame(() => {
          setBasketPopping(true);

          if (animationTimer.current) {
            clearTimeout(
              animationTimer.current
            );
          }

          animationTimer.current =
            setTimeout(() => {
              setBasketPopping(false);
            }, 700);
        });
      }
    };

    window.addEventListener(
      "eunoia-kit-updated",
      handleKitUpdate
    );

    const handleStorage = () => {
      setKitCount(getKitCount());
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    setKitCount(getKitCount());

    return () => {
      window.removeEventListener(
        "eunoia-kit-updated",
        handleKitUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorage
      );

      if (animationTimer.current) {
        clearTimeout(
          animationTimer.current
        );
      }
    };
  }, [
    showFloatingBasket,
    location.pathname,
  ]);

  /*
   * Close mobile menu after navigation.
   */

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    {
      label: "Discover",
      path: "/",
    },
    {
      label: "AI Scan",
      path: "/scan",
    },
    {
      label: "Shade Match",
      path: "/shade-match",
    },
    {
      label: "Recommendations",
      path: "/results",
    },
    {
      label: "About",
      path: "/about",
    },
  ];

  const textColor = dark
    ? "text-white"
    : "text-[#111111]";

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className={`
          ${
            overlay
              ? "absolute"
              : "relative"
          }

          left-0
          right-0
          top-0
          z-50
          w-full
          ${textColor}
        `}
      >

        {overlay && (
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              h-36
              bg-gradient-to-b
              from-black/55
              via-black/20
              to-transparent
            "
          />
        )}

        <div
          className="
            relative
            mx-auto
            flex
            h-[82px]
            max-w-[1500px]
            items-center
            justify-between
            px-6
            md:px-10
          "
        >

          {/* LOGO */}

          <Link
            to="/"
            className="
              eunoia-logo
              text-xl
              font-light
              tracking-[0.34em]
              md:text-2xl
            "
          >
            EUNOIA
          </Link>


          {/* DESKTOP NAV */}

          <nav
            className="
              hidden
              items-center
              gap-6
              md:flex
              lg:gap-8
            "
          >

            {navLinks.map((link) => {
              const active =
                location.pathname ===
                link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    eunoia-nav-link
                    relative
                    py-2
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]

                    ${
                      active
                        ? "opacity-100"
                        : "opacity-65"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}

          </nav>


          {/* RIGHT SIDE */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            {/* NORMAL MY KIT */}

            <Link
              to="/kit"
              className="
                eunoia-my-kit
                flex
                h-10
                items-center
                gap-2
                border
                border-black/15
                px-3
                text-[#111]
              "
            >

              <ShoppingBag
                size={17}
                strokeWidth={1.6}
              />

              <span
                className="
                  hidden
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  sm:inline
                "
              >
                My Kit
              </span>

              <span
                className="
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#111]
                  px-1
                  text-[9px]
                  font-bold
                  text-white
                "
              >
                {kitCount}
              </span>

            </Link>


            {/* MOBILE MENU */}

            <button
              type="button"
              onClick={() =>
                setMenuOpen(
                  (value) => !value
                )
              }
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                md:hidden
              "
              aria-label="Menu"
            >

              {menuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}

            </button>

          </div>

        </div>


        {/* MOBILE NAV */}

        {menuOpen && (
          <div
            className="
              relative
              border-t
              border-black/10
              bg-[#f7f5f2]
              px-6
              py-5
              md:hidden
            "
          >

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="
                  block
                  border-b
                  border-black/10
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                "
              >
                {link.label}
              </Link>
            ))}

          </div>
        )}

      </header>


      {/* =====================================================
          FLOATING BASKET

          THIS APPEARS ONLY WHEN:

          <EunoiaNav showFloatingBasket={true} />

          Results = TRUE
          KitBuilder = FALSE
      ===================================================== */}

      {showFloatingBasket && (
        <Link
          to="/kit"
          className={`
            floating-basket
            fixed
            right-5
            top-1/2
            z-[100]
            flex
            h-16
            w-16
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-[#111]
            text-white
            shadow-[0_12px_35px_rgba(0,0,0,0.22)]
            md:right-7
            lg:right-9

            ${
              basketPopping
                ? "floating-basket-pop"
                : ""
            }
          `}
          aria-label="Open my kit"
        >

          {/* expanding ring */}

          <span
            className="
              floating-basket-ring
              absolute
              inset-0
              rounded-full
            "
          />


          {/* icon */}

          <span
            className="
              relative
              z-10
              flex
              items-center
              justify-center
            "
          >

            <ShoppingBag
              size={23}
              strokeWidth={1.6}
            />

          </span>


          {/* count */}

          <span
            className={`
              floating-basket-count
              absolute
              -right-1
              -top-1
              z-20
              flex
              h-6
              min-w-6
              items-center
              justify-center
              rounded-full
              border-2
              border-[#f7f5f2]
              bg-[#c89f91]
              px-1
              text-[10px]
              font-bold
              text-white

              ${
                basketPopping
                  ? "basket-count-pop"
                  : ""
              }
            `}
          >
            {kitCount}
          </span>

        </Link>
      )}

    </>
  );
}