import { ShieldCheck } from "lucide-react";
import ReadRecepts from "./readRecepts";
import BlockedUsers from "./blockedUsers";
import PrivacyVisibility from "./privacyVisibility";

export default function Privacy() {
  return (
    <section className="relative flex chat-scroll h-full min-h-0 w-full min-w-0 flex-col overflow-y-auto overflow-x-hidden rounded-[2.5rem] border border-white/40 bg-white/30 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-8">
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative z-50 mx-auto w-full max-w-7xl">
        <header className="flex items-center gap-4 border-b border-zinc-200/70 pb-5 dark:border-zinc-800 mb-2">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500/20 to-orange-500/5 text-orange-500 ring-1 ring-orange-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Privacy
            </h2>
            <p className="mt-0.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Manage your blocked contacts.
            </p>
          </div>
        </header>

        <PrivacyVisibility />
        <ReadRecepts />
        <BlockedUsers />
      </div>
    </section>
  );
}
