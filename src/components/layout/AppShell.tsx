"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { MobileNav } from "./MobileNav";
import { SearchModal } from "@/components/common/SearchModal";
import { QuickAddModal } from "@/components/common/QuickAddModal";
import { Toast } from "@/components/common/Toast";
import { useStore } from "@/lib/store-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useStore();

  return (
    <div className="min-h-screen flex bg-aurelle-bg dark:bg-aurelle-dark-bg text-aurelle-navy-text dark:text-aurelle-dark-text antialiased font-sans transition-colors duration-200">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* Top Navigation */}
        <TopNav />

        {/* Dynamic Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto">
          {!isLoaded ? (
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-aurelle-action-blue border-t-transparent animate-spin" />
                <span className="text-xs text-aurelle-text-muted font-serif">
                  A U R E L L E
                </span>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals & Notifications */}
      <SearchModal />
      <QuickAddModal />
      <Toast />
    </div>
  );
}
