"use client";

import { ChatListCardProps } from "@/types/Props";
import UnreadBadge from "./unreadBadge";

type ChatUser = NonNullable<
  ChatListCardProps["chatUsers"][string]
>;

type ChatListInfoProps = {
  chat: ChatListCardProps["chat"];
  isGroup: boolean;
  currentUserId?: string;
  otherUser?: ChatUser;
  unreadCount: number;
};

export default function ChatListInfo({
  chat,
  isGroup,
  currentUserId,
  otherUser,
  unreadCount,
}: ChatListInfoProps) {
  const chatName = isGroup
    ? chat.name || "Unnamed Group"
    : otherUser?.name || "Unknown User";

  const lastMessage = chat.lastMessage;

  const messagePreview = !lastMessage
    ? "No messages yet"
    : lastMessage.type === "image"
      ? "📷 Photo"
      : lastMessage.senderId === currentUserId
        ? `You: ${lastMessage.text}`
        : lastMessage.text;

  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[12px] font-bold text-zinc-800 dark:text-zinc-100">
          {chatName}
        </p>

        {isGroup && (
          <span className="shrink-0 rounded-full bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-bold text-violet-600 dark:text-violet-400">
            GROUP
          </span>
        )}
      </div>

      <div className="mt-1 flex min-w-0 items-center justify-between gap-2">
        <p className="min-w-0 flex-1 truncate text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
          {messagePreview}
        </p>

        <UnreadBadge count={unreadCount} />
      </div>
    </div>
  );
}