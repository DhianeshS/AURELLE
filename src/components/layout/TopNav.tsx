"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/lib/store-context";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Search, Plus, Moon, Sun } from "lucide-react";
import { format } from "date-fns";

export function TopNav() {
  const { setSearchOpen, setQuickAddOpen, preferences, updatePreferences } = useStore();
  const [currentDateFormatted, setCurrentDateFormatted] = useState("");

  useEffect(() => {
    // Format in client local time to prevent SSR hydration mismatch
    const now = new Date();
    setCurrentDateFormatted(format(now, "EEEE, MMMM d, yyyy"));
  }, []);

  const toggleTheme = () => {
    const nextTheme = preferences.theme === "dark" ? "light" : "dark";
    updatePreferences({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-aurelle-dark-card/80 backdrop-blur-md border-b border-aurelle-border dark:border-aurelle-dark-border px-4 sm:px-6 lg:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Mobile brand mark (desktop is in sidebar) */}
        <div className="lg:hidden flex items-center">
          <BrandLogo size="sm" />
        </div>

        {/* Search Bar Trigger */}
        <div className="flex-1 max-w-md hidden sm:block">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-aurelle-text-muted bg-aurelle-bg dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-xl hover:border-aurelle-action-blue/70 transition-all text-left shadow-soft"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-aurelle-text-muted" />
              <span>Search rituals, tasks, goals...</span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded text-[10px] font-mono text-aurelle-text-muted">
              <span>⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Mobile search icon button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-2 text-aurelle-navy-text dark:text-aurelle-dark-text hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-surface rounded-lg transition-colors"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Current Date Display */}
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
              {currentDateFormatted || "Today"}
            </span>
            <span className="text-[10px] text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
              Focused & Intentional
            </span>
          </div>

          <div className="h-6 w-px bg-aurelle-border dark:bg-aurelle-dark-border hidden md:block" />

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-aurelle-navy-text dark:text-aurelle-dark-text hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-surface rounded-lg border border-aurelle-border dark:border-aurelle-dark-border transition-colors"
            title={`Switch to ${preferences.theme === "dark" ? "Light" : "Dark"} theme`}
            aria-label="Toggle visual theme"
          >
            {preferences.theme === "dark" ? (
              <Sun className="w-4 h-4 text-aurelle-warning" />
            ) : (
              <Moon className="w-4 h-4 text-aurelle-navy-text" />
            )}
          </button>

          {/* Quick Add Action Button */}
          <button
            type="button"
            onClick={() => setQuickAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-aurelle-action-blue hover:bg-aurelle-action-hover rounded-lg shadow-action-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium">New</span>
          </button>
        </div>
      </div>
    </header>
  );
}
