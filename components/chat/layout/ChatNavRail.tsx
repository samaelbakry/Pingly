"use client";

import { Archive, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ChatNavRailProps {
  setShowArchived: Dispatch<SetStateAction<boolean>>;
  showArchived: boolean;
}

export default function ChatNavRail({
  showArchived = false,
  setShowArchived,
}: ChatNavRailProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isChatsActive = pathname === "/chatDashboard" && !showArchived;
  const isProfileActive = pathname === "/userProfile";

  const avatarContent = user?.photoURL ? (
    <img
      src={user.photoURL}
      alt={user.displayName || "User profile"}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  ) : (
    <span className="text-xs font-bold uppercase tracking-wider">
      {user?.displayName?.trim()?.charAt(0) ||
        user?.email?.charAt(0) ||
        "U"}
    </span>
  );

  return (
    <>
      <aside
        className="
          hidden h-full w-18 shrink-0 flex-col items-center justify-between
          rounded-full border border-black/5 bg-white/60 p-3 py-5
          shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] backdrop-blur-2xl
          transition-all duration-300
          dark:border-white/10 dark:bg-zinc-950/60 dark:shadow-none md:flex
        "
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative group flex items-center">
            <Link
              href="/chatDashboard"
              onClick={() => setShowArchived(false)}
              aria-label="Chats"
              aria-current={isChatsActive ? "page" : undefined}
              className={`
                relative flex size-12 items-center justify-center rounded-full
                transition-all duration-300 hover:-translate-y-0.5 active:scale-95
                ${
                  isChatsActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/35"
                    : "text-zinc-500 hover:bg-orange-500/10 hover:text-orange-600 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-orange-400"
                }
              `}
            >
              <MessageCircle className="size-5 transition-transform duration-300 group-hover:scale-110" />
            </Link>
          </div>

          <div className="relative group flex items-center">
            <button
              type="button"
              onClick={() => setShowArchived((prev) => !prev)}
              aria-label="Archived chats"
              aria-pressed={showArchived}
              className={`
                relative flex size-12 items-center justify-center rounded-full
                transition-all duration-300 hover:-translate-y-0.5 active:scale-95
                ${
                  showArchived
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/35"
                    : "text-zinc-500 hover:bg-orange-500/10 hover:text-orange-600 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-orange-400"
                }
              `}
            >
              <Archive className="size-5 transition-transform duration-300 group-hover:scale-110" />
            </button>

          </div>
        </div>

        <div className="relative group flex items-center">
          <Link
            href="/userProfile"
            onClick={() => setShowArchived(false)}
            aria-label="User profile"
            aria-current={isProfileActive ? "page" : undefined}
            className={`
              relative flex size-11 items-center justify-center overflow-hidden rounded-full
              p-[2px] transition-all duration-300 hover:scale-105 active:scale-95
              ${
                isProfileActive
                  ? "bg-linear-to-tr from-orange-500 via-amber-500 to-amber-300 shadow-md shadow-orange-500/20"
                  : "bg-zinc-200 hover:bg-orange-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              }
            `}
          >
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-orange-100 text-orange-700 dark:bg-zinc-900 dark:text-orange-400">
              {avatarContent}
            </div>
          </Link>

        </div>
      </aside>

      <nav
        aria-label="Main navigation"
        className="fixed bottom-4 left-0 right-0 z-50 px-6 pb-safe md:hidden"
      >
        <div
          className="
            mx-auto flex h-16 w-full max-w-xs
            items-center justify-between rounded-full border
            border-black/5 bg-white/80 px-6 shadow-[0_12px_40px_rgba(0,0,0,0.12)]
            backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/80 dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]
          "
        >
          <Link
            href="/chatDashboard"
            onClick={() => setShowArchived(false)}
            aria-label="Chats"
            aria-current={isChatsActive ? "page" : undefined}
            className="relative flex flex-col items-center justify-center active:scale-90"
          >
            <div
              className={`
                flex size-10 items-center justify-center rounded-full transition-all duration-300
                ${
                  isChatsActive
                    ? "text-orange-500"
                    : "text-zinc-400 dark:text-zinc-500"
                }
              `}
            >
              <MessageCircle className="size-5" />
            </div>
            {isChatsActive && (
              <span className="absolute -bottom-1 size-1 rounded-full bg-orange-500 shadow-sm shadow-orange-500" />
            )}
          </Link>

          <button
            type="button"
            onClick={() => setShowArchived((prev) => !prev)}
            aria-label="Archived chats"
            aria-pressed={showArchived}
            className="relative flex flex-col items-center justify-center active:scale-90"
          >
            <div
              className={`
                flex size-10 items-center justify-center rounded-full transition-all duration-300
                ${
                  showArchived
                    ? "text-orange-500"
                    : "text-zinc-400 dark:text-zinc-500"
                }
              `}
            >
              <Archive className="size-5" />
            </div>
            {showArchived && (
              <span className="absolute -bottom-1 size-1 rounded-full bg-orange-500 shadow-sm shadow-orange-500" />
            )}
          </button>

          <Link
            href="/userProfile"
            onClick={() => setShowArchived(false)}
            aria-label="User profile"
            aria-current={isProfileActive ? "page" : undefined}
            className={`
              relative flex size-9 items-center justify-center overflow-hidden rounded-full
              p-[2px] transition-all duration-300 active:scale-90
              ${
                isProfileActive
                  ? "bg-linear-to-tr from-orange-500 to-amber-500"
                  : "bg-zinc-200 dark:bg-zinc-700"
              }
            `}
          >
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-orange-100 text-orange-700 dark:bg-zinc-900 dark:text-orange-400">
              {avatarContent}
            </div>
          </Link>
        </div>
      </nav>
    </>
  );
}