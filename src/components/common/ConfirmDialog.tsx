"use client";

import React from "react";
import { Modal } from "./Modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        {isDestructive && (
          <div className="w-12 h-12 rounded-xl bg-aurelle-error/10 text-aurelle-error flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
        )}
        <h3 className="text-lg font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text mb-2">
          {title}
        </h3>
        <p className="text-sm text-aurelle-text-muted dark:text-aurelle-dark-text-muted mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 text-sm font-medium text-aurelle-navy-text dark:text-aurelle-dark-text bg-white dark:bg-aurelle-dark-surface border border-aurelle-border dark:border-aurelle-dark-border rounded-lg hover:bg-aurelle-bg-secondary dark:hover:bg-aurelle-dark-card transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-colors ${
              isDestructive
                ? "bg-aurelle-error text-white hover:bg-aurelle-error/90 shadow-sm"
                : "bg-aurelle-action-blue text-white hover:bg-aurelle-action-hover shadow-action-glow"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
