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
  onReply: (message: Message) => void;
};

export default function MessageBubble({
  messages,
  chatId,
  isGroupChat,
  chatUsers,
  onReply,
}: Props) {
  const { user: currentUser } = useAuth();

  if (messages.length === 0) {
    return <EmptyChatState />;
  }

  return (
    <div
      className="
        flex
        w-full
        min-w-0
        flex-col
        gap-4
        px-1
        py-3

        sm:gap-5
        sm:py-4
      "
    >
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
            onReply={onReply}
          />
        );
      })}
    </div>
  );
}
