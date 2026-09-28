import { Link } from "react-router-dom";

export default function EunoiaFooter() {
  return (
    <footer
      className="
        eunoia-global-footer
        w-full
        border-t
        border-white/10
        bg-[#111111]
        text-white
      "
    >
      <div
        className="
          mx-auto
          max-w-[1500px]
          px-6
          py-9
          md:px-10
          md:py-10
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          {/* LOGO + EUNOIA */}
          <Link
            to="/"
            className="
              flex
              items-center
              gap-4
              transition
              duration-300
              hover:opacity-80
            "
            aria-label="EUNOIA home"
          >
            {/* YOUR ACTUAL LOGO IMAGE */}
            <img
              src="/eunoia-logo.png"
              alt=""
              aria-hidden="true"
              className="
                h-20
                w-auto
                object-contain
                md:h-22
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

          {/* COPYRIGHT — RIGHT SIDE */}
          <span
            className="
              text-[10px]
              uppercase
              tracking-[0.14em]
              text-white/45
            "
          >
            © 2026 EUNOIA
          </span>
        </div>
      </div>
    </footer>
  );
}