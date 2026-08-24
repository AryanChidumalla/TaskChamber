import React, { useState, useEffect } from "react";
import { X, Trash, CalendarBlank, Flag, Columns, CheckCircle } from "@phosphor-icons/react";

const PRIORITIES = [
  { value: "low", label: "Low", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  { value: "medium", label: "Medium", color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30" },
  { value: "high", label: "High", color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { value: "urgent", label: "Urgent", color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30" },
];

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  initialData = null,
  sections = [],
  defaultSectionId = null,
  loading = false,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(initialData?._id);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setSectionId(initialData.section?._id || initialData.section || defaultSectionId || (sections[0]?._id || ""));
      setPriority(initialData.priority || "medium");
      setDueDate(
        initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : ""
      );
      setCompleted(Boolean(initialData.completed));
    } else {
      setTitle("");
      setDescription("");
      setSectionId(defaultSectionId || (sections[0]?._id || ""));
      setPriority("medium");
      setDueDate("");
      setCompleted(false);
    }
    setError("");
  }, [initialData, defaultSectionId, sections, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      sectionId: sectionId || (sections[0]?._id || null),
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      completed,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl animate-modal-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {isEditing ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEditing ? "Modify task details and assignments" : "Add a new task to your project workflow"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Implement user authentication"
              autoFocus
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950/60 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add extra context, checklists, or links..."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950/60 px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          {/* Column / Section selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                <Columns size={14} weight="bold" className="text-slate-400" />
                Workflow Column
              </label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950/60 px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none cursor-pointer focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                {sections.map((sec) => (
                  <option key={sec._id} value={sec._id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                <CalendarBlank size={14} weight="bold" className="text-slate-400" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950/60 px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none cursor-pointer focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              <Flag size={14} weight="bold" className="text-slate-400" />
              Priority Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition ${
                    priority === p.value
                      ? `${p.color} ring-2 ring-indigo-500/40 shadow-sm font-bold`
                      : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Completed toggle */}
          {isEditing && (
            <div className="pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CheckCircle size={16} weight="fill" className={completed ? "text-emerald-500" : "text-slate-400"} />
                  Mark as Completed
                </span>
              </label>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(initialData._id)}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
              >
                <Trash size={14} weight="bold" />
                Delete Task
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
