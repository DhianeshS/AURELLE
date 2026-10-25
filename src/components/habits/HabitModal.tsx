"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/common/Modal";
import { useStore } from "@/lib/store-context";
import { Habit, ScheduleType, TargetType } from "@/types";
import { getLocalDateString } from "@/lib/utils";

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit?: Habit | null;
}

const DAYS_OF_WEEK = [
  { day: 1, label: "M" },
  { day: 2, label: "T" },
  { day: 3, label: "W" },
  { day: 4, label: "T" },
  { day: 5, label: "F" },
  { day: 6, label: "S" },
  { day: 0, label: "S" },
];

const COLOR_OPTIONS = [
  { label: "Action Blue", value: "#78B9E8" },
  { label: "Vitality Green", value: "#5C9E82" },
  { label: "Amber Glow", value: "#C68C4D" },
  { label: "Cotton Blue", value: "#A9D6F5" },
  { label: "Deep Navy", value: "#1F3045" },
];

export function HabitModal({ isOpen, onClose, habitToEdit }: HabitModalProps) {
  const { addHabit, updateHabit, categories } = useStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Mindfulness");
  const [targetType, setTargetType] = useState<TargetType>("boolean");
  const [targetValue, setTargetValue] = useState<number>(10);
  const [unit, setUnit] = useState("mins");
  const [scheduleType, setScheduleType] = useState<ScheduleType>("daily");
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [startDate, setStartDate] = useState(getLocalDateString());
  const [color, setColor] = useState("#78B9E8");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setDescription(habitToEdit.description || "");
      setCategory(habitToEdit.category);
      setTargetType(habitToEdit.targetType);
      setTargetValue(habitToEdit.targetValue || 10);
      setUnit(habitToEdit.unit || "mins");
      setScheduleType(habitToEdit.schedule.type);
      setSelectedDays(habitToEdit.schedule.daysOfWeek);
      setStartDate(habitToEdit.startDate);
      setColor(habitToEdit.color || "#78B9E8");
    } else {
      setName("");
      setDescription("");
      setCategory(categories[0]?.name || "Mindfulness");
      setTargetType("boolean");
      setTargetValue(10);
      setUnit("mins");
      setScheduleType("daily");
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
      setStartDate(getLocalDateString());
      setColor("#78B9E8");
    }
    setError(null);
  }, [habitToEdit, categories, isOpen]);

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length === 1) return; // keep at least 1 day
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a habit name.");
      return;
    }

    let days = selectedDays;
    if (scheduleType === "daily") {
      days = [0, 1, 2, 3, 4, 5, 6];
    } else if (scheduleType === "weekdays") {
      days = [1, 2, 3, 4, 5];
    }

    if (habitToEdit) {
      updateHabit(habitToEdit.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        targetType,
        targetValue: targetType === "measurable" ? Number(targetValue) : undefined,
        unit: targetType === "measurable" ? unit.trim() : undefined,
        schedule: { type: scheduleType, daysOfWeek: days },
        startDate,
        color,
      });
    } else {
      addHabit({
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        targetType,
        targetValue: targetType === "measurable" ? Number(targetValue) : undefined,
        unit: targetType === "measurable" ? unit.trim() : undefined,
        schedule: { type: scheduleType, daysOfWeek: days },
        startDate,
        color,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={habitToEdit ? "Edit Habit" : "New Ritual"}
      description="Define a calm, repeatable action to cultivate consistency."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-aurelle-error bg-aurelle-error/10 border border-aurelle-error/20 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
            Habit Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning Stillness & Meditation"
            className="w-full px-3.5 py-2.5 text-sm bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text placeholder:text-aurelle-text-muted focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
            Description or Intention
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. 10 minutes of deep quiet before screens"
            className="w-full px-3.5 py-2.5 text-sm bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text placeholder:text-aurelle-text-muted focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text focus:outline-none focus:ring-2 focus:ring-aurelle-action-blue"
            />
          </div>
        </div>

        {/* Target Type */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
            Measurement
          </label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              type="button"
              onClick={() => setTargetType("boolean")}
              className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                targetType === "boolean"
                  ? "bg-aurelle-action-blue text-white border-aurelle-action-blue shadow-action-glow"
                  : "bg-white dark:bg-aurelle-dark-surface text-aurelle-navy-text dark:text-aurelle-dark-text border-aurelle-border dark:border-aurelle-dark-border"
              }`}
            >
              Simple Yes / No
            </button>
            <button
              type="button"
              onClick={() => setTargetType("measurable")}
              className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${
                targetType === "measurable"
                  ? "bg-aurelle-action-blue text-white border-aurelle-action-blue shadow-action-glow"
                  : "bg-white dark:bg-aurelle-dark-surface text-aurelle-navy-text dark:text-aurelle-dark-text border-aurelle-border dark:border-aurelle-dark-border"
              }`}
            >
              Measurable Target
            </button>
          </div>

          {targetType === "measurable" && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface rounded-lg border border-aurelle-border dark:border-aurelle-dark-border">
              <div>
                <label className="block text-[11px] font-medium text-aurelle-text-muted dark:text-aurelle-dark-text-muted mb-1">
                  Target Value
                </label>
                <input
                  type="number"
                  min="1"
                  value={targetValue}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-aurelle-text-muted dark:text-aurelle-dark-text-muted mb-1">
                  Unit (e.g. mins, pages, glasses)
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="mins"
                  className="w-full px-3 py-1.5 text-sm bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-lg text-aurelle-navy-text dark:text-aurelle-dark-text"
                />
              </div>
            </div>
          )}
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
            Frequency Schedule
          </label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {(["daily", "weekdays", "custom"] as ScheduleType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setScheduleType(type)}
                className={`py-2 px-2 text-xs font-medium rounded-lg border capitalize transition-all ${
                  scheduleType === type
                    ? "bg-aurelle-action-blue text-white border-aurelle-action-blue shadow-action-glow"
                    : "bg-white dark:bg-aurelle-dark-surface text-aurelle-navy-text dark:text-aurelle-dark-text border-aurelle-border dark:border-aurelle-dark-border"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {scheduleType === "custom" && (
            <div className="flex items-center justify-between gap-1 p-2 bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface rounded-lg border border-aurelle-border dark:border-aurelle-dark-border">
              {DAYS_OF_WEEK.map(({ day, label }, idx) => {
                const isSelected = selectedDays.includes(day);
                return (
                  <button
                    key={`${day}-${idx}`}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-aurelle-action-blue text-white shadow-sm"
                        : "bg-white dark:bg-aurelle-dark-card text-aurelle-text-muted hover:text-aurelle-navy-text border border-aurelle-border dark:border-aurelle-dark-border"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-aurelle-navy-text dark:text-aurelle-dark-text mb-1.5">
            Accent Palette
          </label>
          <div className="flex items-center gap-3">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setColor(c.value)}
                style={{ backgroundColor: c.value }}
                className={`w-7 h-7 rounded-lg transition-transform ${
                  color === c.value ? "ring-2 ring-offset-2 ring-aurelle-action-blue scale-110" : "opacity-80 hover:opacity-100"
                }`}
                title={c.label}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-aurelle-border/60 dark:border-aurelle-dark-border/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-medium text-aurelle-navy-text dark:text-aurelle-dark-text hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-surface rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-medium text-white bg-aurelle-action-blue hover:bg-aurelle-action-hover rounded-lg shadow-action-glow transition-all"
          >
            {habitToEdit ? "Save Changes" : "Create Habit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
