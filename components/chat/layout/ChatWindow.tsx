"use client";

import { useEffect, useState } from "react";

import { listenToMessages } from "@/services/messages";
import { Message } from "@/types/messages";

import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/userProfile";
import MessageBubble from "../features/MessageBubble";
import MessageComposer from "../features/MessageComposer";
import NoChatSelectedState from "./NoChatSelectedState";
import ChatWindowHeader from "./ChatWindowHeader";
import { ChatItem } from "@/types/chatType";
import { database } from "@/lib/firebaseConfig";
import { get, ref } from "firebase/database";

type ChatPropsType = {
  selectedUserId: string | null;
  selectedUser: UserProfile | null;
  chatId: string | null;
  isGroupChat: boolean;
  handleLeaveChat:()=>void
};

export default function ChatWindow({
  selectedUserId,
  selectedUser,
  chatId,
  isGroupChat,
  handleLeaveChat
}: ChatPropsType) {
  const { user: currentUser } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ChatItem | null>(null);
  const [chatUsers, setChatUsers] = useState<Record<string, UserProfile>>({});

useEffect(() => {
  if (!chatId) return;

  const loadChat = async () => {
    try {
      const snapshot = await get(ref(database, `chats/${chatId}`));

      if (!snapshot.exists()) return;

      const chat = snapshot.val() as ChatItem;

      const messagesSnapshot = await get(
        ref(database, `chats/${chatId}/messages`),
      );

      const messagesData = messagesSnapshot.exists()
        ? messagesSnapshot.val()
        : {};

      const fetchedMessages: Message[] = Object.entries(messagesData).map(
        ([id, message]) => ({
          id,
          ...(message as Omit<Message, "id">),
        }),
      );

      setMessages(fetchedMessages);

      if (chat.type === "group") {
        setSelectedGroup({
          ...chat,
          chatId,
        });

        const participantIds = Object.keys(chat.participants || {});

        const leftUserIds = fetchedMessages
          .filter(
            (message) =>
              message.type === "system" &&
              message.action === "left" &&
              message.userId,
          )
          .map((message) => message.userId!);

        const userIds = [...new Set([...participantIds, ...leftUserIds])];

        const usersEntries = await Promise.all(
          userIds.map(async (userId) => {
            const userSnapshot = await get(
              ref(database, `users/${userId}`),
            );

            if (!userSnapshot.exists()) return null;

            return [
              userId,
              {
                uid: userId,
                ...userSnapshot.val(),
              },
            ] as const;
          }),
        );

        const usersMap: Record<string, UserProfile> = {};

        usersEntries.forEach((entry) => {
          if (!entry) return;

          const [userId, user] = entry;
          usersMap[userId] = user;
        });

        setChatUsers(usersMap);
      } else {
        setSelectedGroup(null);
        setChatUsers({});
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
    }
  };

  loadChat();

  const unsubscribe = listenToMessages(chatId, (fetchedMessages) => {
    setMessages(fetchedMessages);
  });

  return () => {
    unsubscribe();
  };
}, [chatId]);
  if (!selectedUserId || !chatId) {
    return <NoChatSelectedState />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden scroll-smooth rounded-[2.5rem] border border-white/40 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/40 shadow-md dark:shadow-none backdrop-blur-3xl">
      <ChatWindowHeader
        selectedUser={selectedUser}
        selectedGroup={selectedGroup}
        isGroupChat={isGroupChat}
        currentUserId={currentUser?.uid ?? ""}
        messages={messages}
        chatId={chatId}
        handleLeaveChat={handleLeaveChat}
      />
      <div className="chat-scroll flex-1 min-h-0 overflow-y-auto p-5 space-y-3.5">
        <MessageBubble messages={messages} chatId={chatId} chatUsers={chatUsers} isGroupChat={isGroupChat} />
      </div>

      <MessageComposer
        chatId={chatId}
        currentUserId={currentUser?.uid as string}
      />
    </div>
  );
}
