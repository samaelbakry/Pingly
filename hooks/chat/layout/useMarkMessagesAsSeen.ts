"use client";

import { useEffect } from "react";

import { markMessagesAsSeen } from "@/services/messages";

export function useMarkMessagesAsSeen(
  chatId: string | null,
  currentUserId: string | undefined,
  messagesCount: number,
) {
  useEffect(() => {
    if (
      !chatId ||
      !currentUserId ||
      messagesCount === 0
    ) {
      return;
    }

    markMessagesAsSeen(chatId, currentUserId).catch((error) => {
      console.error(
        "Failed to mark messages as seen:",
        error,
      );
    });
  }, [chatId, currentUserId, messagesCount]);
}