import { Link } from "react-router-dom";

export default function EunoiaBrand({ dark = false }) {
  return (
    <Link
      to="/"
      aria-label="EUNOIA home"
      className="
        inline-flex
        shrink-0
        items-center
        gap-3
        transition
        duration-300
        hover:opacity-70
      "
    >
      {/* Flower mark */}
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="
          h-7
          w-7
          shrink-0
          md:h-8
          md:w-8
        "
      >
        <g transform="translate(16 16)">
          <g fill={dark ? "#d9a7b5" : "#a86d82"}>
            <ellipse
              cx="0"
              cy="-7"
              rx="3.5"
              ry="6.5"
            />

            <ellipse
              cx="0"
              cy="-7"
              rx="3.5"
              ry="6.5"
              transform="rotate(60)"
              opacity="0.86"
            />

            <ellipse
              cx="0"
              cy="-7"
              rx="3.5"
              ry="6.5"
              transform="rotate(120)"
              opacity="0.92"
            />

            <ellipse
              cx="0"
              cy="-7"
              rx="3.5"
              ry="6.5"
              transform="rotate(180)"
              opacity="0.8"
            />

            <ellipse
              cx="0"
              cy="-7"
              rx="3.5"
              ry="6.5"
              transform="rotate(240)"
              opacity="0.92"
            />

            <ellipse
              cx="0"
              cy="-7"
              rx="3.5"
              ry="6.5"
              transform="rotate(300)"
              opacity="0.86"
            />

            <circle
              cx="0"
              cy="0"
              r="3"
            />
          </g>
        </g>
      </svg>

      {/* EUNOIA wordmark */}
      <span
        className={`
          text-3xl
          font-light
          leading-none
          tracking-[0.34em]
          md:text-4xl
          ${
            dark
              ? "text-white"
              : "text-[#111111]"
          }
        `}
      >
        EUNOIA
      </span>
    </Link>
  );
}