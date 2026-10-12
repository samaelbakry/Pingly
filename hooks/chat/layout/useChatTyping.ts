"use client";

import { useEffect, useState } from "react";

import { listenToTyping } from "@/services/typing";

export function useChatTyping(
  chatId: string | null,
  currentUserId: string | undefined,
) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!chatId || !currentUserId) {
      return;
    }

    const unsubscribe = listenToTyping(chatId, (users) => {
      setTypingUsers(
        users.filter((userId) => userId !== currentUserId),
      );
    });

    return unsubscribe;
  }, [chatId, currentUserId]);

  return {
    typingUsers,
    isSomeoneTyping: typingUsers.length > 0,
  };
}