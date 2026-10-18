"use client";

import { useAuth } from "@/context/AuthContext";
import { Message } from "@/types/messages";
import { UserProfile } from "@/types/userProfile";

import EmptyChatState from "../states/EmptyChatState";
import MessageItem from "./MessageItem";
import SystemMessage from "./SystemMessage";
import UnreadMessagesDivider from "./unreadMessagesDivider";
import type { UnreadMessagesSnapshot } from "@/services/messages";

type Props = {
  messages: Message[];
  chatId: string;
  isGroupChat: boolean;
  chatUsers: Record<string, UserProfile>;
  onReply: (message: Message) => void;
  unreadSnapshot: UnreadMessagesSnapshot | null;
};

export default function MessageBubble({
  messages,
  chatId,
  isGroupChat,
  chatUsers,
  onReply,
  unreadSnapshot,
}: Props) {
  const { user: currentUser } = useAuth();

  const activeUnreadSnapshot =
    unreadSnapshot?.chatId === chatId ? unreadSnapshot : null;

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
        const isFirstUnread =
          message.id === activeUnreadSnapshot?.firstUnreadMessageId;

        return (
          <div key={message.id} className="w-full min-w-0">
            {isFirstUnread && activeUnreadSnapshot && (
              <UnreadMessagesDivider count={activeUnreadSnapshot.count} />
            )}

            {message.type === "system" ? (
              <SystemMessage message={message} chatUsers={chatUsers} />
            ) : (
              <MessageItem
                message={message}
                chatId={chatId}
                isMine={message.senderId === currentUser?.uid}
                isGroupChat={isGroupChat}
                sender={chatUsers[message.senderId]}
                onReply={onReply}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
