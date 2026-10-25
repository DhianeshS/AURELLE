"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store-context";
import {
  getLocalDateString,
  isHabitScheduledForDate,
  calculateHabitStreaks,
} from "@/lib/utils";
import { Check, Flame, Plus, Minus, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { HabitModal } from "@/components/habits/HabitModal";

export function TodayHabitsList() {
  const { habits, completions, toggleHabitCompletion, setHabitProgress } = useStore();
  const todayStr = getLocalDateString();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeNoteHabitId, setActiveNoteHabitId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");

  const scheduledToday = habits.filter(
    (h) => !h.archived && isHabitScheduledForDate(h, todayStr)
  );

  const handleStepValue = (habitId: string, currentVal: number, targetVal: number, delta: number) => {
    const nextVal = Math.max(0, currentVal + delta);
    setHabitProgress(habitId, nextVal, todayStr);
  };

  const handleSaveNote = (habitId: string) => {
    const comp = completions.find((c) => c.habitId === habitId && c.date === todayStr);
    const currentVal = comp?.currentValue || 0;
    setHabitProgress(habitId, currentVal, todayStr, noteInput);
    setActiveNoteHabitId(null);
    setNoteInput("");
  };

  return (
    <div className="bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-xl p-5 shadow-soft flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-aurelle-action-blue" />
            <h2 className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
              Today&apos;s Rituals
            </h2>
          </div>
          <Link
            href="/habits"
            className="text-xs text-aurelle-text-muted hover:text-aurelle-action-blue flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {scheduledToday.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted mb-3">
              No rituals scheduled for today.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-aurelle-action-blue bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg hover:border-aurelle-action-blue transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Ritual</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {scheduledToday.map((habit) => {
              const comp = completions.find(
                (c) => c.habitId === habit.id && c.date === todayStr
              );
              const isCompleted = comp ? comp.completed : false;
              const currentValue = comp?.currentValue || 0;
              const targetValue = habit.targetValue || 1;
              const streak = calculateHabitStreaks(habit, completions, todayStr);

              return (
                <div
                  key={habit.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isCompleted
                      ? "bg-aurelle-bg/50 dark:bg-aurelle-dark-surface/40 border-aurelle-border/60"
                      : "bg-white dark:bg-aurelle-dark-card border-aurelle-border dark:border-aurelle-dark-border hover:border-aurelle-action-blue/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Completion control */}
                    <button
                      type="button"
                      onClick={() => toggleHabitCompletion(habit.id, todayStr)}
                      className={`w-6 h-6 mt-0.5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? "bg-aurelle-success border-aurelle-success text-white shadow-sm"
                          : "border-aurelle-border dark:border-aurelle-dark-border hover:border-aurelle-action-blue text-transparent"
                      }`}
                      aria-label={`Mark ${habit.name} complete`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium truncate ${
                            isCompleted
                              ? "line-through text-aurelle-text-muted"
                              : "text-aurelle-navy-text dark:text-aurelle-dark-text"
                          }`}
                        >
                          {habit.name}
                        </span>
                        {streak.currentStreak > 0 && (
                          <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-aurelle-warning/10 text-aurelle-warning shrink-0"
                            title={`${streak.currentStreak} day streak`}
                          >
                            <Flame className="w-2.5 h-2.5" />
                            {streak.currentStreak}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
                        <span className="px-1.5 py-0.5 bg-aurelle-bg dark:bg-aurelle-dark-surface rounded text-[10px]">
                          {habit.category}
                        </span>

                        {habit.targetType === "measurable" && (
                          <span>
                            {currentValue} / {targetValue} {habit.unit}
                          </span>
                        )}

                        {comp?.notes && (
                          <span className="italic truncate max-w-[140px]" title={comp.notes}>
                            &ldquo;{comp.notes}&rdquo;
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Measurable Stepper and Note trigger */}
                    <div className="flex items-center gap-1 shrink-0">
                      {habit.targetType === "measurable" && (
                        <div className="flex items-center gap-1 bg-aurelle-bg dark:bg-aurelle-dark-surface p-1 rounded-lg border border-aurelle-border dark:border-aurelle-dark-border">
                          <button
                            type="button"
                            onClick={() => handleStepValue(habit.id, currentValue, targetValue, -1)}
                            className="p-1 hover:text-aurelle-navy-text text-aurelle-text-muted transition-colors"
                            aria-label="Decrease progress"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold px-1 text-aurelle-navy-text dark:text-aurelle-dark-text">
                            {currentValue}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStepValue(habit.id, currentValue, targetValue, 1)}
                            className="p-1 hover:text-aurelle-navy-text text-aurelle-text-muted transition-colors"
                            aria-label="Increase progress"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setActiveNoteHabitId(activeNoteHabitId === habit.id ? null : habit.id);
                          setNoteInput(comp?.notes || "");
                        }}
                        className="p-1.5 text-aurelle-text-muted hover:text-aurelle-action-blue rounded-lg transition-colors"
                        title="Add reflection note"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Note edit drawer */}
                  {activeNoteHabitId === habit.id && (
                    <div className="mt-2.5 pt-2 border-t border-aurelle-border/60 dark:border-aurelle-dark-border/60 flex items-center gap-2">
                      <input
                        type="text"
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Add quick reflection or note..."
                        className="flex-1 px-2.5 py-1 text-xs bg-aurelle-bg dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text placeholder:text-aurelle-text-muted focus:outline-none focus:ring-1 focus:ring-aurelle-action-blue"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveNote(habit.id)}
                        className="px-2.5 py-1 text-[11px] font-medium bg-aurelle-action-blue text-white rounded-lg shadow-sm hover:bg-aurelle-action-hover transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <HabitModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
