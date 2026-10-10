"use client";

import { useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatProvider";

import { useUserChats } from "./useUserChats";
import { useChatUsers } from "./useChatUsers";
import { useFilteredChats } from "./useFilteredChats";
import { useChatSidebarActions } from "./useChatSidebarActions";

export function useChatSidebar(showArchived: boolean) {
  const { user: currentUser } = useAuth();

  const { selectedChat, selectUserChat, selectGroupChat } = useChat();

  const currentUserId = currentUser?.uid;

  const [search, setSearch] = useState("");

  const { userChats, loading } = useUserChats( currentUserId, showArchived );

  const chatUsers = useChatUsers(userChats, currentUserId);

  const filteredChats = useFilteredChats({
    userChats,
    chatUsers,
    search,
    currentUserId,
    selectedChatId: selectedChat?.chatId ?? null,
  });

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
    selectedChatId: selectedChat?.chatId ?? null,
    ...actions,
  };
}