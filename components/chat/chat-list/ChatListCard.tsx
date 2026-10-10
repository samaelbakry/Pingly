"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const otherUserId = participantIds.find((id) => id !== currentUser?.uid);

  const otherUser = otherUserId ? chatUsers[otherUserId] : undefined;

  const isSelected = selectedChatId === chat.chatId;

  const storedUnread = chat.unreadCounts?.[currentUser?.uid ?? ""];

  const unreadCount =
    storedUnread ??
    (chat.lastMessage &&
    chat.lastMessage.senderId !== currentUser?.uid &&
    chat.lastMessage.seen !== true
      ? 1
      : 0);

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        border transition-all duration-200 cursor-pointer
        ${
          isSelected
            ? "border-orange-200 bg-linear-to-r from-orange-50 via-white to-amber-50 shadow-[0_8px_25px_rgba(249,115,22,0.10)] dark:border-orange-500/20 dark:from-orange-500/10 dark:via-zinc-900 dark:to-amber-500/5"
            : "border-transparent hover:border-zinc-200/80 hover:bg-white/75 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/70"
        }
        ${
          isSelected && isGroup
            ? "border-violet-200 bg-linear-to-r from-violet-50 via-white to-amber-50 shadow-[0_8px_25px_rgba(249,115,22,0.10)] dark:border-violet-500/20 dark:from-violet-500/10 dark:via-zinc-900 dark:to-amber-500/5"
            : "border-transparent hover:border-zinc-200/80 hover:bg-white/75 dark:hover:border-zinc-800 dark:hover:bg-zinc-900/70"
        }
      `}
    >
      {isSelected && (
        <span className="absolute bottom-3 left-0 top-3 w-0.75 rounded-r-full bg-linear-to-b from-orange-500 to-amber-400" />
      )}
      {isSelected && isGroup && (
        <span className="absolute bottom-3 left-0 top-3 w-0.75 rounded-r-full bg-linear-to-b from-violet-500 to-violet-400" />
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
              handleSelectChat(currentUser.uid, otherUser);
            }
          }}
          className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left"
        >
          {isGroup ? (
            <div className="relative h-11 w-11 shrink-0">
              {chat.photoURL ? (
                <Avatar className="h-11 w-11 rounded-2xl border-2 border-white shadow-md dark:border-zinc-900">
                  <AvatarImage
                    src={chat.photoURL}
                    alt={chat.name || "Group"}
                    className="h-full w-full rounded-2xl object-cover"
                  />

                  <AvatarFallback className="rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 text-xs font-bold text-white">
                    {chat.name?.charAt(0).toUpperCase() || "G"}
                  </AvatarFallback>
                </Avatar>
              ) : groupParticipants.length >= 2 ? (
                <>
                  <Avatar className="absolute left-0 top-0 h-8 w-8 rounded-xl border-2 border-white shadow-md dark:border-zinc-950">
                    <AvatarImage
                      src={groupParticipants[0]?.photoURL || undefined}
                      alt={groupParticipants[0]?.name || "Member"}
                      className="rounded-xl object-cover"
                    />

                    <AvatarFallback className="rounded-xl bg-linear-to-br from-violet-500 to-purple-600 text-[10px] font-bold text-white">
                      {groupParticipants[0]?.name?.charAt(0).toUpperCase() ||
                        "G"}
                    </AvatarFallback>
                  </Avatar>

                  <Avatar className="absolute bottom-0 right-0 h-8 w-8 rounded-xl border-2 border-white shadow-md dark:border-zinc-950">
                    <AvatarImage
                      src={groupParticipants[1]?.photoURL || undefined}
                      alt={groupParticipants[1]?.name || "Member"}
                      className="rounded-xl object-cover"
                    />

                    <AvatarFallback className="rounded-xl bg-linear-to-br from-orange-400 to-amber-500 text-[10px] font-bold text-white">
                      {groupParticipants[1]?.name?.charAt(0).toUpperCase() ||
                        "G"}
                    </AvatarFallback>
                  </Avatar>
                </>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200 bg-linear-to-br from-violet-500/15 to-purple-500/20 text-violet-600 dark:border-violet-500/20 dark:text-violet-400">
                  <Users className="h-5 w-5" />
                </div>
              )}
            </div>
          ) : (
            <Avatar className="h-11 w-11 shrink-0 rounded-2xl border-2 border-white shadow-md dark:border-zinc-900">
              <AvatarImage
                src={otherUser?.photoURL || undefined}
                alt={otherUser?.name || "User"}
                className="rounded-2xl object-cover"
              />

              <AvatarFallback className="rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 text-xs font-bold text-white">
                {otherUser?.name?.charAt(0).toUpperCase() || "U"}
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

            <div className="mt-1 flex min-w-0 items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                {chat.lastMessage ? (
                  <p className="truncate text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                    {chat.lastMessage.type === "image"
                      ? "📷 Photo"
                      : chat.lastMessage.senderId === currentUser?.uid
                        ? `You: ${chat.lastMessage.text}`
                        : chat.lastMessage.text}
                  </p>
                ) : (
                  <p className="truncate text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                    No messages yet
                  </p>
                )}
              </div>

              {unreadCount > 0 && (
                <span
                  aria-label={`${unreadCount} unread messages`}
                  className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-white shadow-sm"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
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
