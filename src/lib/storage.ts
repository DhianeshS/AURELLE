import { ApplicationData, UserPreferences, Category } from "@/types";
import { z } from "zod";

export const STORAGE_KEY = "aurelle_app_data_v1";
export const CURRENT_SCHEMA_VERSION = 1;

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "light",
  weekStart: "monday",
  dateFormat: "MMM d, yyyy",
  reducedMotion: false,
  userName: "",
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat_mindfulness", name: "Mindfulness", color: "#78B9E8" },
  { id: "cat_health", name: "Health & Vitality", color: "#5C9E82" },
  { id: "cat_focus", name: "Deep Work", color: "#1F3045" },
  { id: "cat_growth", name: "Personal Growth", color: "#C68C4D" },
  { id: "cat_routine", name: "Daily Rituals", color: "#A9D6F5" },
];

export const INITIAL_APPLICATION_DATA: ApplicationData = {
  version: CURRENT_SCHEMA_VERSION,
  exportedAt: new Date().toISOString(),
  habits: [],
  completions: [],
  tasks: [],
  goals: [],
  categories: DEFAULT_CATEGORIES,
  preferences: DEFAULT_PREFERENCES,
};

// Zod schemas for backup validation
const habitScheduleSchema = z.object({
  type: z.enum(["daily", "weekdays", "custom"]),
  daysOfWeek: z.array(z.number()),
});

const habitSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string(),
  targetType: z.enum(["boolean", "measurable"]),
  targetValue: z.number().optional(),
  unit: z.string().optional(),
  schedule: habitScheduleSchema,
  createdAt: z.string(),
  startDate: z.string(),
  archived: z.boolean(),
  color: z.string().optional(),
});

const habitCompletionSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  date: z.string(),
  completed: z.boolean(),
  currentValue: z.number().optional(),
  notes: z.string().optional(),
  completedAt: z.string(),
});

const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  category: z.string(),
  dueDate: z.string(),
  dueTime: z.string().optional(),
  completed: z.boolean(),
  completedAt: z.string().optional(),
  createdAt: z.string(),
});

const milestoneSchema = z.object({
  id: z.string(),
  goalId: z.string(),
  title: z.string().min(1),
  completed: z.boolean(),
  completedAt: z.string().optional(),
  dueDate: z.string().optional(),
});

const goalSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string(),
  createdAt: z.string(),
  targetDate: z.string().optional(),
  milestones: z.array(milestoneSchema),
  status: z.enum(["active", "completed", "archived"]),
  color: z.string().optional(),
});

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

const userPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  weekStart: z.enum(["monday", "sunday"]),
  dateFormat: z.enum(["MMM d, yyyy", "yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy"]),
  reducedMotion: z.boolean(),
  userName: z.string().optional(),
});

export const applicationDataSchema = z.object({
  version: z.number(),
  exportedAt: z.string().optional(),
  habits: z.array(habitSchema),
  completions: z.array(habitCompletionSchema),
  tasks: z.array(taskSchema),
  goals: z.array(goalSchema),
  categories: z.array(categorySchema),
  preferences: userPreferencesSchema,
});

/**
 * Storage service for reading and saving ApplicationData
 */
export const storageService = {
  loadData(): ApplicationData {
    if (typeof window === "undefined") {
      return INITIAL_APPLICATION_DATA;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return INITIAL_APPLICATION_DATA;
      }
      const parsed = JSON.parse(raw);
      // Validate schema gracefully
      const result = applicationDataSchema.safeParse(parsed);
      if (!result.success) {
        console.warn("Stored data schema mismatch, fallback to defaults where missing", result.error);
        return {
          ...INITIAL_APPLICATION_DATA,
          ...parsed,
          preferences: { ...DEFAULT_PREFERENCES, ...(parsed.preferences || {}) },
          categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : DEFAULT_CATEGORIES,
        };
      }
      return result.data as ApplicationData;
    } catch (err) {
      console.error("Failed to load application data from localStorage:", err);
      return INITIAL_APPLICATION_DATA;
    }
  },

  saveData(data: ApplicationData): boolean {
    if (typeof window === "undefined") return false;
    try {
      const payload: ApplicationData = {
        ...data,
        version: CURRENT_SCHEMA_VERSION,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return true;
    } catch (err) {
      console.error("Failed to save application data to localStorage:", err);
      return false;
    }
  },

  clearData(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear localStorage:", err);
    }
  },

  exportJSON(data: ApplicationData): string {
    const payload: ApplicationData = {
      ...data,
      version: CURRENT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  },

  validateImport(jsonString: string): { success: boolean; data?: ApplicationData; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      const result = applicationDataSchema.safeParse(parsed);
      if (!result.success) {
        const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
        return { success: false, error: `Invalid backup schema: ${issues}` };
      }
      return { success: true, data: result.data as ApplicationData };
    } catch (err) {
      return { success: false, error: "The file is not a valid JSON document." };
    }
  },
};
