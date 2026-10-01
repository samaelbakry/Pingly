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

  const participantIds = Object.keys(
    chat.participants ?? {},
  );

  const groupParticipants = participantIds
    .filter((id) => id !== currentUser?.uid)
    .map((id) => chatUsers[id])
    .filter(Boolean);

  const otherUserId = participantIds.find(
    (id) => id !== currentUser?.uid,
  );

  const otherUser = otherUserId
    ? chatUsers[otherUserId]
    : undefined;

  const isSelected = selectedChatId === chat.chatId;

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        border transition-all duration-200
        ${
          isSelected
            ? "border-orange-200 bg-linear-to-r from-orange-50 via-white to-amber-50 shadow-[0_8px_25px_rgba(249,115,22,0.10)] dark:border-orange-500/20 dark:from-orange-500/10 dark:via-zinc-900 dark:to-amber-500/5"
            : "border-transparent hover:border-zinc-200/80 hover:bg-white/75 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/70"
        }
      `}
    >
      {isSelected && (
        <span className="absolute bottom-3 left-0 top-3 w-0.75 rounded-r-full bg-linear-to-b from-orange-500 to-amber-400" />
      )}

      <div className="flex items-center">
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
                otherUser,
              );
            }
          }}
          className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
        >
          
          {isGroup ? (
            <div className="relative h-11 w-11 shrink-0">
              {groupParticipants.length >= 2 ? (
                <>
                  <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white bg-linear-to-br from-violet-500 to-purple-600 text-[10px] font-bold text-white shadow-md dark:border-zinc-950">
                    {groupParticipants[0]?.name
                      ?.charAt(0)
                      .toUpperCase() || "G"}
                  </span>

                  <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white bg-linear-to-br from-orange-400 to-amber-500 text-[10px] font-bold text-white shadow-md dark:border-zinc-950">
                    {groupParticipants[1]?.name
                      ?.charAt(0)
                      .toUpperCase() || "G"}
                  </span>
                </>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200 bg-linear-to-br from-violet-500/15 to-purple-500/20 text-violet-600 dark:border-violet-500/20 dark:text-violet-400">
                  <Users className="h-5 w-5" />
                </div>
              )}
            </div>
          ) : (
            <Avatar className="h-11 w-11 shrink-0 rounded-2xl border-2 border-white shadow-md dark:border-zinc-900">
              <AvatarFallback className="rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 text-xs font-bold text-white">
                {otherUser?.name
                  ?.charAt(0)
                  .toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          )}

      
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[12px] font-bold text-zinc-800 dark:text-zinc-100">
                {isGroup
                  ? chat.name || "Unnamed Group"
                  : otherUser?.name || "Unknown User"}
              </p>

              {isGroup && (
                <span className="shrink-0 rounded-full bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-bold text-violet-600 dark:text-violet-400">
                  GROUP
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-1.5">
              {isGroup ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />

                  <p className="truncate text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                    {participantIds.length}{" "}
                    {participantIds.length === 1
                      ? "member"
                      : "members"}
                  </p>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />

                  <p className="truncate text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                    {otherUser?.email ||
                      otherUser?.phoneNumber ||
                      "No contact info"}
                  </p>
                </>
              )}
            </div>
          </div>
        </button>

        {showArchived && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onUnarchive(chat.chatId)}
            title="Unarchive chat"
            className="mr-2 h-8 w-8 shrink-0 rounded-xl text-zinc-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-orange-500/10 hover:text-orange-500 dark:text-zinc-500 dark:hover:text-orange-400"
          >
            <ArchiveRestore className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}