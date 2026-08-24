import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "@phosphor-icons/react";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-1.5 p-2 rounded-xl border transition-all duration-200 shadow-sm ${
        isDark
          ? "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700"
          : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300"
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun size={17} weight="bold" className="text-amber-400 animate-fade-in" />
      ) : (
        <Moon size={17} weight="bold" className="text-indigo-600 animate-fade-in" />
      )}
    </button>
  );
}
