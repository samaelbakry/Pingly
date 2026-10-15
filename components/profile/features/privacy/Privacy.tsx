import { ShieldCheck } from "lucide-react";
import ReadRecepts from "./readRecepts";
import BlockedUsers from "./blockedUsers";
import PrivacyVisibility from "./privacyVisibility";

export default function Privacy() {
  return (
    <section className="relative flex chat-scroll h-full min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-50 mx-auto w-full max-w-7xl">
        <header className="mb-8 flex items-center justify-between gap-4 border-b border-zinc-200/70 pb-6 dark:border-zinc-800">
          <div className="flex min-w-0 items-stretch gap-4">
            <div className="w-1 shrink-0 rounded-full bg-linear-to-b from-orange-500 to-amber-300" />

            <div className="min-w-0 py-1">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-orange-500">
                Privacy & security
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
                Privacy
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Manage your blocked contacts and privacy preferences.
              </p>
            </div>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/70 text-zinc-600 shadow-sm transition-all duration-300 hover:border-orange-500/30 hover:bg-orange-500/5 hover:text-orange-500 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300">
            <ShieldCheck className="h-5 w-5" strokeWidth={1.7} />
          </div>
        </header>

        <PrivacyVisibility />
        <ReadRecepts />
        <BlockedUsers />
      </div>
    </section>
  );
}
