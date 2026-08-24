import React, { useState } from "react";
import { Plus, DotsThreeVertical, PencilSimple, Trash } from "@phosphor-icons/react";
import { useTheme } from "../context/ThemeContext";

export default function ProjectSidebar({
  projects = [],
  selectedProject,
  onSelectProject,
  onOpenCreateProject,
  onOpenEditProject,
  onDeleteProject,
  isOpen = true,
  onCloseMobile,
}) {
  const { currentAccent } = useTheme();
  const [activeMenuProjectId, setActiveMenuProjectId] = useState(null);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 dark:bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* New Project Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onOpenCreateProject();
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold shadow-sm transition ${currentAccent.tailwind}`}
          >
            <Plus size={15} weight="bold" />
            New Project
          </button>
        </div>

        {/* Project List Section */}
        <div className="flex-1 overflow-y-auto px-3 space-y-6 pb-6">
          <div>
            <div className="px-3 py-1 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Workspaces ({projects.length})
              </span>
            </div>

            <div className="mt-2 space-y-1">
              {projects.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-slate-400 dark:text-slate-500">No workspaces yet.</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-600 mt-0.5">
                    Click "New Project" to start.
                  </p>
                </div>
              ) : (
                projects.map((project) => {
                  const isSelected = selectedProject?._id === project._id;
                  const isMenuOpen = activeMenuProjectId === project._id;

                  return (
                    <div
                      key={project._id}
                      className={`group relative flex items-center justify-between rounded-2xl px-3 py-2 text-xs font-medium transition ${
                        isSelected
                          ? "bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white shadow-sm font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProject(project);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className="flex-1 flex items-center gap-2.5 min-w-0 text-left"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                          style={{
                            backgroundColor: project.color || "#3b82f6",
                          }}
                        />
                        <span className="truncate">{project.name}</span>
                      </button>

                      {/* Project Options Menu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuProjectId(isMenuOpen ? null : project._id);
                          }}
                          className={`p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition ${
                            isSelected || isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <DotsThreeVertical size={15} weight="bold" />
                        </button>

                        {isMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-30"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuProjectId(null);
                              }}
                            />
                            <div className="absolute right-0 top-full mt-1 z-40 w-36 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl animate-fade-in">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuProjectId(null);
                                  onOpenEditProject(project);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
                              >
                                <PencilSimple size={13} weight="bold" />
                                Edit Project
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuProjectId(null);
                                  onDeleteProject(project);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                              >
                                <Trash size={13} weight="bold" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
