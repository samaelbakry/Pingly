"use client";

import { Message } from "@/types/messages";
import { UserProfile } from "@/types/userProfile";
import MessageContent from "./MessageContent";
import MessageMeta from "./MessageMeta";
import MessageAvatar from "./MessageAvatar";

type Props = {
  message: Message;
  chatId: string;
  isMine: boolean;
  isGroupChat: boolean;
  sender?: UserProfile;
  onReply: (message: Message) => void;
};

export default function MessageItem({ message, chatId, isMine, isGroupChat, sender , onReply }: Props) {
  const senderName = sender?.name || "Unknown User";

  return (
    <div
      className={`group flex items-end gap-2 ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
      {!isMine && <MessageAvatar sender={sender} isGroupChat={isGroupChat} />}

      <div
        className={`flex max-w-[85%] flex-col sm:max-w-[70%] ${
          isMine ? "items-end" : "items-start"
        }`}
      >
        {isGroupChat && !isMine && (
          <span className="mb-1.5 px-2 text-[11px] font-semibold text-orange-500 dark:text-orange-400">
            {senderName}
          </span>
        )}

        <MessageContent message={message} chatId={chatId} isMine={isMine} onReply={onReply} isGroupChat={isGroupChat} />

        <MessageMeta message={message} isMine={isMine} />
      </div>
    </div>
  );
}
