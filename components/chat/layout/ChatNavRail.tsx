"use client";

import {
  Archive,
  MessageCircle,
  UserRound,
} from "lucide-react";
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

  const isChatsActive =
    pathname === "/chatDashboard" && !showArchived;

  const isProfileActive =
    pathname === "/userProfile" && !showArchived;

  return (
    <>
    
      <aside
        className="
          hidden
          h-full
          w-20
          shrink-0
          flex-col
          items-center
          rounded-2xl
          border
          border-zinc-200/80
          bg-white/55
          p-3
          shadow-[0_20px_70px_rgba(249,115,22,0.08)]
          backdrop-blur-2xl

          dark:border-zinc-800/80
          dark:bg-zinc-950/55
          dark:shadow-none

          md:flex
        "
      >
        <div className="flex w-full flex-col items-center gap-3 px-3">
          <Link
            href="/chatDashboard"
            onClick={() => setShowArchived(false)}
            className={`
              group
              flex
              size-11
              items-center
              justify-center
              rounded-4xl
              transition-all
              duration-300

              ${
                isChatsActive
                  ? "scale-105 bg-linear-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                  : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
              }
            `}
          >
            <MessageCircle className="size-5 transition-transform duration-300 group-hover:scale-110" />
          </Link>

          <button
            type="button"
            onClick={() =>
              setShowArchived((prev) => !prev)
            }
            className={`
              group
              flex
              size-11
              items-center
              justify-center
              rounded-4xl
              transition-all
              duration-300

              ${
                showArchived
                  ? "scale-105 bg-linear-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                  : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
              }
            `}
          >
            <Archive className="size-5 transition-transform duration-300 group-hover:scale-110" />
          </button>

          <Link
            href="/userProfile"
            onClick={() => setShowArchived(false)}
            className={`
              group
              flex
              size-11
              items-center
              justify-center
              rounded-4xl
              transition-all
              duration-300

              ${
                isProfileActive
                  ? "scale-105 bg-linear-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                  : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100"
              }
            `}
          >
            <UserRound className="size-5 transition-transform duration-300 group-hover:rotate-12" />
          </Link>
        </div>
      </aside>
      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          px-3
          pb-safe
          pt-2
          md:hidden
        "
      >
        <div
          className="
            mx-auto
            mb-3
            flex
            h-16
            w-full
            max-w-5xl
            items-center
            justify-between
            rounded-3xl
            border
            border-white/80
            bg-white/80
            px-3
            shadow-2xl
            shadow-slate-900/10
            backdrop-blur-2xl

            dark:border-zinc-800
            dark:bg-zinc-900/85
          "
        >
          <Link
            href="/chatDashboard"
            onClick={() => setShowArchived(false)}
            className={`
              group
              flex
              size-12
              items-center
              justify-center
              rounded-4xl
              transition-all
              duration-300

              ${
                isChatsActive
                  ? "bg-linear-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                  : "text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }
            `}
          >
            <MessageCircle className="size-5 transition-transform group-hover:scale-110" />
          </Link>

          <button
            type="button"
            onClick={() =>
              setShowArchived((prev) => !prev)
            }
            className={`
              group
              flex
              size-12
              items-center
              justify-center
              rounded-4xl
              transition-all
              duration-300

              ${
                showArchived
                  ? "bg-linear-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                  : "text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }
            `}
          >
            <Archive className="size-5 transition-transform group-hover:scale-110" />
          </button>

          <Link
            href="/userProfile"
            onClick={() => setShowArchived(false)}
            className={`
              group
              flex
              size-12
              items-center
              justify-center
              rounded-4xl
              transition-all
              duration-300

              ${
                isProfileActive
                  ? "bg-linear-to-tr from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                  : "text-slate-500 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }
            `}
          >
            <UserRound className="size-5 transition-transform group-hover:scale-110" />
          </Link>
        </div>
      </nav>
    </>
  );
}