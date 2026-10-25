import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  format,
  parseISO,
  subDays,
  addDays,
  isBefore,
  isAfter,
  startOfDay,
  eachDayOfInterval,
  getDay,
} from "date-fns";
import { Habit, HabitCompletion, HabitStreak, Task, Goal } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Returns YYYY-MM-DD for a date in local time (never shifts day due to UTC conversion).
 */
export function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parses YYYY-MM-DD into a local Date at midnight.
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Format a YYYY-MM-DD string for display according to preference.
 */
export function formatDisplayDate(dateStr: string, formatStr = "MMM d, yyyy"): string {
  if (!dateStr) return "";
  try {
    const d = parseLocalDate(dateStr);
    return format(d, formatStr);
  } catch {
    return dateStr;
  }
}

/**
 * Checks if a habit is scheduled for a specific date (YYYY-MM-DD).
 */
export function isHabitScheduledForDate(habit: Habit, dateStr: string): boolean {
  if (habit.archived) return false;
  if (habit.startDate && dateStr < habit.startDate) return false;

  const date = parseLocalDate(dateStr);
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  if (habit.schedule.type === "daily") {
    return true;
  }
  if (habit.schedule.type === "weekdays") {
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }
  if (habit.schedule.type === "custom") {
    return habit.schedule.daysOfWeek.includes(dayOfWeek);
  }
  return true;
}

/**
 * Calculates current and longest streak for a habit.
 * Correctly accounts for non-scheduled days (unscheduled days do not break a streak).
 */
export function calculateHabitStreaks(
  habit: Habit,
  completions: HabitCompletion[],
  currentDateStr = getLocalDateString()
): HabitStreak {
  // Extract all completed dates for this habit
  const completedDates = new Set(
    completions
      .filter((c) => c.habitId === habit.id && c.completed)
      .map((c) => c.date)
  );

  const totalCompletions = completedDates.size;
  if (totalCompletions === 0) {
    return { currentStreak: 0, longestStreak: 0, totalCompletions: 0 };
  }

  // Determine start date for scanning (from habit startDate or 365 days ago, whichever is later)
  const today = parseLocalDate(currentDateStr);
  let scanStart = habit.startDate ? parseLocalDate(habit.startDate) : subDays(today, 180);
  if (isBefore(today, scanStart)) {
    scanStart = today;
  }

  // Get all scheduled days in chronological order from scanStart up to today
  const allDays = eachDayOfInterval({ start: scanStart, end: today });
  const scheduledDays: string[] = [];

  for (const d of allDays) {
    const dStr = getLocalDateString(d);
    if (isHabitScheduledForDate(habit, dStr)) {
      scheduledDays.push(dStr);
    }
  }

  if (scheduledDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalCompletions };
  }

  // Calculate longest streak across history
  let longestStreak = 0;
  let runningStreak = 0;

  for (let i = 0; i < scheduledDays.length; i++) {
    const dStr = scheduledDays[i];
    if (completedDates.has(dStr)) {
      runningStreak++;
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    } else {
      runningStreak = 0;
    }
  }

  // Calculate current streak: walk backwards from today's scheduled day
  let currentStreak = 0;
  const lastScheduledIndex = scheduledDays.length - 1;
  const isTodayScheduled = scheduledDays[lastScheduledIndex] === currentDateStr;
  const isTodayCompleted = completedDates.has(currentDateStr);

  let startIndex = lastScheduledIndex;
  // If today is scheduled but not yet completed, user still has time today; check if previous scheduled days were completed
  if (isTodayScheduled && !isTodayCompleted) {
    startIndex = lastScheduledIndex - 1;
  }

  for (let i = startIndex; i >= 0; i--) {
    const dStr = scheduledDays[i];
    if (completedDates.has(dStr)) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalCompletions,
  };
}

/**
 * Calculate goal milestone completion percentage
 */
export function calculateGoalProgress(goal: Goal): number {
  if (!goal.milestones || goal.milestones.length === 0) {
    return goal.status === "completed" ? 100 : 0;
  }
  const completedCount = goal.milestones.filter((m) => m.completed).length;
  return Math.round((completedCount / goal.milestones.length) * 100);
}

/**
 * Task filter helper
 */
export type TaskFilterType = "all" | "today" | "upcoming" | "overdue" | "completed";

export function filterTasks(
  tasks: Task[],
  filter: TaskFilterType,
  todayStr = getLocalDateString()
): Task[] {
  return tasks.filter((task) => {
    const isOverdue = !task.completed && task.dueDate < todayStr;
    const isTodayTask = task.dueDate === todayStr;
    const isUpcoming = !task.completed && task.dueDate > todayStr;

    switch (filter) {
      case "today":
        return isTodayTask;
      case "upcoming":
        return isUpcoming;
      case "overdue":
        return isOverdue;
      case "completed":
        return task.completed;
      case "all":
      default:
        return true;
    }
  });
}
