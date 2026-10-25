"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/lib/store-context";
import {
  getLocalDateString,
  parseLocalDate,
  formatDisplayDate,
  isHabitScheduledForDate,
} from "@/lib/utils";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth,
  isSameDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Check,
  CheckSquare,
  Flame,
  Target,
  Plus,
} from "lucide-react";
import { TaskModal } from "@/components/tasks/TaskModal";

type CalendarViewMode = "month" | "week";

export default function CalendarPage() {
  const {
    habits,
    completions,
    tasks,
    goals,
    preferences,
    toggleHabitCompletion,
    toggleTask,
  } = useStore();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(getLocalDateString());
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  const todayStr = getLocalDateString();
  const weekStartsOn = preferences.weekStart === "sunday" ? 0 : 1;

  // Calendar dates matrix
  const calendarDays = useMemo(() => {
    if (viewMode === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(monthStart);
      const start = startOfWeek(monthStart, { weekStartsOn });
      const end = endOfWeek(monthEnd, { weekStartsOn });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfWeek(currentDate, { weekStartsOn });
      const end = endOfWeek(currentDate, { weekStartsOn });
      return eachDayOfInterval({ start, end });
    }
  }, [currentDate, viewMode, weekStartsOn]);

  const handlePrev = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const handleGoToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(getLocalDateString(now));
  };

  // Records for selected day agenda
  const selectedDayAgenda = useMemo(() => {
    // Scheduled habits for selected date
    const scheduledHabits = habits.filter(
      (h) => !h.archived && isHabitScheduledForDate(h, selectedDateStr)
    );

    // Tasks due on selected date
    const dayTasks = tasks.filter((t) => t.dueDate === selectedDateStr);

    // Goals with deadline on selected date
    const dayGoals = goals.filter((g) => g.targetDate === selectedDateStr);

    return {
      habits: scheduledHabits,
      tasks: dayTasks,
      goals: dayGoals,
    };
  }, [habits, tasks, goals, selectedDateStr]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-semibold text-aurelle-action-blue">
              Temporal Sanctuary
            </span>
            <span className="text-xs text-aurelle-text-muted">•</span>
            <span className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
              {format(currentDate, "MMMM yyyy")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
            Calendar & Cadence
          </h1>
        </div>

        {/* Calendar Nav Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-lg shadow-soft">
            <button
              type="button"
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === "month"
                  ? "bg-aurelle-action-blue text-white"
                  : "text-aurelle-text-muted hover:text-aurelle-navy-text"
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === "week"
                  ? "bg-aurelle-action-blue text-white"
                  : "text-aurelle-text-muted hover:text-aurelle-navy-text"
              }`}
            >
              Week
            </button>
          </div>

          <button
            type="button"
            onClick={handleGoToday}
            className="px-3 py-1.5 text-xs font-medium text-aurelle-navy-text dark:text-aurelle-dark-text bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-lg hover:bg-aurelle-bg-secondary transition-colors"
          >
            Today
          </button>

          <div className="flex items-center gap-1 bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-lg p-1">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 hover:bg-aurelle-bg-secondary rounded text-aurelle-text-muted hover:text-aurelle-navy-text transition-colors"
              aria-label="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1 hover:bg-aurelle-bg-secondary rounded text-aurelle-text-muted hover:text-aurelle-navy-text transition-colors"
              aria-label="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Calendar Matrix (Left) + Selected Day Agenda (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Matrix View (2 cols on large screen) */}
        <div className="lg:col-span-2 bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-2xl p-4 sm:p-6 shadow-soft">
          <div className="text-sm font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text mb-4">
            {format(currentDate, "MMMM yyyy")}
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
            {calendarDays.slice(0, 7).map((d) => (
              <div
                key={d.toISOString()}
                className="text-[11px] font-semibold uppercase tracking-wider text-aurelle-text-muted py-1"
              >
                {format(d, "EEE")}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((day) => {
              const dStr = getLocalDateString(day);
              const isSelected = dStr === selectedDateStr;
              const isToday = dStr === todayStr;
              const isCurrentMonth = isSameMonth(day, currentDate);

              // Daily indicators
              const scheduledHabits = habits.filter(
                (h) => !h.archived && isHabitScheduledForDate(h, dStr)
              );
              const tasksDue = tasks.filter((t) => t.dueDate === dStr);
              const goalsDue = goals.filter((g) => g.targetDate === dStr);

              const hasHabits = scheduledHabits.length > 0;
              const hasTasks = tasksDue.length > 0;
              const hasGoals = goalsDue.length > 0;

              return (
                <button
                  key={dStr}
                  type="button"
                  onClick={() => setSelectedDateStr(dStr)}
                  className={`min-h-[64px] sm:min-h-[82px] p-1.5 sm:p-2 rounded-xl text-left border flex flex-col justify-between transition-all relative ${
                    isSelected
                      ? "bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border-aurelle-action-blue ring-1 ring-aurelle-action-blue shadow-soft"
                      : isCurrentMonth
                      ? "bg-white dark:bg-aurelle-dark-card border-aurelle-border dark:border-aurelle-dark-border hover:border-aurelle-action-blue/40"
                      : "bg-aurelle-bg/40 dark:bg-aurelle-dark-surface/20 border-transparent text-aurelle-text-muted/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? "bg-aurelle-action-blue text-white font-semibold"
                          : isSelected
                          ? "font-semibold text-aurelle-action-blue"
                          : "text-aurelle-navy-text dark:text-aurelle-dark-text"
                      }`}
                    >
                      {format(day, "d")}
                    </span>

                    {/* Indicators dot row */}
                    <div className="flex items-center gap-1">
                      {hasHabits && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-aurelle-success"
                          title={`${scheduledHabits.length} habits`}
                        />
                      )}
                      {hasTasks && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-aurelle-action-blue"
                          title={`${tasksDue.length} tasks`}
                        />
                      )}
                      {hasGoals && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-aurelle-warning"
                          title="Goal target"
                        />
                      )}
                    </div>
                  </div>

                  {/* Summary preview on desktop */}
                  <div className="hidden sm:block text-[10px] text-aurelle-text-muted truncate mt-1">
                    {tasksDue.length > 0 && (
                      <span className="block truncate text-aurelle-navy-text dark:text-aurelle-dark-text">
                        {tasksDue[0].title}
                      </span>
                    )}
                    {tasksDue.length > 1 && (
                      <span>+{tasksDue.length - 1} more</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected-Day Agenda Panel (1 col) */}
        <div className="bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-2xl p-5 sm:p-6 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-aurelle-action-blue block mb-0.5">
                  Day Agenda
                </span>
                <h3 className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
                  {formatDisplayDate(selectedDateStr, "EEEE, MMMM d")}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setTaskModalOpen(true)}
                className="p-1.5 bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface hover:text-aurelle-action-blue rounded-lg border border-aurelle-border dark:border-aurelle-dark-border text-aurelle-text-muted transition-colors"
                title="Add task on this date"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Agenda Sections */}
            <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1">
              {/* Scheduled Habits */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-aurelle-text-muted mb-2">
                  <Flame className="w-3.5 h-3.5 text-aurelle-success" />
                  <span>Rituals ({selectedDayAgenda.habits.length})</span>
                </div>

                {selectedDayAgenda.habits.length === 0 ? (
                  <p className="text-xs text-aurelle-text-muted italic py-1">
                    No rituals scheduled for this day.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedDayAgenda.habits.map((h) => {
                      const comp = completions.find(
                        (c) => c.habitId === h.id && c.date === selectedDateStr
                      );
                      const isDone = comp?.completed || false;

                      return (
                        <div
                          key={h.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-aurelle-bg-secondary/60 dark:bg-aurelle-dark-surface/60 border border-aurelle-border/60 text-xs"
                        >
                          <span
                            className={`truncate ${
                              isDone
                                ? "line-through text-aurelle-text-muted"
                                : "text-aurelle-navy-text dark:text-aurelle-dark-text font-medium"
                            }`}
                          >
                            {h.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleHabitCompletion(h.id, selectedDateStr)}
                            className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${
                              isDone
                                ? "bg-aurelle-success border-aurelle-success text-white"
                                : "border-aurelle-border text-transparent hover:border-aurelle-action-blue"
                            }`}
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tasks Due */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-aurelle-text-muted mb-2">
                  <CheckSquare className="w-3.5 h-3.5 text-aurelle-action-blue" />
                  <span>Tasks Due ({selectedDayAgenda.tasks.length})</span>
                </div>

                {selectedDayAgenda.tasks.length === 0 ? (
                  <p className="text-xs text-aurelle-text-muted italic py-1">
                    No tasks due on this day.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedDayAgenda.tasks.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-aurelle-bg-secondary/60 dark:bg-aurelle-dark-surface/60 border border-aurelle-border/60 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <input
                            type="checkbox"
                            checked={t.completed}
                            onChange={() => toggleTask(t.id)}
                            className="w-3.5 h-3.5 rounded text-aurelle-action-blue cursor-pointer"
                          />
                          <span
                            className={`truncate ${
                              t.completed
                                ? "line-through text-aurelle-text-muted"
                                : "text-aurelle-navy-text dark:text-aurelle-dark-text font-medium"
                            }`}
                          >
                            {t.title}
                          </span>
                        </div>
                        {t.dueTime && (
                          <span className="text-[10px] text-aurelle-text-muted shrink-0">
                            {t.dueTime}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Goals Deadlines */}
              {selectedDayAgenda.goals.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-aurelle-text-muted mb-2">
                    <Target className="w-3.5 h-3.5 text-aurelle-warning" />
                    <span>Goal Target</span>
                  </div>

                  <div className="space-y-1.5">
                    {selectedDayAgenda.goals.map((g) => (
                      <div
                        key={g.id}
                        className="p-2 rounded-lg bg-aurelle-warning/10 border border-aurelle-warning/20 text-xs"
                      >
                        <div className="font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
                          {g.title}
                        </div>
                        <div className="text-[10px] text-aurelle-text-muted mt-0.5">
                          {g.milestones.filter((m) => m.completed).length} / {g.milestones.length} milestones completed
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        defaultDate={selectedDateStr}
      />
    </div>
  );
}
