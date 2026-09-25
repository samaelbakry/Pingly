"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ChatListCardProps } from "@/types/Props";
import { ArchiveRestore, Users } from "lucide-react";

export default function ChatListCard({
  chat,
  chatUsers,
  selectedChatId,
  handleSelectChat,
  handleSelectGroup,
  showArchived,
  onUnarchive,
}: ChatListCardProps) {
  const { user: currentUser } = useAuth();

  const isGroup = chat.type === "group";

  const participantIds = Object.keys(chat.participants ?? {});

  const groupParticipants = participantIds
    .filter((id) => id !== currentUser?.uid)
    .map((id) => chatUsers[id])
    .filter(Boolean);

 
  const otherUserId = participantIds.find(
    (id) => id !== currentUser?.uid
  );

  const otherUser = otherUserId
    ? chatUsers[otherUserId]
    : undefined;

  const isSelected = selectedChatId === chat.chatId;

  return (
    <div
      className={`group relative flex items-center rounded-2xl transition-all duration-200 ${
        isSelected
          ? "bg-linear-to-r from-orange-500/15 via-amber-500/10 to-rose-500/10 shadow-sm dark:from-orange-500/20 dark:via-amber-500/15 dark:to-rose-500/15"
          : "hover:bg-white/40 dark:hover:bg-zinc-800/50"
      }`}
    >
      <button
        type="button"
        onClick={() => {
          if (!currentUser?.uid) return;

          if (isGroup) {
            handleSelectGroup(chat.chatId);
            return;
          }

          if (otherUser) {
            handleSelectChat(
              currentUser.uid,
              otherUser
            );
          }
        }}
        className="group relative flex min-w-0 flex-1 cursor-pointer items-center gap-3.5 rounded-2xl border border-transparent p-3 text-left"
      >
        {isSelected && (
          <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-linear-to-b from-orange-500 to-rose-500 shadow-sm" />
        )}

        {isGroup ? (
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-500/30 bg-linear-to-tr from-violet-500/20 to-purple-600/20 text-violet-600 shadow-sm dark:text-violet-400">
            {groupParticipants.length >= 2 ? (
              <div className="relative flex h-full w-full items-center justify-center">
                <span className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-violet-500 text-[10px] font-bold text-white shadow-xs dark:border-zinc-900">
                  {groupParticipants[0]?.name
                    ?.charAt(0)
                    .toUpperCase() || "G"}
                </span>

                <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-purple-600 text-[10px] font-bold text-white shadow-xs dark:border-zinc-900">
                  {groupParticipants[1]?.name
                    ?.charAt(0)
                    .toUpperCase() || "2"}
                </span>
              </div>
            ) : (
              <Users className="h-5 w-5" />
            )}
          </div>
        ) : (
          <Avatar className="h-11 w-11 border border-white/80 shadow-xs dark:border-zinc-700">
            <AvatarFallback className="bg-linear-to-tr from-amber-400 to-orange-500 text-xs font-bold text-white">
              {otherUser?.name
                ?.charAt(0)
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-zinc-100">
              {isGroup
                ? chat.name || "Unnamed Group"
                : otherUser?.name || "Unknown User"}
            </p>
          </div>

          <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400 dark:text-zinc-500">
            {isGroup
              ? `${participantIds.length} members`
              : otherUser?.email ||
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