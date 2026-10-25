"use client";

import React, { useState, useMemo } from "react";
import { Modal } from "./Modal";
import { useStore } from "@/lib/store-context";
import { useRouter } from "next/navigation";
import { Search, CheckCircle2, Circle, Flame, Target, Calendar, ArrowRight } from "lucide-react";
import { formatDisplayDate } from "@/lib/utils";

export function SearchModal() {
  const { searchOpen, setSearchOpen, habits, tasks, goals } = useStore();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmed) return { habits: [], tasks: [], goals: [] };

    const matchedHabits = habits.filter(
      (h) =>
        h.name.toLowerCase().includes(trimmed) ||
        (h.description && h.description.toLowerCase().includes(trimmed)) ||
        h.category.toLowerCase().includes(trimmed)
    );

    const matchedTasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(trimmed) ||
        (t.description && t.description.toLowerCase().includes(trimmed)) ||
        t.category.toLowerCase().includes(trimmed)
    );

    const matchedGoals = goals.filter(
      (g) =>
        g.title.toLowerCase().includes(trimmed) ||
        (g.description && g.description.toLowerCase().includes(trimmed)) ||
        g.category.toLowerCase().includes(trimmed) ||
        g.milestones.some((m) => m.title.toLowerCase().includes(trimmed))
    );

    return { habits: matchedHabits, tasks: matchedTasks, goals: matchedGoals };
  }, [trimmed, habits, tasks, goals]);

  const totalResults =
    results.habits.length + results.tasks.length + results.goals.length;

  const navigateTo = (path: string) => {
    setSearchOpen(false);
    setQuery("");
    router.push(path);
  };

  return (
    <Modal
      isOpen={searchOpen}
      onClose={() => {
        setSearchOpen(false);
        setQuery("");
      }}
      maxWidth="lg"
    >
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-aurelle-text-muted absolute left-3.5" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search habits, tasks, goals, categories..."
            className="w-full pl-11 pr-4 py-3 bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-xl text-sm text-aurelle-navy-text dark:text-aurelle-dark-text placeholder:text-aurelle-text-muted focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
          />
        </div>

        {/* Results Area */}
        <div className="max-h-[380px] overflow-y-auto space-y-4 pt-1">
          {!trimmed && (
            <div className="py-8 text-center text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
              Type to search across all your records. Press Esc to close.
            </div>
          )}

          {trimmed && totalResults === 0 && (
            <div className="py-8 text-center text-sm text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
              No matching records found for &ldquo;{query}&rdquo;.
            </div>
          )}

          {/* Habits Section */}
          {results.habits.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-aurelle-text-muted dark:text-aurelle-dark-text-muted px-2 mb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-aurelle-action-blue" />
                <span>Habits ({results.habits.length})</span>
              </div>
              <div className="space-y-1">
                {results.habits.map((habit) => (
                  <button
                    key={habit.id}
                    onClick={() => navigateTo("/habits")}
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-surface transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium text-aurelle-navy-text dark:text-aurelle-dark-text group-hover:text-aurelle-action-blue transition-colors">
                        {habit.name}
                      </div>
                      <div className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted flex items-center gap-2 mt-0.5">
                        <span className="px-1.5 py-0.5 bg-aurelle-bg dark:bg-aurelle-dark-card rounded text-[10px]">
                          {habit.category}
                        </span>
                        <span>{habit.schedule.type}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-aurelle-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {results.tasks.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-aurelle-text-muted dark:text-aurelle-dark-text-muted px-2 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-aurelle-success" />
                <span>Tasks ({results.tasks.length})</span>
              </div>
              <div className="space-y-1">
                {results.tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => navigateTo("/tasks")}
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-surface transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-aurelle-success shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-aurelle-text-muted shrink-0" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            task.completed
                              ? "line-through text-aurelle-text-muted"
                              : "text-aurelle-navy-text dark:text-aurelle-dark-text group-hover:text-aurelle-action-blue"
                          } transition-colors`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <div className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted flex items-center gap-2 mt-1 ml-6">
                        <span className="capitalize">{task.priority} priority</span>
                        <span>•</span>
                        <span>Due {formatDisplayDate(task.dueDate)}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-aurelle-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Goals Section */}
          {results.goals.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-aurelle-text-muted dark:text-aurelle-dark-text-muted px-2 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-aurelle-warning" />
                <span>Goals ({results.goals.length})</span>
              </div>
              <div className="space-y-1">
                {results.goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => navigateTo("/goals")}
                    className="w-full text-left flex items-center justify-between p-3 rounded-lg hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-surface transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium text-aurelle-navy-text dark:text-aurelle-dark-text group-hover:text-aurelle-action-blue transition-colors">
                        {goal.title}
                      </div>
                      <div className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted flex items-center gap-2 mt-0.5">
                        <span className="px-1.5 py-0.5 bg-aurelle-bg dark:bg-aurelle-dark-card rounded text-[10px]">
                          {goal.category}
                        </span>
                        <span>
                          {goal.milestones.filter((m) => m.completed).length} / {goal.milestones.length} milestones
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-aurelle-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
