"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store-context";
import { Habit } from "@/types";
import {
  calculateHabitStreaks,
  getLocalDateString,
  isHabitScheduledForDate,
} from "@/lib/utils";
import {
  Flame,
  Plus,
  Check,
  Award,
  Archive,
  Filter,
  MoreVertical,
  Minus,
  Sparkles,
} from "lucide-react";
import { HabitModal } from "@/components/habits/HabitModal";
import { HabitDetailModal } from "@/components/habits/HabitDetailModal";
import { EmptyState } from "@/components/common/EmptyState";

type FilterStatus = "active" | "all" | "archived";

export default function HabitsPage() {
  const {
    habits,
    completions,
    categories,
    toggleHabitCompletion,
    setHabitProgress,
  } = useStore();

  const todayStr = getLocalDateString();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [inspectingHabit, setInspectingHabit] = useState<Habit | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("active");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredHabits = useMemo(() => {
    return habits.filter((h) => {
      // Status filter
      if (statusFilter === "active" && h.archived) return false;
      if (statusFilter === "archived" && !h.archived) return false;

      // Category filter
      if (categoryFilter !== "all" && h.category !== categoryFilter) return false;

      return true;
    });
  }, [habits, statusFilter, categoryFilter]);

  const handleOpenEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingHabit(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-semibold text-aurelle-action-blue">
              Daily Practice
            </span>
            <span className="text-xs text-aurelle-text-muted">•</span>
            <span className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
              {habits.filter((h) => !h.archived).length} active rituals
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
            Habits & Rituals
          </h1>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-aurelle-action-blue hover:bg-aurelle-action-hover rounded-lg shadow-action-glow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Ritual</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-xl shadow-soft">
        <div className="flex items-center gap-1.5">
          {(["active", "all", "archived"] as FilterStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                statusFilter === status
                  ? "bg-aurelle-action-blue text-white shadow-sm"
                  : "text-aurelle-text-muted hover:text-aurelle-navy-text dark:hover:text-aurelle-dark-text hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-surface"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-aurelle-text-muted" />
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
        </div>
      </div>

      {/* Habit List */}
      {filteredHabits.length === 0 ? (
        <EmptyState
          icon={Flame}
          title={
            statusFilter === "archived"
              ? "No archived habits"
              : "No rituals configured"
          }
          description={
            statusFilter === "archived"
              ? "Archived habits will appear here when you retire them from your daily cadence."
              : "Establish calm, repeatable intentions. Daily micro-actions shape your best self."
          }
          actionLabel={statusFilter !== "archived" ? "Create First Ritual" : undefined}
          onAction={statusFilter !== "archived" ? handleCreateNew : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHabits.map((habit) => {
            const streak = calculateHabitStreaks(habit, completions, todayStr);
            const isScheduledToday = isHabitScheduledForDate(habit, todayStr);
            const todayComp = completions.find(
              (c) => c.habitId === habit.id && c.date === todayStr
            );
            const isCompletedToday = todayComp?.completed || false;
            const currentVal = todayComp?.currentValue || 0;
            const targetVal = habit.targetValue || 1;

            return (
              <div
                key={habit.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all group ${
                  habit.archived
                    ? "opacity-60 bg-white/40 dark:bg-aurelle-dark-card/40 border-aurelle-border"
                    : "bg-white dark:bg-aurelle-dark-card border-aurelle-border dark:border-aurelle-dark-border hover:shadow-card hover:border-aurelle-action-blue/40"
                }`}
              >
                <div>
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-aurelle-bg dark:bg-aurelle-dark-surface border border-aurelle-border/60 text-aurelle-navy-text dark:text-aurelle-dark-text">
                      {habit.category}
                    </span>

                    <button
                      type="button"
                      onClick={() => setInspectingHabit(habit)}
                      className="text-aurelle-text-muted hover:text-aurelle-navy-text dark:hover:text-aurelle-dark-text p-1 rounded-md transition-colors"
                      title="Inspect habit history and options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Habit Title & Description */}
                  <h3
                    onClick={() => setInspectingHabit(habit)}
                    className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text cursor-pointer hover:text-aurelle-action-blue transition-colors line-clamp-1 mb-1"
                  >
                    {habit.name}
                  </h3>

                  {habit.description && (
                    <p className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted line-clamp-2 mb-4 leading-relaxed">
                      {habit.description}
                    </p>
                  )}
                </div>

                {/* Bottom stats and action bar */}
                <div className="pt-4 border-t border-aurelle-border/60 dark:border-aurelle-dark-border/60 space-y-3">
                  {/* Streaks row */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-aurelle-warning">
                      <Flame className="w-4 h-4" />
                      <span className="font-semibold">{streak.currentStreak}d</span>
                      <span className="text-[10px] text-aurelle-text-muted">streak</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-aurelle-text-muted">
                      <Award className="w-3.5 h-3.5 text-aurelle-action-blue" />
                      <span>Best: {streak.longestStreak}d</span>
                    </div>
                  </div>

                  {/* Today completion control */}
                  {isScheduledToday && !habit.archived ? (
                    <div className="flex items-center justify-between gap-2 p-2 bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface rounded-lg">
                      <button
                        type="button"
                        onClick={() => toggleHabitCompletion(habit.id, todayStr)}
                        className={`flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                          isCompletedToday
                            ? "bg-aurelle-success text-white shadow-sm"
                            : "bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border text-aurelle-navy-text dark:text-aurelle-dark-text hover:border-aurelle-action-blue"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>{isCompletedToday ? "Completed Today" : "Mark Today"}</span>
                      </button>

                      {habit.targetType === "measurable" && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setHabitProgress(
                                habit.id,
                                Math.max(0, currentVal - 1),
                                todayStr
                              )
                            }
                            className="p-1 text-aurelle-text-muted hover:text-aurelle-navy-text"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-1 text-aurelle-navy-text dark:text-aurelle-dark-text">
                            {currentVal}/{targetVal} {habit.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setHabitProgress(habit.id, currentVal + 1, todayStr)
                            }
                            className="p-1 text-aurelle-text-muted hover:text-aurelle-navy-text"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : habit.archived ? (
                    <div className="text-[11px] text-aurelle-text-muted italic py-1 text-center">
                      Habit archived.
                    </div>
                  ) : (
                    <div className="text-[11px] text-aurelle-text-muted italic py-1 text-center">
                      Not scheduled for today ({habit.schedule.type}).
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation / Edit Modal */}
      <HabitModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingHabit(null);
        }}
        habitToEdit={editingHabit}
      />

      {/* Detail / Inspection Modal */}
      <HabitDetailModal
        habit={inspectingHabit}
        isOpen={inspectingHabit !== null}
        onClose={() => setInspectingHabit(null)}
        onEdit={(habit) => handleOpenEdit(habit)}
      />
    </div>
  );
}
