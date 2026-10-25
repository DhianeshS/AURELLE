"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/common/Modal";
import { useStore } from "@/lib/store-context";
import { Goal, Milestone } from "@/types";
import { generateId } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: Goal | null;
}

const COLOR_OPTIONS = [
  { label: "Vitality Green", value: "#5C9E82" },
  { label: "Action Blue", value: "#78B9E8" },
  { label: "Amber Glow", value: "#C68C4D" },
  { label: "Deep Navy", value: "#1F3045" },
];

export function GoalModal({ isOpen, onClose, goalToEdit }: GoalModalProps) {
  const { addGoal, updateGoal, categories } = useStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Deep Work");
  const [targetDate, setTargetDate] = useState("");
  const [color, setColor] = useState("#5C9E82");
  const [milestones, setMilestones] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newMilestoneInput, setNewMilestoneInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setDescription(goalToEdit.description || "");
      setCategory(goalToEdit.category);
      setTargetDate(goalToEdit.targetDate || "");
      setColor(goalToEdit.color || "#5C9E82");
      setMilestones(goalToEdit.milestones.map((m) => ({ id: m.id, title: m.title, completed: m.completed })));
    } else {
      setTitle("");
      setDescription("");
      setCategory(categories[0]?.name || "Deep Work");
      setTargetDate("");
      setColor("#5C9E82");
      setMilestones([]);
    }
    setNewMilestoneInput("");
    setError(null);
  }, [goalToEdit, categories, isOpen]);

  const handleAddMilestone = () => {
    if (!newMilestoneInput.trim()) return;
    setMilestones([
      ...milestones,
      { id: generateId("m"), title: newMilestoneInput.trim(), completed: false },
    ]);
    setNewMilestoneInput("");
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a goal title.");
      return;
    }

    const formattedMilestones: Milestone[] = milestones.map((m) => ({
      id: m.id,
      goalId: goalToEdit ? goalToEdit.id : "",
      title: m.title,
      completed: m.completed,
    }));

    if (goalToEdit) {
      updateGoal(goalToEdit.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        targetDate: targetDate.trim() || undefined,
        color,
        milestones: formattedMilestones.map((m) => ({ ...m, goalId: goalToEdit.id })),
      });
    } else {
      addGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        targetDate: targetDate.trim() || undefined,
        color,
        milestones: formattedMilestones,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goalToEdit ? "Edit Strategic Goal" : "New Aspiration"}
      description="Ground your highest ambitions into tangible milestones."
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
            Goal Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Establish Uncompromised Daily Well-being"
            className="w-full px-3.5 py-2.5 text-sm bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text placeholder:text-aurelle-text-muted focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
            Purpose & Vision
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what success embodies and why this matters..."
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
              Target Deadline (Optional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
            />
          </div>
        </div>

        {/* Milestones list builder */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
            Milestones (Key Checkpoints)
          </label>
          <div className="space-y-2 mb-2">
            {milestones.map((m, idx) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-2 p-2.5 bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface rounded-lg border border-aurelle-border dark:border-aurelle-dark-border text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-5 h-5 rounded-full bg-white dark:bg-aurelle-dark-card border border-aurelle-border flex items-center justify-center font-semibold text-[10px] text-aurelle-text-muted">
                    {idx + 1}
                  </span>
                  <span className="truncate text-aurelle-navy-text dark:text-aurelle-dark-text font-medium">
                    {m.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMilestone(m.id)}
                  className="text-aurelle-text-muted hover:text-aurelle-error transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newMilestoneInput}
              onChange={(e) => setNewMilestoneInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddMilestone();
                }
              }}
              placeholder="e.g. Complete phase 1 discovery..."
              className="flex-1 px-3 py-2 text-xs bg-white dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text placeholder:text-aurelle-text-muted focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
            />
            <button
              type="button"
              onClick={handleAddMilestone}
              className="px-3 py-2 bg-aurelle-bg-secondary dark:bg-aurelle-dark-card hover:bg-aurelle-border/60 text-aurelle-navy-text dark:text-aurelle-dark-text text-xs font-medium rounded-lg border border-aurelle-border dark:border-aurelle-dark-border flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Color Accent */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
            Accent Palette
          </label>
          <div className="flex items-center gap-3">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-7 h-7 rounded-lg transition-transform ${
                  color === c.value ? "ring-2 ring-offset-2 ring-aurelle-action-blue scale-110" : "opacity-80 hover:opacity-100"
                }`}
                title={c.label}
              />
            ))}
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
            {goalToEdit ? "Save Goal" : "Create Goal"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
