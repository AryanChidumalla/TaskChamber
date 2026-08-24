import React, { useState } from "react";
import { Plus, PencilSimple, Trash, Check, X } from "@phosphor-icons/react";
import TaskCard from "./TaskCard";
import { useTheme } from "../context/ThemeContext";

export default function KanbanBoard({
  sections = [],
  tasks = [],
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleCompleteTask,
  onMoveTask,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
}) {
  const { currentAccent } = useTheme();
  const [dragOverSectionId, setDragOverSectionId] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSectionName, setEditingSectionName] = useState("");

  const handleDragOver = (e, sectionId) => {
    e.preventDefault();
    if (dragOverSectionId !== sectionId) {
      setDragOverSectionId(sectionId);
    }
  };

  const handleDragLeave = (e, sectionId) => {
    if (dragOverSectionId === sectionId) {
      setDragOverSectionId(null);
    }
  };

  const handleDrop = (e, sectionId) => {
    e.preventDefault();
    setDragOverSectionId(null);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId && sectionId) {
      onMoveTask(taskId, sectionId);
    }
  };

  const handleCreateSection = (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    onAddSection(newSectionName.trim());
    setNewSectionName("");
    setIsAddingSection(false);
  };

  const handleStartRename = (section) => {
    setEditingSectionId(section._id);
    setEditingSectionName(section.name);
  };

  const handleSaveRename = (sectionId) => {
    if (editingSectionName.trim()) {
      onUpdateSection(sectionId, { name: editingSectionName.trim() });
    }
    setEditingSectionId(null);
    setEditingSectionName("");
  };

  return (
    <div className="flex gap-5 overflow-x-auto pb-6 pt-2 items-start select-none min-h-[calc(100vh-14rem)]">
      {sections.map((section) => {
        const sectionTasks = tasks.filter(
          (task) => (task.section?._id || task.section) === section._id
        );
        const isDragOver = dragOverSectionId === section._id;

        return (
          <div
            key={section._id}
            onDragOver={(e) => handleDragOver(e, section._id)}
            onDragLeave={(e) => handleDragLeave(e, section._id)}
            onDrop={(e) => handleDrop(e, section._id)}
            className={`w-80 shrink-0 flex flex-col rounded-3xl border transition-all duration-200 ${
              isDragOver
                ? "border-blue-500/80 bg-blue-50/50 dark:bg-slate-900/80 ring-2 ring-blue-500/20"
                : "bg-slate-100/70 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800/80"
            }`}
          >
            {/* Column Header */}
            <div className="p-3.5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {editingSectionId === section._id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="text"
                      value={editingSectionName}
                      onChange={(e) => setEditingSectionName(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveRename(section._id);
                        if (e.key === "Escape") setEditingSectionId(null);
                      }}
                      className="w-full text-xs font-semibold px-2 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-blue-500 outline-none"
                    />
                    <button
                      onClick={() => handleSaveRename(section._id)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-emerald-500"
                    >
                      <Check size={14} weight="bold" />
                    </button>
                    <button
                      onClick={() => setEditingSectionId(null)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded text-slate-400"
                    >
                      <X size={14} weight="bold" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate uppercase tracking-wider">
                      {section.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {sectionTasks.length}
                    </span>
                  </>
                )}
              </div>

              {editingSectionId !== section._id && (
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => onAddTask(section._id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
                    title="Add task to column"
                  >
                    <Plus size={15} weight="bold" />
                  </button>
                  <button
                    onClick={() => handleStartRename(section)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
                    title="Rename column"
                  >
                    <PencilSimple size={15} weight="bold" />
                  </button>
                  {sections.length > 1 && (
                    <button
                      onClick={() => onDeleteSection(section._id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      title="Delete column"
                    >
                      <Trash size={15} weight="bold" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Column Tasks Body */}
            <div className="p-3 flex-1 flex flex-col gap-3 min-h-[140px] max-h-[calc(100vh-20rem)] overflow-y-auto">
              {sectionTasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-slate-300 dark:border-slate-800/80 rounded-2xl text-center">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">No tasks in this stage</p>
                  <button
                    onClick={() => onAddTask(section._id)}
                    className={`mt-2 text-xs font-semibold ${currentAccent.text} hover:underline transition`}
                  >
                    + Add Task
                  </button>
                </div>
              ) : (
                sectionTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    sections={sections}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onToggleComplete={onToggleCompleteTask}
                    onMoveToSection={(taskId, targetSecId) => onMoveTask(taskId, targetSecId)}
                  />
                ))
              )}
            </div>

            {/* Quick Add Button at bottom */}
            <div className="p-2.5 border-t border-slate-200/40 dark:border-slate-800/40">
              <button
                onClick={() => onAddTask(section._id)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 transition"
              >
                <Plus size={14} weight="bold" />
                Add task
              </button>
            </div>
          </div>
        );
      })}

      {/* Add New Section / Column */}
      <div className="w-72 shrink-0">
        {isAddingSection ? (
          <form
            onSubmit={handleCreateSection}
            className="p-3.5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xl space-y-3"
          >
            <input
              type="text"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="e.g. In Review, QA"
              autoFocus
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:border-blue-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingSection(false);
                  setNewSectionName("");
                }}
                className="px-2.5 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-3 py-1 text-xs font-semibold text-white rounded-xl shadow-sm transition ${currentAccent.tailwind}`}
              >
                Add Column
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingSection(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-white/40 dark:bg-slate-900/30 hover:bg-white dark:hover:bg-slate-900/70 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition"
          >
            <Plus size={15} weight="bold" />
            Add Stage Column
          </button>
        )}
      </div>
    </div>
  );
}
