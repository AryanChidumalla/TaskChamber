import React, { useEffect } from "react";
import { CheckCircle, WarningCircle, Info, X } from "@phosphor-icons/react";

export default function Toast({ message, type = "info", onClose, duration = 3500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle size={20} weight="fill" className="text-emerald-500 shrink-0" />,
    error: <WarningCircle size={20} weight="fill" className="text-rose-500 shrink-0" />,
    info: <Info size={20} weight="fill" className="text-blue-500 shrink-0" />,
  };

  const borderColors = {
    success: "border-emerald-500/30 bg-emerald-50/90 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200",
    error: "border-rose-500/30 bg-rose-50/90 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200",
    info: "border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md max-w-md ${
          borderColors[type] || borderColors.info
        }`}
      >
        {icons[type] || icons.info}
        <span className="text-xs font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
        >
          <X size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
}
