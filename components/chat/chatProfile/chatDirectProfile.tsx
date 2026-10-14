"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ChatProfilePresence } from "@/hooks/chat/profile/useChatProfileAvatar";

type Props = {
  displayName: string;
  displayPhoto: string;
  presence: ChatProfilePresence | null;
  canSeePresence: boolean;
};

function formatLastSeen(timestamp?: number) {
  if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) {
    return "Offline";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Offline";
  }

  const now = new Date();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (date.toDateString() === now.toDateString()) {
    return `Last seen today at ${time}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) {
    return `Last seen yesterday at ${time}`;
  }

  const dateLabel = date.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });

  return `Last seen ${dateLabel} at ${time}`;
}

export default function ChatDirectProfile({
  displayName,
  displayPhoto,
  presence,
  canSeePresence,
}: Props) {

  return (
    <div
      className="
        group flex min-w-0 cursor-pointer items-center gap-2.5
        rounded-xl px-1.5 py-1.5 transition-all duration-200
        hover:bg-slate-100/60 sm:gap-3.5 sm:px-2
        dark:hover:bg-zinc-800/50
      "
    >
      <div className="relative shrink-0">
        <Avatar
          className="
            h-9 w-9 ring-2 ring-slate-200/60
            transition-transform duration-300 group-hover:scale-105
            sm:h-10 sm:w-10 dark:ring-zinc-700/60
          "
        >
          <AvatarImage
            src={displayPhoto || undefined}
            alt={displayName}
            className="object-cover"
          />

          <AvatarFallback className="bg-linear-to-br from-amber-500 to-rose-500 text-xs font-semibold tracking-wider text-white">
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="min-w-0 flex-1 overflow-hidden">
        <h2 className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
          {displayName}
        </h2>

        {canSeePresence && (
          <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">
            <span
              className={`inline-block size-2 shrink-0 rounded-full ${
                presence?.state === "online"
                  ? "animate-pulse bg-emerald-500"
                  : "bg-slate-400 dark:bg-zinc-500"
              }`}
            />

            <span className="truncate">
              {!presence
                ? "Loading status..."
                : presence.state === "online"
                  ? "Active now"
                  : formatLastSeen(presence.lastSeen)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
