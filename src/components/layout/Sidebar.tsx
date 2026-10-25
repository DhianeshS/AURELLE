"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  LayoutDashboard,
  Flame,
  CheckSquare,
  Target,
  Calendar,
  BarChart3,
  Settings,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/habits", label: "Habits", icon: Flame },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-aurelle-dark-card border-r border-aurelle-border dark:border-aurelle-dark-border h-screen sticky top-0 shrink-0 select-none z-30 transition-colors">
      {/* Brand Header */}
      <div className="p-6 pb-6 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
        <BrandLogo showTagline size="md" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto" aria-label="Main Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                isActive
                  ? "bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface text-aurelle-action-blue font-semibold shadow-soft"
                  : "text-aurelle-text-muted hover:text-aurelle-navy-text dark:hover:text-aurelle-dark-text hover:bg-aurelle-bg/80 dark:hover:bg-aurelle-dark-surface/60"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 bg-aurelle-action-blue rounded-r" />
              )}
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors stroke-[1.75]",
                  isActive
                    ? "text-aurelle-action-blue"
                    : "text-aurelle-text-muted group-hover:text-aurelle-navy-text dark:group-hover:text-aurelle-dark-text"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Storage info & Legal links footer */}
      <div className="p-4 border-t border-aurelle-border/60 dark:border-aurelle-dark-border/60 space-y-3">
        <div className="p-3 bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface/80 rounded-xl border border-aurelle-border/70 dark:border-aurelle-dark-border/70 text-[11px] text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
          <div className="flex items-center gap-1.5 font-medium text-aurelle-navy-text dark:text-aurelle-dark-text mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-aurelle-success animate-pulse" />
            <span>Local Browser Storage</span>
          </div>
          <p className="leading-tight text-[10px]">
            Your data is stored exclusively on this device.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-aurelle-text-muted px-1">
          <Link
            href="/privacy"
            className="hover:text-aurelle-navy-text dark:hover:text-aurelle-dark-text transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Privacy</span>
          </Link>
          <span>•</span>
          <Link
            href="/terms"
            className="hover:text-aurelle-navy-text dark:hover:text-aurelle-dark-text transition-colors flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            <span>Terms</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
