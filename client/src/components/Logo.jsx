import React from "react";

export default function Logo({ size = 32, showText = false, textClassName = "" }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105"
      >
        {/* Rounded square container with vibrant indigo gradient */}
        <rect width="40" height="40" rx="11" fill="url(#tc-gradient)" />

        {/* Inner subtle glow border */}
        <rect
          x="0.5"
          y="0.5"
          width="39"
          height="39"
          rx="10.5"
          stroke="white"
          strokeOpacity="0.25"
        />

        {/* Top workflow bar */}
        <rect x="10" y="10.5" width="20" height="3.5" rx="1.75" fill="white" />

        {/* Middle workflow bar */}
        <rect
          x="10"
          y="17"
          width="13"
          height="3.5"
          rx="1.75"
          fill="white"
          fillOpacity="0.8"
        />

        {/* Bottom active task checklist item with checkmark */}
        <path
          d="M10 27.5L14 31.5L22 23.5"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="25"
          y="25.5"
          width="5"
          height="3.5"
          rx="1.75"
          fill="white"
          fillOpacity="0.6"
        />

        {/* Gradient Definition */}
        <defs>
          <linearGradient
            id="tc-gradient"
            x1="0"
            y1="0"
            x2="40"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6366F1" />
            <stop offset="0.5" stopColor="#4F46E5" />
            <stop offset="1" stopColor="#3730A3" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <span
          className={`font-bold tracking-tight text-slate-900 dark:text-white ${textClassName}`}
        >
          TaskChamber
        </span>
      )}
    </div>
  );
}
