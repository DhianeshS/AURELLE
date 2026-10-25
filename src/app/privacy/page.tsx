import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — AURELLE",
  description:
    "A transparent explanation of AURELLE's client-side local storage architecture and privacy commitments.",
};

export default function PrivacyPage() {
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
          <ShieldCheck className="w-4 h-4 text-aurelle-action-blue" />
          <span className="text-xs uppercase tracking-widest font-semibold text-aurelle-action-blue">
            Transparency & Integrity
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-aurelle-navy-text dark:text-aurelle-dark-text">
          Privacy Policy
        </h1>
        <p className="text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted mt-1">
          Last updated: October 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-aurelle-navy-text dark:text-aurelle-dark-text leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-serif font-medium">1. Local-First Architecture</h2>
          <p className="text-aurelle-text-muted dark:text-aurelle-dark-text-muted text-xs leading-relaxed">
            AURELLE is intentionally constructed as a client-side web application. All records
            pertaining to your personal rituals, habits, completed dates, task lists, and
            aspirational milestones reside exclusively within your web browser&apos;s local storage
            (`localStorage`).
          </p>
          <p className="text-aurelle-text-muted dark:text-aurelle-dark-text-muted text-xs leading-relaxed">
            No personal productivity records are transmitted to, hosted on, or processed by an
            external cloud database or third-party analytics provider.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-medium">2. Data Persistence and Browser Limitations</h2>
          <p className="text-aurelle-text-muted dark:text-aurelle-dark-text-muted text-xs leading-relaxed">
            Because data is retained locally within your specific browser instance:
          </p>
          <ul className="list-disc pl-5 text-xs text-aurelle-text-muted dark:text-aurelle-dark-text-muted space-y-1">
            <li>Your information does not automatically synchronise across multiple devices or separate browsers.</li>
            <li>Purging your browser cache, clearing local website storage, or operating in private/incognito mode may irreversibly remove your stored records.</li>
            <li>We recommend taking advantage of the JSON Backup Export utility located in Settings.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-medium">3. Third-Party Services and Analytics</h2>
          <p className="text-aurelle-text-muted dark:text-aurelle-dark-text-muted text-xs leading-relaxed">
            The application does not embed surveillance pixels, behavioural tracking scripts, or
            commercial advertising cookies. Font assets may be fetched via standard Google Web Fonts
            CDNs to render typography accurately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-serif font-medium">4. User Autonomy & Deletion</h2>
          <p className="text-aurelle-text-muted dark:text-aurelle-dark-text-muted text-xs leading-relaxed">
            You retain absolute ownership and control over your records. You may export a complete,
            versioned JSON document of your data at any time or execute the &ldquo;Clear All Data&rdquo; command
            in Settings to immediately delete all application entries from your local browser memory.
          </p>
        </section>
      </div>
    </div>
  );
}
