"use client";
import { useAuth } from "@/context/AuthContext";
import { getUserChats } from "@/services/chats";
import { listenToAllUserMessages } from "@/services/notifications";
import { getUserById } from "@/services/users";
import { UserProfile } from "@/types/userProfile";
import { useEffect, useState } from "react";

export default function useNotifications() {
  const { user: currentUser } = useAuth();

  const [notification, setNotification] = useState<{
    user: UserProfile;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!currentUser?.uid) return;

    let unsubscribeMessages: (() => void) | undefined;

    const setupMessageListener = async () => {
      try {
        const chats = await getUserChats(currentUser.uid);

        const chatIds = chats.map((chat) => chat.chatId);

        if (chatIds.length === 0) return;

        unsubscribeMessages = listenToAllUserMessages(
          chatIds,
          currentUser.uid,
          async (message) => {
            const sender = await getUserById(message?.senderId);

            if (sender) {
              setNotification({
                user: sender,
                message: message.text!,
              });
            }
          },
        );
      } catch (error) {
        console.error("Failed to setup message listener:", error);
      }
    };

    setupMessageListener();

    return () => {
      unsubscribeMessages?.();
    };
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification(null);
    }, 6000);

    return () => clearTimeout(timer);
  }, [notification]);

  return {
    notification,
    setNotification,
  };
}
