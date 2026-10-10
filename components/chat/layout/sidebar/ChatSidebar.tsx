
"use client";

import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatProvider";

import {
  createChat,
  createGroupChat,
  listenToUserChats,
} from "@/services/chats";

import { unarchiveChat } from "@/services/chatActions";
import { getUserById } from "@/services/users";

import { useEffect, useMemo, useState } from "react";

import ChatSkeleton from "@/components/skeletons/ChatSkeleton";
import { ChatItem } from "@/types/chatType";
import { UserProfile } from "@/types/userProfile";

import ChatListCard from "../../chat-list/ChatListCard";
import NoMatchingChats from "../../states/NoMatchingChats";
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

  const {
    selectedChat,
    selectUserChat,
    selectGroupChat,
  } = useChat();

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [userChats, setUserChats] = useState<ChatItem[]>([]);
  const [chatUsers, setChatUsers] = useState<
    Record<string, UserProfile>
  >({});

  useEffect(() => {
    if (!currentUser?.uid) {
      setUserChats([]);
      setChatUsers({});
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = listenToUserChats(
      currentUser.uid,
      showArchived,
      (chats) => {
        setUserChats(chats);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [currentUser?.uid, showArchived]);

 const currentUserId = currentUser?.uid;

const userIdsKey = useMemo(() => {
  if (!currentUserId) return "";

  const userIds = userChats
    .filter((chat) => chat.type !== "group")
    .flatMap((chat) =>
      Object.keys(chat.participants ?? {}).filter(
        (id) => id !== currentUserId,
      ),
    );

  return [...new Set(userIds)].sort().join("|");
}, [userChats, currentUserId]);

  useEffect(() => {
    let cancelled = false;

    const userIds = userIdsKey
      ? userIdsKey.split("|")
      : [];

    if (userIds.length === 0) {
      return;
    }

    const loadUsers = async () => {
      try {
        const entries = await Promise.all(
          userIds.map(async (userId) => {
            const user = await getUserById(userId);

            return user
              ? ([userId, user] as const)
              : null;
          }),
        );

        if (cancelled) return;

        const usersMap: Record<string, UserProfile> = {};

        entries.forEach((entry) => {
          if (!entry) return;

          const [userId, user] = entry;
          usersMap[userId] = user;
        });

        setChatUsers(usersMap);
      } catch (error) {
        console.error("Failed to load chat users:", error);
      }
    };

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, [userIdsKey]);

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    const getUnreadCount = (chat: ChatItem) => {
      const userId = currentUser?.uid;

      if (!userId) return 0;

      const storedCount = chat.unreadCounts?.[userId];

      if (typeof storedCount === "number") {
        return storedCount;
      }

      const lastMessage = chat.lastMessage;

      if (
        lastMessage &&
        lastMessage.senderId !== userId &&
        lastMessage.seen !== true
      ) {
        return 1;
      }

      return 0;
    };

    const filtered = userChats.filter((chat) => {
      if (!query) return true;

      if (chat.type === "group") {
        return (
          chat.name?.toLowerCase().includes(query) ?? false
        );
      }

      const participantIds = Object.keys(
        chat.participants ?? {},
      );

      const otherUserId = participantIds.find(
        (id) => id !== currentUser?.uid,
      );

      if (!otherUserId) return false;

      const otherUser = chatUsers[otherUserId];

      return (
        otherUser?.name?.toLowerCase().includes(query) ||
        otherUser?.email?.toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((a, b) => {
      const aSelected = a.chatId === selectedChat?.chatId;
      const bSelected = b.chatId === selectedChat?.chatId;

      if (aSelected !== bSelected) {
        return aSelected ? -1 : 1;
      }

      const aUnread = getUnreadCount(a);
      const bUnread = getUnreadCount(b);

      if (aUnread !== bUnread) {
        return bUnread - aUnread;
      }

      const aTime = Number(
        a.lastMessage?.createdAt ?? a.createdAt ?? 0,
      );

      const bTime = Number(
        b.lastMessage?.createdAt ?? b.createdAt ?? 0,
      );

      return bTime - aTime;
    });
  }, [
    userChats,
    chatUsers,
    search,
    currentUser?.uid,
    selectedChat?.chatId,
  ]);

  const handleSelectChat = async (
    currentUserId: string,
    user: UserProfile,
  ) => {
    if (!currentUserId || !user?.uid) return;

    try {
      const chatId = await createChat(
        currentUserId,
        user.uid,
      );

      selectUserChat(chatId, user);
    } catch (error) {
      console.error("Failed to open chat:", error);
    }
  };

  const handleUnarchive = async (chatId: string) => {
    try {
      if (!currentUser?.uid) return;

      await unarchiveChat(currentUser.uid, chatId);

      toast.success("Removed From Archive");

    } catch (error) {
      console.error("Failed to unarchive chat:", error);
      toast.error("Couldn't unarchive chat");
    }
  };

  const handleCreateGroup = async (
    groupName: string,
    membersIds: string[],
  ) => {
    if (
      !currentUser?.uid ||
      !groupName.trim() ||
      membersIds.length === 0
    ) {
      return;
    }

    try {
      await createGroupChat(
        currentUser.uid,
        membersIds,
        groupName.trim(),
      );

      toast.success("Group created successfully");
    } catch (error) {
      console.error("Failed to create group:", error);
      toast.error("Failed to create group");
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

  return (
    <aside className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/55 p-3 shadow-[0_20px_70px_rgba(249,115,22,0.08)] backdrop-blur-2xl dark:border-zinc-800/80 dark:bg-zinc-950/55 dark:shadow-none">
      <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      <SidebarHeader
        userChats={userChats}
        search={search}
        setSearch={setSearch}
      />

      <div className="custom-scrollbar relative z-10 -mr-1 flex-1 space-y-1 overflow-y-auto px-1 pb-2 pr-1">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
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

      <div className="relative z-10 mt-2 border-t border-zinc-200/60 pt-2 dark:border-zinc-800/70">
        <ChatSidebarFooter
          currentUserId={currentUser?.uid as string}
          handleSelectChat={handleSelectChat}
          onCreateGroup={handleCreateGroup}
        />
      </div>
    </aside>
  );
}
