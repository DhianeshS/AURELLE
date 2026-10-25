"use client";

import React, { useMemo } from "react";
import { useStore } from "@/lib/store-context";
import { getLocalDateString, formatDisplayDate } from "@/lib/utils";
import { addDays } from "date-fns";
import { Clock, CheckSquare, Target, ArrowRight } from "lucide-react";
import Link from "next/link";

export function UpcomingDeadlines() {
  const { tasks, goals } = useStore();
  const todayStr = getLocalDateString();
  const next7DaysStr = getLocalDateString(addDays(new Date(), 7));

  const items = useMemo(() => {
    // Incomplete tasks due today or in the next 7 days, or overdue
    const upcomingTasks = tasks
      .filter((t) => !t.completed && t.dueDate <= next7DaysStr)
      .map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        type: "task" as const,
        priority: t.priority,
        category: t.category,
        isOverdue: t.dueDate < todayStr,
      }));

    // Active goals with target date within next 14 days or overdue
    const next14DaysStr = getLocalDateString(addDays(new Date(), 14));
    const upcomingGoals = goals
      .filter((g) => g.status === "active" && g.targetDate && g.targetDate <= next14DaysStr)
      .map((g) => ({
        id: g.id,
        title: g.title,
        dueDate: g.targetDate!,
        type: "goal" as const,
        category: g.category,
        isOverdue: g.targetDate! < todayStr,
      }));

    const combined = [...upcomingTasks, ...upcomingGoals].sort((a, b) =>
      a.dueDate.localeCompare(b.dueDate)
    );

    return combined.slice(0, 5);
  }, [tasks, goals, todayStr, next7DaysStr]);

  return (
    <div className="bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-xl p-5 shadow-soft">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-aurelle-error" />
          <h2 className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
            Upcoming Deadlines
          </h2>
        </div>
        <span className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
          Next 7 days
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-6 text-center text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
          No impending deadlines within the next 7 days. Enjoy the mental clarity.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.type === "task" ? "/tasks" : "/goals"}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-surface transition-colors group"
            >
              <div className="flex items-center gap-3 truncate">
                {item.type === "task" ? (
                  <CheckSquare className="w-4 h-4 text-aurelle-action-blue shrink-0" />
                ) : (
                  <Target className="w-4 h-4 text-aurelle-warning shrink-0" />
                )}
                <div className="truncate">
                  <div className="text-xs font-medium text-aurelle-navy-text dark:text-aurelle-dark-text group-hover:text-aurelle-action-blue truncate transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-aurelle-text-muted dark:text-aurelle-dark-text-muted flex items-center gap-2">
                    <span className="uppercase">{item.type}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                    item.isOverdue
                      ? "bg-aurelle-error/10 text-aurelle-error font-semibold"
                      : item.dueDate === todayStr
                      ? "bg-aurelle-warning/10 text-aurelle-warning font-semibold"
                      : "bg-aurelle-bg dark:bg-aurelle-dark-card text-aurelle-text-muted"
                  }`}
                >
                  {item.isOverdue
                    ? "Overdue"
                    : item.dueDate === todayStr
                    ? "Due Today"
                    : formatDisplayDate(item.dueDate)}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-aurelle-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
