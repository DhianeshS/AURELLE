"use client";

import React from "react";
import { useStore } from "@/lib/store-context";
import { CheckCircle2 } from "lucide-react";

export function Toast() {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#1F3045] dark:bg-white text-white dark:text-aurelle-navy-text rounded-xl shadow-card border border-white/10 dark:border-aurelle-border text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <CheckCircle2 className="w-4 h-4 text-aurelle-cotton-blue dark:text-aurelle-action-blue shrink-0" />
      <span>{toastMessage}</span>
    </div>
  );
}
