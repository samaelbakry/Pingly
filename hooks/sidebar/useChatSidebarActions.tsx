"use client";

import { createChat, createGroupChat } from "@/services/chats";
import { unarchiveChat } from "@/services/chatActions";

import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";

import { toast } from "sonner";

type Props = {
  currentUserId: string | undefined;
  userChats: ChatItem[];
  selectUserChat: (chatId: string, user: UserProfile) => void;
  selectGroupChat: (chatId: string, group: ChatItem) => void;
};

export function useChatSidebarActions({ currentUserId, userChats, selectUserChat,selectGroupChat }: Props) {

  const handleSelectChat = async (requestedUserId: string, user: UserProfile) => {
    if (
      !currentUserId ||
      requestedUserId !== currentUserId ||
      !user?.uid
    ) {
      return;
    }

    try {
      const chatId = await createChat(currentUserId, user.uid);

      selectUserChat(chatId, user);
    } catch (error) {
      console.error("Failed to open chat:", error);
      toast.error("Couldn't open chat");
    }
  };

  const handleSelectGroup = (chatId: string) => {
    if (!chatId) return;

    const group = userChats.find(
      (chat) => chat.chatId === chatId,
    );

    if (!group || group.type !== "group") return;

    selectGroupChat(chatId, group);
  };

  const handleUnarchive = async (chatId: string) => {
    if (!currentUserId) return;

    try {
      await unarchiveChat(currentUserId, chatId);

      toast.success("Removed From Archive");
    } catch (error) {
      console.error("Failed to unarchive chat:", error);
      toast.error("Couldn't unarchive chat");
    }
  };

  const handleCreateGroup = async (groupName: string,membersIds: string[]) => {
    if (
      !currentUserId ||
      !groupName.trim() ||
      membersIds.length === 0
    ) {
      return;
    }

    try {
      await createGroupChat(
        currentUserId,
        membersIds,
        groupName.trim(),
      );

      toast.success("Group created successfully");
    } catch (error) {
      console.error("Failed to create group:", error);
      toast.error("Failed to create group");
    }
  };

  return {
    handleSelectChat,
    handleSelectGroup,
    handleUnarchive,
    handleCreateGroup,
  };
}