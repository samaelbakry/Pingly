"use client";

import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatProvider";

import { useChatMessages } from "../layout/useChatMessages";
import { useChatTyping } from "../layout/useChatTyping";
import { useChatBlockStatus } from "../layout/useChatBlockStatus";
import { useMarkMessagesAsSeen } from "../layout/useMarkMessagesAsSeen";
import { useChatWindowScroll } from "../layout/useChatWindowScroll";
import { useChatReply } from "../layout/useChatReply";

export function useChatWindow() {
  const { user: currentUser } = useAuth();
  const { selectedChat } = useChat();

  const currentUserId = currentUser?.uid;
  const chatId = selectedChat?.chatId ?? null;

  const isGroupChat = selectedChat?.type === "group";

  const selectedUser =  selectedChat?.type === "user"  ? selectedChat.user : null;

  const selectedGroup = selectedChat?.type === "group"  ? selectedChat.group : null;

  const { messages, chatUsers } = useChatMessages(chatId);

  const { isSomeoneTyping } = useChatTyping(
    chatId,
    currentUserId,
  );

  const blockStatus = useChatBlockStatus(
    chatId,
    isGroupChat,
    currentUserId,
    selectedUser?.uid,
  );

  useMarkMessagesAsSeen(
    chatId,
    currentUserId,
    messages.length,
  );

  const messagesEndRef = useChatWindowScroll(
    chatId,
    messages.length,
  );

  const {
    replyingTo,
    handleReply,
    cancelReply,
  } = useChatReply({
    currentUserId,
    chatUsers,
    selectedUserName: selectedUser?.name,
  });

  const hideSelectedUserProfile =  blockStatus === "blocked-me" || blockStatus === "both";

  const visibleSelectedUser = selectedUser
    ? {
        ...selectedUser,
        name: hideSelectedUserProfile
          ? "Unavailable contact"
          : selectedUser.name,
        photoURL: hideSelectedUserProfile
          ? ""
          : selectedUser.photoURL,
      }
    : null;

  return {
    selectedChat,
    chatId,
    currentUserId,
    isGroupChat,
    selectedGroup,
    visibleSelectedUser,
    messages,
    chatUsers,
    isSomeoneTyping,
    blockStatus,
    messagesEndRef,
    replyingTo,
    handleReply,
    cancelReply,
  };
}