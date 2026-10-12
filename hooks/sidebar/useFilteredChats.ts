"use client";

import { useMemo } from "react";

import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";

type Props = {
  userChats: ChatItem[];
  chatUsers: Record<string, UserProfile>;
  search: string;
  currentUserId: string | undefined;
  selectedChatId: string | null;
};

export function useFilteredChats({ userChats, chatUsers, search, currentUserId, selectedChatId}: Props) {
  return useMemo(() => {
    const query = search.trim().toLowerCase();

    const getUnreadCount = (chat: ChatItem) => {
      if (!currentUserId) return 0;

      const storedCount = chat.unreadCounts?.[currentUserId];

      if (typeof storedCount === "number") {
        return storedCount;
      }

      const lastMessage = chat.lastMessage;

      if (
        lastMessage &&
        lastMessage.senderId !== currentUserId &&
        lastMessage.seen !== true
      ) {
        return 1;
      }

      return 0;
    };

    const filtered = userChats.filter((chat) => {
      if (!query) return true;

      if (chat.type === "group") {
        return chat.name?.toLowerCase().includes(query) ?? false;
      }

      const participantIds = Object.keys(chat.participants ?? {});

      const otherUserId = participantIds.find((id) => id !== currentUserId );

      if (!otherUserId) return false;

      const otherUser = chatUsers[otherUserId];

      return (
        otherUser?.name?.toLowerCase().includes(query) ||
        otherUser?.email?.toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      const aSelected = a.chatId === selectedChatId;
      const bSelected = b.chatId === selectedChatId;

      if (aSelected !== bSelected) {
        return aSelected ? -1 : 1;
      }

      const aUnread = getUnreadCount(a);
      const bUnread = getUnreadCount(b);

      if (aUnread !== bUnread) {
        return bUnread - aUnread;
      }

      const aTime = Number(
        a.lastMessage?.createdAt ?? a.createdAt ?? 0,
      );

      const bTime = Number(
        b.lastMessage?.createdAt ?? b.createdAt ?? 0,
      );

      return bTime - aTime;
    });
  }, [
    userChats,
    chatUsers,
    search,
    currentUserId,
    selectedChatId,
  ]);
}