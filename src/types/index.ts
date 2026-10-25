export type Priority = "low" | "medium" | "high";

export type TargetType = "boolean" | "measurable";

export type ScheduleType = "daily" | "weekdays" | "custom";

export interface HabitSchedule {
  type: ScheduleType;
  daysOfWeek: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  targetType: TargetType;
  targetValue?: number;
  unit?: string;
  schedule: HabitSchedule;
  createdAt: string; // ISO
  startDate: string; // YYYY-MM-DD
  archived: boolean;
  color?: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD local
  completed: boolean;
  currentValue?: number; // for measurable habits
  notes?: string;
  completedAt: string; // ISO
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  category: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  dueDate?: string;
}

export type GoalStatus = "active" | "completed" | "archived";

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  createdAt: string;
  targetDate?: string; // YYYY-MM-DD
  milestones: Milestone[];
  status: GoalStatus;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type ThemePreference = "light" | "dark" | "system";
export type WeekStartPreference = "monday" | "sunday";
export type DateFormatPreference = "MMM d, yyyy" | "yyyy-MM-dd" | "dd/MM/yyyy" | "MM/dd/yyyy";

export interface UserPreferences {
  theme: ThemePreference;
  weekStart: WeekStartPreference;
  dateFormat: DateFormatPreference;
  reducedMotion: boolean;
  userName?: string;
}

export interface ApplicationData {
  version: number;
  exportedAt: string;
  habits: Habit[];
  completions: HabitCompletion[];
  tasks: Task[];
  goals: Goal[];
  categories: Category[];
  preferences: UserPreferences;
}

export interface HabitStreak {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
}
