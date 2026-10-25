"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store-context";
import { Task, Priority } from "@/types";
import {
  getLocalDateString,
  formatDisplayDate,
  filterTasks,
  TaskFilterType,
} from "@/lib/utils";
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  Check,
  Calendar,
} from "lucide-react";
import { TaskModal } from "@/components/tasks/TaskModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";

type SortOption = "date-asc" | "date-desc" | "priority-high" | "title";

export default function TasksPage() {
  const { tasks, toggleTask, deleteTask, categories } = useStore();
  const todayStr = getLocalDateString();

  const [activeFilter, setActiveFilter] = useState<TaskFilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Filter tasks
  const filtered = useMemo(() => {
    let list = filterTasks(tasks, activeFilter, todayStr);

    if (categoryFilter !== "all") {
      list = list.filter((t) => t.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort
    return list.sort((a, b) => {
      if (sortBy === "date-asc") {
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === "date-desc") {
        return b.dueDate.localeCompare(a.dueDate);
      }
      if (sortBy === "priority-high") {
        const priorityWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [tasks, activeFilter, categoryFilter, searchQuery, sortBy, todayStr]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-semibold text-aurelle-action-blue">
              Intentional Execution
            </span>
            <span className="text-xs text-aurelle-text-muted">•</span>
            <span className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
              {tasks.filter((t) => !t.completed).length} incomplete tasks
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
            Tasks & Priorities
          </h1>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-aurelle-action-blue hover:bg-aurelle-action-hover rounded-lg shadow-action-glow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Views Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-xl shadow-soft">
        {/* Status view tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "today", "upcoming", "overdue", "completed"] as TaskFilterType[]).map(
            (filter) => {
              const count = filterTasks(tasks, filter, todayStr).length;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors flex items-center gap-1.5 ${
                    activeFilter === filter
                      ? "bg-aurelle-action-blue text-white shadow-sm"
                      : "text-aurelle-text-muted hover:text-aurelle-navy-text dark:hover:text-aurelle-dark-text hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-surface"
                  }`}
                >
                  <span>{filter}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeFilter === filter
                        ? "bg-white/20 text-white"
                        : "bg-aurelle-bg dark:bg-aurelle-dark-surface text-aurelle-text-muted"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-aurelle-text-muted absolute left-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="text-xs pl-8 pr-3 py-1.5 bg-aurelle-bg dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text placeholder:text-aurelle-text-muted focus:outline-none focus:ring-1 focus:ring-aurelle-action-blue w-36 sm:w-44"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-aurelle-bg dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg px-2.5 py-1.5 text-aurelle-navy-text dark:text-aurelle-dark-text focus:outline-none focus:ring-1 focus:ring-aurelle-action-blue"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-aurelle-bg dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg px-2 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-aurelle-text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs bg-transparent text-aurelle-navy-text dark:text-aurelle-dark-text focus:outline-none"
            >
              <option value="date-asc">Due: Soonest</option>
              <option value="date-desc">Due: Latest</option>
              <option value="priority-high">Priority: High</option>
              <option value="title">Title: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={
            activeFilter === "overdue"
              ? "No overdue tasks"
              : activeFilter === "completed"
              ? "No completed tasks yet"
              : "No tasks found"
          }
          description={
            activeFilter === "overdue"
              ? "All your deliverables are on schedule or completed. Excellent execution."
              : "Break complex projects down into crisp, manageable actions."
          }
          actionLabel={activeFilter !== "overdue" && activeFilter !== "completed" ? "Add First Task" : undefined}
          onAction={handleCreate}
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((task) => {
            const isOverdue = !task.completed && task.dueDate < todayStr;
            const isDueToday = task.dueDate === todayStr;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                  task.completed
                    ? "bg-aurelle-bg/50 dark:bg-aurelle-dark-surface/40 border-aurelle-border/60"
                    : isOverdue
                    ? "bg-white dark:bg-aurelle-dark-card border-aurelle-error/40 hover:border-aurelle-error"
                    : "bg-white dark:bg-aurelle-dark-card border-aurelle-border dark:border-aurelle-dark-border hover:border-aurelle-action-blue/50 shadow-soft"
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 mt-0.5 rounded text-aurelle-action-blue focus:ring-aurelle-action-blue border-aurelle-border dark:border-aurelle-dark-border cursor-pointer accent-aurelle-action-blue shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-medium ${
                          task.completed
                            ? "line-through text-aurelle-text-muted"
                            : "text-aurelle-navy-text dark:text-aurelle-dark-text"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted line-clamp-1 mb-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
                      <span className="px-1.5 py-0.5 bg-aurelle-bg dark:bg-aurelle-dark-surface rounded text-[10px]">
                        {task.category}
                      </span>

                      {/* Accessible priority indicator with icon + label */}
                      <span
                        className={`inline-flex items-center gap-1 font-medium capitalize text-[10px] ${
                          task.priority === "high"
                            ? "text-aurelle-error font-semibold"
                            : task.priority === "medium"
                            ? "text-aurelle-warning font-medium"
                            : "text-aurelle-text-muted"
                        }`}
                      >
                        {task.priority === "high" && <AlertCircle className="w-3 h-3" />}
                        {task.priority} priority
                      </span>

                      {/* Due date tag */}
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded ${
                          isOverdue
                            ? "bg-aurelle-error/10 text-aurelle-error font-semibold"
                            : isDueToday
                            ? "bg-aurelle-warning/10 text-aurelle-warning font-semibold"
                            : "bg-aurelle-bg dark:bg-aurelle-dark-surface text-aurelle-text-muted"
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        {isOverdue
                          ? `Overdue (${formatDisplayDate(task.dueDate)})`
                          : isDueToday
                          ? "Today"
                          : formatDisplayDate(task.dueDate)}
                      </span>

                      {task.dueTime && (
                        <span className="flex items-center gap-1 text-[10px]">
                          <Clock className="w-3 h-3" />
                          {task.dueTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action icons */}
                <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(task)}
                    className="p-1.5 text-aurelle-text-muted hover:text-aurelle-action-blue rounded-lg transition-colors"
                    title="Edit task"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaskToDelete(task)}
                    className="p-1.5 text-aurelle-text-muted hover:text-aurelle-error rounded-lg transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        title="Delete Task"
        message={`Are you sure you want to remove "${taskToDelete?.title}"?`}
        confirmLabel="Delete Task"
      />
    </div>
  );
}
