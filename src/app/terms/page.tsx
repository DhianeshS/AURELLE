import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions — AURELLE",
  description:
    "Terms of usage and general conditions for the AURELLE personal productivity application.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-aurelle-border/60 dark:border-aurelle-dark-border/60">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-aurelle-text-muted hover:text-aurelle-action-blue mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-aurelle-action-blue" />
          <span className="text-xs uppercase tracking-widest font-semibold text-aurelle-action-blue">
            Product Terms
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
          Terms and Conditions
        </h1>
        <p className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted mt-1">
          Effective Date: October 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-aurelle-navy-text dark:text-aurelle-dark-text leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-serif font-medium">1. Agreement to Terms</h2>
          <p className="text-aurelle-text-muted dark:text-aurelle-dark-text-muted text-xs leading-relaxed">
            By accessing or utilising the AURELLE personal productivity software, you acknowledge and
            agree to be governed by these standard Terms and Conditions. If you do not concur with
            these conditions, you should cease interaction with the application.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-medium">2. Purpose of the Software</h2>
          <p className="text-aurelle-text-muted dark:text-aurelle-dark-text-muted text-xs leading-relaxed">
            AURELLE is provided strictly as a personal organisation, habit tracking, and goal
            reflection tool. The application does not provide clinical, psychological, medical, or
            legally binding planning advice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-medium">3. Data Backup Responsibility</h2>
          <p className="text-aurelle-text-muted dark:text-aurelle-dark-text-muted text-xs leading-relaxed">
            Because this iteration operates locally within your client browser environment, you are
            solely responsible for preserving and archiving backups of your information through the
            provided export functionality. AURELLE cannot retrieve data wiped due to browser cache
            clearing, operating system resets, or hardware loss.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-medium">4. Disclaimer of Warranties</h2>
          <p className="text-aurelle-text-muted dark:text-aurelle-dark-text-muted text-xs leading-relaxed">
            The software is delivered on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of
            any kind, whether express or implied, including fitness for a particular purpose or
            uninterrupted error-free performance.
          </p>
        </section>
      </div>
    </div>
  );
}
