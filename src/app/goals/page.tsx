"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store-context";
import { Goal, Milestone, GoalStatus } from "@/types";
import {
  calculateGoalProgress,
  formatDisplayDate,
  getLocalDateString,
} from "@/lib/utils";
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  MoreVertical,
  Edit3,
  Trash2,
  Archive,
  RotateCcw,
  PlusCircle,
} from "lucide-react";
import { GoalModal } from "@/components/goals/GoalModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";

export default function GoalsPage() {
  const {
    goals,
    toggleMilestone,
    addMilestone,
    deleteMilestone,
    archiveGoal,
    restoreGoal,
    deleteGoal,
  } = useStore();

  const todayStr = getLocalDateString();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [statusFilter, setStatusFilter] = useState<GoalStatus | "all">("active");
  const [newMilestoneText, setNewMilestoneText] = useState<Record<string, string>>({});

  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      if (statusFilter === "all") return true;
      return g.status === statusFilter;
    });
  }, [goals, statusFilter]);

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingGoal(null);
    setModalOpen(true);
  };

  const handleAddInlineMilestone = (goalId: string) => {
    const text = newMilestoneText[goalId]?.trim();
    if (!text) return;
    addMilestone(goalId, text);
    setNewMilestoneText({ ...newMilestoneText, [goalId]: "" });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-semibold text-aurelle-action-blue">
              Strategic Vision
            </span>
            <span className="text-xs text-aurelle-text-muted">•</span>
            <span className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
              {goals.filter((g) => g.status === "active").length} active aspirations
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
            Goals & Milestones
          </h1>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-aurelle-action-blue hover:bg-aurelle-action-hover rounded-lg shadow-action-glow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-xl shadow-soft w-fit">
        {(["active", "completed", "archived", "all"] as (GoalStatus | "all")[]).map(
          (status) => {
            const count =
              status === "all"
                ? goals.length
                : goals.filter((g) => g.status === status).length;

            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors flex items-center gap-1.5 ${
                  statusFilter === status
                    ? "bg-aurelle-action-blue text-white shadow-sm"
                    : "text-aurelle-text-muted hover:text-aurelle-navy-text dark:hover:text-aurelle-dark-text hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-surface"
                }`}
              >
                <span>{status}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === status
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

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title={
            statusFilter === "archived"
              ? "No archived goals"
              : statusFilter === "completed"
              ? "No completed goals yet"
              : "No active goals"
          }
          description="Give your daily efforts a horizon. Set an aspirational goal and define concrete milestone steps."
          actionLabel={statusFilter !== "archived" && statusFilter !== "completed" ? "Define First Goal" : undefined}
          onAction={handleCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const progress = calculateGoalProgress(goal);
            const isOverdue =
              goal.status === "active" && goal.targetDate && goal.targetDate < todayStr;
            const completedMilestones = goal.milestones.filter((m) => m.completed).length;

            return (
              <div
                key={goal.id}
                className="p-6 rounded-2xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-soft flex flex-col justify-between hover:shadow-card transition-all"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-aurelle-bg dark:bg-aurelle-dark-surface text-aurelle-navy-text dark:text-aurelle-dark-text border border-aurelle-border/60">
                      {goal.category}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(goal)}
                        className="p-1.5 text-aurelle-text-muted hover:text-aurelle-action-blue rounded-lg transition-colors"
                        title="Edit goal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {goal.status === "archived" ? (
                        <button
                          type="button"
                          onClick={() => restoreGoal(goal.id)}
                          className="p-1.5 text-aurelle-text-muted hover:text-aurelle-navy-text rounded-lg transition-colors"
                          title="Restore goal"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => archiveGoal(goal.id)}
                          className="p-1.5 text-aurelle-text-muted hover:text-aurelle-navy-text rounded-lg transition-colors"
                          title="Archive goal"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setGoalToDelete(goal)}
                        className="p-1.5 text-aurelle-text-muted hover:text-aurelle-error rounded-lg transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text mb-1">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted mb-4 leading-relaxed">
                      {goal.description}
                    </p>
                  )}

                  {/* Progress bar and statistics */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-aurelle-navy-text dark:text-aurelle-dark-text">
                        {progress}% Completed
                      </span>
                      <span className="text-[11px] text-aurelle-text-muted">
                        {completedMilestones} of {goal.milestones.length} milestones
                      </span>
                    </div>

                    <div className="w-full h-2 bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-aurelle-action-blue rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  <div className="space-y-2 mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-aurelle-text-muted mb-1">
                      Milestones
                    </div>

                    {goal.milestones.length === 0 ? (
                      <p className="text-xs text-aurelle-text-muted italic py-1">
                        No milestones added yet.
                      </p>
                    ) : (
                      goal.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-aurelle-bg-secondary/60 dark:bg-aurelle-dark-surface/60 border border-aurelle-border/60 dark:border-aurelle-dark-border/60 text-xs group"
                        >
                          <button
                            type="button"
                            onClick={() => toggleMilestone(goal.id, milestone.id)}
                            className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                          >
                            {milestone.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-aurelle-success shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-aurelle-text-muted shrink-0" />
                            )}
                            <span
                              className={`truncate font-medium ${
                                milestone.completed
                                  ? "line-through text-aurelle-text-muted"
                                  : "text-aurelle-navy-text dark:text-aurelle-dark-text"
                              }`}
                            >
                              {milestone.title}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteMilestone(goal.id, milestone.id)}
                            className="opacity-0 group-hover:opacity-100 text-aurelle-text-muted hover:text-aurelle-error p-1 transition-opacity"
                            title="Remove milestone"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Quick inline milestone adder */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMilestoneText[goal.id] || ""}
                      onChange={(e) =>
                        setNewMilestoneText({
                          ...newMilestoneText,
                          [goal.id]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddInlineMilestone(goal.id);
                        }
                      }}
                      placeholder="Add key milestone..."
                      className="flex-1 px-3 py-1.5 text-xs bg-aurelle-bg dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text placeholder:text-aurelle-text-muted focus:outline-none focus:ring-1 focus:ring-aurelle-action-blue"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddInlineMilestone(goal.id)}
                      className="px-2.5 py-1.5 text-xs font-medium bg-aurelle-bg-secondary dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border text-aurelle-navy-text dark:text-aurelle-dark-text rounded-lg hover:border-aurelle-action-blue transition-colors flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Footer target date */}
                <div className="pt-4 mt-4 border-t border-aurelle-border/60 dark:border-aurelle-dark-border/60 flex items-center justify-between text-[11px] text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {goal.targetDate ? (
                      <span className={isOverdue ? "text-aurelle-error font-semibold" : ""}>
                        {isOverdue ? "Target Overdue: " : "Target: "}
                        {formatDisplayDate(goal.targetDate)}
                      </span>
                    ) : (
                      <span>Open-ended horizon</span>
                    )}
                  </div>

                  <span className="capitalize">{goal.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Modal */}
      <GoalModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingGoal(null);
        }}
        goalToEdit={editingGoal}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={goalToDelete !== null}
        onClose={() => setGoalToDelete(null)}
        onConfirm={() => {
          if (goalToDelete) {
            deleteGoal(goalToDelete.id);
            setGoalToDelete(null);
          }
        }}
        title="Delete Strategic Goal"
        message={`Are you sure you want to permanently delete "${goalToDelete?.title}" and its milestones?`}
        confirmLabel="Delete Goal"
      />
    </div>
  );
}
