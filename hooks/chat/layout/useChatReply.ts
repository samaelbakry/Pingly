"use client";

import { useState } from "react";

import { Message, ReplyTo } from "@/types/messages";
import { UserProfile } from "@/types/userProfile";

type Props = {
  currentUserId: string | undefined;
  chatUsers: Record<string, UserProfile>;
  selectedUserName: string | undefined;
};

export function useChatReply({
  currentUserId,
  chatUsers,
  selectedUserName,
}: Props) {
  const [replyingTo, setReplyingTo] =
    useState<ReplyTo | null>(null);

  const handleReply = (message: Message) => {
    const senderName =
      message.senderId === currentUserId
        ? "You"
        : chatUsers[message.senderId]?.name ||
          selectedUserName ||
          "Unknown User";

    setReplyingTo({
      messageId: message.id,
      senderId: message.senderId,
      senderName,
      type: message.type as "text" | "image",
      text: message.text,
      imageUrl: message.imageUrl,
    });
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  return {
    replyingTo,
    handleReply,
    cancelReply,
  };
}