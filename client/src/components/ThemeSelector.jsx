import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon, Palette, Check } from "@phosphor-icons/react";

export default function ThemeSelector() {
  const { isDark, toggleTheme, accent, setAccent, availableAccents } = useTheme();
  const [showPalette, setShowPalette] = useState(false);

  return (
    <div className="flex items-center gap-1.5 relative">
      {/* Light / Dark Mode Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition shadow-sm"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? (
          <Sun size={17} weight="bold" className="text-amber-400" />
        ) : (
          <Moon size={17} weight="bold" className="text-slate-700" />
        )}
      </button>

      {/* Accent Palette Toggle Button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPalette(!showPalette)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition shadow-sm"
          title="Customize Theme Accent"
        >
          <Palette size={17} weight="bold" />
        </button>

        {showPalette && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowPalette(false)}
            />
            <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Accent Color
                </span>
              </div>

              <div className="space-y-1">
                {availableAccents.map((acc) => {
                  const isSelected = accent === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setAccent(acc.id);
                        setShowPalette(false);
                      }}
                      className={`flex w-full items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition ${
                        isSelected
                          ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 dark:border-white/20"
                          style={{ backgroundColor: acc.hex }}
                        />
                        <span>{acc.name}</span>
                      </div>
                      {isSelected && (
                        <Check size={14} weight="bold" className="text-slate-900 dark:text-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
