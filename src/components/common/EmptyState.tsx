"use client";

import React from "react";
import { LucideIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-aurelle-border dark:border-aurelle-dark-border rounded-xl bg-white/50 dark:bg-aurelle-dark-surface/40",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-aurelle-bg-secondary dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border flex items-center justify-center text-aurelle-action-blue mb-4">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>

      <h4 className="text-lg font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
        {title}
      </h4>

      <p className="max-w-md text-sm text-aurelle-text-muted dark:text-aurelle-dark-text-muted leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-aurelle-action-blue hover:bg-aurelle-action-hover rounded-lg shadow-action-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{actionLabel}</span>
          </button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-aurelle-navy-text dark:text-aurelle-dark-text bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-surface rounded-lg transition-all"
          >
            <span>{secondaryActionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
