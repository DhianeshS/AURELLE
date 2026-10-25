"use client";

import React, { useState } from "react";
import { Modal } from "./Modal";
import { useStore } from "@/lib/store-context";
import { CheckSquare, Flame, Target } from "lucide-react";
import { HabitModal } from "@/components/habits/HabitModal";
import { TaskModal } from "@/components/tasks/TaskModal";
import { GoalModal } from "@/components/goals/GoalModal";

export function QuickAddModal() {
  const { quickAddOpen, setQuickAddOpen } = useStore();
  const [activeForm, setActiveForm] = useState<"task" | "habit" | "goal" | null>(null);

  const handleSelect = (type: "task" | "habit" | "goal") => {
    setActiveForm(type);
    setQuickAddOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        title="Create New"
        description="Select what you would like to bring into focus."
        maxWidth="sm"
      >
        <div className="grid grid-cols-1 gap-3 py-1">
          <button
            type="button"
            onClick={() => handleSelect("task")}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-aurelle-border dark:border-aurelle-dark-border bg-white dark:bg-aurelle-dark-surface hover:border-aurelle-action-blue hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-card transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-aurelle-bg-secondary dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border flex items-center justify-center text-aurelle-action-blue group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-aurelle-navy-text dark:text-aurelle-dark-text group-hover:text-aurelle-action-blue transition-colors">
                New Daily Task
              </div>
              <div className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
                Capture an actionable item with priority and due date
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelect("habit")}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-aurelle-border dark:border-aurelle-dark-border bg-white dark:bg-aurelle-dark-surface hover:border-aurelle-action-blue hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-card transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-aurelle-bg-secondary dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border flex items-center justify-center text-aurelle-success group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-aurelle-navy-text dark:text-aurelle-dark-text group-hover:text-aurelle-action-blue transition-colors">
                New Daily Ritual / Habit
              </div>
              <div className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
                Establish a recurring habit or measurable target
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelect("goal")}
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-aurelle-border dark:border-aurelle-dark-border bg-white dark:bg-aurelle-dark-surface hover:border-aurelle-action-blue hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-card transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-aurelle-bg-secondary dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border flex items-center justify-center text-aurelle-warning group-hover:scale-105 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-aurelle-navy-text dark:text-aurelle-dark-text group-hover:text-aurelle-action-blue transition-colors">
                New Strategic Goal
              </div>
              <div className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
                Define an overarching aspiration with milestone steps
              </div>
            </div>
          </button>
        </div>
      </Modal>

      {/* Child modals triggered by quick add */}
      <TaskModal isOpen={activeForm === "task"} onClose={() => setActiveForm(null)} />
      <HabitModal isOpen={activeForm === "habit"} onClose={() => setActiveForm(null)} />
      <GoalModal isOpen={activeForm === "goal"} onClose={() => setActiveForm(null)} />
    </>
  );
}
