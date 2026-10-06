"use client";

import { Message } from "@/types/messages";
import { UserProfile } from "@/types/userProfile";
import MessageAvatar from "./MessageAvatar";
import MessageContent from "./MessageContent/MessageContent";

type Props = {
  message: Message;
  chatId: string;
  isMine: boolean;
  isGroupChat: boolean;
  sender?: UserProfile;
  onReply: (message: Message) => void;
};

export default function MessageItem({
  message,
  chatId,
  isMine,
  isGroupChat,
  sender,
  onReply,
}: Props) {
  const senderName = sender?.name || "Unknown User";

  return (
    <div
      className={`
        group
        flex
        w-full
        min-w-0
        items-end
        gap-2
        ${isMine ? "justify-end" : "justify-start"}
        
      `}
    >
      {!isMine && isGroupChat && (
        <div className="shrink-0">
          <MessageAvatar sender={sender} isGroupChat={isGroupChat} />
        </div>
      )}

      <div
        className={`
          flex
          min-w-0
          max-w-[calc(100%-44px)]
          flex-col

          sm:max-w-[70%]

          ${isMine ? "items-end" : "items-start"}
        `}
      >
        {isGroupChat && !isMine && (
          <span
            className="
              mb-1.5
              max-w-full
              truncate
              px-2
              text-[11px]
              font-semibold
              text-orange-500
              dark:text-orange-400
            "
          >
            {senderName}
          </span>
        )}

        <MessageContent
          message={message}
          chatId={chatId}
          isMine={isMine}
          onReply={onReply}
          isGroupChat={isGroupChat}
        />
      </div>
    </div>
  );
}
