"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store-context";
import { calculateGoalProgress, formatDisplayDate } from "@/lib/utils";
import { Target, ArrowRight, Plus, Calendar } from "lucide-react";
import Link from "next/link";
import { GoalModal } from "@/components/goals/GoalModal";

export function GoalsOverview() {
  const { goals } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  const activeGoals = goals.filter((g) => g.status === "active");

  return (
    <div className="bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-xl p-5 shadow-soft">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-aurelle-warning" />
          <h2 className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
            Active Aspirations
          </h2>
        </div>
        <Link
          href="/goals"
          className="text-xs text-aurelle-text-muted hover:text-aurelle-action-blue flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {activeGoals.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted mb-3">
            No active goals. Define what matters most.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-aurelle-action-blue bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg hover:border-aurelle-action-blue transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Goal</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {activeGoals.slice(0, 4).map((goal) => {
            const progress = calculateGoalProgress(goal);
            const completedCount = goal.milestones.filter((m) => m.completed).length;

            return (
              <div
                key={goal.id}
                className="p-3.5 rounded-xl border border-aurelle-border dark:border-aurelle-dark-border bg-white dark:bg-aurelle-dark-surface flex flex-col justify-between hover:border-aurelle-action-blue/50 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-aurelle-bg dark:bg-aurelle-dark-card text-aurelle-navy-text dark:text-aurelle-dark-text">
                      {goal.category}
                    </span>
                    <span className="text-xs font-serif font-semibold text-aurelle-navy-text dark:text-aurelle-dark-text">
                      {progress}%
                    </span>
                  </div>

                  <h3 className="text-sm font-medium text-aurelle-navy-text dark:text-aurelle-dark-text line-clamp-1 mb-2">
                    {goal.title}
                  </h3>
                </div>

                <div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-aurelle-bg-secondary dark:bg-aurelle-dark-card rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-aurelle-action-blue rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
                    <span>
                      {completedCount} of {goal.milestones.length} milestones
                    </span>

                    {goal.targetDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDisplayDate(goal.targetDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GoalModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
