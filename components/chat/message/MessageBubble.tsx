"use client";

import { useAuth } from "@/context/AuthContext";
import { Message } from "@/types/messages";
import { UserProfile } from "@/types/userProfile";

import EmptyChatState from "../states/EmptyChatState";
import SystemMessage from "./SystemMessage";
import MessageItem from "./MessageItem";


type Props = {
  messages: Message[];
  chatId: string;
  isGroupChat: boolean;
  chatUsers: Record<string, UserProfile>;
};

export default function MessageBubble({messages,chatId, isGroupChat, chatUsers}: Props) {

  const { user: currentUser } = useAuth();
  
  if (messages.length === 0) {
    return <EmptyChatState />;
  }

  return (
    <div className="flex flex-col gap-5 px-1 py-4">
      {messages.map((message) => {
        if (message.type === "system") {
          return (
            <SystemMessage
              key={message.id}
              message={message}
              chatUsers={chatUsers}
            />
          );
        }

        const isMine = message.senderId === currentUser?.uid;
        const sender = chatUsers[message.senderId];

        return (
          <MessageItem
            key={message.id}
            message={message}
            chatId={chatId}
            isMine={isMine}
            isGroupChat={isGroupChat}
            sender={sender}
          />
        );
      })}
    </div>
  );
}