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
};

type Presence = {
  state: "online" | "offline";
  lastSeen?: number;
};

export default function ChatProfileAvatar({
  selectedUser,
  selectedGroup,
  isGroupChat,
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
    <div className="relative shrink-0">
      <Avatar className="h-11 w-11 border-2 border-white dark:border-zinc-900 shadow-md shadow-slate-900/5 ring-1 ring-slate-200/80 dark:ring-zinc-700/80 transition-transform duration-300 hover:scale-105">
        <AvatarImage
          src={displayPhoto}
          alt={displayName}
          className="object-cover"
        />

        <AvatarFallback
          className={
            isGroupChat
              ? "bg-linear-to-br from-violet-500 via-purple-500 to-fuchsia-600 font-bold text-white text-sm tracking-wide"
              : "bg-linear-to-br from-amber-400 via-orange-500 to-rose-500 font-bold text-white text-sm tracking-wide"
          }
        >
          {displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {!isGroupChat && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm transition-colors duration-300 ${
            isOnline ? "bg-emerald-400" : "bg-zinc-400 dark:bg-zinc-600"
          }`}
        />
      )}

      {isGroupChat && (
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-purple-600 border-2 border-white dark:border-zinc-900 shadow-sm">
          <svg
            viewBox="0 0 24 24"
            className="h-2.5 w-2.5 fill-white"
          >
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        </span>
      )}
    </div>
  );
}