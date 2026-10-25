"use client";

import React, { useMemo } from "react";
import { useStore } from "@/lib/store-context";
import { getLocalDateString, isHabitScheduledForDate } from "@/lib/utils";
import { Flame, CheckSquare, Sparkles, TrendingUp } from "lucide-react";

export function DailyProgressCards() {
  const { habits, completions, tasks } = useStore();
  const todayStr = getLocalDateString();

  const stats = useMemo(() => {
    // Habits scheduled for today
    const scheduledHabits = habits.filter(
      (h) => !h.archived && isHabitScheduledForDate(h, todayStr)
    );
    const totalScheduledHabits = scheduledHabits.length;

    const completedHabitsCount = scheduledHabits.filter((h) => {
      const comp = completions.find((c) => c.habitId === h.id && c.date === todayStr);
      return comp && comp.completed;
    }).length;

    const habitPercentage =
      totalScheduledHabits > 0
        ? Math.round((completedHabitsCount / totalScheduledHabits) * 100)
        : 0;

    // Tasks due today
    const tasksToday = tasks.filter((t) => t.dueDate === todayStr);
    const totalTasksToday = tasksToday.length;
    const completedTasksCount = tasksToday.filter((t) => t.completed).length;

    const taskPercentage =
      totalTasksToday > 0
        ? Math.round((completedTasksCount / totalTasksToday) * 100)
        : 0;

    // Overall day completion
    const totalItems = totalScheduledHabits + totalTasksToday;
    const totalDone = completedHabitsCount + completedTasksCount;
    const overallPercentage =
      totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;

    return {
      totalScheduledHabits,
      completedHabitsCount,
      habitPercentage,
      totalTasksToday,
      completedTasksCount,
      taskPercentage,
      totalItems,
      totalDone,
      overallPercentage,
    };
  }, [habits, completions, tasks, todayStr]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Overall Daily Progress Card */}
      <div className="p-5 rounded-xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
            Daily Alignment
          </span>
          <div className="w-8 h-8 rounded-lg bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border flex items-center justify-center text-aurelle-action-blue">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-serif font-semibold text-aurelle-navy-text dark:text-aurelle-dark-text">
              {stats.overallPercentage}%
            </span>
            <span className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
              {stats.totalDone} of {stats.totalItems} done
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-2 bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-aurelle-action-blue rounded-full transition-all duration-500"
              style={{ width: `${stats.overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Habit Completion Card */}
      <div className="p-5 rounded-xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
            Habit Consistency
          </span>
          <div className="w-8 h-8 rounded-lg bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border flex items-center justify-center text-aurelle-success">
            <Flame className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-serif font-semibold text-aurelle-navy-text dark:text-aurelle-dark-text">
              {stats.completedHabitsCount}/{stats.totalScheduledHabits}
            </span>
            <span className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
              habits ({stats.habitPercentage}%)
            </span>
          </div>

          <div className="w-full h-2 bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-aurelle-success rounded-full transition-all duration-500"
              style={{ width: `${stats.habitPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Completion Card */}
      <div className="p-5 rounded-xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-soft flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
            Today&apos;s Focus Tasks
          </span>
          <div className="w-8 h-8 rounded-lg bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border flex items-center justify-center text-aurelle-warning">
            <CheckSquare className="w-4 h-4" />
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-serif font-semibold text-aurelle-navy-text dark:text-aurelle-dark-text">
              {stats.completedTasksCount}/{stats.totalTasksToday}
            </span>
            <span className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
              tasks ({stats.taskPercentage}%)
            </span>
          </div>

          <div className="w-full h-2 bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-aurelle-warning rounded-full transition-all duration-500"
              style={{ width: `${stats.taskPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
