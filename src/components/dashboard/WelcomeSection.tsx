"use client";

import React, { useMemo } from "react";
import { useStore } from "@/lib/store-context";
import { format } from "date-fns";

export function WelcomeSection() {
  const { preferences } = useStore();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const motivationalThought = useMemo(() => {
    const thoughts = [
      "Make today count.",
      "Clarity precedes mastery.",
      "Consistency is the highest form of self-respect.",
      "Small rituals, compounded daily.",
      "Breathe, focus, and move with intention.",
    ];
    // deterministic based on day of month
    const day = new Date().getDate();
    return thoughts[day % thoughts.length];
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-widest font-semibold text-aurelle-action-blue">
            Daily Sanctuary
          </span>
          <span className="text-xs text-aurelle-text-muted">•</span>
          <span className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
            {format(new Date(), "EEEE, MMMM d")}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
          {greeting}
          {preferences.userName ? `, ${preferences.userName}` : "."}
        </h1>
      </div>

      <div className="text-xs sm:text-right text-aurelle-text-muted dark:text-aurelle-dark-text-muted italic font-serif">
        &ldquo;{motivationalThought}&rdquo;
      </div>
    </div>
  );
}
