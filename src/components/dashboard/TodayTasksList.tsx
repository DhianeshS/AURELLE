"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store-context";
import { getLocalDateString } from "@/lib/utils";
import { CheckSquare, Plus, ArrowRight, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { TaskModal } from "@/components/tasks/TaskModal";

export function TodayTasksList() {
  const { tasks, toggleTask } = useStore();
  const todayStr = getLocalDateString();
  const [modalOpen, setModalOpen] = useState(false);

  const tasksToday = tasks.filter((t) => t.dueDate === todayStr);

  return (
    <div className="bg-white dark:bg-aurelle-dark-card border border-aurelle-border dark:border-aurelle-dark-border rounded-xl p-5 shadow-soft flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-aurelle-warning" />
            <h2 className="text-base font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
              Today&apos;s Focus Tasks
            </h2>
          </div>
          <Link
            href="/tasks"
            className="text-xs text-aurelle-text-muted hover:text-aurelle-action-blue flex items-center gap-1 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {tasksToday.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted mb-3">
              No tasks due today. Everything is clear.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-aurelle-action-blue bg-aurelle-bg-secondary dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg hover:border-aurelle-action-blue transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasksToday.map((task) => (
              <div
                key={task.id}
                className={`p-3 rounded-xl border transition-all ${
                  task.completed
                    ? "bg-aurelle-bg/50 dark:bg-aurelle-dark-surface/40 border-aurelle-border/60"
                    : "bg-white dark:bg-aurelle-dark-card border-aurelle-border dark:border-aurelle-dark-border hover:border-aurelle-action-blue/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-4 h-4 mt-0.5 rounded text-aurelle-action-blue focus:ring-aurelle-action-blue border-aurelle-border dark:border-aurelle-dark-border cursor-pointer accent-aurelle-action-blue"
                  />
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium ${
                        task.completed
                          ? "line-through text-aurelle-text-muted"
                          : "text-aurelle-navy-text dark:text-aurelle-dark-text"
                      }`}
                    >
                      {task.title}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-aurelle-text-muted dark:text-aurelle-dark-text-muted">
                      <span className="px-1.5 py-0.5 bg-aurelle-bg dark:bg-aurelle-dark-surface rounded text-[10px]">
                        {task.category}
                      </span>

                      {/* Accessible priority tag with text and icon */}
                      <span
                        className={`inline-flex items-center gap-1 font-medium capitalize text-[10px] ${
                          task.priority === "high"
                            ? "text-aurelle-error"
                            : task.priority === "medium"
                            ? "text-aurelle-warning"
                            : "text-aurelle-text-muted"
                        }`}
                      >
                        {task.priority === "high" && <AlertCircle className="w-3 h-3" />}
                        {task.priority} priority
                      </span>

                      {task.dueTime && (
                        <span className="flex items-center gap-1 text-[10px]">
                          <Clock className="w-3 h-3" />
                          {task.dueTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} defaultDate={todayStr} />
    </div>
  );
}
