"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";

export default function ChatListCard({
  chat,
  chatUsers,
  selectedUserId,
  handleSelectChat,
}: {
  chat: ChatItem;
  chatUsers: Record<string, UserProfile>;
  selectedUserId?: string;
  handleSelectChat: (currentUserID: string, user: UserProfile) => Promise<void>;
}) {
  const { user: currentUser } = useAuth();

  const participantIds = Object.keys(chat.participants);

  const otherUserId = participantIds.find((id) => id !== currentUser?.uid);

  if (!otherUserId) return null;

  const otherUser = chatUsers[otherUserId];

  const isSelected = selectedUserId === otherUserId;
  return (
    <>
      <button
        key={chat.chatId}
        type="button"
        onClick={() => {
          if (currentUser?.uid) {
            if (otherUser) {
              handleSelectChat(currentUser.uid, otherUser);
            }
          }
        }}
        className={`group relative flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${
          isSelected
            ? "border-white/60 dark:border-zinc-700 bg-linear-to-r from-orange-500/15 via-amber-500/10 to-rose-500/10 dark:from-orange-500/20 dark:via-amber-500/15 dark:to-rose-500/15 shadow-xs backdrop-blur-md"
            : "border-transparent hover:bg-white/30 dark:hover:bg-zinc-800/50 backdrop-blur-xs"
        }`}
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

          <p className="truncate text-[11px] font-medium text-slate-400 dark:text-zinc-500 mt-0.5">
            {otherUser?.email || otherUser?.phoneNumber || "No contact info"}
          </p>
        </div>
      </button>
    </>
  );
}
