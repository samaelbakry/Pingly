"use client";

import { useEffect, useState } from "react";
import { listenToUserChats } from "@/services/chats";
import { ChatItem } from "@/types/chatType";

export function useUserChats( currentUserId: string | undefined, showArchived: boolean) {

  const [userChats, setUserChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }
    const unsubscribe = listenToUserChats(
      currentUserId,
      showArchived,
      (chats) => {
        setUserChats(chats);
        setLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [currentUserId, showArchived]);

  return { userChats, loading };
}