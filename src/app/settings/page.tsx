"use client";

import React, { useState, useRef } from "react";
import { useStore } from "@/lib/store-context";
import {
  ThemePreference,
  WeekStartPreference,
  DateFormatPreference,
  ApplicationData,
} from "@/types";
import { storageService } from "@/lib/storage";
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export default function SettingsPage() {
  const {
    preferences,
    updatePreferences,
    exportBackup,
    importBackup,
    resetAllData,
    loadStarterData,
    showToast,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [importPendingData, setImportPendingData] = useState<ApplicationData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const validation = storageService.validateImport(content);

      if (!validation.success || !validation.data) {
        setImportError(validation.error || "Failed to validate imported file.");
      } else {
        setImportPendingData(validation.data);
      }
    };
    reader.readAsText(file);
    // Reset file input so user can choose the same file again if desired
    e.target.value = "";
  };

  const handleConfirmImport = () => {
    if (importPendingData) {
      importBackup(importPendingData);
      setImportPendingData(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase tracking-widest font-semibold text-aurelle-action-blue">
            Preferences & Controls
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
          Settings
        </h1>
        <p className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted mt-1">
          Configure your local sanctuary, aesthetic theme, and data backups.
        </p>
      </div>

      {/* 1. Profile / Personalization */}
      <div className="p-6 rounded-2xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-soft space-y-4">
        <h2 className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
          Personal Identity
        </h2>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
            Your Name (Used in calm dashboard greetings)
          </label>
          <input
            type="text"
            value={preferences.userName || ""}
            onChange={(e) => updatePreferences({ userName: e.target.value })}
            placeholder="e.g. Lingesh"
            className="w-full max-w-md px-3.5 py-2 text-sm bg-aurelle-bg dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text placeholder:text-aurelle-text-muted focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
          />
        </div>
      </div>

      {/* 2. Appearance */}
      <div className="p-6 rounded-2xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-soft space-y-4">
        <h2 className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
          Aesthetic Appearance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md">
          {[
            { value: "light" as ThemePreference, label: "Light", icon: Sun },
            { value: "dark" as ThemePreference, label: "Dark", icon: Moon },
            { value: "system" as ThemePreference, label: "System", icon: Laptop },
          ].map((opt) => {
            const Icon = opt.icon;
            const isSelected = preferences.theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updatePreferences({ theme: opt.value })}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border-aurelle-action-blue ring-1 ring-aurelle-action-blue text-aurelle-action-blue shadow-soft"
                    : "bg-white dark:bg-aurelle-dark-card border-aurelle-border dark:border-aurelle-dark-border text-aurelle-text-muted hover:text-aurelle-navy-text"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. System Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-soft space-y-5">
        <h2 className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
          Regional & Interaction Preferences
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
              Week Starts On
            </label>
            <select
              value={preferences.weekStart}
              onChange={(e) =>
                updatePreferences({ weekStart: e.target.value as WeekStartPreference })
              }
              className="w-full px-3 py-2 text-xs bg-aurelle-bg dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text focus:outline-none focus:ring-1 focus:ring-aurelle-action-blue"
            >
              <option value="monday">Monday (ISO standard)</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
              Date Format
            </label>
            <select
              value={preferences.dateFormat}
              onChange={(e) =>
                updatePreferences({ dateFormat: e.target.value as DateFormatPreference })
              }
              className="w-full px-3 py-2 text-xs bg-aurelle-bg dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text focus:outline-none focus:ring-1 focus:ring-aurelle-action-blue"
            >
              <option value="MMM d, yyyy">Oct 25, 2026</option>
              <option value="yyyy-MM-dd">2026-10-25 (ISO)</option>
              <option value="dd/MM/yyyy">25/10/2026</option>
              <option value="MM/dd/yyyy">10/25/2026</option>
            </select>
          </div>
        </div>

        {/* Reduced motion toggle */}
        <div className="flex items-center justify-between max-w-lg pt-3 border-t border-aurelle-border/60">
          <div>
            <span className="text-xs font-semibold text-aurelle-navy-text dark:text-aurelle-dark-text block">
              Reduced Motion
            </span>
            <span className="text-[11px] text-aurelle-text-muted">
              Minimises decorative transitions and subtle animations.
            </span>
          </div>

          <button
            type="button"
            onClick={() => updatePreferences({ reducedMotion: !preferences.reducedMotion })}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              preferences.reducedMotion ? "bg-aurelle-action-blue" : "bg-aurelle-border dark:bg-aurelle-dark-border"
            }`}
            role="switch"
            aria-checked={preferences.reducedMotion}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${
                preferences.reducedMotion ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. Local Storage & Backups */}
      <div className="p-6 rounded-2xl bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border shadow-soft space-y-4">
        <h2 className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
          Data Architecture & Backups
        </h2>

        {/* Notice on browser storage */}
        <div className="p-4 bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface rounded-xl border border-aurelle-border/70 dark:border-aurelle-dark-border text-xs text-aurelle-navy-text dark:text-aurelle-dark-text space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-aurelle-action-blue">
            <ShieldCheck className="w-4 h-4" />
            <span>Private Local Storage Notice</span>
          </div>
          <p className="text-[11px] text-aurelle-text-muted dark:text-aurelle-dark-text-muted leading-relaxed">
            AURELLE operates without external database synchronisation in this version.
            Your habits, tasks, and goals exist solely within this browser profile.
            Clearing your browser cache or site data will remove your saved records.
            We recommend exporting periodic JSON backups below.
          </p>
        </div>

        {importError && (
          <div className="p-3 text-xs text-aurelle-error bg-aurelle-error/10 border border-aurelle-error/20 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        {/* Actions grid */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Export button */}
          <button
            type="button"
            onClick={exportBackup}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white bg-aurelle-action-blue hover:bg-aurelle-action-hover rounded-lg shadow-action-glow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-aurelle-navy-text dark:text-aurelle-dark-text bg-white dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border hover:bg-aurelle-bg-secondary rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import Backup</span>
          </button>

          {/* Reset all data button */}
          <button
            type="button"
            onClick={() => setConfirmClearOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-aurelle-error hover:bg-aurelle-error/10 rounded-lg transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation for Import */}
      <ConfirmDialog
        isOpen={importPendingData !== null}
        onClose={() => setImportPendingData(null)}
        onConfirm={handleConfirmImport}
        title="Confirm Data Import"
        message={`This backup contains ${importPendingData?.habits.length || 0} habits, ${
          importPendingData?.tasks.length || 0
        } tasks, and ${
          importPendingData?.goals.length || 0
        } goals. Importing will replace your current workspace records with this file.`}
        confirmLabel="Replace and Import"
        isDestructive={false}
      />

      {/* Confirmation for Clear All */}
      <ConfirmDialog
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={resetAllData}
        title="Clear All Local Data"
        message="Are you certain you wish to purge all habits, tasks, completions, and goals from this browser? This action is irrevocable."
        confirmLabel="Erase Everything"
        isDestructive
      />
    </div>
  );
}
