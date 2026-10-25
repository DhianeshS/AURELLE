import { Habit, Task, Goal, HabitCompletion } from "@/types";
import { getLocalDateString } from "./utils";
import { subDays } from "date-fns";

export function getSampleStarterData(): {
  habits: Habit[];
  completions: HabitCompletion[];
  tasks: Task[];
  goals: Goal[];
} {
  const today = getLocalDateString();
  const dMinus1 = getLocalDateString(subDays(new Date(), 1));
  const dMinus2 = getLocalDateString(subDays(new Date(), 2));
  const dMinus3 = getLocalDateString(subDays(new Date(), 3));
  const dPlus2 = getLocalDateString(subDays(new Date(), -2));
  const dPlus5 = getLocalDateString(subDays(new Date(), -5));

  const habits: Habit[] = [
    {
      id: "habit_morning_mindfulness",
      name: "Morning Mindfulness & Stillness",
      description: "10 minutes of silent meditation before opening screens.",
      category: "Mindfulness",
      targetType: "measurable",
      targetValue: 10,
      unit: "mins",
      schedule: { type: "daily", daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      createdAt: new Date().toISOString(),
      startDate: dMinus3,
      archived: false,
      color: "#78B9E8",
    },
    {
      id: "habit_hydration",
      name: "Pure Hydration Protocol",
      description: "Drink crisp filtered water throughout the day.",
      category: "Health & Vitality",
      targetType: "measurable",
      targetValue: 8,
      unit: "glasses",
      schedule: { type: "daily", daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      createdAt: new Date().toISOString(),
      startDate: dMinus3,
      archived: false,
      color: "#5C9E82",
    },
    {
      id: "habit_deep_reading",
      name: "Deliberate Reading",
      description: "Immerse in long-form philosophical or craft literature.",
      category: "Personal Growth",
      targetType: "measurable",
      targetValue: 25,
      unit: "pages",
      schedule: { type: "weekdays", daysOfWeek: [1, 2, 3, 4, 5] },
      createdAt: new Date().toISOString(),
      startDate: dMinus3,
      archived: false,
      color: "#C68C4D",
    },
    {
      id: "habit_evening_reflection",
      name: "Evening Review & Workspace Reset",
      description: "Tidy physical desk, jot top 3 priorities for tomorrow.",
      category: "Daily Rituals",
      targetType: "boolean",
      schedule: { type: "daily", daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      createdAt: new Date().toISOString(),
      startDate: dMinus3,
      archived: false,
      color: "#1F3045",
    },
  ];

  const completions: HabitCompletion[] = [
    {
      id: "comp_1",
      habitId: "habit_morning_mindfulness",
      date: dMinus3,
      completed: true,
      currentValue: 10,
      completedAt: new Date().toISOString(),
    },
    {
      id: "comp_2",
      habitId: "habit_morning_mindfulness",
      date: dMinus2,
      completed: true,
      currentValue: 10,
      completedAt: new Date().toISOString(),
    },
    {
      id: "comp_3",
      habitId: "habit_morning_mindfulness",
      date: dMinus1,
      completed: true,
      currentValue: 10,
      completedAt: new Date().toISOString(),
    },
    {
      id: "comp_4",
      habitId: "habit_hydration",
      date: dMinus2,
      completed: true,
      currentValue: 8,
      completedAt: new Date().toISOString(),
    },
    {
      id: "comp_5",
      habitId: "habit_hydration",
      date: dMinus1,
      completed: true,
      currentValue: 8,
      completedAt: new Date().toISOString(),
    },
    {
      id: "comp_6",
      habitId: "habit_hydration",
      date: today,
      completed: false,
      currentValue: 4,
      completedAt: new Date().toISOString(),
    },
  ];

  const tasks: Task[] = [
    {
      id: "task_1",
      title: "Synthesise quarterly architecture priorities",
      description: "Review core system decoupling and publish draft memo.",
      priority: "high",
      category: "Deep Work",
      dueDate: today,
      dueTime: "11:00",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "task_2",
      title: "Cleanse and streamline digital knowledge base",
      description: "Archive deprecated notes and consolidate workspace indexes.",
      priority: "medium",
      category: "Personal Growth",
      dueDate: today,
      dueTime: "16:30",
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "task_3",
      title: "Schedule annual preventative health consultation",
      priority: "low",
      category: "Health & Vitality",
      dueDate: dPlus2,
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "task_4",
      title: "Finalise studio design system guidelines",
      priority: "high",
      category: "Deep Work",
      dueDate: dPlus5,
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];

  const goals: Goal[] = [
    {
      id: "goal_1",
      title: "Establish Uncompromised Daily Well-being",
      description: "Cultivate consistent physical, mental, and spatial harmony.",
      category: "Health & Vitality",
      createdAt: new Date().toISOString(),
      targetDate: dPlus5,
      status: "active",
      color: "#5C9E82",
      milestones: [
        {
          id: "m_1",
          goalId: "goal_1",
          title: "Complete 14 consecutive days of morning stillness",
          completed: false,
        },
        {
          id: "m_2",
          goalId: "goal_1",
          title: "Maintain 2L daily hydration for 3 weeks",
          completed: false,
        },
        {
          id: "m_3",
          goalId: "goal_1",
          title: "Establish a zero-screen bedroom sanctuary",
          completed: true,
          completedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: "goal_2",
      title: "Ship Flagship Product Platform Architecture",
      description: "Complete modular foundation with comprehensive test coverage.",
      category: "Deep Work",
      createdAt: new Date().toISOString(),
      targetDate: dPlus5,
      status: "active",
      color: "#78B9E8",
      milestones: [
        {
          id: "m_4",
          goalId: "goal_2",
          title: "Finalise typed data contracts and persistence interface",
          completed: true,
          completedAt: new Date().toISOString(),
        },
        {
          id: "m_5",
          goalId: "goal_2",
          title: "Implement responsive Scandinavian bento-grid layouts",
          completed: false,
        },
        {
          id: "m_6",
          goalId: "goal_2",
          title: "Verify backup import/export round-trip schema validation",
          completed: false,
        },
      ],
    },
  ];

  return { habits, completions, tasks, goals };
}
