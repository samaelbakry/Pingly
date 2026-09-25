"use client";

import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatProvider";

import {
  createChat,
  createGroupChat,
  getUserChats,
} from "@/services/chats";

import { getArchivedChats, unarchiveChat } from "@/services/chatActions";
import { getUserById } from "@/services/users";

import { useEffect, useMemo, useState } from "react";

import ChatSkeleton from "@/components/skeletons/ChatSkeleton";
import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";

import ChatListCard from "./ChatListCard";
import NoMatchingChats from "./NoMatchingChats";
import SidebarHeader from "./SidebarHeader";
import ChatSidebarFooter from "./ChatSidebarFooter";

import { toast } from "sonner";

type ChatSidebarProps = {
  showArchived: boolean;
};

export default function ChatSidebar({
  showArchived,
}: ChatSidebarProps) {
  const { user: currentUser } = useAuth();

  const { selectedChat, selectUserChat, selectGroupChat } = useChat();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [userChats, setUserChats] = useState<ChatItem[]>([]);

  const [chatUsers, setChatUsers] = useState<
    Record<string, UserProfile>
  >({});

  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);

        if (!currentUser?.uid) return;

        const chats = showArchived
          ? await getArchivedChats(currentUser.uid)
          : await getUserChats(currentUser.uid);

        const chatItems = chats as unknown as ChatItem[];

        setUserChats(chatItems);

        const usersEntries = await Promise.all(
          chatItems
            .filter((chat) => chat.type !== "group")
            .map(async (chat) => {
              const participantIds = Object.keys(
                chat.participants ?? {}
              );

              const otherUserId = participantIds.find(
                (id) => id !== currentUser.uid
              );

              if (!otherUserId) return null;

              const user = await getUserById(otherUserId);

              if (!user) return null;

              return [otherUserId, user] as const;
            })
        );

        const usersMap: Record<string, UserProfile> = {};

        usersEntries.forEach((entry) => {
          if (!entry) return;

          const [userId, user] = entry;

          usersMap[userId] = user;
        });

        setChatUsers(usersMap);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.uid) {
      loadChats();
    }
  }, [currentUser?.uid, showArchived]);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return userChats;
    }

    return userChats.filter((chat) => {
    
      if (chat.type === "group") {
        return chat.name?.toLowerCase().includes(query);
      }

      const participantIds = Object.keys(
        chat.participants ?? {}
      );

      const otherUserId = participantIds.find(
        (id) => id !== currentUser?.uid
      );

      if (!otherUserId) return false;

      const otherUser = chatUsers[otherUserId];

      return (
        otherUser?.name
          ?.toLowerCase()
          .includes(query) ||
        otherUser?.email
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [
    userChats,
    chatUsers,
    search,
    currentUser?.uid,
  ]);

  const handleSelectChat = async (
    currentUserId: string,
    user: UserProfile
  ) => {
    if (!currentUserId || !user?.uid) return;

    try {
      const chatId = await createChat(
        currentUserId,
        user.uid
      );

      selectUserChat(chatId, user);
    } catch (error) {
      console.error(
        "Failed to open chat:",
        error
      );
    }
  };

  const handleUnarchive = async (
    chatId: string
  ) => {
    try {
      if (!currentUser?.uid) return;

      await unarchiveChat(
        currentUser.uid,
        chatId
      );

      toast.success("Removed From Archive");

      setUserChats((prev) =>
        prev.filter(
          (chat) => chat.chatId !== chatId
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateGroup = async (
    groupName: string,
    membersIds: string[]
  ) => {
    if (!currentUser?.uid || !groupName.trim() || membersIds.length === 0 ) {
      return;
    }

    try {
      const chatId = await createGroupChat(
        currentUser.uid,
        membersIds,
        groupName.trim()
      );

      const chats = await getUserChats(
        currentUser.uid
      );

      setUserChats(
        chats as unknown as ChatItem[]
      );

      console.log("Group created:", chatId);
    } catch (error) {
      console.error(
        "Failed to create group:",
        error
      );
    }
  };

  const handleSelectGroup = (chatId: string) => {
    if (!chatId) return;

    const group = userChats.find(
      (chat) => chat.chatId === chatId
    );

    if (!group || group.type !== "group") {
      return;
    }

    selectGroupChat(chatId, group);
  };

  return (
    <div className="relative chat-scroll flex h-full min-h-0 flex-col rounded-[2.5rem] border border-white/40 p-5 shadow-md backdrop-blur-3xl dark:border-zinc-800 dark:shadow-none">
      <SidebarHeader
        userChats={userChats}
        search={search}
        setSearch={setSearch}
      />

      <div className="custom-scrollbar -mr-1 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <ChatSkeleton key={index} />
          ))
        ) : filteredChats.length === 0 ? (
          <NoMatchingChats />
        ) : (
          filteredChats.map((chat) => (
            <ChatListCard
              key={chat.chatId}
              chat={chat}
              chatUsers={chatUsers}
              handleSelectChat={handleSelectChat}
              handleSelectGroup={handleSelectGroup}
              selectedChatId={selectedChat?.chatId ?? null}
              showArchived={showArchived}
              onUnarchive={handleUnarchive}
            />
          ))
        )}
      </div>

      <div className="mt-2 shrink-0 rounded-b-2xl border-t border-white/20 bg-white/10 p-1 pt-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/10">
        <ChatSidebarFooter
          currentUserId={currentUser?.uid as string}
          handleSelectChat={handleSelectChat}
          onCreateGroup={handleCreateGroup}
        />
      </div>
    </div>
  );
}