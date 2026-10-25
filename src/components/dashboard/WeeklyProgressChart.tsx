"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useStore } from "@/lib/store-context";
import { getLocalDateString, isHabitScheduledForDate } from "@/lib/utils";
import {
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
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";

export function WeeklyProgressChart() {
  const { habits, completions, tasks, preferences } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const weekData = useMemo(() => {
    const today = new Date();
    const weekStartsOn = preferences.weekStart === "sunday" ? 0 : 1;
    const start = startOfWeek(today, { weekStartsOn });
    const end = endOfWeek(today, { weekStartsOn });
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dStr = getLocalDateString(day);
      const dayLabel = format(day, "EEE");

      // Habits scheduled & completed on dStr
      const scheduledHabits = habits.filter(
        (h) => !h.archived && isHabitScheduledForDate(h, dStr)
      );
      const habitsDone = scheduledHabits.filter((h) => {
        const c = completions.find((comp) => comp.habitId === h.id && comp.date === dStr);
        return c && c.completed;
      }).length;

      // Tasks due & completed on dStr
      const tasksDue = tasks.filter((t) => t.dueDate === dStr);
      const tasksDone = tasksDue.filter((t) => t.completed).length;

      return {
        day: dayLabel,
        date: dStr,
        "Habits Completed": habitsDone,
        "Tasks Completed": tasksDone,
        totalActivity: habitsDone + tasksDone,
      };
    });
  }, [habits, completions, tasks, preferences.weekStart]);

  const totalWeeklyActivity = weekData.reduce((sum, d) => sum + d.totalActivity, 0);

  return (
    <div className="bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-xl p-5 shadow-soft">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-aurelle-action-blue" />
          <h2 className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
            Weekly Rhythm
          </h2>
        </div>
        <span className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
          {totalWeeklyActivity} actions logged this week
        </span>
      </div>

      {!mounted ? (
        <div className="h-60 flex items-center justify-center">
          <span className="text-xs text-aurelle-text-muted">Loading chart...</span>
        </div>
      ) : totalWeeklyActivity === 0 ? (
        <div className="h-60 flex flex-col items-center justify-center text-center p-4">
          <p className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted max-w-xs mb-2">
            No completed rituals or tasks recorded yet for this week.
          </p>
          <span className="text-[11px] text-aurelle-action-blue">
            Complete daily items to view your weekly cadence.
          </span>
        </div>
      ) : (
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="day"
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
                  boxShadow: "0 4px 12px rgba(31, 48, 69, 0.08)",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="Habits Completed" fill="#5C9E82" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="Tasks Completed" fill="#78B9E8" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
