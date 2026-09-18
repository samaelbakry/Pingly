"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";
import { ArchiveRestore } from "lucide-react";

export default function ChatListCard({
  chat,
  chatUsers,
  selectedUserId,
  handleSelectChat,
  showArchived,
  onUnarchive,
}: {
  chat: ChatItem;
  chatUsers: Record<string, UserProfile>;
  selectedUserId?: string;
  handleSelectChat: (
    currentUserID: string,
    user: UserProfile
  ) => Promise<void>;
  showArchived: boolean;
  onUnarchive: (chatId: string) => Promise<void>;
}) {
  const { user: currentUser } = useAuth();

  const participantIds = Object.keys(chat.participants);

  const otherUserId = participantIds.find(
    (id) => id !== currentUser?.uid
  );

  if (!otherUserId) return null;

  const otherUser = chatUsers[otherUserId];

  const isSelected = selectedUserId === otherUserId;

  return (
    <div
      className={`group relative flex items-center rounded-2xl transition-all duration-200 ${
        isSelected
          ? "bg-linear-to-r from-orange-500/15 via-amber-500/10 to-rose-500/10 dark:from-orange-500/20 dark:via-amber-500/15 dark:to-rose-500/15"
          : "hover:bg-white/30 dark:hover:bg-zinc-800/50"
      }`}
    >
      <button
        type="button"
        onClick={() => {
          if (currentUser?.uid && otherUser) {
            handleSelectChat(currentUser.uid, otherUser);
          }
        }}
        className="group relative flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl border border-transparent p-3 text-left"
      >
        {isSelected && (
          <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-linear-to-b from-orange-500 to-rose-500 shadow-sm" />
        )}

        <Avatar className="h-11 w-11 border border-white/60 dark:border-zinc-700 shadow-xs">
          <AvatarFallback className="bg-linear-to-tr from-amber-400 to-orange-500 font-bold text-white">
            {otherUser?.name?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-800 dark:text-zinc-100">
            {otherUser?.name || "Unknown User"}
          </p>

          <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400 dark:text-zinc-500">
            {otherUser?.email ||
              otherUser?.phoneNumber ||
              "No contact info"}
          </p>
        </div>
      </button>

      {showArchived && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onUnarchive(chat.chatId)}
          title="Unarchive chat"
          className="mr-2 shrink-0 rounded-full text-slate-400 transition-colors hover:bg-orange-500/10 hover:text-orange-500 dark:text-zinc-500 dark:hover:text-orange-400"
        >
          <ArchiveRestore className="size-4" />
        </Button>
      )}
    </div>
  );
}