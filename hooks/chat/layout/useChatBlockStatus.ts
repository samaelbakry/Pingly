"use client";

import { useEffect, useState } from "react";

import {
  BlockStatus,
  listenToBlockStatus,
} from "@/services/block";

export function useChatBlockStatus(
  chatId: string | null,
  isGroupChat: boolean,
  currentUserId: string | undefined,
  targetUserId: string | undefined,
) {
  const [blockStatus, setBlockStatus] =
    useState<BlockStatus>("loading");

  useEffect(() => {
    if (isGroupChat || !currentUserId || !targetUserId) {
      return;
    }

    return listenToBlockStatus(
      currentUserId,
      targetUserId,
      setBlockStatus,
    );
  }, [
    chatId,
    isGroupChat,
    currentUserId,
    targetUserId,
  ]);

  return blockStatus;
}