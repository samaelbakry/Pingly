"use client";

import { useEffect, useRef, useState } from "react";

import { listenToMessages } from "@/services/messages";
import { Message } from "@/types/messages";

import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/userProfile";
import MessageBubble from "../features/MessageBubble";
import MessageComposer from "../features/MessageComposer";
import NoChatSelectedState from "./NoChatSelectedState";
import ChatWindowHeader from "./ChatWindowHeader";

type ChatPropsType = {
  selectedUserId: string | null;
  selectedUser: UserProfile | null;
  chatId: string | null;
};

export default function ChatWindow({
  selectedUserId,
  selectedUser,
  chatId,
}: ChatPropsType) {
  const { user: currentUser } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //handle any changes
  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = listenToMessages(chatId, (fetchedMessages) => {
      setMessages(fetchedMessages);
    });

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedUserId || !chatId) {
    return <NoChatSelectedState />;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-white/40 dark:border-zinc-800 bg-white/30 dark:bg-zinc-900/40 shadow-[0_8px_32px_0_rgba(249,115,22,0.06)] dark:shadow-none backdrop-blur-3xl">
      <ChatWindowHeader selectedUser={selectedUser!} messages={messages} />

      <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
        <MessageBubble messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      <MessageComposer
        chatId={chatId}
        currentUserId={currentUser?.uid as string}
      />
    </div>
  );
}
