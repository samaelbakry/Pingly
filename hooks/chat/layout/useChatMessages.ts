"use client";

import { useEffect, useState } from "react";

import { database } from "@/lib/firebaseConfig";
import { listenToMessages } from "@/services/messages";
import { Message } from "@/types/messages";
import { UserProfile } from "@/types/userProfile";

import { get, ref } from "firebase/database";

export function useChatMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);

  const [chatUsers, setChatUsers] = useState<
    Record<string, UserProfile>
  >({});

  useEffect(() => {
    if (!chatId) {
      return;
    }

    let cancelled = false;

    const loadChatUsers = async () => {
      try {
        const snapshot = await get(
          ref(database, `chats/${chatId}`),
        );

        if (!snapshot.exists() || cancelled) return;

        const chat = snapshot.val() as {
          type?: string;
          participants?: Record<string, boolean>;
          messages?: Record<string, unknown>;
        };

        if (chat.type !== "group") {
          setChatUsers({});
          return;
        }

        const participantIds = Object.keys(
          chat.participants ?? {},
        );

        const fetchedMessages: Message[] = Object.entries(
          chat.messages ?? {},
        ).map(([id, message]) => ({
          id,
          ...(message as Omit<Message, "id">),
        }));

        const systemUserIds = fetchedMessages
          .filter(
            (message) =>
              message.type === "system" &&
              !!message.userId &&
              (message.action === "left" ||
                message.action === "admin_changed"),
          )
          .map((message) => message.userId!);

        const userIds = [
          ...new Set([...participantIds, ...systemUserIds]),
        ];

        const usersEntries = await Promise.all(
          userIds.map(async (userId) => {
            const userSnapshot = await get(
              ref(database, `users/${userId}`),
            );

            if (!userSnapshot.exists()) return null;

            return [
              userId,
              {
                ...userSnapshot.val(),
                uid: userId,
              },
            ] as const;
          }),
        );

        if (cancelled) return;

        const usersMap: Record<string, UserProfile> = {};

        usersEntries.forEach((entry) => {
          if (!entry) return;

          const [userId, user] = entry;
          usersMap[userId] = user;
        });

        setChatUsers(usersMap);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load chat users:", error);
        }
      }
    };

    loadChatUsers();

    const unsubscribe = listenToMessages(
      chatId,
      (fetchedMessages) => {
        if (!cancelled) {
          setMessages(fetchedMessages);
        }
      },
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [chatId]);

  return {
    messages,
    chatUsers,
  };
}