"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  ApplicationData,
  Habit,
  HabitCompletion,
  Task,
  Goal,
  Milestone,
  Category,
  UserPreferences,
} from "@/types";
import {
  storageService,
  INITIAL_APPLICATION_DATA,
  DEFAULT_PREFERENCES,
  DEFAULT_CATEGORIES,
} from "./storage";
import { generateId, getLocalDateString } from "./utils";
import { getSampleStarterData } from "./seed";

interface StoreContextValue {
  isLoaded: boolean;
  habits: Habit[];
  completions: HabitCompletion[];
  tasks: Task[];
  goals: Goal[];
  categories: Category[];
  preferences: UserPreferences;

  // Habit operations
  addHabit: (habit: Omit<Habit, "id" | "createdAt" | "archived">) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  archiveHabit: (id: string) => void;
  restoreHabit: (id: string) => void;
  deleteHabit: (id: string) => void;

  // Completion operations
  toggleHabitCompletion: (habitId: string, dateStr?: string) => void;
  setHabitProgress: (habitId: string, value: number, dateStr?: string, notes?: string) => void;
  getHabitCompletionForDate: (habitId: string, dateStr?: string) => HabitCompletion | undefined;

  // Task operations
  addTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Goal operations
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "status">) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addMilestone: (goalId: string, title: string, dueDate?: string) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;
  archiveGoal: (id: string) => void;
  restoreGoal: (id: string) => void;
  deleteGoal: (id: string) => void;

  // Category operations
  addCategory: (name: string, color: string) => Category;

  // Preferences
  updatePreferences: (updates: Partial<UserPreferences>) => void;

  // Backup & reset
  exportBackup: () => void;
  importBackup: (backupData: ApplicationData) => void;
  resetAllData: () => void;
  loadStarterData: () => void;

  // Global modals and notifications
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  quickAddOpen: boolean;
  setQuickAddOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ApplicationData>(INITIAL_APPLICATION_DATA);
  const [isLoaded, setIsLoaded] = useState(false);

  // UI state
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // Dismiss toast after 3 seconds
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Load data on client mount
  useEffect(() => {
    const loaded = storageService.loadData();
    setData(loaded);
    setIsLoaded(true);
  }, []);

  // Save data on change (only after initial load)
  const persist = useCallback((nextData: ApplicationData) => {
    setData(nextData);
    storageService.saveData(nextData);
  }, []);

  // Theme application
  useEffect(() => {
    if (!isLoaded) return;
    const root = document.documentElement;
    const theme = data.preferences.theme;

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // system preference
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    if (data.preferences.reducedMotion) {
      root.setAttribute("data-reduced-motion", "true");
    } else {
      root.removeAttribute("data-reduced-motion");
    }
  }, [data.preferences.theme, data.preferences.reducedMotion, isLoaded]);

  // Keyboard shortcut for Cmd+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Habit operations
  const addHabit = useCallback(
    (habitInput: Omit<Habit, "id" | "createdAt" | "archived">): Habit => {
      const newHabit: Habit = {
        ...habitInput,
        id: generateId("habit"),
        createdAt: new Date().toISOString(),
        archived: false,
      };
      persist({
        ...data,
        habits: [...data.habits, newHabit],
      });
      showToast(`Habit "${newHabit.name}" created`);
      return newHabit;
    },
    [data, persist, showToast]
  );

  const updateHabit = useCallback(
    (id: string, updates: Partial<Habit>) => {
      const nextHabits = data.habits.map((h) => (h.id === id ? { ...h, ...updates } : h));
      persist({ ...data, habits: nextHabits });
      showToast("Habit updated");
    },
    [data, persist, showToast]
  );

  const archiveHabit = useCallback(
    (id: string) => {
      const nextHabits = data.habits.map((h) => (h.id === id ? { ...h, archived: true } : h));
      persist({ ...data, habits: nextHabits });
      showToast("Habit archived");
    },
    [data, persist, showToast]
  );

  const restoreHabit = useCallback(
    (id: string) => {
      const nextHabits = data.habits.map((h) => (h.id === id ? { ...h, archived: false } : h));
      persist({ ...data, habits: nextHabits });
      showToast("Habit restored");
    },
    [data, persist, showToast]
  );

  const deleteHabit = useCallback(
    (id: string) => {
      const nextHabits = data.habits.filter((h) => h.id !== id);
      const nextCompletions = data.completions.filter((c) => c.habitId !== id);
      persist({ ...data, habits: nextHabits, completions: nextCompletions });
      showToast("Habit deleted");
    },
    [data, persist, showToast]
  );

  // Completion operations
  const getHabitCompletionForDate = useCallback(
    (habitId: string, dateStr = getLocalDateString()): HabitCompletion | undefined => {
      return data.completions.find((c) => c.habitId === habitId && c.date === dateStr);
    },
    [data.completions]
  );

  const toggleHabitCompletion = useCallback(
    (habitId: string, dateStr = getLocalDateString()) => {
      const habit = data.habits.find((h) => h.id === habitId);
      if (!habit) return;

      const existingIndex = data.completions.findIndex(
        (c) => c.habitId === habitId && c.date === dateStr
      );

      let nextCompletions = [...data.completions];

      if (existingIndex >= 0) {
        const existing = data.completions[existingIndex];
        const nextCompleted = !existing.completed;
        const nextVal = habit.targetType === "measurable" && habit.targetValue
          ? (nextCompleted ? habit.targetValue : 0)
          : existing.currentValue;

        nextCompletions[existingIndex] = {
          ...existing,
          completed: nextCompleted,
          currentValue: nextVal,
          completedAt: new Date().toISOString(),
        };
      } else {
        const targetVal = habit.targetType === "measurable" ? habit.targetValue || 1 : undefined;
        const newRecord: HabitCompletion = {
          id: generateId("comp"),
          habitId,
          date: dateStr,
          completed: true,
          currentValue: targetVal,
          completedAt: new Date().toISOString(),
        };
        nextCompletions.push(newRecord);
      }

      persist({ ...data, completions: nextCompletions });
    },
    [data, persist]
  );

  const setHabitProgress = useCallback(
    (habitId: string, value: number, dateStr = getLocalDateString(), notes?: string) => {
      const habit = data.habits.find((h) => h.id === habitId);
      if (!habit) return;

      const target = habit.targetValue || 1;
      const isCompleted = value >= target;

      const existingIndex = data.completions.findIndex(
        (c) => c.habitId === habitId && c.date === dateStr
      );

      let nextCompletions = [...data.completions];

      if (existingIndex >= 0) {
        nextCompletions[existingIndex] = {
          ...nextCompletions[existingIndex],
          currentValue: value,
          completed: isCompleted,
          notes: notes !== undefined ? notes : nextCompletions[existingIndex].notes,
          completedAt: new Date().toISOString(),
        };
      } else {
        nextCompletions.push({
          id: generateId("comp"),
          habitId,
          date: dateStr,
          completed: isCompleted,
          currentValue: value,
          notes,
          completedAt: new Date().toISOString(),
        });
      }

      persist({ ...data, completions: nextCompletions });
    },
    [data, persist]
  );

  // Task operations
  const addTask = useCallback(
    (taskInput: Omit<Task, "id" | "createdAt" | "completed">): Task => {
      const newTask: Task = {
        ...taskInput,
        id: generateId("task"),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      persist({
        ...data,
        tasks: [newTask, ...data.tasks],
      });
      showToast(`Task "${newTask.title}" added`);
      return newTask;
    },
    [data, persist, showToast]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      const nextTasks = data.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
      persist({ ...data, tasks: nextTasks });
      showToast("Task updated");
    },
    [data, persist, showToast]
  );

  const toggleTask = useCallback(
    (id: string) => {
      const nextTasks = data.tasks.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });
      persist({ ...data, tasks: nextTasks });
    },
    [data, persist]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const nextTasks = data.tasks.filter((t) => t.id !== id);
      persist({ ...data, tasks: nextTasks });
      showToast("Task removed");
    },
    [data, persist, showToast]
  );

  // Goal operations
  const addGoal = useCallback(
    (goalInput: Omit<Goal, "id" | "createdAt" | "status">): Goal => {
      const newGoal: Goal = {
        ...goalInput,
        id: generateId("goal"),
        createdAt: new Date().toISOString(),
        status: "active",
      };
      persist({
        ...data,
        goals: [...data.goals, newGoal],
      });
      showToast(`Goal "${newGoal.title}" created`);
      return newGoal;
    },
    [data, persist, showToast]
  );

  const updateGoal = useCallback(
    (id: string, updates: Partial<Goal>) => {
      const nextGoals = data.goals.map((g) => (g.id === id ? { ...g, ...updates } : g));
      persist({ ...data, goals: nextGoals });
      showToast("Goal updated");
    },
    [data, persist, showToast]
  );

  const toggleMilestone = useCallback(
    (goalId: string, milestoneId: string) => {
      const nextGoals = data.goals.map((g) => {
        if (g.id === goalId) {
          const updatedMilestones = g.milestones.map((m) => {
            if (m.id === milestoneId) {
              const completed = !m.completed;
              return {
                ...m,
                completed,
                completedAt: completed ? new Date().toISOString() : undefined,
              };
            }
            return m;
          });
          const allCompleted =
            updatedMilestones.length > 0 && updatedMilestones.every((m) => m.completed);
          return {
            ...g,
            milestones: updatedMilestones,
            status: allCompleted ? ("completed" as const) : ("active" as const),
          };
        }
        return g;
      });
      persist({ ...data, goals: nextGoals });
    },
    [data, persist]
  );

  const addMilestone = useCallback(
    (goalId: string, title: string, dueDate?: string) => {
      const newMilestone: Milestone = {
        id: generateId("m"),
        goalId,
        title,
        completed: false,
        dueDate,
      };
      const nextGoals = data.goals.map((g) => {
        if (g.id === goalId) {
          return {
            ...g,
            milestones: [...g.milestones, newMilestone],
            status: "active" as const,
          };
        }
        return g;
      });
      persist({ ...data, goals: nextGoals });
      showToast("Milestone added");
    },
    [data, persist, showToast]
  );

  const deleteMilestone = useCallback(
    (goalId: string, milestoneId: string) => {
      const nextGoals = data.goals.map((g) => {
        if (g.id === goalId) {
          return {
            ...g,
            milestones: g.milestones.filter((m) => m.id !== milestoneId),
          };
        }
        return g;
      });
      persist({ ...data, goals: nextGoals });
      showToast("Milestone deleted");
    },
    [data, persist, showToast]
  );

  const archiveGoal = useCallback(
    (id: string) => {
      const nextGoals = data.goals.map((g) =>
        g.id === id ? { ...g, status: "archived" as const } : g
      );
      persist({ ...data, goals: nextGoals });
      showToast("Goal archived");
    },
    [data, persist, showToast]
  );

  const restoreGoal = useCallback(
    (id: string) => {
      const nextGoals = data.goals.map((g) =>
        g.id === id ? { ...g, status: "active" as const } : g
      );
      persist({ ...data, goals: nextGoals });
      showToast("Goal restored");
    },
    [data, persist, showToast]
  );

  const deleteGoal = useCallback(
    (id: string) => {
      const nextGoals = data.goals.filter((g) => g.id !== id);
      persist({ ...data, goals: nextGoals });
      showToast("Goal deleted");
    },
    [data, persist, showToast]
  );

  // Category
  const addCategory = useCallback(
    (name: string, color: string): Category => {
      const newCat: Category = {
        id: generateId("cat"),
        name,
        color,
      };
      persist({ ...data, categories: [...data.categories, newCat] });
      return newCat;
    },
    [data, persist]
  );

  // Preferences
  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      const nextPreferences = { ...data.preferences, ...updates };
      persist({ ...data, preferences: nextPreferences });
      showToast("Preferences updated");
    },
    [data, persist, showToast]
  );

  // Backup & reset
  const exportBackup = useCallback(() => {
    const jsonStr = storageService.exportJSON(data);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aurelle_backup_${getLocalDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Backup exported successfully");
  }, [data, showToast]);

  const importBackup = useCallback(
    (backupData: ApplicationData) => {
      persist(backupData);
      showToast("Data imported successfully");
    },
    [persist, showToast]
  );

  const resetAllData = useCallback(() => {
    storageService.clearData();
    setData(INITIAL_APPLICATION_DATA);
    showToast("All local records cleared");
  }, [showToast]);

  const loadStarterData = useCallback(() => {
    const starter = getSampleStarterData();
    const nextData: ApplicationData = {
      ...data,
      habits: starter.habits,
      completions: starter.completions,
      tasks: starter.tasks,
      goals: starter.goals,
    };
    persist(nextData);
    showToast("Calm starter routine loaded");
  }, [data, persist, showToast]);

  const value = useMemo<StoreContextValue>(
    () => ({
      isLoaded,
      habits: data.habits,
      completions: data.completions,
      tasks: data.tasks,
      goals: data.goals,
      categories: data.categories,
      preferences: data.preferences,

      addHabit,
      updateHabit,
      archiveHabit,
      restoreHabit,
      deleteHabit,

      toggleHabitCompletion,
      setHabitProgress,
      getHabitCompletionForDate,

      addTask,
      updateTask,
      toggleTask,
      deleteTask,

      addGoal,
      updateGoal,
      toggleMilestone,
      addMilestone,
      deleteMilestone,
      archiveGoal,
      restoreGoal,
      deleteGoal,

      addCategory,
      updatePreferences,

      exportBackup,
      importBackup,
      resetAllData,
      loadStarterData,

      searchOpen,
      setSearchOpen,
      quickAddOpen,
      setQuickAddOpen,
      toastMessage,
      showToast,
    }),
    [
      isLoaded,
      data,
      addHabit,
      updateHabit,
      archiveHabit,
      restoreHabit,
      deleteHabit,
      toggleHabitCompletion,
      setHabitProgress,
      getHabitCompletionForDate,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
      addGoal,
      updateGoal,
      toggleMilestone,
      addMilestone,
      deleteMilestone,
      archiveGoal,
      restoreGoal,
      deleteGoal,
      addCategory,
      updatePreferences,
      exportBackup,
      importBackup,
      resetAllData,
      loadStarterData,
      searchOpen,
      quickAddOpen,
      toastMessage,
      showToast,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
