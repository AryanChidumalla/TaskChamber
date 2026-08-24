import React, { useState } from "react";
import {
  DotsThreeVertical,
  Circle,
  CheckCircle,
  CalendarBlank,
  PencilSimple,
  Trash,
  ArrowRight,
} from "@phosphor-icons/react";
import { useTheme } from "../context/ThemeContext";

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
  medium: { label: "Medium", color: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
  high: { label: "High", color: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
  urgent: { label: "Urgent", color: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" },
};

export default function TaskCard({
  task,
  sections = [],
  onEdit,
  onDelete,
  onToggleComplete,
  onMoveToSection,
}) {
  const { currentAccent } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const priorityStyle = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", task._id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group relative rounded-2xl border p-4 shadow-sm backdrop-blur-sm transition-all duration-200 cursor-grab active:cursor-grabbing ${
        isDragging
          ? "opacity-40 scale-95 border-blue-500"
          : "bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md"
      } ${task.completed ? "bg-slate-50/60 dark:bg-slate-900/40 opacity-75" : ""}`}
    >
      {/* Header: Priority & Action Menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${priorityStyle.color}`}
        >
          {priorityStyle.label}
        </span>

        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <DotsThreeVertical size={16} weight="bold" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 top-full mt-1 z-30 w-44 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl animate-fade-in">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit(task);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <PencilSimple size={14} weight="bold" />
                  Edit Task
                </button>

                {/* Move to another column */}
                <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />
                <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Move to Column
                </p>
                {sections
                  .filter((sec) => sec._id !== (task.section?._id || task.section))
                  .map((sec) => (
                    <button
                      key={sec._id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onMoveToSection(task._id, sec._id);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      <ArrowRight size={12} weight="bold" className="text-slate-400" />
                      {sec.name}
                    </button>
                  ))}

                <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onDelete(task._id);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                >
                  <Trash size={14} weight="bold" />
                  Delete Task
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Task Title & Checkbox */}
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(task);
          }}
          className="mt-0.5 text-slate-400 hover:text-emerald-500 transition shrink-0"
        >
          {task.completed ? (
            <CheckCircle size={17} weight="fill" className="text-emerald-500" />
          ) : (
            <Circle size={17} weight="bold" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
          )}
        </button>

        <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
          <h4
            className={`text-xs font-semibold leading-snug cursor-pointer transition ${
              task.completed
                ? "line-through text-slate-400 dark:text-slate-500"
                : "text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Info: Due Date */}
      {formattedDate && (
        <div className="mt-3 pt-2 flex items-center justify-between text-[11px] border-t border-slate-100 dark:border-slate-800/50">
          <div
            className={`flex items-center gap-1.5 font-medium ${
              isOverdue
                ? "text-rose-600 dark:text-rose-400 font-bold"
                : task.completed
                ? "text-slate-400 dark:text-slate-500"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            <CalendarBlank size={13} weight="bold" className="shrink-0" />
            <span>{isOverdue ? `Overdue: ${formattedDate}` : formattedDate}</span>
          </div>
        </div>
      )}
    </div>
  );
}
