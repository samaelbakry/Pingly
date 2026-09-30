"use client";

import { Archive, MessageCircle, UserRound } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";

interface ChatNavRailProps {
  setShowArchived: Dispatch<SetStateAction<boolean>>;
  showArchived: boolean;
}

export default function ChatNavRail({
  showArchived = false,
  setShowArchived,
}: ChatNavRailProps) {
  const pathname = usePathname();

  const isChatsActive = pathname === "/chatDashboard" && !showArchived;
  const isProfileActive = pathname === "/userProfile" && !showArchived;

  return (
    <aside className="hidden h-full w-20 shrink-0 flex-col items-center justify-between rounded-4xl border border-white/90 bg-white/70 py-5 shadow-xl shadow-slate-900/5 backdrop-blur-2xl transition-all duration-300 dark:border-zinc-800/80 dark:bg-zinc-900/70 sm:flex">
      
      <div className="flex w-full flex-col items-center gap-3 px-3">

        <Link
          href="/chatDashboard"
          onClick={() => setShowArchived(false)}
          className={`group relative flex size-11 items-center justify-center rounded-2xl transition-all duration-300 ${
            isChatsActive
              ? "scale-105 bg-linear-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
              : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
          }`}
        >
          <MessageCircle className="size-5 transition-transform duration-300 group-hover:scale-110" />
        </Link>

        <button
          type="button"
          onClick={() => setShowArchived((prev) => !prev)}
          className={`group relative flex size-11 items-center justify-center rounded-2xl transition-all duration-300 ${
            showArchived
              ? "scale-105 bg-linear-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
              : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
          }`}
        >
          <Archive className="size-5 transition-transform duration-300 group-hover:scale-110" />
        </button>

        <Link
          href="/userProfile"
          onClick={() => setShowArchived(false)}
          className={`group relative flex size-11 items-center justify-center rounded-2xl transition-all duration-300 ${
            isProfileActive
              ? "scale-105 bg-linear-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
              : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
          }`}
        >
          <UserRound className="size-5 transition-transform duration-300 group-hover:rotate-12" />
        </Link>

      </div>
    </aside>
  );
}