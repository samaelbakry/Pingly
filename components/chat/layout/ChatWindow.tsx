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
  isGroupChat:boolean
};

export default function ChatWindow({
  selectedUserId,
  selectedUser,
  chatId,
  isGroupChat
}: ChatPropsType) {
  const { user: currentUser } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ChatItem | null>(null);

  useEffect(() => {

    if (!chatId) return;
     if (!chatId) return;

  const loadChat = async () => {
    try {
      const snapshot = await get(ref(database, `chats/${chatId}`));

      if (!snapshot.exists()) return;

      const chat = snapshot.val() as ChatItem;

      if (chat.type === "group") {
        setSelectedGroup({
          ...chat,
          chatId,
        });
      } else {
        setSelectedGroup(null);
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
/>
      <div className="chat-scroll flex-1 min-h-0 overflow-y-auto p-5 space-y-3.5">
        <MessageBubble messages={messages} chatId={chatId} />
      </div>

      <MessageComposer
        chatId={chatId}
        currentUserId={currentUser?.uid as string}
      />
    </div>
  );
}
