"use client";

import React, { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { useStore } from "@/lib/store-context";
import { Habit } from "@/types";
import { calculateHabitStreaks, getLocalDateString, isHabitScheduledForDate, formatDisplayDate } from "@/lib/utils";
import { subDays, eachDayOfInterval, format } from "date-fns";
import { Flame, Calendar, Award, Check, X, Archive, RotateCcw, Trash2, Edit3 } from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

interface HabitDetailModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (habit: Habit) => void;
}

export function HabitDetailModal({ habit, isOpen, onClose, onEdit }: HabitDetailModalProps) {
  const { completions, archiveHabit, restoreHabit, deleteHabit, toggleHabitCompletion } = useStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!habit) return null;

  const todayStr = getLocalDateString();
  const streaks = calculateHabitStreaks(habit, completions, todayStr);

  // Past 28 days for history mini-matrix
  const today = new Date();
  const past28Days = eachDayOfInterval({
    start: subDays(today, 27),
    end: today,
  });

  const completedMap = new Set(
    completions.filter((c) => c.habitId === habit.id && c.completed).map((c) => c.date)
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={habit.name}
        description={habit.description || "Consistent daily ritual."}
        maxWidth="md"
      >
        <div className="space-y-6">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border text-aurelle-navy-text dark:text-aurelle-dark-text">
              {habit.category}
            </span>
            <span className="px-2.5 py-1 text-xs rounded-lg bg-aurelle-bg dark:bg-aurelle-dark-surface text-aurelle-text-muted capitalize">
              {habit.schedule.type} schedule
            </span>
            {habit.targetType === "measurable" && (
              <span className="px-2.5 py-1 text-xs rounded-lg bg-aurelle-bg dark:bg-aurelle-dark-surface text-aurelle-text-muted">
                Target: {habit.targetValue} {habit.unit}
              </span>
            )}
            {habit.archived && (
              <span className="px-2.5 py-1 text-xs rounded-lg bg-aurelle-warning/10 text-aurelle-warning font-semibold">
                Archived
              </span>
            )}
          </div>

          {/* Streaks Bento Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border text-center">
              <div className="flex items-center justify-center gap-1 text-aurelle-warning mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-[11px] font-semibold uppercase">Current</span>
              </div>
              <div className="text-2xl font-serif font-bold text-aurelle-navy-text dark:text-aurelle-dark-text">
                {streaks.currentStreak}
              </div>
              <div className="text-[10px] text-aurelle-text-muted">days</div>
            </div>

            <div className="p-3.5 rounded-xl bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border text-center">
              <div className="flex items-center justify-center gap-1 text-aurelle-action-blue mb-1">
                <Award className="w-4 h-4" />
                <span className="text-[11px] font-semibold uppercase">Longest</span>
              </div>
              <div className="text-2xl font-serif font-bold text-aurelle-navy-text dark:text-aurelle-dark-text">
                {streaks.longestStreak}
              </div>
              <div className="text-[10px] text-aurelle-text-muted">days</div>
            </div>

            <div className="p-3.5 rounded-xl bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border text-center">
              <div className="flex items-center justify-center gap-1 text-aurelle-success mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-[11px] font-semibold uppercase">Total</span>
              </div>
              <div className="text-2xl font-serif font-bold text-aurelle-navy-text dark:text-aurelle-dark-text">
                {streaks.totalCompletions}
              </div>
              <div className="text-[10px] text-aurelle-text-muted">completions</div>
            </div>
          </div>

          {/* 28-Day Consistency Matrix */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text">
                28-Day Habit Cadence
              </span>
              <span className="text-[11px] text-aurelle-text-muted">
                Since {formatDisplayDate(habit.startDate)}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 p-3 bg-aurelle-bg dark:bg-aurelle-dark-surface rounded-xl border border-aurelle-border dark:border-aurelle-dark-border">
              {past28Days.map((date) => {
                const dStr = getLocalDateString(date);
                const isScheduled = isHabitScheduledForDate(habit, dStr);
                const isDone = completedMap.has(dStr);
                const isToday = dStr === todayStr;

                return (
                  <button
                    key={dStr}
                    type="button"
                    onClick={() => toggleHabitCompletion(habit.id, dStr)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] border transition-all relative ${
                      isDone
                        ? "bg-aurelle-success text-white border-aurelle-success"
                        : isScheduled
                        ? "bg-white dark:bg-aurelle-dark-card border-aurelle-border dark:border-aurelle-dark-border text-aurelle-text-muted hover:border-aurelle-action-blue"
                        : "bg-transparent border-transparent text-aurelle-text-muted/40 cursor-default"
                    } ${isToday ? "ring-2 ring-aurelle-action-blue ring-offset-1" : ""}`}
                    title={`${format(date, "MMM d")}: ${
                      isDone ? "Completed" : isScheduled ? "Scheduled" : "Off day"
                    }`}
                  >
                    <span>{format(date, "d")}</span>
                    {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions toolbar */}
          <div className="flex items-center justify-between pt-4 border-t border-aurelle-border/60 dark:border-aurelle-dark-border/60">
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-aurelle-error hover:bg-aurelle-error/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>

            <div className="flex items-center gap-2">
              {habit.archived ? (
                <button
                  type="button"
                  onClick={() => {
                    restoreHabit(habit.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-aurelle-navy-text dark:text-aurelle-dark-text bg-white dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg hover:bg-aurelle-bg-secondary transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    archiveHabit(habit.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-aurelle-text-muted hover:text-aurelle-navy-text bg-white dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg hover:bg-aurelle-bg-secondary transition-colors"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(habit);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-aurelle-action-blue hover:bg-aurelle-action-hover rounded-lg shadow-action-glow transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Habit</span>
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteHabit(habit.id);
          onClose();
        }}
        title="Delete Habit"
        message={`Are you sure you want to permanently delete "${habit.name}" and its completion history? This action cannot be undone.`}
        confirmLabel="Delete Habit"
      />
    </>
  );
}
