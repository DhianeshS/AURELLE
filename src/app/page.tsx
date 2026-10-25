"use client";

import React from "react";
import { useStore } from "@/lib/store-context";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { DailyProgressCards } from "@/components/dashboard/DailyProgressCards";
import { TodayHabitsList } from "@/components/dashboard/TodayHabitsList";
import { TodayTasksList } from "@/components/dashboard/TodayTasksList";
import { WeeklyProgressChart } from "@/components/dashboard/WeeklyProgressChart";
import { GoalsOverview } from "@/components/dashboard/GoalsOverview";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { Sparkles, Plus, Compass } from "lucide-react";

export default function DashboardPage() {
  const { habits, tasks, goals, setQuickAddOpen, loadStarterData } = useStore();

  const isBrandNewWorkspace =
    habits.length === 0 && tasks.length === 0 && goals.length === 0;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Editorial Welcome Header */}
      <WelcomeSection />

      {/* Brand new empty state greeting banner */}
      {isBrandNewWorkspace && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-aurelle-cotton-blue/20 text-aurelle-navy-text dark:text-aurelle-cotton-blue text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome to Aurelle</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
              Your intentional space awaits.
            </h2>
            <p className="text-xs sm:text-sm text-aurelle-text-muted dark:text-aurelle-dark-text-muted leading-relaxed">
              Organise your rituals, daily deep work, and long-term milestones in a
              calm, distraction-free environment. Everything is stored locally on this device.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setQuickAddOpen(true)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-aurelle-action-blue hover:bg-aurelle-action-hover rounded-lg shadow-action-glow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Item</span>
            </button>
            <button
              type="button"
              onClick={loadStarterData}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-aurelle-navy-text dark:text-aurelle-dark-text bg-aurelle-bg dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-card rounded-lg transition-all"
            >
              <Compass className="w-4 h-4 text-aurelle-action-blue" />
              <span>Load Starter Routine</span>
            </button>
          </div>
        </div>
      )}

      {/* Calculated Daily Statistics */}
      <DailyProgressCards />

      {/* Primary Bento Grid: Habits & Tasks for Today */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayHabitsList />
        <TodayTasksList />
      </div>

      {/* Weekly Rhythm Analytics */}
      <WeeklyProgressChart />

      {/* Secondary Bento Grid: Aspirations & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalsOverview />
        <UpcomingDeadlines />
      </div>
    </div>
  );
}
