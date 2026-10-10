"use client";

import { useEffect, useMemo, useState } from "react";

import { getUserById } from "@/services/users";
import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";

export function useChatUsers(userChats: ChatItem[], currentUserId: string | undefined) {
  const [chatUsers, setChatUsers] = useState<Record<string, UserProfile>>({});

  const userIdsKey = useMemo(() => {
    if (!currentUserId) return "";

    const userIds = userChats.flatMap((chat) =>
      Object.keys(chat.participants ?? {}).filter(
        (id) => id !== currentUserId,
      ),
    );

    return [...new Set(userIds)].sort().join("|");
  }, [userChats, currentUserId]);

  useEffect(() => {
    let cancelled = false;

    if (!userIdsKey) {
      return;
    }

    const userIds = userIdsKey.split("|");

    const loadUsers = async () => {
      try {
        const entries = await Promise.all(
          userIds.map(async (userId) => {
            const user = await getUserById(userId);

            return user ? ([userId, user] as const) : null;
          }),
        );

        if (cancelled) return;

        const usersMap: Record<string, UserProfile> = {};

        entries.forEach((entry) => {
          if (!entry) return;

          const [userId, user] = entry;
          usersMap[userId] = user;
        });

        setChatUsers(usersMap);
      } catch (error) {
        console.error("Failed to load chat users:", error);
      }
    };

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, [userIdsKey]);

  return chatUsers;
}