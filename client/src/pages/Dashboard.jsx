import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";
import {
  getSections,
  createSection,
  updateSection,
  deleteSection,
} from "../services/sectionService";
import {
  getTasks,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
} from "../services/taskService";

import ProjectSidebar from "../components/ProjectSidebar";
import KanbanBoard from "../components/KanbanBoard";
import TaskListView from "../components/TaskListView";
import CreateProjectModal from "../components/CreateProjectModal";
import TaskModal from "../components/TaskModal";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import ThemeToggle from "../components/ThemeToggle";
import Logo from "../components/Logo";

import {
  SquaresFour,
  List,
  MagnifyingGlass,
  Plus,
  Funnel,
  List as MenuIcon,
  SignOut,
  FolderSimplePlus,
  CheckCircle,
  Clock,
} from "@phosphor-icons/react";

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Primary Data State
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [tasks, setTasks] = useState([]);

  // UI / Filter State
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" | "list"
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Loading & Feedback
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingProjectData, setLoadingProjectData] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetSectionId, setTargetSectionId] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  // 1. Initial Load: Fetch Projects
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        setLoadingProjects(true);
        const data = await getProjects();
        setProjects(data);
        if (data.length > 0) {
          setSelectedProject(data[0]);
        }
      } catch (error) {
        showToast(error.message || "Failed to load projects", "error");
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchUserProjects();
  }, []);

  // 2. Load Sections and Tasks when selectedProject changes
  useEffect(() => {
    if (!selectedProject?._id) {
      setSections([]);
      setTasks([]);
      return;
    }

    const loadProjectDetails = async () => {
      try {
        setLoadingProjectData(true);
        const [sectionsData, tasksData] = await Promise.all([
          getSections(selectedProject._id),
          getTasks(selectedProject._id),
        ]);
        setSections(sectionsData);
        setTasks(tasksData);
      } catch (error) {
        showToast(error.message || "Failed to load project details", "error");
      } finally {
        setLoadingProjectData(false);
      }
    };

    loadProjectDetails();
  }, [selectedProject?._id]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  // Project Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  // ================= Project Handlers =================
  const handleOpenCreateProject = () => {
    setEditingProject(null);
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj) => {
    setEditingProject(proj);
    setProjectModalOpen(true);
  };

  const handleProjectSubmit = async (formData) => {
    try {
      setActionLoading(true);
      if (editingProject) {
        const updated = await updateProject(editingProject._id, formData);
        setProjects((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
        if (selectedProject?._id === updated._id) {
          setSelectedProject(updated);
        }
        showToast("Project updated successfully", "success");
      } else {
        const created = await createProject(formData);
        const newProj = created.project;
        setProjects((prev) => [newProj, ...prev]);
        setSelectedProject(newProj);
        if (created.sections) {
          setSections(created.sections);
        }
        showToast("Project created successfully", "success");
      }
      setProjectModalOpen(false);
    } catch (error) {
      showToast(error.message || "Failed to save project", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = (proj) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete "${proj.name}"?`,
      message:
        "This will permanently delete this project, including all its workflow columns and tasks.",
      onConfirm: async () => {
        try {
          setActionLoading(true);
          await deleteProject(proj._id);
          const remaining = projects.filter((p) => p._id !== proj._id);
          setProjects(remaining);
          setSelectedProject(remaining.length > 0 ? remaining[0] : null);
          showToast("Project deleted", "success");
          setConfirmModal({ isOpen: false });
        } catch (error) {
          showToast(error.message || "Failed to delete project", "error");
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  // ================= Section Handlers =================
  const handleAddSection = async (name) => {
    if (!selectedProject?._id) return;
    try {
      const newSec = await createSection(selectedProject._id, name);
      setSections((prev) => [...prev, newSec]);
      showToast(`Column "${name}" created`, "success");
    } catch (error) {
      showToast(error.message || "Failed to add column", "error");
    }
  };

  const handleUpdateSection = async (sectionId, updateData) => {
    try {
      const updated = await updateSection(sectionId, updateData);
      setSections((prev) =>
        prev.map((s) => (s._id === updated._id ? updated : s))
      );
      showToast("Column updated", "success");
    } catch (error) {
      showToast(error.message || "Failed to update column", "error");
    }
  };

  const handleDeleteSection = (sectionId) => {
    const sec = sections.find((s) => s._id === sectionId);
    setConfirmModal({
      isOpen: true,
      title: `Delete column "${sec?.name || "Column"}"?`,
      message: "All tasks inside this column will be permanently deleted.",
      onConfirm: async () => {
        try {
          setActionLoading(true);
          await deleteSection(sectionId);
          setSections((prev) => prev.filter((s) => s._id !== sectionId));
          setTasks((prev) =>
            prev.filter((t) => (t.section?._id || t.section) !== sectionId)
          );
          showToast("Column and tasks deleted", "success");
          setConfirmModal({ isOpen: false });
        } catch (error) {
          showToast(error.message || "Failed to delete column", "error");
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  // ================= Task Handlers =================
  const handleOpenAddTask = (secId = null) => {
    setEditingTask(null);
    setTargetSectionId(secId || sections[0]?._id || null);
    setTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setTargetSectionId(task.section?._id || task.section);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = async (formData) => {
    if (!selectedProject?._id) return;
    try {
      setActionLoading(true);
      if (editingTask) {
        const updated = await updateTask(editingTask._id, formData);
        setTasks((prev) =>
          prev.map((t) => (t._id === updated._id ? updated : t))
        );
        showToast("Task updated", "success");
      } else {
        const created = await createTask(selectedProject._id, formData);
        setTasks((prev) => [...prev, created]);
        showToast("Task created", "success");
      }
      setTaskModalOpen(false);
    } catch (error) {
      showToast(error.message || "Failed to save task", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleCompleteTask = async (task) => {
    const nextCompleted = !task.completed;
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id ? { ...t, completed: nextCompleted } : t
      )
    );

    try {
      await updateTask(task._id, { completed: nextCompleted });
    } catch (error) {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, completed: !nextCompleted } : t
        )
      );
      showToast(error.message || "Failed to update task", "error");
    }
  };

  const handleMoveTask = async (taskId, destinationSectionId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, section: destinationSectionId } : t
      )
    );

    try {
      await moveTask(taskId, destinationSectionId);
    } catch (error) {
      showToast(error.message || "Failed to move task", "error");
      const reloadedTasks = await getTasks(selectedProject._id);
      setTasks(reloadedTasks);
    }
  };

  const handleDeleteTask = (taskId) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Task?",
      message: "Are you sure you want to delete this task?",
      onConfirm: async () => {
        try {
          setActionLoading(true);
          await deleteTask(taskId);
          setTasks((prev) => prev.filter((t) => t._id !== taskId));
          if (taskModalOpen) setTaskModalOpen(false);
          showToast("Task deleted", "success");
          setConfirmModal({ isOpen: false });
        } catch (error) {
          showToast(error.message || "Failed to delete task", "error");
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500/20">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 lg:hidden transition"
              title="Toggle sidebar"
            >
              <MenuIcon size={18} weight="bold" />
            </button>
            <Logo size={32} showText={true} textClassName="text-base font-bold hidden sm:inline" />
          </div>

          {/* Right Nav Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle (Dark / Light) */}
            <ThemeToggle />

            <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />

            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-white leading-none">
                {user?.name || "User"}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-none">
                {user?.email || ""}
              </p>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Log out"
            >
              <SignOut size={14} weight="bold" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Project Sidebar */}
        <ProjectSidebar
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={setSelectedProject}
          onOpenCreateProject={handleOpenCreateProject}
          onOpenEditProject={handleOpenEditProject}
          onDeleteProject={handleDeleteProject}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Content Workspace */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-8">
          {loadingProjects ? (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400 text-xs">
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
              Loading workspaces...
            </div>
          ) : projects.length === 0 ? (
            /* No Projects Empty State */
            <div className="max-w-md mx-auto my-20 text-center p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
                <FolderSimplePlus size={24} weight="bold" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">No Workspaces Yet</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                TaskChamber helps you organize work across custom workflows. Create your first project to get started.
              </p>
              <button
                onClick={handleOpenCreateProject}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
              >
                <Plus size={15} weight="bold" />
                Create First Workspace
              </button>
            </div>
          ) : (
            /* Active Project Workspace */
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Project Header Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{
                        backgroundColor: selectedProject?.color || "#6366f1",
                      }}
                    />
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {selectedProject?.name}
                    </h2>
                  </div>
                  {selectedProject?.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                      {selectedProject.description}
                    </p>
                  )}
                </div>

                {/* Primary Action & Stats Pill */}
                <div className="flex items-center gap-3">
                  {/* Stats Pill */}
                  <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-xs font-medium shadow-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                      Total: <strong className="text-slate-900 dark:text-white">{stats.total}</strong>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle size={14} weight="fill" /> {stats.completed}
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-bold">
                      <Clock size={14} weight="fill" /> {stats.pending}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenAddTask()}
                    className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-sm transition shadow-indigo-600/20"
                  >
                    <Plus size={15} weight="bold" />
                    Add Task
                  </button>
                </div>
              </div>

              {/* Controls Bar: Search, Priority Filter, View Mode */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-xs">
                    <MagnifyingGlass size={14} weight="bold" className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                    />
                  </div>

                  {/* Priority Filter */}
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 shadow-sm">
                    <Funnel size={13} weight="bold" className="text-slate-400 shrink-0" />
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        All Priorities
                      </option>
                      <option value="urgent" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Urgent
                      </option>
                      <option value="high" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        High
                      </option>
                      <option value="medium" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Medium
                      </option>
                      <option value="low" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                        Low
                      </option>
                    </select>
                  </div>
                </div>

                {/* View Switcher: Kanban vs List */}
                <div className="flex items-center bg-slate-200/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-0.5 rounded-2xl self-end sm:self-auto">
                  <button
                    onClick={() => setViewMode("kanban")}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-xl transition ${
                      viewMode === "kanban"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <SquaresFour size={14} weight="bold" />
                    Kanban
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-xl transition ${
                      viewMode === "list"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <List size={14} weight="bold" />
                    List
                  </button>
                </div>
              </div>

              {/* Main Task View Body */}
              {loadingProjectData ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
                  Loading workflow stages...
                </div>
              ) : viewMode === "kanban" ? (
                <KanbanBoard
                  sections={sections}
                  tasks={filteredTasks}
                  onAddTask={handleOpenAddTask}
                  onEditTask={handleOpenEditTask}
                  onDeleteTask={handleDeleteTask}
                  onToggleCompleteTask={handleToggleCompleteTask}
                  onMoveTask={handleMoveTask}
                  onAddSection={handleAddSection}
                  onUpdateSection={handleUpdateSection}
                  onDeleteSection={handleDeleteSection}
                />
              ) : (
                <TaskListView
                  tasks={filteredTasks}
                  sections={sections}
                  onAddTask={handleOpenAddTask}
                  onEditTask={handleOpenEditTask}
                  onDeleteTask={handleDeleteTask}
                  onToggleCompleteTask={handleToggleCompleteTask}
                  onMoveTask={handleMoveTask}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <CreateProjectModal
        isOpen={projectModalOpen}
        initialData={editingProject}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={handleProjectSubmit}
        loading={actionLoading}
      />

      <TaskModal
        isOpen={taskModalOpen}
        initialData={editingTask}
        sections={sections}
        defaultSectionId={targetSectionId}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleTaskSubmit}
        onDelete={handleDeleteTask}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ isOpen: false })}
        loading={actionLoading}
      />

      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
