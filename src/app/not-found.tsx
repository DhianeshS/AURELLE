import React from "react";
import Link from "next/link";
import { BrandSymbol } from "@/components/brand/BrandLogo";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
      <div className="mb-6">
        <BrandSymbol size="lg" />
      </div>

      <span className="text-xs font-semibold tracking-widest uppercase text-aurelle-action-blue mb-2">
        Error 404
      </span>

      <h1 className="text-3xl sm:text-4xl font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text mb-3">
        Space Not Found
      </h1>

      <p className="max-w-md text-sm text-aurelle-text-muted dark:text-aurelle-dark-text-muted mb-8 leading-relaxed">
        The sanctuary page you are seeking does not exist or has been relocated.
        Take a breath and return to your daily center.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-white bg-aurelle-action-blue hover:bg-aurelle-action-hover rounded-lg shadow-action-glow transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
