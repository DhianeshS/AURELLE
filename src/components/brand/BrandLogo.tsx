"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function BrandSymbol({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const dimension = size === "sm" ? 28 : size === "lg" ? 40 : 34;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105",
        className
      )}
      style={{ width: dimension, height: dimension }}
      aria-label="AURELLE Insignia"
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Soft geometric rounded tile */}
        <rect
          x="2"
          y="2"
          width="36"
          height="36"
          rx="10"
          className="fill-white dark:fill-aurelle-dark-surface stroke-aurelle-border dark:stroke-aurelle-dark-border"
          strokeWidth="1.2"
        />
        {/* Harmonic geometric circles: Inner focal stillness & expansive outer aura */}
        <circle
          cx="20"
          cy="20"
          r="12"
          className="stroke-aurelle-cotton-blue dark:stroke-aurelle-cotton-blue/60"
          strokeWidth="1.4"
          strokeDasharray="2 3"
        />
        <circle
          cx="20"
          cy="20"
          r="7"
          className="stroke-aurelle-action-blue dark:stroke-aurelle-action-blue"
          strokeWidth="1.5"
        />
        {/* Central focal node - pure stillness */}
        <circle
          cx="20"
          cy="20"
          r="2.5"
          className="fill-aurelle-navy-text dark:fill-aurelle-dark-text"
        />
        {/* Subtle cardinal alignment ticks */}
        <line x1="20" y1="4.5" x2="20" y2="7.5" stroke="#78B9E8" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="20" y1="32.5" x2="20" y2="35.5" stroke="#78B9E8" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function BrandLogo({ className, showTagline = false, size = "md", href = "/" }: BrandLogoProps) {
  const content = (
    <div className={cn("group flex items-center gap-3 select-none", className)}>
      <BrandSymbol size={size} />
      <div className="flex flex-col">
        <span
          className={cn(
            "font-serif tracking-[0.16em] uppercase font-semibold text-aurelle-navy-text dark:text-aurelle-dark-text leading-none transition-colors",
            size === "sm" ? "text-base tracking-[0.14em]" : size === "lg" ? "text-2xl" : "text-lg"
          )}
        >
          Aurelle
        </span>
        {showTagline && (
          <span className="text-[10px] tracking-normal text-aurelle-text-muted dark:text-aurelle-dark-text-muted mt-0.5 font-sans font-normal">
            Make space for your best self.
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-aurelle-action-blue rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
