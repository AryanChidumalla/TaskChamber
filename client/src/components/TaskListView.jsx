import React from "react";
import { CheckCircle, Circle, CalendarBlank, PencilSimple, Trash, Plus } from "@phosphor-icons/react";

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
  medium: { label: "Medium", color: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
  high: { label: "High", color: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
  urgent: { label: "Urgent", color: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" },
};

export default function TaskListView({
  tasks = [],
  sections = [],
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleCompleteTask,
  onMoveTask,
}) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/30 p-12 text-center my-6">
        <p className="text-slate-700 dark:text-slate-400 font-semibold text-sm">No tasks found</p>
        <p className="mt-1 text-xs text-slate-500">
          Create tasks or adjust your filters to see them listed here.
        </p>
        <button
          onClick={() => onAddTask()}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus size={14} weight="bold" />
          Create Task
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 backdrop-blur-sm shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">Status</th>
              <th className="py-3.5 px-4 min-w-[240px]">Task Title</th>
              <th className="py-3.5 px-4 w-40">Workflow Stage</th>
              <th className="py-3.5 px-4 w-32">Priority</th>
              <th className="py-3.5 px-4 w-36">Due Date</th>
              <th className="py-3.5 px-4 w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {tasks.map((task) => {
              const priorityStyle = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
              const isOverdue =
                task.dueDate &&
                !task.completed &&
                new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
              const formattedDate = task.dueDate
                ? new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—";

              return (
                <tr
                  key={task._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition group"
                >
                  {/* Status Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleCompleteTask(task)}
                      className="text-slate-400 hover:text-emerald-500 transition"
                    >
                      {task.completed ? (
                        <CheckCircle size={18} weight="fill" className="text-emerald-500 mx-auto" />
                      ) : (
                        <Circle size={18} weight="bold" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mx-auto" />
                      )}
                    </button>
                  </td>

                  {/* Title & Description */}
                  <td className="py-3.5 px-4">
                    <div
                      onClick={() => onEditTask(task)}
                      className="cursor-pointer"
                    >
                      <span
                        className={`font-semibold ${
                          task.completed
                            ? "line-through text-slate-400 dark:text-slate-500"
                            : "text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md mt-0.5">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Workflow Stage */}
                  <td className="py-3.5 px-4">
                    <select
                      value={task.section?._id || task.section}
                      onChange={(e) => onMoveTask(task._id, e.target.value)}
                      className="text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2.5 py-1 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                    >
                      {sections.map((sec) => (
                        <option key={sec._id} value={sec._id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                          {sec.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${priorityStyle.color}`}
                    >
                      {priorityStyle.label}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-3.5 px-4 text-xs">
                    <div
                      className={`flex items-center gap-1.5 font-medium ${
                        isOverdue
                          ? "text-rose-600 dark:text-rose-400 font-bold"
                          : task.completed
                          ? "text-slate-400 dark:text-slate-500"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <CalendarBlank size={14} weight="bold" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                        title="Edit Task"
                      >
                        <PencilSimple size={14} weight="bold" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                        title="Delete Task"
                      >
                        <Trash size={14} weight="bold" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
