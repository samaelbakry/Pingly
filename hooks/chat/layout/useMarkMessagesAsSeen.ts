
"use client";

import { useEffect, useState } from "react";

import {
  markMessagesAsSeen,
  type UnreadMessagesSnapshot,
} from "@/services/messages";

export function useMarkMessagesAsSeen(
  chatId: string | null,
  currentUserId: string | undefined,
  messagesCount: number,
) {
  const [unreadSnapshot, setUnreadSnapshot] =
    useState<UnreadMessagesSnapshot | null>(null);

  const hasMessages = messagesCount > 0;

  useEffect(() => {
    if (!chatId || !currentUserId || !hasMessages) {
      return;
    }

    let cancelled = false;

    markMessagesAsSeen(chatId, currentUserId)
      .then((snapshot) => {
        if (!cancelled) {
          setUnreadSnapshot(snapshot);
        }
      })
      .catch((error) => {
        console.error("Failed to mark messages as seen:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [chatId, currentUserId, hasMessages]);

  return {
    unreadSnapshot:
      unreadSnapshot?.chatId === chatId ? unreadSnapshot : null,
  };
}
