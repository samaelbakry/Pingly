"use client";

import { useEffect, useState } from "react";

import { listenToReadReceipts, updateReadReceipts } from "@/services/privacy";

export function useReadReceipts( userId: string | undefined ) {
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const unsubscribe = listenToReadReceipts(
      userId,
      (enabled) => {
        setReadReceiptsEnabled(enabled);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [userId]);

  const saveReadReceipts = async (enabled: boolean) => {
    if (!userId) {
      throw new Error("User is not authenticated");
    }

    await updateReadReceipts(userId, enabled);
  };

  return {
    readReceiptsEnabled,
    loading,
    saveReadReceipts,
  };
}