"use client";

import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatProvider";

import { useUserChats } from "./useUserChats";
import { useChatUsers } from "./useChatUsers";
import { useFilteredChats } from "./useFilteredChats";
import { useChatSidebarActions } from "./useChatSidebarActions";
import { deleteChatForMe } from "@/services/chats";
import { toast } from "sonner";

export function useChatSidebar(showArchived: boolean) {
  const [search, setSearch] = useState("");

  const { user: currentUser } = useAuth();

  const { selectedChat, selectUserChat, selectGroupChat, clearSelectedChat } = useChat();
  const currentUserId = currentUser?.uid;

  const { userChats, loading } = useUserChats(currentUserId, showArchived);

  const chatUsers = useChatUsers(userChats, currentUserId);

  const filteredChats = useFilteredChats({
    userChats,
    chatUsers,
    search,
    currentUserId,
    selectedChatId: selectedChat?.chatId ?? null,
  });
  const handleDeleteChat = async (chatId: string) => {
  if (!currentUserId) return;

  try {
    await deleteChatForMe(currentUserId, chatId);

    if (selectedChat?.chatId === chatId) {
      clearSelectedChat();
    }

    toast.success("Chat deleted from your sidebar");
  } catch (error) {
    console.error("Failed to delete chat:", error);
    toast.error("Failed to delete chat");
  }
};

  const actions = useChatSidebarActions({
    currentUserId,
    userChats,
    selectUserChat,
    selectGroupChat,
  });

  return {
    search,
    setSearch,
    userChats,
    chatUsers,
    loading,
    filteredChats,
    currentUserId,
    handleDeleteChat,
    selectedChatId: selectedChat?.chatId ?? null,
    ...actions,
  };
}
