"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  createChat,
  getArchivedChats,
  getUserById,
  getUserChats,
} from "@/services/chats";

import ChatSkeleton from "@/components/skeletons/ChatSkeleton";
import { ChatItem } from "@/types/chatType";
import { SidebarChatsProps } from "@/types/Props";
import { UserProfile } from "@/types/userProfile";
import AddNewChat from "../features/AddNewChat";
import ChatListCard from "./ChatListCard";
import NoMatchingChats from "./NoMatchingChats";
import SidebarHeader from "./SidebarHeader";

export default function ChatSidebar({selectedUserId,setSelectedUserId,setSelectedUser,setChatId}: SidebarChatsProps) {
  const { user: currentUser } = useAuth();

  const [showArchived, setShowArchived] = useState(false);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [userChats, setUserChats] = useState<ChatItem[]>([]);

  const [chatUsers, setChatUsers] = useState<Record<string, UserProfile>>({});

  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);

        if (!currentUser) return;

        const chats = showArchived
          ? await getArchivedChats(currentUser.uid)
          : await getUserChats(currentUser.uid);

        const chatItems = chats as unknown as ChatItem[];

        setUserChats(chatItems);

        const usersEntries = await Promise.all(
          chatItems.map(async (chat) => {
            const participantIds = Object.keys(chat?.participants);

            const otherUserId = participantIds.find(
              (id) => id !== currentUser.uid,
            );

            if (!otherUserId) return null;

            const user = await getUserById(otherUserId);

            if (!user) return null;

            return [otherUserId, user] as const;
          }),
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
  }, [currentUser?.uid, showArchived, currentUser]);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return userChats;
    }

    return userChats.filter((chat) => {
      const participantIds = Object.keys(chat.participants);

      const otherUserId = participantIds.find((id) => id !== currentUser?.uid);

      if (!otherUserId) return false;

      const otherUser = chatUsers[otherUserId];

      return (
        otherUser?.name?.toLowerCase().includes(query) ||
        otherUser?.email?.toLowerCase().includes(query)
      );
    });
  }, [userChats, chatUsers, search, currentUser?.uid]);

  const handleSelectChat = async (currentUserID: string, user: UserProfile) => {
    if (!currentUserID || !user?.uid) return;

    try {
      const chatID = await createChat(currentUserID, user.uid);
      setSelectedUserId(user.uid);
      setSelectedUser(user);
      setChatId(chatID);
    } catch (error) {
      console.error("Failed to open chat:", error);
    }
  };

  return (
    <div className="relative flex h-full flex-col rounded-[2.5rem] border border-white/40 dark:border-zinc-800 p-5 shadow-md dark:shadow-none backdrop-blur-3xl">
      <SidebarHeader
        userChats={userChats}
        setShowArchived={setShowArchived}
        showArchived={showArchived}
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
          filteredChats.map((chat) => {
            return (
              <ChatListCard
                key={chat.chatId}
                chat={chat}
                chatUsers={chatUsers}
                handleSelectChat={handleSelectChat}
                selectedUserId={selectedUserId as string}
              />
            );
          })
        )}
      </div>

      <div className="mt-2 border-t border-white/20 dark:border-zinc-800 pt-3 bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md rounded-b-2xl p-1">
        <AddNewChat
          currentUserId={currentUser?.uid as string}
          handleSelectChat={handleSelectChat}
        />
      </div>
    </div>
  );
}
