"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Flame,
  CheckSquare,
  Target,
  MoreHorizontal,
  Calendar,
  BarChart3,
  Settings,
  ShieldCheck,
  FileText,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRIMARY_MOBILE_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/habits", label: "Habits", icon: Flame },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/goals", label: "Goals", icon: Target },
];

const SECONDARY_MOBILE_ITEMS = [
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
  { href: "/terms", label: "Terms & Conditions", icon: FileText },
];

export function MobileNav() {
  const pathname = usePathname();
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-aurelle-dark-card/95 backdrop-blur-md border-t border-aurelle-border dark:border-aurelle-dark-border px-2 py-1.5 transition-colors"
        aria-label="Mobile Navigation"
      >
        <div className="flex items-center justify-around">
          {PRIMARY_MOBILE_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-colors min-w-[56px]",
                  isActive
                    ? "text-aurelle-action-blue font-semibold"
                    : "text-aurelle-text-muted hover:text-aurelle-navy-text dark:hover:text-aurelle-dark-text"
                )}
              >
                <Icon className="w-5 h-5 mb-0.5 stroke-[1.75]" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreDrawerOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-colors min-w-[56px]",
              moreDrawerOpen || ["/calendar", "/analytics", "/settings", "/privacy", "/terms"].includes(pathname)
                ? "text-aurelle-action-blue font-semibold"
                : "text-aurelle-text-muted hover:text-aurelle-navy-text dark:hover:text-aurelle-dark-text"
            )}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5 stroke-[1.75]" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* More Navigation Drawer */}
      {moreDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-[#1F3045]/40 backdrop-blur-sm"
            onClick={() => setMoreDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white dark:bg-aurelle-dark-card rounded-t-2xl border-t border-aurelle-border dark:border-aurelle-dark-border p-5 pb-8 shadow-card z-10 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60 mb-3">
              <span className="text-sm font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
                Navigation & Preferences
              </span>
              <button
                type="button"
                onClick={() => setMoreDrawerOpen(false)}
                className="p-1 rounded-md text-aurelle-text-muted hover:text-aurelle-navy-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              {SECONDARY_MOBILE_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreDrawerOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface text-aurelle-action-blue font-semibold"
                        : "text-aurelle-navy-text dark:text-aurelle-dark-text hover:bg-aurelle-bg/80 dark:hover:bg-aurelle-dark-surface/60"
                    )}
                  >
                    <Icon className="w-4 h-4 text-aurelle-text-muted" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
