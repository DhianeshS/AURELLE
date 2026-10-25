"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useStore } from "@/lib/store-context";
import {
  calculateHabitStreaks,
  getLocalDateString,
  isHabitScheduledForDate,
} from "@/lib/utils";
import {
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  BarChart3,
  Flame,
  CheckSquare,
  Award,
  Sparkles,
  PieChart as PieIcon,
  Calendar,
} from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export default function AnalyticsPage() {
  const { habits, completions, tasks, categories, setQuickAddOpen } = useStore();
  const [mounted, setMounted] = useState(false);
  const todayStr = getLocalDateString();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Summary Metrics calculated strictly from records
  const metrics = useMemo(() => {
    // 1. Habit Completion Rate: over past 30 days
    const past30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    let totalScheduledOccurrences = 0;
    let totalCompletedOccurrences = 0;

    past30Days.forEach((day) => {
      const dStr = getLocalDateString(day);
      habits.forEach((habit) => {
        if (!habit.archived && isHabitScheduledForDate(habit, dStr)) {
          totalScheduledOccurrences++;
          const comp = completions.find((c) => c.habitId === habit.id && c.date === dStr);
          if (comp && comp.completed) {
            totalCompletedOccurrences++;
          }
        }
      });
    });

    const habitCompletionRate =
      totalScheduledOccurrences > 0
        ? Math.round((totalCompletedOccurrences / totalScheduledOccurrences) * 100)
        : 0;

    // 2. Task Completion Rate: all tasks
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const taskCompletionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // 3. Streaks leaderboards
    let bestCurrentStreak = 0;
    let bestStreakHabitName = "—";
    let longestAllTimeStreak = 0;

    habits.forEach((h) => {
      const s = calculateHabitStreaks(h, completions, todayStr);
      if (s.currentStreak > bestCurrentStreak) {
        bestCurrentStreak = s.currentStreak;
        bestStreakHabitName = h.name;
      }
      if (s.longestStreak > longestAllTimeStreak) {
        longestAllTimeStreak = s.longestStreak;
      }
    });

    return {
      totalScheduledOccurrences,
      totalCompletedOccurrences,
      habitCompletionRate,
      totalTasks,
      completedTasks,
      taskCompletionRate,
      bestCurrentStreak,
      bestStreakHabitName,
      longestAllTimeStreak,
    };
  }, [habits, completions, tasks, todayStr]);

  // 14-day chronological activity chart
  const activityTrendData = useMemo(() => {
    const past14Days = eachDayOfInterval({
      start: subDays(new Date(), 13),
      end: new Date(),
    });

    return past14Days.map((day) => {
      const dStr = getLocalDateString(day);
      const habitsDone = completions.filter((c) => c.date === dStr && c.completed).length;
      const tasksDone = tasks.filter((t) => t.completed && t.dueDate === dStr).length;

      return {
        date: format(day, "MMM d"),
        "Habits Logged": habitsDone,
        "Tasks Completed": tasksDone,
        total: habitsDone + tasksDone,
      };
    });
  }, [completions, tasks]);

  // Category distribution
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};

    habits.forEach((h) => {
      counts[h.category] = (counts[h.category] || 0) + 1;
    });

    tasks.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });

    const palette = ["#78B9E8", "#5C9E82", "#C68C4D", "#1F3045", "#A9D6F5"];
    let idx = 0;

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: palette[idx++ % palette.length],
    }));
  }, [habits, tasks]);

  const hasData = habits.length > 0 || tasks.length > 0 || completions.length > 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-semibold text-aurelle-action-blue">
              Empirical Progress
            </span>
            <span className="text-xs text-aurelle-text-muted">•</span>
            <span className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
              Derived strictly from your records
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
            Analytics & Insights
          </h1>
        </div>
      </div>

      {!hasData ? (
        <EmptyState
          icon={BarChart3}
          title="No activity recorded yet"
          description="Analytics are generated dynamically from your habits, tasks, and completion history. Start logging your daily rituals to unlock meaningful insights."
          actionLabel="Create First Action"
          onAction={() => setQuickAddOpen(true)}
        />
      ) : (
        <>
          {/* Key Metric Bento Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Habit Completion Rate */}
            <div className="p-5 rounded-xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-soft flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-aurelle-text-muted">
                  Habit Consistency (30d)
                </span>
                <Flame className="w-4 h-4 text-aurelle-success" />
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-aurelle-navy-text dark:text-aurelle-dark-text mb-1">
                  {metrics.habitCompletionRate}%
                </div>
                <div className="text-[11px] text-aurelle-text-muted leading-tight">
                  {metrics.totalCompletedOccurrences} completed out of {metrics.totalScheduledOccurrences} scheduled
                </div>
              </div>
            </div>

            {/* Task Completion Rate */}
            <div className="p-5 rounded-xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-soft flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-aurelle-text-muted">
                  Task Completion
                </span>
                <CheckSquare className="w-4 h-4 text-aurelle-action-blue" />
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-aurelle-navy-text dark:text-aurelle-dark-text mb-1">
                  {metrics.taskCompletionRate}%
                </div>
                <div className="text-[11px] text-aurelle-text-muted leading-tight">
                  {metrics.completedTasks} completed out of {metrics.totalTasks} recorded
                </div>
              </div>
            </div>

            {/* Best Active Streak */}
            <div className="p-5 rounded-xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-soft flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-aurelle-text-muted">
                  Active Streak Leader
                </span>
                <Award className="w-4 h-4 text-aurelle-warning" />
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-aurelle-navy-text dark:text-aurelle-dark-text mb-1">
                  {metrics.bestCurrentStreak}d
                </div>
                <div className="text-[11px] text-aurelle-text-muted truncate leading-tight" title={metrics.bestStreakHabitName}>
                  {metrics.bestStreakHabitName}
                </div>
              </div>
            </div>

            {/* Longest All-Time Streak */}
            <div className="p-5 rounded-xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-soft flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-aurelle-text-muted">
                  Personal Record
                </span>
                <Sparkles className="w-4 h-4 text-aurelle-action-blue" />
              </div>
              <div>
                <div className="text-3xl font-serif font-bold text-aurelle-navy-text dark:text-aurelle-dark-text mb-1">
                  {metrics.longestAllTimeStreak}d
                </div>
                <div className="text-[11px] text-aurelle-text-muted leading-tight">
                  Highest streak achieved across habits
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 14-Day Activity Trend Bar Chart (2 cols) */}
            <div className="lg:col-span-2 bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-xl p-5 shadow-soft">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-aurelle-action-blue" />
                  <h3 className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
                    14-Day Activity History
                  </h3>
                </div>
                <span className="text-xs text-aurelle-text-muted">
                  Past 2 weeks
                </span>
              </div>

              {!mounted ? (
                <div className="h-64 flex items-center justify-center">
                  <span className="text-xs text-aurelle-text-muted">Loading chart...</span>
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activityTrendData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="date"
                        stroke="#748398"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#748398"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#E4EAF0",
                          borderRadius: "10px",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                      <Bar
                        dataKey="Habits Logged"
                        fill="#5C9E82"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={22}
                      />
                      <Bar
                        dataKey="Tasks Completed"
                        fill="#78B9E8"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={22}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Category Focus Distribution (1 col) */}
            <div className="bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-xl p-5 shadow-soft">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-aurelle-warning" />
                  <h3 className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
                    Category Distribution
                  </h3>
                </div>
              </div>

              {!mounted ? (
                <div className="h-64 flex items-center justify-center">
                  <span className="text-xs text-aurelle-text-muted">Loading chart...</span>
                </div>
              ) : categoryData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-aurelle-text-muted">
                  No categorized items yet.
                </div>
              ) : (
                <div className="h-64 w-full flex flex-col justify-between">
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          innerRadius={45}
                          outerRadius={68}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            borderColor: "#E4EAF0",
                            borderRadius: "10px",
                            fontSize: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center pt-2 border-t border-aurelle-border/60">
                    {categoryData.map((cat) => (
                      <div
                        key={cat.name}
                        className="flex items-center gap-1.5 text-[11px] text-aurelle-navy-text dark:text-aurelle-dark-text"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.name}</span>
                        <span className="text-aurelle-text-muted">({cat.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
