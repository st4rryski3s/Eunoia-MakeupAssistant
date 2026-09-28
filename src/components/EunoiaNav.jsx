import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  Menu,
  ShoppingBag,
  X,
  LogOut,
} from "lucide-react";

import { supabase } from "../lib/supabase";

import {
  getSavedProducts,
} from "../services/supabaseData";

export default function EunoiaNav({
  dark = false,
  overlay = false,
  showFloatingBasket = false,
}) {
  const location = useLocation();

  const [kitCount, setKitCount] = useState(0);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [basketPopping, setBasketPopping] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const animationTimer =
    useRef(null);

  /*
   * ---------------------------------------------------------
   * LOAD KIT COUNT FROM SUPABASE
   * ---------------------------------------------------------
   *
   * Supabase is now the single source of truth.
   * We do NOT count localStorage anymore.
   */

  const loadKitCount = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(
          "Error getting current user:",
          userError
        );

        setKitCount(0);
        return;
      }

      if (!user) {
        setKitCount(0);
        return;
      }

      const savedProducts =
        await getSavedProducts(user.id);

      setKitCount(
        Array.isArray(savedProducts)
          ? savedProducts.length
          : 0
      );
    } catch (error) {
      console.error(
        "Error loading kit count:",
        error
      );

      setKitCount(0);
    }
  };

  /*
   * ---------------------------------------------------------
   * INITIAL LOAD + KIT UPDATE LISTENER
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    const loadCount = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (cancelled) {
          return;
        }

        if (userError) {
          console.error(
            "Error getting current user:",
            userError
          );

          setKitCount(0);
          return;
        }

        if (!user) {
          setKitCount(0);
          return;
        }

        const savedProducts =
          await getSavedProducts(user.id);

        if (cancelled) {
          return;
        }

        setKitCount(
          Array.isArray(savedProducts)
            ? savedProducts.length
            : 0
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Error loading kit count:",
            error
          );

          setKitCount(0);
        }
      }
    };

    loadCount();

    /*
     * Listen for products being added/removed
     * anywhere in the application.
     */
    const handleKitUpdate = async (event) => {
      await loadKitCount();

      /*
       * Animate the floating basket when a product
       * has been added.
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

    /*
     * Listen for Supabase authentication changes.
     *
     * This makes sure the number resets when the
     * user logs out and loads the correct user's
     * kit after login.
     */
    const {
      data: authListener,
    } = supabase.auth.onAuthStateChange(
      () => {
        loadKitCount();
      }
    );

    window.addEventListener(
      "eunoia-kit-updated",
      handleKitUpdate
    );

    return () => {
      cancelled = true;

      window.removeEventListener(
        "eunoia-kit-updated",
        handleKitUpdate
      );

      authListener?.subscription?.unsubscribe();

      if (animationTimer.current) {
        clearTimeout(
          animationTimer.current
        );
      }
    };
  }, [showFloatingBasket]);

  /*
   * ---------------------------------------------------------
   * CLOSE MOBILE MENU WHEN PAGE CHANGES
   * ---------------------------------------------------------
   */

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /*
   * ---------------------------------------------------------
   * LOGOUT
   * ---------------------------------------------------------
   */

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      const { error } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          "Logout error:",
          error
        );

        setLoggingOut(false);

        return;
      }

      /*
       * Immediately reset the displayed kit count.
       */
      setKitCount(0);

      window.location.href = "/";
    } catch (error) {
      console.error(
        "Unexpected logout error:",
        error
      );

      setLoggingOut(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * NAVIGATION LINKS
   * ---------------------------------------------------------
   */

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

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <>
      <header
        className={`
          eunoia-global-nav
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
              h-40
              bg-gradient-to-b
              from-black/60
              via-black/25
              to-transparent
            "
          />
        )}

        <div
          className="
            relative
            mx-auto
            flex
            h-[96px]
            max-w-[1500px]
            items-center
            justify-between
            px-6
            md:px-10
          "
        >
          {/* LOGO + EUNOIA */}

          <Link
            to="/"
            className="
              flex
              shrink-0
              items-center
              gap-4
              transition
              duration-300
              hover:opacity-80
            "
            aria-label="EUNOIA home"
          >
            {/* ACTUAL LOGO */}

            <img
              src="/eunoia-logo.png"
              alt=""
              aria-hidden="true"
              className="
                h-14
                w-auto
                object-contain
                md:h-16
              "
            />

            {/* TYPED EUNOIA */}

            <span
              className="
                eunoia-logo
                text-2xl
                font-light
                leading-none
                tracking-[0.34em]
                md:text-3xl
              "
            >
              EUNOIA
            </span>
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
                    transition
                    duration-300
                    hover:opacity-100
                    ${
                      active
                        ? "opacity-100"
                        : "opacity-60"
                    }
                  `}
                >
                  {link.label}

                  {active && (
                    <span
                      className="
                        absolute
                        bottom-0
                        left-0
                        h-px
                        w-full
                        bg-current
                      "
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}

          <div
            className="
              flex
              items-center
              gap-2
              md:gap-3
            "
          >
            {/* MY KIT */}

            <Link
              to="/kit"
              className={`
                flex
                h-10
                items-center
                gap-2
                border
                px-3
                transition
                duration-300
                md:px-4
                ${
                  dark
                    ? `
                      border-white/40
                      text-white
                      hover:bg-white
                      hover:text-[#111111]
                    `
                    : `
                      border-black/15
                      text-[#111111]
                      hover:bg-[#111111]
                      hover:text-white
                    `
                }
              `}
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

              {/* SUPABASE KIT COUNT */}

              <span
                className={`
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  px-1
                  text-[9px]
                  font-bold
                  ${
                    dark
                      ? "bg-white text-[#111111]"
                      : "bg-[#111111] text-white"
                  }
                `}
              >
                {kitCount}
              </span>
            </Link>

            {/* LOG OUT */}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className={`
                hidden
                h-10
                items-center
                gap-2
                border
                px-4
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                transition
                duration-300
                disabled:cursor-wait
                disabled:opacity-50
                md:flex
                ${
                  dark
                    ? `
                      border-white/40
                      text-white
                      hover:bg-white
                      hover:text-[#111111]
                    `
                    : `
                      border-black/15
                      text-[#111111]
                      hover:bg-[#111111]
                      hover:text-white
                    `
                }
              `}
            >
              <LogOut
                size={16}
                strokeWidth={1.6}
              />

              {loggingOut
                ? "Logging Out..."
                : "Log Out"}
            </button>

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

        {/* MOBILE MENU */}

        {menuOpen && (
          <div
            className="
              relative
              border-t
              border-black/10
              bg-[#f7f5f2]
              px-6
              py-5
              text-[#111111]
              shadow-lg
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

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="
                flex
                w-full
                items-center
                gap-3
                border-b
                border-black/10
                py-4
                text-left
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
              "
            >
              <LogOut
                size={17}
                strokeWidth={1.6}
              />

              {loggingOut
                ? "Logging Out..."
                : "Log Out"}
            </button>
          </div>
        )}
      </header>

      {/* FLOATING BASKET */}

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
          <span
            className="
              floating-basket-ring
              absolute
              inset-0
              rounded-full
            "
          />

          <ShoppingBag
            size={23}
            strokeWidth={1.6}
            className="
              relative
              z-10
            "
          />

          {/* SAME SUPABASE KIT COUNT */}

          <span
            className={`
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