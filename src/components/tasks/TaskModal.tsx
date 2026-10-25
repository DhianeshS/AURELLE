"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/common/Modal";
import { useStore } from "@/lib/store-context";
import { Task, Priority } from "@/types";
import { getLocalDateString } from "@/lib/utils";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultDate?: string;
}

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "text-aurelle-text-muted" },
  { value: "medium", label: "Medium", color: "text-aurelle-warning" },
  { value: "high", label: "High", color: "text-aurelle-error" },
];

export function TaskModal({ isOpen, onClose, taskToEdit, defaultDate }: TaskModalProps) {
  const { addTask, updateTask, categories } = useStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState("Deep Work");
  const [dueDate, setDueDate] = useState(defaultDate || getLocalDateString());
  const [dueTime, setDueTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setDueDate(taskToEdit.dueDate);
      setDueTime(taskToEdit.dueTime || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory(categories[0]?.name || "Deep Work");
      setDueDate(defaultDate || getLocalDateString());
      setDueTime("");
    }
    setError(null);
  }, [taskToEdit, defaultDate, categories, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a task title.");
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
        dueDate,
        dueTime: dueTime.trim() || undefined,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
        dueDate,
        dueTime: dueTime.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? "Edit Task" : "New Task"}
      description="Focus on a single, clear accomplishment."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-aurelle-error bg-aurelle-error/10 border border-aurelle-error/20 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Synthesise quarterly architecture priorities"
            className="w-full px-3.5 py-2.5 text-sm bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text placeholder:text-aurelle-text-muted focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
            Notes / Details
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add context, references, or sub-points..."
            className="w-full px-3.5 py-2 text-sm bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text placeholder:text-aurelle-text-muted focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`py-2 px-2 text-xs font-medium rounded-lg border capitalize transition-all ${
                    priority === p.value
                      ? "bg-white dark:bg-aurelle-dark-card border-aurelle-action-blue shadow-sm ring-1 ring-aurelle-action-blue font-semibold text-aurelle-navy-text dark:text-aurelle-dark-text"
                      : "bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border-aurelle-border dark:border-aurelle-dark-border text-aurelle-text-muted hover:text-aurelle-navy-text"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
              Due Time (Optional)
            </label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-aurelle-border/60 dark:border-aurelle-dark-border/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-medium text-aurelle-navy-text dark:text-aurelle-dark-text hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-surface rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-medium text-white bg-aurelle-action-blue hover:bg-aurelle-action-hover rounded-lg shadow-action-glow transition-all"
          >
            {taskToEdit ? "Save Task" : "Add Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
