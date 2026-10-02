"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";
import { listenToUserPresence } from "@/services/presence";

type Props = {
  selectedUser: UserProfile | null;
  selectedGroup: ChatItem | null;
  isGroupChat: boolean;
  groupMembers: UserProfile[];
};

type Presence = {
  state: "online" | "offline";
  lastSeen?: number;
};

export default function ChatProfileAvatar({
  selectedUser,
  selectedGroup,
  isGroupChat,
  groupMembers
}: Props) {
  const [presence, setPresence] = useState<Presence | null>(null);

  useEffect(() => {
    if (isGroupChat || !selectedUser?.uid) {
      return;
    }

    const unsubscribe = listenToUserPresence(
      selectedUser.uid,
      (currentPresence) => {
        setPresence(currentPresence);
      },
    );

    return () => unsubscribe();
  }, [selectedUser?.uid, isGroupChat]);

  const displayName = isGroupChat
    ? selectedGroup?.name || "Unnamed Group"
    : selectedUser?.name || "Unknown User";

  const displayPhoto = isGroupChat
    ? selectedGroup?.photoURL || ""
    : selectedUser?.photoURL || "";

  const isOnline = presence?.state === "online";

  return (
    <><div className="group flex items-center gap-3.5 py-1.5 px-2 rounded-xl transition-all duration-200 hover:bg-slate-100/60 dark:hover:bg-zinc-800/50 cursor-pointer">
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10 ring-2 ring-slate-200/60 dark:ring-zinc-700/60 transition-transform duration-300 group-hover:scale-105">
          <AvatarImage
            src={displayPhoto}
            alt={displayName}
            className="object-cover"
          />
          <AvatarFallback
            className={
              isGroupChat
                ? "bg-linear-to-br from-indigo-500 to-purple-600 font-semibold text-white text-xs tracking-wider"
                : "bg-linear-to-br from-amber-500 to-rose-500 font-semibold text-white text-xs tracking-wider"
            }
          >
            {displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-100 truncate">
          {displayName}
        </h2>
        <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 truncate mt-0.5">
          {isGroupChat ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="text-purple-600 dark:text-purple-400 font-medium">
                {groupMembers.length} {groupMembers.length === 1 ? "member" : "members"}
              </span>
              <span className="text-slate-300 dark:text-zinc-600">•</span>
              <span className="truncate text-slate-400 dark:text-zinc-500">
                {groupMembers.map((m) => m.name).join(", ") || "No members"}
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`inline-block size-2 rounded-full ${
                  isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400 dark:bg-zinc-500"
                }`}
              />
              {isOnline ? "Active now" : "Offline"}
            </span>
          )}
        </p>
      </div>
    </div>
    </>
  );
}
