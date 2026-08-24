import React, { createContext, useContext, useEffect, useState } from "react";

export const ACCENT_COLORS = {
  blue: {
    id: "blue",
    name: "Sky Blue",
    hex: "#3b82f6",
    tailwind: "bg-blue-600 hover:bg-blue-500 text-white",
    border: "border-blue-500",
    text: "text-blue-500 dark:text-blue-400",
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    ring: "focus:ring-blue-500/20 focus:border-blue-500",
  },
  indigo: {
    id: "indigo",
    name: "Classic Indigo",
    hex: "#6366f1",
    tailwind: "bg-indigo-600 hover:bg-indigo-500 text-white",
    border: "border-indigo-500",
    text: "text-indigo-500 dark:text-indigo-400",
    badge: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    ring: "focus:ring-indigo-500/20 focus:border-indigo-500",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Green",
    hex: "#10b981",
    tailwind: "bg-emerald-600 hover:bg-emerald-500 text-white",
    border: "border-emerald-500",
    text: "text-emerald-500 dark:text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    ring: "focus:ring-emerald-500/20 focus:border-emerald-500",
  },
  violet: {
    id: "violet",
    name: "Royal Violet",
    hex: "#8b5cf6",
    tailwind: "bg-violet-600 hover:bg-violet-500 text-white",
    border: "border-violet-500",
    text: "text-violet-500 dark:text-violet-400",
    badge: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    ring: "focus:ring-violet-500/20 focus:border-violet-500",
  },
  rose: {
    id: "rose",
    name: "Crimson Rose",
    hex: "#f43f5e",
    tailwind: "bg-rose-600 hover:bg-rose-500 text-white",
    border: "border-rose-500",
    text: "text-rose-500 dark:text-rose-400",
    badge: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    ring: "focus:ring-rose-500/20 focus:border-rose-500",
  },
  amber: {
    id: "amber",
    name: "Golden Amber",
    hex: "#f59e0b",
    tailwind: "bg-amber-600 hover:bg-amber-500 text-white",
    border: "border-amber-500",
    text: "text-amber-500 dark:text-amber-400",
    badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    ring: "focus:ring-amber-500/20 focus:border-amber-500",
  },
  monochrome: {
    id: "monochrome",
    name: "Monochrome (B&W)",
    hex: "#71717a",
    tailwind: "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950",
    border: "border-slate-900 dark:border-white",
    text: "text-slate-900 dark:text-white",
    badge: "bg-slate-500/10 text-slate-800 dark:text-slate-200 border-slate-500/20",
    ring: "focus:ring-slate-500/20 focus:border-slate-800 dark:focus:border-white",
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("tc_theme") || "dark";
  });

  const [accent, setAccent] = useState(() => {
    return localStorage.getItem("tc_accent") || "blue";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    localStorage.setItem("tc_theme", theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-accent", accent);
    localStorage.setItem("tc_accent", accent);

    const accentObj = ACCENT_COLORS[accent] || ACCENT_COLORS.blue;
    root.style.setProperty("--accent-primary", accentObj.hex);
  }, [accent]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const currentAccent = ACCENT_COLORS[accent] || ACCENT_COLORS.blue;

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
    accent,
    setAccent,
    currentAccent,
    availableAccents: Object.values(ACCENT_COLORS),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
